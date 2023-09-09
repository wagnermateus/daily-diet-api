import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares /check-session-id-exists";
import { randomUUID } from "node:crypto";

export async function mealRoute(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date_hour: z.string().datetime(),
        is_on_the_diet: z.boolean(),
      });

      let session_id = request.cookies.sessionId;

      const userId = await knex("user")
        .select("id")
        .where("session_id", session_id)
        .first();

      const { name, date_hour, description, is_on_the_diet } =
        createMealBodySchema.parse(request.body);

      await knex("meal").insert({
        id: randomUUID(),
        user_id: String(userId),
        name,
        date_hour,
        description,
        is_on_the_diet,
      });

      return reply.status(201).send();
    }
  );
}
