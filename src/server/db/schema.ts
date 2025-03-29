// import "server-only"; // Make sure you can't import this on client

// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  real,
  sqliteTable,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = sqliteTableCreator(
  (name) => `four-mutations_${name}`,
);


export const users = sqliteTable("users",{
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  name: text("name"),
})
export const pendingUsers = sqliteTable("pending_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  verificationCode: text("verification_code").notNull(),
  expiresAt: text("expires_at").notNull(), // Store expiration time
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
// Updated table for expenses. Each expense is linked to a user.
export const expenses = sqliteTable("expenses", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  // Using `real` to store the expense amount as a floating point value.
  // You can use application-level logic to ensure that it always has
  // two decimal places (for example, by rounding on input/output).
  amount: real("amount").notNull(),
  description: text("description", { length: 512 }).notNull(),
  /*
    expenseDate represents the actual date when the expense occurred.
    This is different from createdAt, which is automatically set to the
    current time when the record is inserted. Use expenseDate if you want
    to record the date of the expense (which could be in the past or future)
    as opposed to the metadata about the record's creation.
  */
  expenseDate: text("expense_date"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});