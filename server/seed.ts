import { db } from './db';
import { allergens, products, productAllergens, alternativeProducts, users } from '../shared/schema';
import bcrypt from 'bcryptjs';

// Admin user data
const adminUser = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com',
  fullName: 'System Administrator',
  isAdmin: true
};

// Common allergens
const allergenData = [
  { name: 'Peanuts', icon: 'peanut', description: 'Common legume allergen that can cause severe reactions' },
  { name: 'Tree Nuts', icon: 'treenut', description: 'Includes almonds, walnuts, cashews, pistachios and pecans' },
  { name: 'Milk', icon: 'milk', description: 'Dairy products containing lactose or milk proteins' },
  { name: 'Eggs', icon: 'egg', description: 'Found in many processed foods and baked goods' },
  { name: 'Fish', icon: 'fish', description: 'Different fish species can trigger allergic reactions' },
  { name: 'Shellfish', icon: 'shellfish', description: 'Includes shrimp, crab, lobster and other crustaceans' },
  { name: 'Soy', icon: 'soy', description: 'Common in many processed foods and vegetarian products' },
  { name: 'Wheat', icon: 'wheat', description: 'Contains gluten which affects people with celiac disease' },
  { name: 'Sesame', icon: 'sesame', description: 'Seeds and oils that can trigger reactions' },
  { name: 'Gluten', icon: 'gluten', description: 'Protein found in wheat, barley, and rye' }
];

// Sample food products with NAFDAC numbers
const productData = [
  { 
    name: 'Nutrilon Premium Baby Formula', 
    manufacturer: 'Nutricia', 
    nafdac_number: 'A1-0123', 
    ingredients: 'Skimmed milk, vegetable oils, lactose, demineralized whey, whey protein concentrate, fish oil, calcium, vitamin mixtures'
  },
  { 
    name: 'Cowbell Milk Powder', 
    manufacturer: 'Cowbell', 
    nafdac_number: 'A1-0456', 
    ingredients: 'Full cream milk powder, vitamins A & D, calcium, iron, zinc'
  },
  { 
    name: 'Golden Penny Spaghetti', 
    manufacturer: 'Flour Mills of Nigeria', 
    nafdac_number: 'A1-0789', 
    ingredients: 'Durum wheat semolina, water'
  },
  { 
    name: 'Indomie Instant Noodles', 
    manufacturer: 'Dufil Prima Foods', 
    nafdac_number: 'A1-1011', 
    ingredients: 'Wheat flour, vegetable oil, salt, starch, chicken flavor, soy sauce, MSG, spices'
  },
  { 
    name: 'Hollandia Yoghurt', 
    manufacturer: 'CHI Limited', 
    nafdac_number: 'A1-1213', 
    ingredients: 'Milk, sugar, strawberry flavor, live lactic acid culture, fruit extract'
  }
];

// Seed data function
async function seedData() {
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await db.delete(alternativeProducts);
    await db.delete(productAllergens);
    await db.delete(products);
    await db.delete(allergens);
    await db.delete(users);
    
    console.log('Cleared existing data');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    await db.insert(users).values({
      ...adminUser,
      password: hashedPassword
    });
    console.log(`Created admin user: ${adminUser.username}`);
    
    // Insert allergens
    await db.insert(allergens).values(allergenData);
    console.log(`Added ${allergenData.length} allergens`);
    
    // Insert products
    await db.insert(products).values(productData);
    console.log(`Added ${productData.length} products`);
    
    // Insert product allergen relationships
    const productAllergenRelations = [
      // Nutrilon Premium Baby Formula contains Milk (ID 3)
      { productId: 1, allergenId: 3 },
      // Cowbell Milk Powder contains Milk (ID 3)
      { productId: 2, allergenId: 3 },
      // Golden Penny Spaghetti contains Wheat (ID 8) and Gluten (ID 10)
      { productId: 3, allergenId: 8 },
      { productId: 3, allergenId: 10 },
      // Indomie contains Wheat (ID 8), Soy (ID 7), Gluten (ID 10)
      { productId: 4, allergenId: 7 },
      { productId: 4, allergenId: 8 },
      { productId: 4, allergenId: 10 },
      // Hollandia Yoghurt contains Milk (ID 3)
      { productId: 5, allergenId: 3 }
    ];
    
    await db.insert(productAllergens).values(productAllergenRelations);
    console.log(`Added ${productAllergenRelations.length} product-allergen relationships`);
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Key Addition: Env Check + Execution
if (process.env.SEED_DATABASE === "true") {
  seedDatabase()
    .catch((e) => {
      console.error("❌ Seeding failed:", e);
      process.exit(1);
    });
}

// Run the seed function
seedData();
