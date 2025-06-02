import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ExternalLink, BookOpen, FileText, Video } from "lucide-react";

export default function EducationalResourcesPage() {
  const [, navigate] = useLocation();
  
  const resources = [
    {
      title: "Understanding Food Allergies",
      description: "Comprehensive guide to common food allergens and their effects",
      type: "Article",
      icon: <FileText className="h-5 w-5" />,
      link: "https://example.com/food-allergies-guide"
    },
    {
      title: "Allergy Emergency Response",
      description: "Learn how to respond to severe allergic reactions",
      type: "Video",
      icon: <Video className="h-5 w-5" />,
      link: "https://example.com/allergy-emergency-video"
    },
    {
      title: "Allergen-Free Cooking",
      description: "Recipes and tips for cooking without common allergens",
      type: "Article",
      icon: <FileText className="h-5 w-5" />,
      link: "https://example.com/allergen-free-cooking"
    },
    {
      title: "Spotting Hidden Allergens",
      description: "How to identify allergens hidden in processed foods",
      type: "Guide",
      icon: <BookOpen className="h-5 w-5" />,
      link: "https://example.com/hidden-allergens"
    },
    {
      title: "Traveling with Food Allergies",
      description: "Tips for staying safe while traveling with food allergies",
      type: "Article",
      icon: <FileText className="h-5 w-5" />,
      link: "https://example.com/travel-with-allergies"
    }
  ];

  return (
    <div className="min-h-full flex flex-col p-4 pb-20">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="bg-primary/10 p-2 rounded-md mr-3">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Educational Resources</h1>
        </div>
        <p className="text-gray-600 text-sm">
          Explore these resources to learn more about allergens, food safety, and managing allergies.
        </p>
      </div>

      <div className="space-y-4">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <div className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  {resource.icon}
                  <span className="ml-1">{resource.type}</span>
                </div>
              </div>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary flex items-center"
                onClick={() => window.open(resource.link, '_blank')}
              >
                View Resource
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button 
        variant="outline" 
        className="mt-6"
        onClick={() => navigate('/education')}
      >
        Back to Education
      </Button>
    </div>
  );
}