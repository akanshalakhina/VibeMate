import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Heart, 
  Edit,
  Save,
  X,
  MessageCircle,
  Calendar,
  Home,
  Users,
  CheckCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  preferences: {
    sleepSchedule: string;
    cleanliness: string;
    socialLevel: string;
    workSchedule: string;
    lifestyle: string;
  };
  roomPreferences: {
    roomType: string;
    floorPreference: string;
    windowPreference: string;
    quietLevel: string;
  };
  isOnline: boolean;
  lastActive: string;
}

interface MutualMatchData {
  matchRequest: any;
  currentUser: UserProfile;
  otherUser: UserProfile;
  compatibility: number;
  matchedAt: string;
  canEditProfile: boolean;
}

export default function MutualMatch() {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState<MutualMatchData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (matchId) {
      fetchMutualMatch(matchId);
    }
  }, [matchId]);

  const fetchMutualMatch = async (id: string) => {
    try {
      const response = await fetch(`/api/mutual-match/${id}`);
      const data = await response.json();
      setMatchData(data);
      setEditedProfile(data.currentUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching mutual match:', error);
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!editedProfile) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProfile),
      });

      const data = await response.json();
      
      if (data.success) {
        setMatchData(prev => prev ? { ...prev, currentUser: editedProfile } : null);
        setIsEditingProfile(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setEditedProfile(matchData?.currentUser || null);
    setIsEditingProfile(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Loading Match Details</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-red-600">Match Not Found</CardTitle>
              <CardDescription>
                This mutual match could not be found or you don't have permission to view it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/match-requests">
                <Button className="bg-gradient-to-r from-primary to-purple-600">
                  Back to Requests
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
          <Link to="/match-requests" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Requests
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-green-600">Mutual Match</span>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-4">
            🎉 It's a Match!
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            You and {matchData.otherUser.name} both want to be roommates! Time to get to know each other better and plan your move-in.
          </p>
          <Badge className="bg-green-100 text-green-700 text-lg px-4 py-2">
            {matchData.compatibility}% Compatibility
          </Badge>
        </div>

        {/* Both Profiles Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current User Profile */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {matchData.currentUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-blue-800">
                      {isEditingProfile ? 'Edit Your Profile' : 'Your Profile'}
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-700 mt-1">You</Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditingProfile ? cancelEdit() : setIsEditingProfile(true)}
                  className="border-blue-300 hover:bg-blue-50"
                >
                  {isEditingProfile ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {isEditingProfile && editedProfile ? (
                // Edit Mode
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={editedProfile.age}
                      onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Sleep Schedule</Label>
                      <Select
                        value={editedProfile.preferences.sleepSchedule}
                        onValueChange={(value) => setEditedProfile({
                          ...editedProfile,
                          preferences: { ...editedProfile.preferences, sleepSchedule: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="early-bird">Early Bird</SelectItem>
                          <SelectItem value="night-owl">Night Owl</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Cleanliness</Label>
                      <Select
                        value={editedProfile.preferences.cleanliness}
                        onValueChange={(value) => setEditedProfile({
                          ...editedProfile,
                          preferences: { ...editedProfile.preferences, cleanliness: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="very-clean">Very Clean</SelectItem>
                          <SelectItem value="moderately-clean">Moderately Clean</SelectItem>
                          <SelectItem value="relaxed">Relaxed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={saveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-blue-800">{matchData.currentUser.name}</h3>
                    <p className="text-sm text-blue-600">Age {matchData.currentUser.age}</p>
                  </div>
                  
                  <p className="text-blue-700">{matchData.currentUser.bio}</p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-blue-800">Preferences:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-600">Sleep: </span>
                        <span className="text-blue-800 capitalize">{matchData.currentUser.preferences.sleepSchedule.replace('-', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Clean: </span>
                        <span className="text-blue-800 capitalize">{matchData.currentUser.preferences.cleanliness.replace('-', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Social: </span>
                        <span className="text-blue-800 capitalize">{matchData.currentUser.preferences.socialLevel.replace('-', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Work: </span>
                        <span className="text-blue-800 capitalize">{matchData.currentUser.preferences.workSchedule.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other User Profile */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {matchData.otherUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {matchData.otherUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl text-purple-800">
                    {matchData.otherUser.name}'s Profile
                  </CardTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-700">Your Match</Badge>
                    {matchData.otherUser.isOnline ? (
                      <Badge className="bg-green-100 text-green-700">Online</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600">Offline</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-purple-800">{matchData.otherUser.name}</h3>
                <p className="text-sm text-purple-600">Age {matchData.otherUser.age}</p>
              </div>
              
              <p className="text-purple-700">{matchData.otherUser.bio}</p>
              
              <div className="space-y-2">
                <h4 className="font-medium text-purple-800">Preferences:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-purple-600">Sleep: </span>
                    <span className="text-purple-800 capitalize">{matchData.otherUser.preferences.sleepSchedule.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Clean: </span>
                    <span className="text-purple-800 capitalize">{matchData.otherUser.preferences.cleanliness.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Social: </span>
                    <span className="text-purple-800 capitalize">{matchData.otherUser.preferences.socialLevel.replace('-', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Work: </span>
                    <span className="text-purple-800 capitalize">{matchData.otherUser.preferences.workSchedule.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="text-center p-6">
              <MessageCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">Start Chatting</h3>
              <p className="text-sm text-green-700 mb-4">
                Get to know each other better before moving in together.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="text-center p-6">
              <Calendar className="w-12 h-12 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-800 mb-2">Schedule Meetup</h3>
              <p className="text-sm text-blue-700 mb-4">
                Plan a coffee date or virtual call to discuss living arrangements.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Call
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="text-center p-6">
              <Home className="w-12 h-12 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">Book Room</h3>
              <p className="text-sm text-purple-700 mb-4">
                Ready to move forward? Let's secure your shared room!
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Home className="w-4 h-4 mr-2" />
                Book Room
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Match Details */}
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Match Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{matchData.compatibility}%</div>
                <div className="text-sm text-gray-600">Compatibility Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {new Date(matchData.matchedAt).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">Matched On</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">Both</div>
                <div className="text-sm text-gray-600">Mutual Interest</div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Next Steps:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Exchange contact information</li>
                <li>• Discuss living preferences and boundaries</li>
                <li>• Plan a meetup to get to know each other</li>
                <li>• Finalize room booking and move-in details</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
