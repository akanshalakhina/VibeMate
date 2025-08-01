import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Heart, 
  X, 
  Check, 
  MapPin, 
  Calendar,
  Star,
  Users,
  Home,
  MessageCircle,
  Phone,
  Mail,
  Send,
  Clock,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface PotentialMatch {
  id: string;
  name: string;
  age: number;
  bio: string;
  initials: string;
  isOnline: boolean;
  lastActive: Date;
  overallCompatibility: number;
  detailedCompatibility: {
    lifestyle: number;
    communication: number;
    roomPreferences: number;
  };
  category: 'good' | 'poor';
  areasForHarmony: string[];
  areasToNavigate: string[];
  recommendedRoom: {
    id: string;
    name: string;
    features: string[];
  };
}

interface MatchesData {
  goodMatches: PotentialMatch[];
  poorMatches: PotentialMatch[];
  summary: {
    totalMatches: number;
    goodCount: number;
    poorCount: number;
  };
}

export default function VibeMatesMatches() {
  const [activeTab, setActiveTab] = useState<'good' | 'poor'>('good');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [matchesData, setMatchesData] = useState<MatchesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [rejectedMatches, setRejectedMatches] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorizedMatches();
  }, []);

  const fetchCategorizedMatches = async () => {
    try {
      const response = await fetch('/api/categorized-matches');
      const data = await response.json();
      setMatchesData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setIsLoading(false);
    }
  };

  const sendMatchRequest = async (targetUserId: string) => {
    try {
      const response = await fetch('/api/match-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId,
          message: "Hi! I'd love to be your roommate. Let's connect!"
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSentRequests([...sentRequests, targetUserId]);
        
        if (data.mutualMatch) {
          // Navigate to mutual match page
          navigate(`/mutual-match/${data.matchRequest.id}`);
        } else {
          alert("Match request sent successfully!");
        }
      }
    } catch (error) {
      console.error('Error sending match request:', error);
      alert("Failed to send match request. Please try again.");
    }
  };

  const handleAccept = (match: PotentialMatch) => {
    sendMatchRequest(match.id);
  };

  const handleReject = (matchId: string) => {
    setRejectedMatches([...rejectedMatches, matchId]);
  };

  const getCurrentMatches = () => {
    if (!matchesData) return [];
    return activeTab === 'good' ? matchesData.goodMatches : matchesData.poorMatches;
  };

  const currentMatches = getCurrentMatches();
  const currentMatch = currentMatches[currentMatchIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Finding Your VibeMates</CardTitle>
            <CardDescription>
              Analyzing compatibility and categorizing matches...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!matchesData || currentMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">No Matches Found</CardTitle>
              <CardDescription className="text-lg">
                We couldn't find any matches at the moment. Try adjusting your preferences.
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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-primary">VibeMate</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Potential
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            VibeMates
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            We found {matchesData.summary.totalMatches} potential matches categorized by compatibility level.
            Review each match and send requests to those you'd like to connect with.
          </p>

          {/* Match Summary */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{matchesData.summary.goodCount}</div>
              <div className="text-sm text-gray-600">Good Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{matchesData.summary.poorCount}</div>
              <div className="text-sm text-gray-600">Poor Matches</div>
            </div>
          </div>
        </div>

        {/* Match Category Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as 'good' | 'poor');
          setCurrentMatchIndex(0);
        }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="good" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Good Matches ({matchesData.summary.goodCount})
            </TabsTrigger>
            <TabsTrigger value="poor" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              Poor Matches ({matchesData.summary.poorCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="good">
            {matchesData.goodMatches.length > 0 && (
              <div className="mb-4 text-center">
                <Badge className="bg-green-100 text-green-700">
                  High Compatibility - Recommended Matches
                </Badge>
              </div>
            )}
          </TabsContent>

          <TabsContent value="poor">
            {matchesData.poorMatches.length > 0 && (
              <div className="mb-4 text-center">
                <Badge className="bg-orange-100 text-orange-700">
                  Lower Compatibility - Consider Carefully
                </Badge>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Available Matches */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {activeTab === 'good' ? 'Good' : 'Poor'} Matches
                </CardTitle>
                <Badge className={activeTab === 'good' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                  {currentMatches.length} Available
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentMatches.map((match, index) => (
                  <div 
                    key={match.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      index === currentMatchIndex 
                        ? 'border-primary bg-purple-50' 
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setCurrentMatchIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {match.initials}
                        </div>
                        {match.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{match.name}</div>
                        <div className="text-xs text-gray-500">Age {match.age}</div>
                        <div className={`text-xs font-medium ${activeTab === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                          {match.overallCompatibility}% Match
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Match Profile */}
          <div className="lg:col-span-3">
            {currentMatch && (
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                        {currentMatch.initials}
                      </div>
                      {currentMatch.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">{currentMatch.name}</h2>
                        <Badge className="bg-gray-100 text-gray-700">
                          Age {currentMatch.age}
                        </Badge>
                        {currentMatch.isOnline ? (
                          <Badge className="bg-green-100 text-green-700">Online</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">
                            Last seen {new Date(currentMatch.lastActive).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{currentMatch.bio}</p>
                      <div className={`text-sm font-medium ${activeTab === 'good' ? 'text-green-600' : 'text-orange-600'}`}>
                        Overall Compatibility: {currentMatch.overallCompatibility}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Compatibility Breakdown */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="mb-2">
                        <Users className="w-6 h-6 mx-auto text-purple-500 mb-1" />
                        <div className="text-sm font-medium">Lifestyle</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {currentMatch.detailedCompatibility.lifestyle}%
                      </div>
                      <Progress value={currentMatch.detailedCompatibility.lifestyle} className="h-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-2">
                        <MessageCircle className="w-6 h-6 mx-auto text-pink-500 mb-1" />
                        <div className="text-sm font-medium">Communication</div>
                      </div>
                      <div className="text-2xl font-bold text-pink-600 mb-1">
                        {currentMatch.detailedCompatibility.communication}%
                      </div>
                      <Progress value={currentMatch.detailedCompatibility.communication} className="h-2" />
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-2">
                        <Home className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                        <div className="text-sm font-medium">Room Preferences</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {currentMatch.detailedCompatibility.roomPreferences}%
                      </div>
                      <Progress value={currentMatch.detailedCompatibility.roomPreferences} className="h-2" />
                    </div>
                  </div>

                  {/* Areas for Harmony and Navigation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Areas for Harmony
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">These align quite nicely</div>
                      <ul className="space-y-2">
                        {currentMatch.areasForHarmony.map((area, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Areas to Navigate
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">Differences that can be managed</div>
                      <ul className="space-y-2">
                        {currentMatch.areasToNavigate.map((area, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommended Room */}
                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Recommended Room</h3>
                        <div className="text-sm text-gray-600">Based on your preferences</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{currentMatch.recommendedRoom.name}</div>
                        <div className="text-sm text-gray-600">Available</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentMatch.recommendedRoom.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-300 text-purple-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Decision Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(currentMatch.id)}
                      disabled={rejectedMatches.includes(currentMatch.id)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {rejectedMatches.includes(currentMatch.id) ? 'Passed' : 'Pass'}
                    </Button>
                    <Button 
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500"
                      onClick={() => handleAccept(currentMatch)}
                      disabled={sentRequests.includes(currentMatch.id)}
                    >
                      {sentRequests.includes(currentMatch.id) ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Request
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Progress indicator */}
                  <div className="text-center text-sm text-gray-500">
                    {currentMatchIndex + 1} of {currentMatches.length} {activeTab} matches
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation between matches */}
        {currentMatches.length > 1 && (
          <div className="flex justify-center gap-4 mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentMatchIndex(Math.max(0, currentMatchIndex - 1))}
              disabled={currentMatchIndex === 0}
            >
              Previous Match
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentMatchIndex(Math.min(currentMatches.length - 1, currentMatchIndex + 1))}
              disabled={currentMatchIndex === currentMatches.length - 1}
            >
              Next Match
            </Button>
          </div>
        )}

        {/* View Requests Button */}
        <div className="text-center mt-8">
          <Link to="/match-requests">
            <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
              <MessageCircle className="w-4 h-4 mr-2" />
              View My Requests & Matches
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
