import z from "zod";
import fastify from "fastify";
import { createGoal } from "../services/create-goal";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

export const AppServer = fastify().withTypeProvider<ZodTypeProvider>();

AppServer.setValidatorCompiler(validatorCompiler);
AppServer.setSerializerCompiler(serializerCompiler);

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

AppServer.listen({
  port: 3333,
}).then(() => {
  console.log("HTTP server running on http://localhost:3333");
});
