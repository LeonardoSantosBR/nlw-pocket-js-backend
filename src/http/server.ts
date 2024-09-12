import z from "zod";
import fastify from "fastify";
import { createGoal } from "../services/post-goal";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../services/get-week-pending-goals";
import { createGoalCompletion } from "../services/post-goal-completion";

export const AppServer = fastify().withTypeProvider<ZodTypeProvider>();

AppServer.setValidatorCompiler(validatorCompiler);
AppServer.setSerializerCompiler(serializerCompiler);

//goals
AppServer.post(
  "/goals",
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().min(1).max(7),
      }),
    },
  },
  async (request) => {
    const { title, desiredWeeklyFrequency } = request.body;
    await createGoal({
      title,
      desiredWeeklyFrequency,
    });
  }
);

AppServer.get("/pending-goals", async (request) => {
  const { query } = await getWeekPendingGoals();
  return query;
});

AppServer.post(
  "/goals-completion",
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body;
    await createGoalCompletion({
      goalId,
    });
  }
);

AppServer.listen({
  port: 3333,
}).then(() => {
  console.log("HTTP server running on http://localhost:3333");
});
