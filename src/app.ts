import fastify from "fastify";
import cookie from "@fastify/cookie";
import { userRoutes } from "./routes/user";
import { mealRoute } from "./routes/meal";

export const app = fastify();
app.register(cookie);

app.register(userRoutes, {
  prefix: "user",
});

app.register(mealRoute, {
  prefix: "/meal",
});
