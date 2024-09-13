import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekSummary } from "../../services/get-week-summary";

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (AppServer) => {
  AppServer.get("/summary", async () => {
    const query = await getWeekSummary();
    return query;
  });
};
