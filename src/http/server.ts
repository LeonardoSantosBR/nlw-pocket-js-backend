import fastify from "fastify";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

//imported routes
import { createGoalsRoute } from "./routes/post-goals";
import { getPendingGoalsRoute } from "./routes/get-pending-goals";
import { createGoalsCompletionRoute } from "./routes/post-goals-completion";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import fastifyCors from "@fastify/cors";

//config
export const AppServer = fastify().withTypeProvider<ZodTypeProvider>();
AppServer.register(fastifyCors, {
  origin: "*",
});
AppServer.setValidatorCompiler(validatorCompiler);
AppServer.setSerializerCompiler(serializerCompiler);

//routes
AppServer.register(createGoalsRoute);
AppServer.register(getPendingGoalsRoute);
AppServer.register(createGoalsCompletionRoute);
AppServer.register(getWeekSummaryRoute);

AppServer.listen({
  port: 3333,
}).then(() => {
  console.log("HTTP server running on http://localhost:3333");
});
