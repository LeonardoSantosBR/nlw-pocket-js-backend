import dayjs from "dayjs";
import { client, db } from ".";
import { goals, goalCompletions } from "./schema";

async function seed() {
  console.log("Seeding...");

  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      {
        title: "Acordar cedo",
        desiredWeeklyFrequency: 5,
      },
      {
        title: "Me exercitar",
        desiredWeeklyFrequency: 3,
      },
      {
        title: "Meditar",
        desiredWeeklyFrequency: 3,
      },
    ])
    .returning();

  const startOfWeek = dayjs().startOf("week");

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: startOfWeek.toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: startOfWeek.add(1, "day").toDate(),
    },
  ]);

  console.log("Seed completed...");
}

seed().finally(() => {
  client.end;
});
