import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

describe("User routes", () => {
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
  it("should be able to create a user", async () => {
    await request(app.server)
      .post("/user")
      .send({
        name: "Wagner Mateus",
      })
      .expect(201);
  });
});
