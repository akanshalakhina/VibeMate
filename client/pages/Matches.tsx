import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Heart, 
  Home, 
  Star, 
  MessageCircle, 
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { MatchResult, UserProfile, Room } from "@shared/roommate";

export default function Matches() {
  const [isLoading, setIsLoading] = useState(true);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    // Get user preferences and find matches via API
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      setUserPreferences(preferences);

      // Call matching API
      findMatchesFromAPI(preferences);
    }
  }, []);

  const findMatchesFromAPI = async (preferences: any) => {
    try {
      // Use enhanced matching API instead
      const response = await fetch('/api/enhanced-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();

      // Simulate loading delay for better UX
      setTimeout(() => {
        // Convert enhanced match result to legacy format for compatibility
        if (data) {
          const legacyMatch = {
            roommateId: data.roommateId,
            roommateName: data.roommateName,
            compatibilityScore: data.compatibilityScore,
            compatibilityLevel: data.compatibilityLevel,
            suggestedRoom: data.suggestedRoom,
            explanation: data.explanation,
            matchReasons: data.matchReasons
          };
          setMatchResult(legacyMatch);
        }
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error finding enhanced matches:', error);
      // Fallback to mock data if API fails
      setTimeout(() => {
        const mockMatch = generateMockMatch(preferences);
        setMatchResult(mockMatch);
        setIsLoading(false);
      }, 3000);
    }
  };

  const generateMockMatch = (preferences: any): MatchResult => {
    // Mock room data
    const suggestedRoom: Room = {
      id: "R-204",
      type: "twin-sharing",
      floor: 2,
      hasWindow: true,
      isQuiet: true,
      isOccupied: false,
      occupants: [],
      maxOccupants: 2
    };

    // Mock compatibility calculation
    const compatibilityScore = 92;
    
    return {
      roommateId: "user-456",
      roommateName: "Maya Patel",
      compatibilityScore,
      compatibilityLevel: "high",
      suggestedRoom,
      explanation: "Maya is an excellent match for you! You both prefer quiet evening routines, work from home occasionally, and maintain moderately clean spaces. Your sleep schedules align perfectly as fellow night owls.",
      matchReasons: [
        "Both prefer night owl sleep schedules (11 PM - 8 AM)",
        "Similar cleanliness preferences - moderately organized",
        "Compatible work schedules with flexible home/office balance", 
        "Shared preference for moderate social interaction",
        "Both interested in twin-sharing room arrangement"
      ]
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Finding Your Perfect Match</CardTitle>
            <CardDescription>
              Our AI is analyzing your preferences and finding compatible roommates...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Analyzing compatibility factors</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
              
              <div className="flex justify-between text-sm">
                <span>Finding available rooms</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
              
              <div className="flex justify-between text-sm">
                <span>Calculating match scores</span>
                <span>70%</span>
              </div>
              <Progress value={70} />
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-6">
              This usually takes 30-60 seconds...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!matchResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-red-600">No Matches Found</CardTitle>
              <CardDescription>
                We couldn't find any compatible roommates at the moment. Please try adjusting your preferences or check back later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/survey">
                <Button className="bg-gradient-to-r from-primary to-purple-600">
                  Retake Survey
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/survey" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Survey
          </Link>
        </div>

        {/* Match Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Perfect Match Found!
          </h1>
          <p className="text-xl text-gray-600">
            We found an amazing roommate who shares your lifestyle and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Roommate Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {matchResult.roommateName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{matchResult.roommateName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        {matchResult.compatibilityScore}% Match
                      </Badge>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {matchResult.explanation}
                </p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Why you're compatible:</h4>
                  <ul className="space-y-2">
                    {matchResult.matchReasons.map((reason, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Room Details */}
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Your Suggested Room
                </CardTitle>
                <CardDescription>
                  Room {matchResult.suggestedRoom.id} - Perfect for your preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Room Type</div>
                      <div className="text-lg capitalize">{matchResult.suggestedRoom.type.replace('-', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Floor</div>
                      <div className="text-lg">Floor {matchResult.suggestedRoom.floor}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Features</div>
                      <div className="space-y-1">
                        {matchResult.suggestedRoom.hasWindow && (
                          <Badge variant="outline" className="text-xs">Window View</Badge>
                        )}
                        {matchResult.suggestedRoom.isQuiet && (
                          <Badge variant="outline" className="text-xs">Quiet Area</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Availability</div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Available Now</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary">
                  <Home className="w-4 h-4 mr-2" />
                  Reserve This Room
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Compatibility Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Compatibility Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="none" 
                      stroke="url(#gradient)" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - matchResult.compatibilityScore / 100)}`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-800">{matchResult.compatibilityScore}%</div>
                      <div className="text-sm text-gray-600 capitalize">{matchResult.compatibilityLevel}</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600">
                  This is an excellent match! You have very high compatibility across all key areas.
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary">
                  <Heart className="w-4 h-4 mr-2" />
                  Accept Match
                </Button>
                <Button variant="outline" className="w-full border-purple-200 hover:bg-purple-50">
                  <Users className="w-4 h-4 mr-2" />
                  View More Matches
                </Button>
                <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-800">
                  <Clock className="w-4 h-4 mr-2" />
                  Save for Later
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                  <span>Connect with Maya and chat about living preferences</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                  <span>Schedule a virtual or in-person meetup</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                  <span>Finalize room reservation and move-in details</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
