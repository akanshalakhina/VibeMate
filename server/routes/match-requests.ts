import { RequestHandler } from "express";

// Mock database for match requests and user profiles
let matchRequests: any[] = [];
let userProfiles: any[] = [
  {
    id: "user-1",
    name: "Current User",
    age: 23,
    bio: "Looking for a compatible roommate to share awesome experiences!",
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
    },
    photos: [],
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: "user-2",
    name: "Rachel Kim",
    age: 22,
    bio: "Early planner who loves coffee mornings and good grooming. Very outgoing and energetic vibes.",
    preferences: {
      sleepSchedule: "early-bird",
      cleanliness: "very-clean",
      socialLevel: "very-social",
      workSchedule: "office-based",
      lifestyle: "active"
    },
    roomPreferences: {
      roomType: "twin-sharing",
      floorPreference: "ground",
      windowPreference: "near-window",
      quietLevel: "lively"
    },
    photos: [],
    isOnline: false,
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: "user-3",
    name: "Jessica Wong",
    age: 24,
    bio: "Creative designer who loves late night projects and cozy vibes. Looking for understanding roommate.",
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
    },
    photos: [],
    isOnline: true,
    lastActive: new Date()
  },
  {
    id: "user-4",
    name: "Maya Patel",
    age: 26,
    bio: "Software engineer who values work-life balance. Loves cooking and weekend movie marathons.",
    preferences: {
      sleepSchedule: "flexible",
      cleanliness: "very-clean",
      socialLevel: "moderately-social",
      workSchedule: "work-from-home",
      lifestyle: "balanced"
    },
    roomPreferences: {
      roomType: "twin-sharing",
      floorPreference: "middle",
      windowPreference: "near-window",
      quietLevel: "moderate"
    },
    photos: [],
    isOnline: true,
    lastActive: new Date()
  }
];

function calculateCompatibilityScore(user1Prefs: any, user2Prefs: any): number {
  let score = 0;
  let totalFactors = 0;

  // Sleep schedule compatibility (weight: 25%)
  if (user1Prefs.sleepSchedule === user2Prefs.sleepSchedule) {
    score += 25;
  } else if (user1Prefs.sleepSchedule === 'flexible' || user2Prefs.sleepSchedule === 'flexible') {
    score += 15;
  }
  totalFactors += 25;

  // Cleanliness compatibility (weight: 20%)
  const cleanlinessScore: { [key: string]: number } = {'very-clean': 3, 'moderately-clean': 2, 'relaxed': 1};
  const user1Clean = cleanlinessScore[user1Prefs.cleanliness] || 2;
  const user2Clean = cleanlinessScore[user2Prefs.cleanliness] || 2;
  const cleanDiff = Math.abs(user1Clean - user2Clean);
  score += Math.max(0, 20 - (cleanDiff * 10));
  totalFactors += 20;

  // Social level compatibility (weight: 20%)
  const socialScore: { [key: string]: number } = {'very-social': 3, 'moderately-social': 2, 'quiet': 1};
  const user1Social = socialScore[user1Prefs.socialLevel] || 2;
  const user2Social = socialScore[user2Prefs.socialLevel] || 2;
  const socialDiff = Math.abs(user1Social - user2Social);
  score += Math.max(0, 20 - (socialDiff * 10));
  totalFactors += 20;

  // Work schedule compatibility (weight: 15%)
  if (user1Prefs.workSchedule === user2Prefs.workSchedule) {
    score += 15;
  } else if (user1Prefs.workSchedule === 'flexible' || user2Prefs.workSchedule === 'flexible') {
    score += 10;
  } else {
    score += 5;
  }
  totalFactors += 15;

  // Lifestyle compatibility (weight: 20%)
  if (user1Prefs.lifestyle === user2Prefs.lifestyle) {
    score += 20;
  } else if (user1Prefs.lifestyle === 'balanced' || user2Prefs.lifestyle === 'balanced') {
    score += 12;
  } else {
    score += 5;
  }
  totalFactors += 20;

  return Math.round((score / totalFactors) * 100);
}

export const getCategorizedMatches: RequestHandler = (req, res) => {
  try {
    const currentUserId = "user-1"; // In real app, get from auth
    const currentUser = userProfiles.find(u => u.id === currentUserId);
    
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const otherUsers = userProfiles.filter(u => u.id !== currentUserId);
    
    const matches = otherUsers.map(user => {
      const score = calculateCompatibilityScore(currentUser.preferences, user.preferences);
      
      // Calculate detailed compatibility scores
      const lifestyleScore = user.preferences.lifestyle === currentUser.preferences.lifestyle ? 85 : 
                           (user.preferences.lifestyle === 'balanced' || currentUser.preferences.lifestyle === 'balanced') ? 65 : 45;
      
      const communicationScore = Math.min(95, score + Math.random() * 20);
      const roomScore = user.roomPreferences.roomType === currentUser.roomPreferences.roomType ? 80 : 50;

      return {
        id: user.id,
        name: user.name,
        age: user.age,
        bio: user.bio,
        initials: user.name.split(' ').map(n => n[0]).join(''),
        isOnline: user.isOnline,
        lastActive: user.lastActive,
        overallCompatibility: score,
        detailedCompatibility: {
          lifestyle: lifestyleScore,
          communication: Math.round(communicationScore),
          roomPreferences: roomScore
        },
        category: score >= 70 ? 'good' : 'poor',
        areasForHarmony: score >= 70 ? 
          ["Shared Interests", "Compatible Schedules", "Similar Values"] :
          ["Age Range", "Basic Respect", "Learning Opportunity"],
        areasToNavigate: score >= 70 ?
          ["Minor Schedule Differences", "Communication Style", "Personal Space"] :
          ["Sleep Schedule", "Social Preferences", "Lifestyle Differences"],
        recommendedRoom: {
          id: `R-${Math.floor(Math.random() * 50) + 100}`,
          name: `Room ${String.fromCharCode(65 + Math.floor(Math.random() * 3))}${Math.floor(Math.random() * 20) + 10}`,
          features: ["Private Work Area", "Large Windows", "Quiet Environment"]
        }
      };
    });

    // Sort by compatibility score
    matches.sort((a, b) => b.overallCompatibility - a.overallCompatibility);

    // Separate into good and poor matches
    const goodMatches = matches.filter(m => m.category === 'good');
    const poorMatches = matches.filter(m => m.category === 'poor');

    res.json({
      goodMatches,
      poorMatches,
      summary: {
        totalMatches: matches.length,
        goodCount: goodMatches.length,
        poorCount: poorMatches.length
      }
    });

  } catch (error) {
    console.error("Error getting categorized matches:", error);
    res.status(500).json({ error: "Failed to get matches" });
  }
};

export const sendMatchRequest: RequestHandler = (req, res) => {
  try {
    const { targetUserId, message } = req.body;
    const currentUserId = "user-1"; // In real app, get from auth

    // Check if request already exists
    const existingRequest = matchRequests.find(
      r => r.fromUserId === currentUserId && r.toUserId === targetUserId
    );

    if (existingRequest) {
      return res.status(400).json({ error: "Match request already sent" });
    }

    const matchRequest = {
      id: `req-${Date.now()}`,
      fromUserId: currentUserId,
      toUserId: targetUserId,
      message: message || "Hi! I'd love to be your roommate. Let's connect!",
      status: "pending", // pending, accepted, rejected
      createdAt: new Date(),
      updatedAt: new Date()
    };

    matchRequests.push(matchRequest);

    // Check if target user has also sent a request (mutual match)
    const mutualRequest = matchRequests.find(
      r => r.fromUserId === targetUserId && r.toUserId === currentUserId
    );

    if (mutualRequest) {
      // Automatic mutual match
      matchRequest.status = "accepted";
      mutualRequest.status = "accepted";
      
      return res.json({
        success: true,
        mutualMatch: true,
        message: "It's a mutual match! You can now connect with each other.",
        matchRequest
      });
    }

    res.json({
      success: true,
      mutualMatch: false,
      message: "Match request sent successfully!",
      matchRequest
    });

  } catch (error) {
    console.error("Error sending match request:", error);
    res.status(500).json({ error: "Failed to send match request" });
  }
};

export const getMatchRequests: RequestHandler = (req, res) => {
  try {
    const currentUserId = "user-1"; // In real app, get from auth

    const sentRequests = matchRequests.filter(r => r.fromUserId === currentUserId);
    const receivedRequests = matchRequests.filter(r => r.toUserId === currentUserId);
    const mutualMatches = matchRequests.filter(
      r => r.status === "accepted" && (r.fromUserId === currentUserId || r.toUserId === currentUserId)
    );

    // Get user details for each request
    const sentWithDetails = sentRequests.map(req => ({
      ...req,
      targetUser: userProfiles.find(u => u.id === req.toUserId)
    }));

    const receivedWithDetails = receivedRequests.map(req => ({
      ...req,
      fromUser: userProfiles.find(u => u.id === req.fromUserId)
    }));

    const mutualWithDetails = mutualMatches.map(req => {
      const otherUserId = req.fromUserId === currentUserId ? req.toUserId : req.fromUserId;
      return {
        ...req,
        otherUser: userProfiles.find(u => u.id === otherUserId)
      };
    });

    res.json({
      sent: sentWithDetails,
      received: receivedWithDetails,
      mutualMatches: mutualWithDetails
    });

  } catch (error) {
    console.error("Error getting match requests:", error);
    res.status(500).json({ error: "Failed to get match requests" });
  }
};

export const respondToMatchRequest: RequestHandler = (req, res) => {
  try {
    const { requestId, response } = req.body; // response: 'accept' or 'reject'
    const currentUserId = "user-1"; // In real app, get from auth

    const matchRequest = matchRequests.find(r => r.id === requestId && r.toUserId === currentUserId);

    if (!matchRequest) {
      return res.status(404).json({ error: "Match request not found" });
    }

    if (matchRequest.status !== "pending") {
      return res.status(400).json({ error: "Match request already responded to" });
    }

    matchRequest.status = response === 'accept' ? 'accepted' : 'rejected';
    matchRequest.updatedAt = new Date();

    const isMutualMatch = response === 'accept';

    res.json({
      success: true,
      mutualMatch: isMutualMatch,
      message: isMutualMatch ? "Match accepted! You can now connect." : "Match request declined.",
      matchRequest
    });

  } catch (error) {
    console.error("Error responding to match request:", error);
    res.status(500).json({ error: "Failed to respond to match request" });
  }
};

export const updateProfile: RequestHandler = (req, res) => {
  try {
    const currentUserId = "user-1"; // In real app, get from auth
    const updates = req.body;

    const userIndex = userProfiles.findIndex(u => u.id === currentUserId);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update profile
    userProfiles[userIndex] = {
      ...userProfiles[userIndex],
      ...updates,
      id: currentUserId // Ensure ID doesn't change
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: userProfiles[userIndex]
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getProfile: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const targetUserId = userId || "user-1"; // Default to current user

    const user = userProfiles.find(u => u.id === targetUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ profile: user });

  } catch (error) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Failed to get profile" });
  }
};

export const getMutualMatch: RequestHandler = (req, res) => {
  try {
    const { matchId } = req.params;
    const currentUserId = "user-1"; // In real app, get from auth

    const matchRequest = matchRequests.find(r => 
      r.id === matchId && 
      r.status === "accepted" && 
      (r.fromUserId === currentUserId || r.toUserId === currentUserId)
    );

    if (!matchRequest) {
      return res.status(404).json({ error: "Mutual match not found" });
    }

    const otherUserId = matchRequest.fromUserId === currentUserId ? matchRequest.toUserId : matchRequest.fromUserId;
    const currentUser = userProfiles.find(u => u.id === currentUserId);
    const otherUser = userProfiles.find(u => u.id === otherUserId);

    if (!currentUser || !otherUser) {
      return res.status(404).json({ error: "User profiles not found" });
    }

    const compatibility = calculateCompatibilityScore(currentUser.preferences, otherUser.preferences);

    res.json({
      matchRequest,
      currentUser,
      otherUser,
      compatibility,
      matchedAt: matchRequest.updatedAt,
      canEditProfile: true
    });

  } catch (error) {
    console.error("Error getting mutual match:", error);
    res.status(500).json({ error: "Failed to get mutual match" });
  }
};
