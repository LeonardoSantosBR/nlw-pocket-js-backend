import fastify from 'fastify'
import { createGoal } from '../services/create-goal';
import z from 'zod';

export const AppServer = fastify()

AppServer.post("/goals", async (request) => {
  const createGoalSchema = z.object({
    title: z.string(),
    desiredWeeklyFrequency: z.number().min(1).max(7),
  });

  const body: any = createGoalSchema.parse(request.body);

  await createGoal({
    title: body.title,
    desiredWeeklyFrequency: body.desiredWeeklyFrequency,
  });
});


AppServer
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on http://localhost:3333')
  })
