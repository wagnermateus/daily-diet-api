import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";

describe("Meal routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new meal", async () => {
    const createUserResponse = await request(app.server).post("/user").send({
      name: "Wagner Mateus",
    });

    const cookies = createUserResponse.get("Set-Cookie");

    await request(app.server)
      .post("/meal")
      .send({
        name: "Pão",
        date_hour: "2023-09-09T01:35:00Z",
        description: "Integral",
        is_on_the_diet: true,
      })
      .set("Cookie", cookies)
      .expect(201);
  });
});
