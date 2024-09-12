import dayjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { ICreateGoalCompletion } from "../interfaces/createGoalCompletion";
import { count, gte, lte, and, eq, sql } from "drizzle-orm";

export async function createGoalCompletion({ goalId }: ICreateGoalCompletion) {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalCompletionCount = db.$with("goal_completion_count").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.id)
  );

  const query = await db
    .with(goalCompletionCount)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql/*sql*/ `
        COALESCE(${goalCompletionCount.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCount, eq(goalCompletionCount.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1);

  const { completionCount, desiredWeeklyFrequency } = query[0];

  if (completionCount >= desiredWeeklyFrequency)
    throw new Error("Meta já alcançada.");

  const result = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning();

  const goalCompletion = result[0];
  return { goalCompletion };
}
