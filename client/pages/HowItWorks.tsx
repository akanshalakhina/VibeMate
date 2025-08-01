import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
        
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              How It Works - Detailed Guide
            </CardTitle>
            <CardDescription className="text-lg">
              Learn more about our AI-powered roommate matching process.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Detailed explanation of the matching algorithm, voice AI integration, and room allocation process.
            </p>
            <Button className="bg-gradient-to-r from-primary to-purple-600">
              Continue Building This Feature
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
