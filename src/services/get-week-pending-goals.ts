import dayjs from "dayjs";

import { db } from "../db";
import { goals, goalCompletions } from "../db/schema";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  );

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
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.id)
  );

  const query = await db
    .with(goalsCreatedUpToWeek, goalCompletionCount)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql/*sql*/ `
        COALESCE(${goalCompletionCount.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCount,
      eq(goalCompletionCount.goalId, goalsCreatedUpToWeek.id)
    )
      // .toSQL();

  return {
    query,
  };
}
