import { db } from './db';
import {
  allergens,
  products,
  productAllergens,
  alternativeProducts,
  users
} from '../shared/schema';
import bcrypt from 'bcryptjs';

// Manually create tables if they don't exist
async function createTables() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS allergens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      icon TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      nafdac_number VARCHAR(50) NOT NULL UNIQUE,
      ingredients TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS product_allergens (
      product_id INT NOT NULL,
      allergen_id INT NOT NULL,
      PRIMARY KEY (product_id, allergen_id),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS alternative_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      alternative_id INT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (alternative_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);
  
    await db.execute(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS user_allergens (
      user_id INT NOT NULL,
      allergen_id INT NOT NULL,
      PRIMARY KEY (user_id, allergen_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (allergen_id) REFERENCES allergens(id) ON DELETE CASCADE
    );
  `);
}

const adminUser = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@example.com',
  fullName: 'System Administrator',
  isAdmin: true
};

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

async function seedData() {
  try {
    console.log('Creating tables (if not exist)...');
    await createTables();
    console.log('Tables ready.');

    console.log('Starting database seeding...');

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

    const productAllergenRelations = [
      { productId: 1, allergenId: 3 },
      { productId: 2, allergenId: 3 },
      { productId: 3, allergenId: 8 },
      { productId: 3, allergenId: 10 },
      { productId: 4, allergenId: 7 },
      { productId: 4, allergenId: 8 },
      { productId: 4, allergenId: 10 },
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

seedData();
