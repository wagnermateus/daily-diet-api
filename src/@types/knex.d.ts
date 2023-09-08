import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    user: {
      id: string;
      name: string;
      created_at: string;
      session_id?: string;
    };
    meal: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date_hour: Date;
      is_on_the_diet: boolean;
      created_at: string;
    };
  }
}
