import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
export async function userRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    });

    const { name } = createUserBodySchema.parse(request.body);

    const session_id = randomUUID();

    await knex("user").insert({
      id: randomUUID(),
      name,
      session_id,
    });

    reply.setCookie("sessionId", session_id, {
      path: "/",
      maxAge: 1 * 60 * 60 * 24 * 7, // 7 days
    });

    return reply.status(201).send();
  });
}
