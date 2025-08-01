import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Heart, 
  Home, 
  Star, 
  MessageCircle, 
  Calendar,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  Shield,
  Users,
  Moon,
  Sun,
  Phone,
  Volume2,
  VolumeX,
  Calendar as CalendarIcon,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

interface ActiveMeasure {
  rule: string;
  description: string;
  category: string;
}

interface EnhancedMatchResult {
  roommateId: string;
  roommateName: string;
  compatibilityScore: number;
  compatibilityLevel: string;
  suggestedRoom?: any;
  explanation: string;
  matchReasons: string[];
  activeMeasures: ActiveMeasure[];
  roomAssigned: boolean;
  noRoomReason?: string;
}

export default function EnhancedMatches() {
  const [isLoading, setIsLoading] = useState(true);
  const [matchResult, setMatchResult] = useState<EnhancedMatchResult | null>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      setUserPreferences(preferences);
      findEnhancedMatch(preferences);
    }
  }, []);

  const findEnhancedMatch = async (preferences: any) => {
    try {
      const response = await fetch('/api/enhanced-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      
      setTimeout(() => {
        setMatchResult(data);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error finding enhanced matches:', error);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const submitFeedback = async () => {
    if (!matchResult || rating === 0) return;
    
    setSubmittingFeedback(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: `match-${Date.now()}`,
          userId: 'current-user',
          roommateId: matchResult.roommateId,
          rating,
          feedback,
          improvementSuggestions: []
        }),
      });

      const data = await response.json();
      if (data.message) {
        setShowFeedback(false);
        alert('Thank you for your feedback! This will help improve our matching algorithm.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep': return <Moon className="w-4 h-4" />;
      case 'cleanliness': return <Sparkles className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'work': return <Calendar className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 50) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-10 h-10 text-white" />;
    if (score >= 50) return <AlertTriangle className="w-10 h-10 text-white" />;
    return <XCircle className="w-10 h-10 text-white" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Analyzing Compatibility</CardTitle>
            <CardDescription>
              Our enhanced AI is evaluating compatibility and determining room assignment...
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Compatibility analysis</span>
                <span>100%</span>
              </div>
              <Progress value={100} />
              
              <div className="flex justify-between text-sm">
                <span>Room assignment evaluation</span>
                <span>85%</span>
              </div>
              <Progress value={85} />
              
              <div className="flex justify-between text-sm">
                <span>Active measures generation</span>
                <span>70%</span>
              </div>
              <Progress value={70} />
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
              <CardTitle className="text-2xl text-red-600">Matching Error</CardTitle>
              <CardDescription>
                We encountered an error while finding your match. Please try again.
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
          <div className={`w-20 h-20 bg-gradient-to-br ${getScoreColor(matchResult.compatibilityScore)} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {getScoreIcon(matchResult.compatibilityScore)}
          </div>
          
          {matchResult.roomAssigned ? (
            <>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                {matchResult.compatibilityScore >= 80 ? 'Perfect Match Found!' : 'Match Found with Conditions'}
              </h1>
              <p className="text-xl text-gray-600">
                {matchResult.compatibilityScore >= 80 
                  ? 'Excellent compatibility! You\'re all set for a great roommate experience.'
                  : 'Good compatibility with some guidelines to ensure harmony.'
                }
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-red-600 mb-2">
                No Room Assignment
              </h1>
              <p className="text-xl text-gray-600">
                Unfortunately, we cannot assign a room at this time.
              </p>
            </>
          )}
        </div>

        {matchResult.roomAssigned ? (
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
                        <Badge className={`${matchResult.compatibilityScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} hover:bg-opacity-80`}>
                          {matchResult.compatibilityScore}% Match
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {matchResult.compatibilityLevel} Compatibility
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {matchResult.explanation}
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Compatibility Factors:</h4>
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

              {/* Active Measures (for 50-80% matches) */}
              {matchResult.activeMeasures && matchResult.activeMeasures.length > 0 && (
                <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-sm border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="w-5 h-5" />
                      Active Measures for Harmony
                    </CardTitle>
                    <CardDescription className="text-orange-700">
                      Follow these guidelines to ensure a successful roommate relationship despite some compatibility differences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {matchResult.activeMeasures.map((measure, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-orange-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                            {getCategoryIcon(measure.category)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-orange-800 mb-1">{measure.rule}</h4>
                            <p className="text-orange-700 text-sm">{measure.description}</p>
                            <Badge variant="outline" className="mt-2 text-xs capitalize border-orange-300 text-orange-600">
                              {measure.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-orange-100 rounded-lg p-4 mt-4">
                      <p className="text-sm text-orange-800">
                        <strong>Important:</strong> Both roommates must agree to follow these guidelines before room assignment is finalized. 
                        This ensures a harmonious living environment for everyone.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Room Details */}
              {matchResult.suggestedRoom && (
                <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="w-5 h-5" />
                      Your Assigned Room
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
                      {matchResult.activeMeasures.length > 0 ? 'Accept Conditions & Reserve Room' : 'Reserve This Room'}
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                        stroke={`url(#gradient-${matchResult.compatibilityScore >= 80 ? 'high' : matchResult.compatibilityScore >= 50 ? 'medium' : 'low'})`}
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - matchResult.compatibilityScore / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient-high" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ef4444" />
                          <stop offset="100%" stopColor="#dc2626" />
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
                    {matchResult.compatibilityScore >= 80 
                      ? "Excellent compatibility! You're perfectly matched."
                      : "Good compatibility with some adjustments needed."
                    }
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
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-200 hover:bg-blue-50"
                    onClick={() => setShowFeedback(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Provide Feedback
                  </Button>
                </CardContent>
              </Card>

              {matchResult.activeMeasures.length > 0 && (
                <Card className="border-0 shadow-xl bg-gradient-to-r from-orange-50 to-yellow-50 backdrop-blur-sm border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-center text-orange-800">Important Notice</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3 text-sm text-orange-700">
                    <p>This match requires following specific guidelines for success.</p>
                    <p>Both roommates must agree to the active measures before room assignment.</p>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <UserCheck className="w-4 h-4" />
                      <span className="font-medium">Mutual Agreement Required</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* No Room Assignment UI */
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-red-50 to-pink-50 backdrop-blur-sm border-red-200">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-red-800">Room Assignment Not Possible</CardTitle>
                <CardDescription className="text-red-700 text-lg">
                  Compatibility Score: {matchResult.compatibilityScore}% (Below 50% Threshold)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Why No Room Was Assigned:</h3>
                  <p className="text-red-700 leading-relaxed">{matchResult.noRoomReason}</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-3">Next Steps:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-red-700">
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Retake the survey with more flexible preferences</span>
                    </li>
                    <li className="flex items-start gap-2 text-red-700">
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Consider adjusting your lifestyle requirements</span>
                    </li>
                    <li className="flex items-start gap-2 text-red-700">
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Wait for new potential roommates to join</span>
                    </li>
                    <li className="flex items-start gap-2 text-red-700">
                      <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>Contact our support team for personalized assistance</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/survey">
                    <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Retake Survey
                    </Button>
                  </Link>
                  <Link to="/chat">
                    <Button variant="outline" className="border-purple-200 hover:bg-purple-50">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Get Help from AI Assistant
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="border-blue-200 hover:bg-blue-50"
                    onClick={() => setShowFeedback(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Provide Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md border-0 shadow-2xl bg-white">
              <CardHeader>
                <CardTitle>Provide Feedback</CardTitle>
                <CardDescription>
                  Help us improve our matching algorithm with your feedback.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rate this match result:</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={() => setRating(star)}
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Additional feedback:</label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what could be improved..."
                    className="mt-2"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={submitFeedback}
                    disabled={rating === 0 || submittingFeedback}
                    className="flex-1"
                  >
                    {submittingFeedback ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Submit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFeedback(false)}
                    disabled={submittingFeedback}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
