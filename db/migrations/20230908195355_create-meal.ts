import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meal", (table) => {
    table.uuid("id").primary(),
      table.uuid("user_id").references("id").inTable("user"),
      table.string("name").notNullable(),
      table.string("description").notNullable(),
      table.dateTime("date_hour").notNullable(),
      table.boolean("is_on_the_diet").notNullable(),
      table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meal");
}
