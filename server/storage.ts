import { 
  users, type User, type InsertUser,
  allergens, type Allergen, type InsertAllergen,
  userAllergens, type UserAllergen, type InsertUserAllergen,
  products, type Product, type InsertProduct,
  productAllergens, type ProductAllergen, type InsertProductAllergen,
  alternativeProducts, type AlternativeProduct, type InsertAlternativeProduct,
  searchHistory, type SearchHistoryItem, type InsertSearchHistoryItem 
} from "@shared/schema";
import { db } from "./db";
import { like } from "drizzle-orm";
import { eq, and, inArray, desc, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>; // Admin function
  
  // Allergen Management
  getAllergens(): Promise<Allergen[]>;
  getAllergenById(id: number): Promise<Allergen | undefined>;
  createAllergen(allergen: InsertAllergen): Promise<Allergen>;
  
  // User Allergens
  getUserAllergens(userId: number): Promise<Allergen[]>;
  addUserAllergen(userAllergen: InsertUserAllergen): Promise<void>;
  removeUserAllergen(userId: number, allergenId: number): Promise<void>;
  
  // Product Management
  getProductById(id: number): Promise<Product | undefined>;
  getProductByNafdacNumber(nafdacNumber: string): Promise<Product | undefined>;
  searchProductsByName(name: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  getAllProducts(): Promise<Product[]>; // Admin function
  
  // Product Allergens
  getProductAllergens(productId: number): Promise<Allergen[]>;
  addProductAllergen(productAllergen: InsertProductAllergen): Promise<void>;
  
  // Alternative Products
  getAlternativeProducts(productId: number, userAllergenIds: number[]): Promise<Product[]>;
  addAlternativeProduct(alternativeProduct: InsertAlternativeProduct): Promise<void>;
  
  // Search History
  addToSearchHistory(userId: number, productId: number): Promise<void>;
  getUserSearchHistory(userId: number, limit?: number): Promise<{ product: Product; createdAt: Date }[]>;
}

export class DatabaseStorage implements IStorage {
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      });
    
    // Get the inserted user
    const insertedUser = await this.getUser(user.insertId);
    return insertedUser!;
  }
  
  // Update user profile
  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id));
    
    const updatedUser = await this.getUser(id);
    return updatedUser!;
  }
  
  // Admin function to get all users
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }
  
  // Allergen Management
  async getAllergens(): Promise<Allergen[]> {
    return await db.select().from(allergens);
  }

  async getAllergenById(id: number): Promise<Allergen | undefined> {
    const [allergen] = await db.select().from(allergens).where(eq(allergens.id, id));
    return allergen;
  }

  async createAllergen(allergenData: InsertAllergen): Promise<Allergen> {
    const [result] = await db
      .insert(allergens)
      .values(allergenData);
    
    const allergen = await this.getAllergenById(result.insertId);
    return allergen!;
  }
    
  // User Allergens
  async getUserAllergens(userId: number): Promise<Allergen[]> {
    const result = await db
      .select({
        allergen: allergens
      })
      .from(userAllergens)
      .innerJoin(allergens, eq(userAllergens.allergenId, allergens.id))
      .where(eq(userAllergens.userId, userId));
    
    return result.map(r => r.allergen);
  }

  async addUserAllergen(userAllergen: InsertUserAllergen): Promise<void> {
    await db.insert(userAllergens).values(userAllergen);
  }

  async removeUserAllergen(userId: number, allergenId: number): Promise<void> {
    await db
      .delete(userAllergens)
      .where(
        and(
          eq(userAllergens.userId, userId),
          eq(userAllergens.allergenId, allergenId)
        )
      );
  }
  
  // Product Management
  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByNafdacNumber(nafdacNumber: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.nafdac_number, nafdacNumber));
    return product;
  }

async searchProductsByName(name: string): Promise<Product[]> {
  return await db
    .select()
    .from(products)
    .where(sql`${products.name} LIKE ${`%${name}%`}`);
}
  async createProduct(productData: InsertProduct): Promise<Product> {
    const [result] = await db
      .insert(products)
      .values(productData);
    
    const product = await this.getProductById(result.insertId);
    return product!;
  }
  
  // Admin function to get all products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  // Product Allergens
  async getProductAllergens(productId: number): Promise<Allergen[]> {
    const result = await db
      .select({
        allergen: allergens
      })
      .from(productAllergens)
      .innerJoin(allergens, eq(productAllergens.allergenId, allergens.id))
      .where(eq(productAllergens.productId, productId));
    
    return result.map(r => r.allergen);
  }

  async addProductAllergen(productAllergen: InsertProductAllergen): Promise<void> {
    await db.insert(productAllergens).values(productAllergen);
  }
  
  // Alternative Products
  async getAlternativeProducts(productId: number, userAllergenIds: number[]): Promise<Product[]> {
    // Get alternative products that don't contain user allergens
    const result = await db
      .select({
        product: products
      })
      .from(alternativeProducts)
      .innerJoin(products, eq(alternativeProducts.alternativeId, products.id))
      .leftJoin(
        productAllergens,
        and(
          eq(productAllergens.productId, alternativeProducts.alternativeId),
          inArray(productAllergens.allergenId, userAllergenIds)
        )
      )
      .where(
        and(
          eq(alternativeProducts.productId, productId),
          sql`${productAllergens.allergenId} IS NULL` // Ensure product doesn't contain user allergens
        )
      );
    
    return result.map(r => r.product);
  }

  async addAlternativeProduct(alternativeProduct: InsertAlternativeProduct): Promise<void> {
    await db.insert(alternativeProducts).values(alternativeProduct);
  }
  
  // Search History
  async addToSearchHistory(userId: number, productId: number): Promise<void> {
    await db.insert(searchHistory).values({ userId, productId });
  }

  async getUserSearchHistory(userId: number, limit: number = 5): Promise<{ product: Product; createdAt: Date }[]> {
    const result = await db
      .select({
        product: products,
        createdAt: searchHistory.createdAt
      })
      .from(searchHistory)
      .innerJoin(products, eq(searchHistory.productId, products.id))
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
    
    return result;
  }
}

export const storage = new DatabaseStorage();
