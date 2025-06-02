import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Loader2, User, LogOut, AlertTriangle, ShieldAlert } from "lucide-react";

const allergenSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  icon: z.string().min(1, "Icon name is required"),
  description: z.string().min(5, "Description must be at least 5 characters")
});

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  manufacturer: z.string().min(2, "Manufacturer must be at least 2 characters"),
  nafdacNumber: z.string().min(3, "NAFDAC number must be at least 3 characters"),
  ingredients: z.string().min(5, "Ingredients must be at least 5 characters")
});

export default function AdminPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("allergens");
  const [selectedAllergens, setSelectedAllergens] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  // Get allergens
  const { data: allergens, isLoading: isLoadingAllergens } = useQuery({
    queryKey: ["/api/allergens"],
  });

  // Get products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["/api/products"],
  });

  // Get users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Create allergen form
  const allergenForm = useForm<z.infer<typeof allergenSchema>>({
    resolver: zodResolver(allergenSchema),
    defaultValues: {
      name: "",
      icon: "",
      description: ""
    }
  });

  // Create product form
  const productForm = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      manufacturer: "",
      nafdacNumber: "",
      ingredients: ""
    }
  });

  // Create allergen mutation
  const createAllergenMutation = useMutation({
    mutationFn: async (data: z.infer<typeof allergenSchema>) => {
      const res = await apiRequest("POST", "/api/admin/allergens", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/allergens"] });
      allergenForm.reset();
      toast({
        title: "Allergen created",
        description: "Allergen has been added successfully"
      });
    },
    onError: () => {
      toast({
        title: "Failed to create allergen",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const res = await apiRequest("POST", "/api/admin/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      productForm.reset();
      toast({
        title: "Product created",
        description: "Product has been added successfully"
      });
    },
    onError: () => {
      toast({
        title: "Failed to create product",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  // Add product allergen mutation
  const addProductAllergenMutation = useMutation({
    mutationFn: async ({ productId, allergenIds }: { productId: number, allergenIds: number[] }) => {
      const res = await apiRequest("POST", `/api/admin/products/${productId}/allergens`, { allergenIds });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setSelectedAllergens([]);
      setSelectedProduct(null);
      toast({
        title: "Allergens added",
        description: "Product allergens have been updated"
      });
    },
    onError: () => {
      toast({
        title: "Failed to update product allergens",
        description: "Please try again",
        variant: "destructive"
      });
    }
  });

  // Form submit handlers
  const onAllergenSubmit = (data: z.infer<typeof allergenSchema>) => {
    createAllergenMutation.mutate(data);
  };

  const onProductSubmit = (data: z.infer<typeof productSchema>) => {
    createProductMutation.mutate(data);
  };

  // Allergen selection handler for products
  const handleAllergenSelection = (allergenId: number) => {
    setSelectedAllergens(prev => 
      prev.includes(allergenId) 
        ? prev.filter(id => id !== allergenId) 
        : [...prev, allergenId]
    );
  };

  // Add allergens to product
  const handleAddAllergensToProduct = () => {
    if (selectedProduct && selectedAllergens.length > 0) {
      addProductAllergenMutation.mutate({
        productId: selectedProduct,
        allergenIds: selectedAllergens
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    fetch('/api/logout', { method: 'POST' })
      .then(() => {
        window.location.href = '/login';
      });
  };

  return (
    <div className="container max-w-6xl mx-auto p-4 md:p-6">
      {/* Admin Header with Logout */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <div className="bg-primary/10 text-primary p-3 rounded-lg mr-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage allergens, products and user accounts</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="self-end md:self-auto flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6">
        <Tabs defaultValue="allergens" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="allergens" className="text-sm font-medium">Allergens</TabsTrigger>
            <TabsTrigger value="products" className="text-sm font-medium">Products</TabsTrigger>
            <TabsTrigger value="users" className="text-sm font-medium">Users</TabsTrigger>
          </TabsList>
          
          {/* Allergens Tab */}
          <TabsContent value="allergens">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Add Allergen Form */}
              <Card className="lg:col-span-5 shadow-sm border border-gray-100">
                <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center">
                    <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    </span>
                    Add New Allergen
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Create a new allergen to associate with products
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Form {...allergenForm}>
                    <form onSubmit={allergenForm.handleSubmit(onAllergenSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={allergenForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Peanuts" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={allergenForm.control}
                          name="icon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Icon</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., peanut" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={allergenForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter a description of the allergen"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={createAllergenMutation.isPending}
                      >
                        {createAllergenMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>Add Allergen</>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {/* Allergen List */}
              <Card className="lg:col-span-7 shadow-sm border border-gray-100">
                <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                  <CardTitle className="text-lg">Existing Allergens</CardTitle>
                  <CardDescription className="text-xs">
                    Manage all allergens in the system
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {isLoadingAllergens ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : allergens?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {allergens.map((allergen: any) => (
                        <div 
                          key={allergen.id}
                          className="flex items-center p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-primary/20 hover:bg-gray-50/80 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-sm text-primary font-medium">{allergen.icon?.substring(0, 2) || "A"}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800">{allergen.name}</p>
                            <p className="text-xs text-gray-500 truncate">{allergen.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-600 font-medium">No allergens found</p>
                      <p className="text-xs text-gray-500 mt-1">Add your first allergen with the form</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Add Product Form */}
              <Card className="lg:col-span-5 shadow-sm border border-gray-100">
                <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                  <CardTitle className="text-lg flex items-center">
                    <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    </span>
                    Add New Product
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Add a new product to the database
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Form {...productForm}>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={productForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-sm font-medium">Product Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Golden Penny Spaghetti" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={productForm.control}
                          name="manufacturer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">Manufacturer</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Flour Mills of Nigeria" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={productForm.control}
                          name="nafdacNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">NAFDAC Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., A1-1234" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={productForm.control}
                        name="ingredients"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">Ingredients</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter product ingredients, comma separated"
                                className="resize-none"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={createProductMutation.isPending}
                      >
                        {createProductMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>Add Product</>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {/* Product & Allergen Management */}
              <Card className="lg:col-span-7 shadow-sm border border-gray-100">
                <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                  <CardTitle className="text-lg">Product Allergen Management</CardTitle>
                  <CardDescription className="text-xs">
                    Assign allergens to products in the database
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {isLoadingProducts ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Products Column */}
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-medium mb-2 text-gray-700 pb-1 border-b">Select a Product:</h4>
                          <div className="max-h-60 overflow-y-auto pr-2 space-y-2 mt-2">
                            {products?.map((product: any) => (
                              <div 
                                key={product.id}
                                className={`p-2.5 border rounded-md cursor-pointer text-sm transition-all ${
                                  selectedProduct === product.id 
                                    ? 'bg-primary text-white border-primary shadow-sm' 
                                    : 'bg-gray-50 hover:border-primary/30'
                                }`}
                                onClick={() => setSelectedProduct(product.id)}
                              >
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs opacity-80 mt-0.5">{product.nafdacNumber}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Allergens Column */}
                        <div className="md:col-span-3">
                          {selectedProduct ? (
                            <>
                              <h4 className="text-sm font-medium mb-2 text-gray-700 pb-1 border-b">Select Allergens:</h4>
                              <div className="max-h-60 overflow-y-auto pr-2 mt-2">
                                <div className="grid grid-cols-2 gap-2">
                                  {allergens?.map((allergen: any) => (
                                    <div 
                                      key={allergen.id}
                                      className={`flex items-center justify-between p-2 border rounded-md cursor-pointer text-sm transition-all ${
                                        selectedAllergens.includes(allergen.id) 
                                          ? 'bg-primary/10 border-primary' 
                                          : 'bg-gray-50 hover:bg-gray-100'
                                      }`}
                                      onClick={() => handleAllergenSelection(allergen.id)}
                                    >
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                          <span className="text-xs text-primary">{allergen.icon?.substring(0, 1) || "A"}</span>
                                        </div>
                                        <span>{allergen.name}</span>
                                      </div>
                                      {selectedAllergens.includes(allergen.id) && (
                                        <Check className="h-4 w-4 text-primary" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <Button 
                                onClick={handleAddAllergensToProduct}
                                disabled={selectedAllergens.length === 0 || addProductAllergenMutation.isPending}
                                className="w-full mt-4 bg-primary hover:bg-primary/90"
                              >
                                {addProductAllergenMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>Update Product Allergens</>
                                )}
                              </Button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg h-full">
                              <p className="text-gray-500 mb-2">Select a product first</p>
                              <p className="text-xs text-gray-400">Choose a product from the list on the left</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="shadow-sm border border-gray-100">
              <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
                <CardTitle className="text-lg">User Management</CardTitle>
                <CardDescription className="text-xs">
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : users?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {users.map((user: any) => (
                      <div 
                        key={user.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.fullName || user.username}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-full border border-green-100 flex-shrink-0 ml-2">
                          Active
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
                    <User className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium">No users found</p>
                    <p className="text-xs text-gray-500 mt-1">User accounts will appear here when registered</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}