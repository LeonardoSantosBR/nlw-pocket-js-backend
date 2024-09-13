import { z } from "zod";
import { createGoal } from "../../services/post-goal";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createGoalsRoute: FastifyPluginAsyncZod = async (AppServer) => {
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
};
