import { useState } from "react";
import { useLocation } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, HelpCircle, BookOpen, AlertTriangle, ArrowRight, Info, ExternalLink } from "lucide-react";

export default function EducationPage() {
  const [, navigate] = useLocation();
  const [selectedTab, setSelectedTab] = useState("basics");
  
  return (
    <div className="container max-w-md mx-auto p-4 pb-20">
      {/* Education Header */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-primary/10 p-2 rounded-md mr-3">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Allergen Education</h1>
        </div>
        <p className="text-gray-600 text-sm">
          Understanding food allergens is crucial for your health and safety.
          Learn about common allergens, how to identify them, and what to do in case of a reaction.
        </p>
      </div>
      
      {/* Featured Info Card */}
      <Card className="mb-6 border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-primary" />
            Did You Know?
          </CardTitle>
          <CardDescription>Important allergen facts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            In Nigeria, food allergies affect approximately 3-5% of the population, 
            with peanut and shellfish allergies being among the most common. 
            Many allergen reactions go unreported or misdiagnosed.
          </p>
        </CardContent>
      </Card>
      
      {/* Educational Content Tabs */}
      <Tabs defaultValue="basics" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="identify">Identify</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>
        
        {/* Basics Tab */}
        <TabsContent value="basics" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">What are food allergens?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">
                  Food allergens are proteins in food that can trigger an abnormal immune response in sensitive individuals. 
                  Even small amounts of an allergen can cause a reaction in those who are allergic.
                </p>
                <div className="bg-amber-50 p-3 rounded-md border border-amber-100 mt-2">
                  <p className="text-sm font-medium text-amber-800">Common symptoms include:</p>
                  <ul className="list-disc pl-4 text-sm text-amber-700 mt-1">
                    <li>Skin reactions (hives, itching, swelling)</li>
                    <li>Digestive problems (cramps, diarrhea, nausea)</li> 
                    <li>Respiratory issues (wheezing, coughing, runny nose)</li>
                    <li>In severe cases, anaphylaxis (life-threatening reaction)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Common food allergens</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Peanuts</p>
                    <p className="text-xs text-gray-600">Legumes that can cause severe allergic reactions</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Tree Nuts</p>
                    <p className="text-xs text-gray-600">Almonds, cashews, walnuts, etc.</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Milk</p>
                    <p className="text-xs text-gray-600">Dairy products with cow's milk protein</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Eggs</p>
                    <p className="text-xs text-gray-600">Found in many processed foods</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Fish</p>
                    <p className="text-xs text-gray-600">Various species can trigger reactions</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Shellfish</p>
                    <p className="text-xs text-gray-600">Shrimp, crab, lobster, etc.</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Soy</p>
                    <p className="text-xs text-gray-600">Found in many processed foods</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-md">
                    <p className="font-medium text-sm mb-1">Wheat</p>
                    <p className="text-xs text-gray-600">Contains gluten which affects some people</p>
                  </div>
                </div>
                <div className="mt-3 bg-primary/5 p-3 rounded-md">
                  <p className="text-sm font-medium">Nigerian specific allergens include:</p>
                  <ul className="list-disc pl-4 text-sm mt-1">
                    <li>Groundnuts (common in local soups and stews)</li>
                    <li>Egusi (melon seeds)</li>
                    <li>Stockfish (common in traditional dishes)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Allergy vs. Intolerance</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 mb-1">Allergy</Badge>
                    <p className="text-sm">Involves the immune system. Can be severe or life-threatening. Symptoms appear quickly, even with tiny amounts of food.</p>
                  </div>
                  
                  <div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mb-1">Intolerance</Badge>
                    <p className="text-sm">Involves the digestive system. Usually less serious and not life-threatening. Symptoms often delayed and typically related to the amount consumed.</p>
                  </div>
                  
                  <div className="flex items-start pt-2">
                    <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-600">Consult with a healthcare provider to determine whether you have an allergy or intolerance, as management approaches differ.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        {/* Identify Tab */}
        <TabsContent value="identify" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Reading NAFDAC food labels</AccordionTrigger>
              <AccordionContent>
                <p className="mb-2">In Nigeria, NAFDAC requires food manufacturers to clearly label if their products contain common allergens.</p>
                
                <div className="bg-white border rounded-md p-3 mb-3">
                  <p className="font-medium text-sm mb-2">Look for statements like:</p>
                  <ul className="space-y-2">
                    <li className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100">"Contains: milk, eggs, wheat"</li>
                    <li className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100">"May contain traces of nuts"</li>
                    <li className="text-sm bg-yellow-50 p-2 rounded border border-yellow-100">"Produced in a facility that also processes peanuts"</li>
                  </ul>
                </div>
                
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs">Always read ingredient lists carefully. Some allergens may be listed under alternative names (e.g., casein = milk protein).</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Hidden allergens in foods</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm mb-3">Many allergens can be hidden in processed foods under different names:</p>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-sm">Milk proteins may appear as:</p>
                    <p className="text-xs text-gray-600">Casein, whey, lactose, lactalbumin, ghee, curds</p>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-sm">Egg components may be listed as:</p>
                    <p className="text-xs text-gray-600">Albumin, globulin, ovomucin, ovovitellin, lysozyme</p>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-sm">Wheat may be hidden in:</p>
                    <p className="text-xs text-gray-600">Flour, starch, bran, cereal extract, couscous, pasta</p>
                  </div>
                  
                  <div className="bg-gray-50 p-2 rounded-md">
                    <p className="font-medium text-sm">Soy derivatives include:</p>
                    <p className="text-xs text-gray-600">Lecithin, tofu, tempeh, textured vegetable protein (TVP)</p>
                  </div>
                </div>
                
                <div className="flex items-center mt-3 p-2 bg-primary/5 rounded-md">
                  <ArrowRight className="h-4 w-4 text-primary mr-2" />
                  <p className="text-sm">When in doubt, contact the manufacturer directly.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Cross-contamination risks</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm mb-3">
                  Cross-contamination occurs when safe foods come into contact with allergens during production, 
                  storage, or preparation. This can happen in factories, restaurants, or even your own kitchen.
                </p>
                
                <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-3">
                  <p className="font-medium text-sm text-red-800 mb-1">High-risk scenarios:</p>
                  <ul className="list-disc pl-4 text-sm text-red-700">
                    <li>Shared cooking equipment in restaurants</li>
                    <li>Bulk bins in grocery stores</li>
                    <li>Using the same utensils for different foods</li>
                    <li>Oil from deep fryers used for multiple foods</li>
                    <li>Buffet-style food service</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-md p-3">
                  <p className="font-medium text-sm text-green-800 mb-1">Prevention tips:</p>
                  <ul className="list-disc pl-4 text-sm text-green-700">
                    <li>Use separate utensils and cutting boards</li>
                    <li>Clean surfaces thoroughly between food preparation</li>
                    <li>Store allergen-free foods separately and above allergenic foods</li>
                    <li>Wash hands thoroughly after handling allergens</li>
                    <li>When dining out, always inform staff about your allergies</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        
        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Emergency response plan</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-100 rounded-md p-3">
                    <p className="font-medium text-red-800 mb-1">Signs of a severe allergic reaction:</p>
                    <ul className="list-disc pl-4 text-sm text-red-700">
                      <li>Difficulty breathing or swallowing</li>
                      <li>Swelling of lips, tongue, or throat</li>
                      <li>Feeling dizzy or faint</li>
                      <li>Rapid heartbeat</li>
                      <li>Sudden drop in blood pressure</li>
                      <li>Loss of consciousness</li>
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm mb-1">Emergency steps:</p>
                    <ol className="list-decimal pl-4 text-sm space-y-2">
                      <li>Stop eating immediately if you suspect a reaction</li>
                      <li>Take antihistamines if prescribed for mild reactions</li>
                      <li>Use emergency epinephrine (EpiPen) if available for severe reactions</li>
                      <li>Call emergency services (112 in Nigeria)</li>
                      <li>If possible, keep the food packaging for identification</li>
                      <li>Stay calm and lie flat with legs elevated (unless having trouble breathing)</li>
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Eating out safely</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <p className="text-sm">Dining out with food allergies requires careful planning:</p>
                  
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="font-medium text-sm text-blue-800 mb-1">Before you go:</p>
                    <ul className="list-disc pl-4 text-sm text-blue-700">
                      <li>Research the restaurant and menu online</li>
                      <li>Call ahead to discuss allergen options</li>
                      <li>Consider visiting during off-peak hours</li>
                      <li>Bring emergency medication just in case</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-md">
                    <p className="font-medium text-sm text-purple-800 mb-1">At the restaurant:</p>
                    <ul className="list-disc pl-4 text-sm text-purple-700">
                      <li>Inform server and manager about your allergies</li>
                      <li>Ask about ingredients and preparation methods</li>
                      <li>Request that food be prepared with clean utensils</li>
                      <li>Avoid buffets and self-service areas</li>
                      <li>When in doubt, don't eat it</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Managing allergies in daily life</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium text-sm mb-1">Practical tips:</p>
                    <ul className="list-disc pl-4 text-sm">
                      <li>Keep a food diary to track potential reactions</li>
                      <li>Wear a medical alert bracelet/necklace</li>
                      <li>Create allergen-free zones in your kitchen</li>
                      <li>Always carry emergency medication</li>
                      <li>Educate family, friends and colleagues</li>
                    </ul>
                  </div>
                  
                  <div className="bg-teal-50 p-3 rounded-md">
                    <p className="font-medium text-sm text-teal-800 mb-1">For parents and caregivers:</p>
                    <ul className="list-disc pl-4 text-sm text-teal-700">
                      <li>Create an allergy action plan for your child</li>
                      <li>Inform teachers, school staff, and other parents</li>
                      <li>Teach children to recognize and report symptoms</li>
                      <li>Provide safe alternatives for school events</li>
                      <li>Consider allergy tests regularly as children grow</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Finding medical help in Nigeria</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm mb-3">For diagnosis and management of food allergies in Nigeria, consult:</p>
                
                <ul className="space-y-3 text-sm">
                  <li className="bg-white p-2 rounded border flex items-start">
                    <HelpCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Allergy specialists (immunologists)</p>
                      <p className="text-xs text-gray-600">Available at major teaching hospitals</p>
                    </div>
                  </li>
                  <li className="bg-white p-2 rounded border flex items-start">
                    <HelpCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Pediatricians</p>
                      <p className="text-xs text-gray-600">For children with suspected allergies</p>
                    </div>
                  </li>
                  <li className="bg-white p-2 rounded border flex items-start">
                    <HelpCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dermatologists</p>
                      <p className="text-xs text-gray-600">For skin-related allergic symptoms</p>
                    </div>
                  </li>
                  <li className="bg-white p-2 rounded border flex items-start">
                    <HelpCircle className="h-4 w-4 text-primary mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dietitians</p>
                      <p className="text-xs text-gray-600">For help with allergen-free diet planning</p>
                    </div>
                  </li>
                </ul>
                
                <div className="mt-3 text-xs text-gray-600">
                  <p className="font-medium mb-1">Major allergy centers in Nigeria include:</p>
                  <ul className="list-disc pl-4">
                    <li>Lagos University Teaching Hospital (LUTH)</li>
                    <li>University College Hospital (UCH), Ibadan</li>
                    <li>National Hospital Abuja</li>
                    <li>University of Nigeria Teaching Hospital, Enugu</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
      
      {/* Resources Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Additional Resources
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => navigate('/education/resources')}
          >
            See all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/education/resources')}>
            <p className="font-medium text-sm">Nigerian Society of Allergy and Immunology</p>
            <p className="text-xs text-gray-600">Information and support for allergy sufferers</p>
          </Card>
          
          <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/education/resources')}>
            <p className="font-medium text-sm">NAFDAC Food Safety Guidelines</p>
            <p className="text-xs text-gray-600">Official food labeling requirements</p>
          </Card>
          
          <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/education/resources')}>
            <p className="font-medium text-sm">Food Allergy Research & Education (FARE)</p>
            <p className="text-xs text-gray-600">Global resources on food allergies</p>
          </Card>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-3 flex items-center justify-center text-primary"
          onClick={() => navigate('/education/resources')}
        >
          View All Educational Resources 
          <ExternalLink className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}