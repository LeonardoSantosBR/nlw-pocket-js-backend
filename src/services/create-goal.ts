import { db } from "../db";
import { ICreateGoal } from "../interfaces/createGoal";
import { goals } from "../db/schema";

export async function createGoal({
  title,
  desiredWeeklyFrequency,
}: ICreateGoal) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning();

  const goal = result[0];
  return { goal };
}
