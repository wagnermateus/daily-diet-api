import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares /check-session-id-exists";
import { randomUUID } from "node:crypto";

export async function mealRoute(app: FastifyInstance) {
  app.get("/", { preHandler: [checkSessionIdExists] }, async (request) => {
    let session_id = request.cookies.sessionId;

    const userId = await knex("user")
      .select("id")
      .where("session_id", session_id)
      .first();

    const meals = await knex("meal").select("*").where("user_id", userId.id);

    return { meals };
  });

  app.get("/:id", { preHandler: [checkSessionIdExists] }, async (request) => {
    let session_id = request.cookies.sessionId;

    const userId = await knex("user")
      .select("id")
      .where("session_id", session_id)
      .first();

    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealParamsSchema.parse(request.params);

    const meal = await knex("meal")
      .select("*")
      .where({ user_id: userId.id, id })
      .first();

    return { meal };
  });

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
        user_id: userId.id,
        name,
        date_hour,
        description,
        is_on_the_diet,
      });

      return reply.status(201).send();
    }
  );

  app.delete(
    "/:id",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      let session_id = request.cookies.sessionId;

      const userId = await knex("user")
        .select("id")
        .where("session_id", session_id)
        .first();

      const deleteMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = deleteMealParamsSchema.parse(request.params);
      await knex("meal").delete("*").where({
        user_id: userId.id,
        id,
      });

      return reply.status(201).send();
    }
  );

  app.put(
    "/:id",
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

      const updateMealParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = updateMealParamsSchema.parse(request.params);
      await knex("meal")
        .update({
          id,
          user_id: userId.id,
          name,
          date_hour,
          description,
          is_on_the_diet,
        })
        .where({ id, user_id: userId.id });

      return reply.status(201).send();
    }
  );

  app.get(
    "/metrics",
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      let session_id = request.cookies.sessionId;

      const userId = await knex("user")
        .select("id")
        .where("session_id", session_id)
        .first();

      const totalMeals = await knex("meal")
        .count("* as total")
        .where({ user_id: userId.id })
        .first();

      const totalMealsWithinTheDiet = await knex("meal")
        .count("* as total")
        .where({ user_id: userId.id, is_on_the_diet: true })
        .first();

      const totalOffDietMeals = await knex("meal")
        .count("* as total")
        .where({ user_id: userId.id, is_on_the_diet: false })
        .first();

      const meals = await knex("meal").select("*").where("user_id", userId.id);

      let accumulator = 0;
      let betterSequence = 0;

      for (let i = 0; i < meals.length; i++) {
        if (meals[i].is_on_the_diet === 1) {
          accumulator += 1;
        } else {
          if (accumulator > betterSequence) {
            betterSequence = accumulator;
            accumulator = 0;
          }
        }
      }
      if (accumulator > betterSequence) {
        betterSequence = accumulator;
        accumulator = 0;
      }

      return {
        totalMeals,
        totalMealsWithinTheDiet,
        totalOffDietMeals,
        betterSequence,
      };
    }
  );
}
