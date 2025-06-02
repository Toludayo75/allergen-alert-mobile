import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import MemoryStore from "memorystore";

// Extend Express Session with our user ID
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Custom request type with typed session
interface AuthRequest extends Request {
  session: session.Session & {
    userId?: number;
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session management
  const MemoryStoreSession = MemoryStore(session);
  
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000 // Prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || 'allergen-alert-secret'
    })
  );

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: AuthRequest, res: any, next: any) => {
    if (req.session && req.session.userId !== undefined) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  // Admin middleware - Check isAdmin flag
  const isAdmin = async (req: AuthRequest, res: any, next: any) => {
    if (!req.session || req.session.userId === undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Get user and check if admin
    const user = await storage.getUser(req.session.userId);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admin access required" });
    }
  };

  // Authentication routes
  app.post('/api/register', async (req: AuthRequest, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Set up session
      req.session.userId = user.id;
      
      res.status(201).json({ 
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: "Invalid data provided" });
    }
  });

  app.post('/api/login', async (req: AuthRequest, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set up session
      req.session.userId = user.id;
      
      res.status(200).json({ 
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isAdmin: !!user.isAdmin
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/logout', (req: AuthRequest, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get('/api/user', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isAdmin: !!user.isAdmin
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update user profile
  app.patch('/api/user', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const { fullName, email } = req.body;
      
      // Validate input
      if (!fullName && !email) {
        return res.status(400).json({ message: "No fields to update" });
      }
      
      // Only allow updating certain fields
      const updateData: any = {};
      if (fullName) updateData.fullName = fullName;
      if (email) updateData.email = email;
      
      // Update user
      const updatedUser = await storage.updateUser(userId, updateData);
      
      res.status(200).json({
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        fullName: updatedUser.fullName
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Allergen routes
  app.get('/api/allergens', async (req, res) => {
    try {
      const allergens = await storage.getAllergens();
      res.status(200).json(allergens);
    } catch (error) {
      console.error('Get allergens error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/user/allergens', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const allergens = await storage.getUserAllergens(userId);
      res.status(200).json(allergens);
    } catch (error) {
      console.error('Get user allergens error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post('/api/user/allergens', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const { allergenIds } = req.body;
      
      if (!Array.isArray(allergenIds)) {
        return res.status(400).json({ message: "allergenIds must be an array" });
      }
      
      // Add each allergen to user
      for (const allergenId of allergenIds) {
        await storage.addUserAllergen({
          userId,
          allergenId
        });
      }
      
      res.status(200).json({ message: "Allergens added successfully" });
    } catch (error) {
      console.error('Add user allergens error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete('/api/user/allergens/:allergenId', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const allergenId = parseInt(req.params.allergenId);
      
      await storage.removeUserAllergen(userId, allergenId);
      
      res.status(200).json({ message: "Allergen removed successfully" });
    } catch (error) {
      console.error('Remove user allergen error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Product routes
  app.get('/api/products/nafdac/:nafdacNumber', async (req, res) => {
    try {
      const { nafdacNumber } = req.params;
      const product = await storage.getProductByNafdacNumber(nafdacNumber);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/products/search', async (req, res) => {
    try {
      const { name } = req.query;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Name parameter is required" });
      }
      
      const products = await storage.searchProductsByName(name);
      res.status(200).json(products);
    } catch (error) {
      console.error('Search products error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/products/:productId/allergens', async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const allergens = await storage.getProductAllergens(productId);
      res.status(200).json(allergens);
    } catch (error) {
      console.error('Get product allergens error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/products/:productId/alternatives', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.session.userId;
      
      // Get user's allergens
      const userAllergens = await storage.getUserAllergens(userId);
      const userAllergenIds = userAllergens.map(allergen => allergen.id);
      
      // Get alternative products
      const alternatives = await storage.getAlternativeProducts(productId, userAllergenIds);
      
      res.status(200).json(alternatives);
    } catch (error) {
      console.error('Get alternative products error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Search history routes
  app.post('/api/user/history', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const { productId } = req.body;
      
      if (typeof productId !== 'number') {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      await storage.addToSearchHistory(userId, productId);
      
      res.status(200).json({ message: "Added to search history" });
    } catch (error) {
      console.error('Add to search history error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get('/api/user/history', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const userId = req.session.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const history = await storage.getUserSearchHistory(userId, limit);
      
      res.status(200).json(history);
    } catch (error) {
      console.error('Get search history error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Product analysis route - detect allergens in a product that affect the user
  app.get('/api/analyze/:productId', isAuthenticated, async (req: AuthRequest, res) => {
    try {
      const productId = parseInt(req.params.productId);
      
      if (!req.session.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const userId = req.session.userId;
      
      // Get the product
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get product allergens
      const productAllergens = await storage.getProductAllergens(productId);
      
      // Get user allergens
      const userAllergens = await storage.getUserAllergens(userId);
      
      // Find matching allergens (allergens that affect the user)
      const matchingAllergens = productAllergens.filter(
        productAllergen => userAllergens.some(
          userAllergen => userAllergen.id === productAllergen.id
        )
      );
      
      // Get alternative products
      const userAllergenIds = userAllergens.map(allergen => allergen.id);
      const alternatives = await storage.getAlternativeProducts(productId, userAllergenIds);
      
      // Add to search history
      await storage.addToSearchHistory(userId, productId);
      
      res.status(200).json({
        product,
        productAllergens,
        matchingAllergens,
        alternatives
      });
    } catch (error) {
      console.error('Analyze product error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Admin Routes
  
  // Get all products (with more details than the public route)
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get all users (admin only)
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error('Admin get users error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add a new allergen (admin only)
  app.post('/api/admin/allergens', isAdmin, async (req: Request, res) => {
    try {
      const { name, icon, description } = req.body;
      
      if (!name || !icon || !description) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const allergen = await storage.createAllergen({ name, icon, description });
      res.status(201).json(allergen);
    } catch (error) {
      console.error('Admin create allergen error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add a new product (admin only)
  app.post('/api/admin/products', isAdmin, async (req: Request, res) => {
    try {
      const { name, manufacturer, nafdacNumber, ingredients } = req.body;
      
      if (!name || !manufacturer || !nafdacNumber || !ingredients) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const product = await storage.createProduct({ 
        name, 
        manufacturer, 
        nafdacNumber, 
        ingredients 
      });
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Admin create product error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add allergens to a product (admin only)
  app.post('/api/admin/products/:productId/allergens', isAdmin, async (req: Request, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const { allergenIds } = req.body;
      
      if (!productId || !allergenIds || !Array.isArray(allergenIds)) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Check if product exists
      const product = await storage.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Add each allergen to the product
      for (const allergenId of allergenIds) {
        await storage.addProductAllergen({ productId, allergenId });
      }
      
      res.status(200).json({ message: "Product allergens updated successfully" });
    } catch (error) {
      console.error('Admin add product allergens error:', error);
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
