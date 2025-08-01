import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Users, 
  Home, 
  Heart,
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { UserProfile, MatchResult, Room } from "@shared/roommate";

// Mock data for demonstration
const mockUsers: UserProfile[] = [
  {
    id: "user-1",
    name: "Sarah Chen",
    age: 24,
    email: "sarah.chen@email.com",
    createdAt: new Date("2024-01-15"),
    preferences: {
      sleepSchedule: "night-owl",
      cleanliness: "very-clean",
      socialLevel: "moderately-social",
      workSchedule: "work-from-home",
      lifestyle: "active"
    },
    roomPreferences: {
      roomType: "twin-sharing",
      floorPreference: "middle",
      windowPreference: "near-window",
      quietLevel: "moderate"
    }
  },
  {
    id: "user-2", 
    name: "Maya Patel",
    age: 26,
    email: "maya.patel@email.com",
    createdAt: new Date("2024-01-16"),
    preferences: {
      sleepSchedule: "night-owl",
      cleanliness: "moderately-clean",
      socialLevel: "moderately-social", 
      workSchedule: "flexible",
      lifestyle: "balanced"
    },
    roomPreferences: {
      roomType: "twin-sharing",
      floorPreference: "top",
      windowPreference: "near-window",
      quietLevel: "very-quiet"
    }
  },
  {
    id: "user-3",
    name: "Emily Rodriguez",
    age: 23,
    email: "emily.rodriguez@email.com", 
    createdAt: new Date("2024-01-17"),
    preferences: {
      sleepSchedule: "early-bird",
      cleanliness: "very-clean",
      socialLevel: "very-social",
      workSchedule: "office-based",
      lifestyle: "active"
    },
    roomPreferences: {
      roomType: "single",
      floorPreference: "ground",
      windowPreference: "no-preference",
      quietLevel: "lively"
    }
  }
];

const mockRooms: Room[] = [
  {
    id: "R-101",
    type: "twin-sharing",
    floor: 1,
    hasWindow: true,
    isQuiet: true,
    isOccupied: false,
    occupants: [],
    maxOccupants: 2
  },
  {
    id: "R-204",
    type: "twin-sharing", 
    floor: 2,
    hasWindow: true,
    isQuiet: true,
    isOccupied: true,
    occupants: ["user-1", "user-2"],
    maxOccupants: 2
  },
  {
    id: "R-305",
    type: "single",
    floor: 3, 
    hasWindow: false,
    isQuiet: false,
    isOccupied: true,
    occupants: ["user-3"],
    maxOccupants: 1
  }
];

const mockMatches: (MatchResult & { userId: string; matchedAt: Date })[] = [
  {
    userId: "user-1",
    roommateId: "user-2",
    roommateName: "Maya Patel",
    compatibilityScore: 92,
    compatibilityLevel: "high",
    suggestedRoom: mockRooms[1],
    explanation: "Excellent compatibility in sleep schedules and lifestyle preferences.",
    matchReasons: ["Both night owls", "Similar cleanliness levels", "Compatible work schedules"],
    matchedAt: new Date("2024-01-18")
  }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState(mockUsers);
  const [rooms] = useState(mockRooms);
  const [matches] = useState(mockMatches);

  const stats = {
    totalUsers: users.length,
    activeMatches: matches.length,
    availableRooms: rooms.filter(r => !r.isOccupied).length,
    occupancyRate: ((rooms.filter(r => r.isOccupied).length / rooms.length) * 100).toFixed(1)
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage profiles, matches, and room allocations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2 this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Matches</CardTitle>
              <Heart className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeMatches}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +1 this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available Rooms</CardTitle>
              <Home className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableRooms}</div>
              <p className="text-xs text-gray-600 mt-1">
                Out of {rooms.length} total
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Occupancy Rate</CardTitle>
              <BarChart3 className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Profiles</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="rooms">Room Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activity and matches</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New match created</p>
                      <p className="text-xs text-gray-600">Sarah Chen matched with Maya Patel (92% compatibility)</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New user registered</p>
                      <p className="text-xs text-gray-600">Emily Rodriguez completed voice survey</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Room allocated</p>
                      <p className="text-xs text-gray-600">Room R-204 assigned to matched pair</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>AI matching performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Match Score</span>
                    <Badge className="bg-green-100 text-green-700">89%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Survey Completion Rate</span>
                    <Badge className="bg-blue-100 text-blue-700">94%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Voice AI Accuracy</span>
                    <Badge className="bg-purple-100 text-purple-700">97%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">User Satisfaction</span>
                    <Badge className="bg-green-100 text-green-700">96%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Profiles</CardTitle>
                    <CardDescription>Manage all user profiles and preferences</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">Joined {user.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {user.preferences.sleepSchedule.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.preferences.socialLevel.replace('-', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Active Matches</CardTitle>
                <CardDescription>View and manage all roommate matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="font-medium">
                            {users.find(u => u.id === match.userId)?.name} ↔ {match.roommateName}
                          </span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {match.compatibilityScore}% Match
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Room:</span> {match.suggestedRoom.id}
                        </div>
                        <div>
                          <span className="text-gray-600">Matched:</span> {match.matchedAt.toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{match.explanation}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Room Management</CardTitle>
                <CardDescription>Manage room availability and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((room) => (
                    <Card key={room.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Room {room.id}</CardTitle>
                          <Badge variant={room.isOccupied ? "destructive" : "default"}>
                            {room.isOccupied ? "Occupied" : "Available"}
                          </Badge>
                        </div>
                        <CardDescription>
                          Floor {room.floor} • {room.type.replace('-', ' ')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {room.hasWindow && (
                            <Badge variant="outline" className="text-xs">Window</Badge>
                          )}
                          {room.isQuiet && (
                            <Badge variant="outline" className="text-xs">Quiet</Badge>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Occupancy:</span> {room.occupants.length}/{room.maxOccupants}
                        </div>
                        {room.occupants.length > 0 && (
                          <div className="text-sm">
                            <span className="text-gray-600">Residents:</span>
                            <div className="mt-1">
                              {room.occupants.map(occupantId => {
                                const user = users.find(u => u.id === occupantId);
                                return user ? (
                                  <div key={occupantId} className="text-xs text-gray-700">
                                    {user.name}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
