import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";

// Define a sample table
export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  age: integer("age"),
});
