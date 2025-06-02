
import {
  mysqlTable,
  text,
  varchar,
  int,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  email: varchar("email" , { length: 255 }).notNull().unique(),
  fullName: text("full_name").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Allergens table
export const allergens = mysqlTable("allergens", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAllergenSchema = createInsertSchema(allergens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User allergens - linking users to their allergens
export const userAllergens = mysqlTable("user_allergens", {
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  allergenId: int("allergen_id")
    .notNull()
    .references(() => allergens.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    pk: primaryKey(table.userId, table.allergenId),
  };
});

// Products table
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  nafdac_number: varchar("nafdac_number", { length: 50 }).notNull().unique(),
  ingredients: text("ingredients").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Product allergens - linking products to allergens they contain
export const productAllergens = mysqlTable("product_allergens", {
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  allergenId: int("allergen_id")
    .notNull()
    .references(() => allergens.id, { onDelete: "cascade" }),
}, (table) => {
  return {
    pk: primaryKey(table.productId, table.allergenId),
  };
});

// Alternative products - for recommendations
export const alternativeProducts = mysqlTable("alternative_products", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  alternativeId: int("alternative_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

// Search history - to keep track of user's search history
export const searchHistory = mysqlTable("search_history", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: int("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Allergen = typeof allergens.$inferSelect;
export type InsertAllergen = z.infer<typeof insertAllergenSchema>;

export type UserAllergen = typeof userAllergens.$inferSelect;
export type InsertUserAllergen = typeof userAllergens.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductAllergen = typeof productAllergens.$inferSelect;
export type InsertProductAllergen = typeof productAllergens.$inferInsert;

export type AlternativeProduct = typeof alternativeProducts.$inferSelect;
export type InsertAlternativeProduct = typeof alternativeProducts.$inferInsert;

export type SearchHistoryItem = typeof searchHistory.$inferSelect;
export type InsertSearchHistoryItem = typeof searchHistory.$inferInsert;
