import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Heart, 
  Home, 
  Mic, 
  Sparkles, 
  Shield, 
  Brain,
  ChevronRight,
  Star,
  MessageCircle,
  Clock,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
    <CardHeader className="text-center pb-4">
      <div className="mx-auto w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription className="text-center text-gray-600 leading-relaxed">
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex items-start gap-4">
    <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
      {number}
    </div>
    <div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default function Index() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="backdrop-blur-sm bg-white/80 border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                VIBEMATE
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/test-matching" className="text-gray-600 hover:text-primary transition-colors">Test Matching</Link>
              <Link to="/admin" className="text-gray-600 hover:text-primary transition-colors">Admin</Link>
              <Link to="/signin" className="text-gray-600 hover:text-primary transition-colors">Sign In</Link>
              <Link to="/signup" className="text-gray-600 hover:text-primary transition-colors">Sign Up</Link>
              <Link to="/survey">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
              🎉 AI-Powered Roommate Matching
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Find Your Perfect
              <br />
              Roommate Match
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Experience the future of co-living with our AI-powered voice assistant that understands your preferences 
              and connects you with compatible roommates in beautiful women's co-living spaces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/survey">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary px-8 py-6 text-lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Voice Survey
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/survey">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-purple-200 hover:bg-purple-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Take Text Survey
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Match Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5 Min</div>
              <div className="text-gray-600">Average Survey Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray-600">Happy Roommates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose VIBEMATE?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge voice technology with intelligent matching algorithms 
              to create the perfect roommate experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mic className="w-6 h-6" />}
              title="Voice-First Experience"
              description="Speak naturally to our AI assistant. No forms to fill - just have a conversation about your preferences and lifestyle."
            />
            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="Smart AI Matching"
              description="Our advanced algorithm analyzes compatibility across multiple dimensions to find your ideal roommate match."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Safe & Secure"
              description="Privacy-first design with ethical AI that respects your data and ensures fair, unbiased matching."
            />
            <FeatureCard
              icon={<Home className="w-6 h-6" />}
              title="Perfect Room Allocation"
              description="Get matched not just with people, but with the ideal room based on your preferences and compatibility."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Instant Results"
              description="Receive your compatibility score and match recommendations in real-time with detailed explanations."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Community Focused"
              description="Join a thriving community of like-minded women in safe, beautiful co-living spaces."
            />
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting matched with your perfect roommate is easier than ever with our streamlined process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <StepCard
                number={1}
                title="Voice Survey"
                description="Chat with our AI assistant about your lifestyle, preferences, and what you're looking for in a roommate. Takes just 5 minutes!"
              />
              <StepCard
                number={2}
                title="AI Analysis"
                description="Our advanced algorithm analyzes your responses and creates a comprehensive compatibility profile."
              />
              <StepCard
                number={3}
                title="Smart Matching"
                description="Get matched with compatible roommates and receive room recommendations with detailed explanations."
              />
              <StepCard
                number={4}
                title="Connect & Move In"
                description="Review your matches, connect with potential roommates, and finalize your perfect co-living arrangement."
              />
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-2xl p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                  <p className="text-gray-600 mb-6">
                    Begin your journey to finding the perfect roommate with just your voice.
                  </p>
                  <Link to="/survey">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
                    >
                      <Mic className="w-5 h-5 mr-2" />
                      Start Voice Survey
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                text: "Found my perfect roommate in minutes! The voice survey was so natural and the match was spot-on.",
                rating: 5
              },
              {
                name: "Emily Rodriguez", 
                text: "Love how the AI understood exactly what I was looking for. My roommate and I are best friends now!",
                rating: 5
              },
              {
                name: "Priya Patel",
                text: "The room allocation was perfect too - quiet corner room just like I wanted. Amazing technology!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold text-primary">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Find Your Perfect Roommate?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of women who have found their ideal living situation through VIBEMATE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/survey">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary px-8 py-6 text-lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">VIBEMATE</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy;  Built with ❤️ for better co-living.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
