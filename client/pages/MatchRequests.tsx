import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Heart, 
  Check, 
  X,
  Clock,
  MessageCircle,
  Users,
  Send,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface MatchRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  targetUser?: any;
  fromUser?: any;
  otherUser?: any;
}

interface RequestsData {
  sent: MatchRequest[];
  received: MatchRequest[];
  mutualMatches: MatchRequest[];
}

export default function MatchRequests() {
  const [requestsData, setRequestsData] = useState<RequestsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatchRequests();
  }, []);

  const fetchMatchRequests = async () => {
    try {
      const response = await fetch('/api/match-requests');
      const data = await response.json();
      setRequestsData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching match requests:', error);
      setIsLoading(false);
    }
  };

  const respondToRequest = async (requestId: string, response: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/match-requests/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response }),
      });

      const data = await res.json();
      
      if (data.success) {
        if (response === 'accept' && data.mutualMatch) {
          // Navigate to mutual match page
          navigate(`/mutual-match/${requestId}`);
        } else {
          // Refresh the requests
          fetchMatchRequests();
        }
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      alert("Failed to respond to request. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Loading Requests</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/matches" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matches
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-primary">VibeMate</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            Match Requests & Connections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your sent requests, respond to incoming requests, and view your mutual matches.
          </p>
        </div>

        {/* Tabs for different request types */}
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Received ({requestsData?.received.length || 0})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Sent ({requestsData?.sent.length || 0})
            </TabsTrigger>
            <TabsTrigger value="mutual" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Mutual Matches ({requestsData?.mutualMatches.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Received Requests */}
          <TabsContent value="received">
            <div className="space-y-6">
              {requestsData?.received.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Requests Yet</h3>
                    <p className="text-gray-600">
                      You haven't received any match requests yet. Keep browsing matches!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                requestsData?.received.map((request) => (
                  <Card key={request.id} className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                          {request.fromUser?.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{request.fromUser?.name}</CardTitle>
                            <Badge className="bg-blue-100 text-blue-700">
                              Age {request.fromUser?.age}
                            </Badge>
                            {request.status === 'pending' && (
                              <Badge className="bg-yellow-100 text-yellow-700">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2">
                            {request.message}
                          </CardDescription>
                          <div className="text-sm text-gray-500 mt-2">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {request.status === 'pending' && (
                      <CardContent>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                            onClick={() => respondToRequest(request.id, 'reject')}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500"
                            onClick={() => respondToRequest(request.id, 'accept')}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Sent Requests */}
          <TabsContent value="sent">
            <div className="space-y-6">
              {requestsData?.sent.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Send className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Sent Requests</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't sent any match requests yet.
                    </p>
                    <Link to="/matches">
                      <Button className="bg-gradient-to-r from-primary to-purple-600">
                        Browse Matches
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                requestsData?.sent.map((request) => (
                  <Card key={request.id} className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                          {request.targetUser?.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{request.targetUser?.name}</CardTitle>
                            <Badge className="bg-blue-100 text-blue-700">
                              Age {request.targetUser?.age}
                            </Badge>
                            <Badge className={
                              request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }>
                              {request.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {request.status === 'rejected' && <X className="w-3 h-3 mr-1" />}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <CardDescription className="mt-2">
                            Your message: "{request.message}"
                          </CardDescription>
                          <div className="text-sm text-gray-500 mt-2">
                            Sent {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Mutual Matches */}
          <TabsContent value="mutual">
            <div className="space-y-6">
              {requestsData?.mutualMatches.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Mutual Matches Yet</h3>
                    <p className="text-gray-600 mb-4">
                      When someone accepts your request or you accept theirs, you'll see mutual matches here.
                    </p>
                    <Link to="/matches">
                      <Button className="bg-gradient-to-r from-primary to-purple-600">
                        Find More Matches
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                requestsData?.mutualMatches.map((match) => (
                  <Card key={match.id} className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                          {match.otherUser?.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-xl">{match.otherUser?.name}</CardTitle>
                            <Badge className="bg-green-100 text-green-700">
                              <Heart className="w-3 h-3 mr-1" />
                              Mutual Match!
                            </Badge>
                          </div>
                          <CardDescription className="mt-2 text-green-700">
                            You both are interested in being roommates! Time to connect and plan your move-in.
                          </CardDescription>
                          <div className="text-sm text-green-600 mt-2">
                            Matched on {new Date(match.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500"
                          onClick={() => navigate(`/mutual-match/${match.id}`)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          View Mutual Match
                        </Button>
                        <Button variant="outline" className="border-green-300 hover:bg-green-50">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
