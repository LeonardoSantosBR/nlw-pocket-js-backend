import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../../services/get-week-pending-goals";

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async (AppServer) => {
  AppServer.get("/pending-goals", async (request) => {
    const { query } = await getWeekPendingGoals();
    return query;
  });
};
