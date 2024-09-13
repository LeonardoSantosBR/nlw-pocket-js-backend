import { z } from "zod";
import { createGoalCompletion } from "../../services/post-goal-completion";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const createGoalsCompletionRoute: FastifyPluginAsyncZod = async (
  AppServer
) => {
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
};
