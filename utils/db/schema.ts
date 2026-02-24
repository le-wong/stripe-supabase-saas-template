//import { Name, name } from 'drizzle-orm';
//import { boolean, primaryKey } from 'drizzle-orm/mysql-core';
import { integer, uuid, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {  // users_table
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    //plan: text('plan').notNull(),
    stripe_id: text('stripe_id').notNull(),
    created_at: timestamp('created_at'),
});

export const productsTable = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text("description"),
    active: boolean('active').notNull().default(true),
    stripeProductId: text("stripe_product_id").unique(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type InsertUser = typeof usersTable.$inferInsert;  //defines the row data going in for users_table
export type SelectUser = typeof usersTable.$inferSelect;  //defines the row data coming out for users_table
