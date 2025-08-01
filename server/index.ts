import "dotenv/config";
import express from "express";
import { handleDemo } from "./routes/demo";
import {
  getAllProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} from "./routes/profiles";
import {
  findMatches,
  getRooms,
  updateRoomOccupancy
} from "./routes/matching";
import {
  getCategorizedMatches,
  sendMatchRequest,
  getMatchRequests,
  respondToMatchRequest,
  getMutualMatch
} from "./routes/match-requests";

// Enhanced matching fallback logic
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
// import { handleSignUp, handleSignIn, requireAuth } from "./routes/auth";
// import cookieParser from "cookie-parser";
  const user1Social = socialScore[user1Prefs.socialLevel] || 2;
  const user2Social = socialScore[user2Prefs.socialLevel] || 2;
  const socialDiff = Math.abs(user1Social - user2Social);
  score += Math.max(0, 20 - (socialDiff * 10));
  totalFactors += 20;

  if (user1Prefs.workSchedule === user2Prefs.workSchedule) {
    score += 15;
  } else if (user1Prefs.workSchedule === 'flexible' || user2Prefs.workSchedule === 'flexible') {
    score += 10;
  } else {
    // Sign in and sign up routes removed
    // Admin/dashboard auth protection removed
    if (user1Prefs.lifestyle === user2Prefs.lifestyle) {
      score += 20;
    } else if (user1Prefs.lifestyle === 'balanced' || user2Prefs.lifestyle === 'balanced') {
      score += 12;
    } else {
      score += 5;
    }
    totalFactors += 20;
  }

  return Math.round((score / totalFactors) * 100);
}

function generateActiveMeasures(user1Prefs: any, user2Prefs: any, score: number): any[] {
  const measures: any[] = [];

  if (score < 50 || score >= 80) {
    return measures;
  }

  // Sleep schedule conflicts
  if (user1Prefs.sleepSchedule !== user2Prefs.sleepSchedule) {
    if (user1Prefs.sleepSchedule === 'night-owl' && user2Prefs.sleepSchedule === 'early-bird') {
      measures.push({
        rule: "Quiet Hours After 10 PM",
        description: "Night owl roommate must maintain complete silence after 10 PM to respect early bird's sleep schedule",
        category: "sleep"
      });
      measures.push({
        rule: "No Phone Calls in Room After 10 PM",
        description: "Take all phone calls outside the room after 10 PM to avoid disturbing roommate",
        category: "sleep"
      });
    } else if (user1Prefs.sleepSchedule === 'early-bird' && user2Prefs.sleepSchedule === 'night-owl') {
      measures.push({
        rule: "Quiet Morning Hours Before 8 AM",
        description: "Early bird roommate must be quiet before 8 AM to let night owl sleep in",
        category: "sleep"
      });
    }
  }

  // Cleanliness compatibility
  const cleanlinessScore: { [key: string]: number } = {'very-clean': 3, 'moderately-clean': 2, 'relaxed': 1};
  const cleanDiff = Math.abs((cleanlinessScore[user1Prefs.cleanliness] || 2) - (cleanlinessScore[user2Prefs.cleanliness] || 2));

  if (cleanDiff >= 2) {
    measures.push({
      rule: "Weekly Cleaning Schedule",
      description: "Establish a weekly cleaning rotation to maintain shared spaces according to both preferences",
      category: "cleanliness"
    });
  }

  // Social level differences
  const socialScore: { [key: string]: number } = {'very-social': 3, 'moderately-social': 2, 'quiet': 1};
  const socialDiff = Math.abs((socialScore[user1Prefs.socialLevel] || 2) - (socialScore[user2Prefs.socialLevel] || 2));

  if (socialDiff >= 2) {
    measures.push({
      rule: "Guest Policy Agreement",
      description: "Agree on guest policies and give 24-hour notice for visitors to respect comfort levels",
      category: "social"
    });
  }

  return measures;
}

function generateEnhancedMatch(request: any): any {
  const preferences = request.preferences;

  // Mock roommate for fallback
  const mockRoommate = {
    id: "user-456",
    name: "Maya Patel",
    preferences: {
      sleepSchedule: "night-owl",
      cleanliness: "moderately-clean",
      socialLevel: "moderately-social",
      workSchedule: "flexible",
      lifestyle: "balanced"
    }
  };

  const score = calculateCompatibilityScore(preferences, mockRoommate.preferences);
  const activeMeasures = generateActiveMeasures(preferences, mockRoommate.preferences, score);

  let level: string;
  if (score >= 80) level = "high";
  else if (score >= 50) level = "medium";
  else level = "low";

  const roomAssigned = score >= 50;
  let suggestedRoom = null;
  let noRoomReason = null;

  if (roomAssigned) {
    suggestedRoom = {
      id: "R-204",
      type: "twin-sharing",
      floor: 2,
      hasWindow: true,
      isQuiet: true,
      isOccupied: false,
      occupants: [],
      maxOccupants: 2
    };
  } else {
    noRoomReason = "Compatibility score is below the minimum threshold of 50%. We recommend retaking the survey or adjusting your preferences to find a better match.";
  }

  let explanation: string;
  if (score >= 80) {
    explanation = `Excellent match with ${score}% compatibility! You share very similar lifestyle preferences that will create a harmonious living environment.`;
  } else if (score >= 50) {
    explanation = `Good match with ${score}% compatibility. While you have some differences, the active measures below will help ensure a successful roommate relationship.`;
  } else {
    explanation = `Unfortunately, with ${score}% compatibility, we cannot assign a room at this time. The lifestyle differences are too significant to ensure a positive living experience for both parties.`;
  }

  const matchReasons: string[] = [];
  if (score >= 50) {
    if (preferences.sleepSchedule === mockRoommate.preferences.sleepSchedule) {
      matchReasons.push(`Both prefer ${preferences.sleepSchedule.replace('-', ' ')} sleep schedules`);
    }
    if (preferences.workSchedule === mockRoommate.preferences.workSchedule) {
      matchReasons.push(`Compatible ${preferences.workSchedule.replace('-', ' ')} work arrangements`);
    }
    if (activeMeasures.length > 0) {
      matchReasons.push("Active measures provided to bridge compatibility gaps");
    }
  } else {
    matchReasons.push("Significant lifestyle differences identified");
    matchReasons.push("Insufficient compatibility for successful cohabitation");
  }

  return {
    roommateId: mockRoommate.id,
    roommateName: mockRoommate.name,
    compatibilityScore: score,
    compatibilityLevel: level,
    suggestedRoom,
    explanation,
    matchReasons,
    activeMeasures,
    roomAssigned,
    noRoomReason
  };
}

function createServer() {
  const app = express();
  app.use(express.json());
  

;

  // Profile management routes
  app.get("/api/profiles", getAllProfiles);
  app.get("/api/profiles/:id", getProfile);
  app.post("/api/profiles", createProfile);
  app.put("/api/profiles/:id", updateProfile);
  app.delete("/api/profiles/:id", deleteProfile);

  // Matching and room management routes
  app.post("/api/matches", findMatches);
  app.get("/api/rooms", getRooms);
  app.put("/api/rooms/occupancy", updateRoomOccupancy);

  // Chatbot proxy route - forwards to Python service
  app.post("/api/chat", async (req, res) => {
    try {
      const response = await fetch("http://localhost:8001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`Python service responded with ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Chatbot service error, providing basic response:", error);

      // Basic fallback response
      res.json({
        response: "I'm temporarily unavailable, but I'd be happy to help! VIBEMATE offers AI-powered roommate matching for women's co-living spaces. You can explore our voice survey, learn about our matching algorithm, or browse room options. For immediate assistance, please contact our support team.",
        confidence: 0.7,
        suggested_actions: [
          "Take our voice survey",
          "Learn about matching process",
          "View room options",
          "Contact support team"
        ],
        timestamp: new Date()
      });
    }
  });

  // Enhanced matching proxy route with fallback
  app.post("/api/enhanced-match", async (req, res) => {
    console.log("Enhanced match request received:", req.body);

    try {
      console.log("Attempting to connect to Python service...");
      const response = await fetch("http://localhost:8001/enhanced-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`Python service responded with ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Enhanced matching service error, using fallback:", error);

      // Fallback to local enhanced matching logic
      try {
        console.log("Generating enhanced match with fallback logic...");
        const enhancedMatch = generateEnhancedMatch(req.body);
        console.log("Fallback match generated:", enhancedMatch);
        res.json(enhancedMatch);
      } catch (fallbackError) {
        console.error("Fallback enhanced matching failed:", fallbackError);
        res.status(500).json({
          error: "Enhanced matching service temporarily unavailable",
          fallback: "Please try again later."
        });
      }
    }
  });

  // Feedback proxy route with fallback
  app.post("/api/feedback", async (req, res) => {
    try {
      const response = await fetch("http://localhost:8001/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error(`Python service responded with ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Feedback service error, using fallback:", error);

      // Fallback feedback storage (in production, use a database)
      const feedbackEntry = {
        id: `feedback-${Date.now()}`,
        ...req.body,
        timestamp: new Date(),
        processed: false
      };

      console.log("Feedback received (fallback):", feedbackEntry);

      res.json({
        message: "Feedback submitted successfully (fallback mode)",
        feedback_id: feedbackEntry.id,
        will_improve: true,
        next_action: "Our AI will learn from this feedback to improve future matches"
      });
    }
  });

  // Match analytics proxy route
  app.get("/api/match-analytics", async (req, res) => {
    try {
      const response = await fetch("http://localhost:8001/match-analytics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Python service responded with ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Analytics service error:", error);
      res.status(503).json({
        error: "Analytics service temporarily unavailable"
      });
    }
  });

  // Match request management routes
  app.get("/api/categorized-matches", getCategorizedMatches);
  app.post("/api/match-requests", sendMatchRequest);
  app.get("/api/match-requests", getMatchRequests);
  app.post("/api/match-requests/:requestId/respond", respondToMatchRequest);
  app.get("/api/mutual-match/:matchId", getMutualMatch);

  // Profile management routes
  app.get("/api/profile/:userId?", getProfile);
  app.put("/api/profile", updateProfile);

  return app;
} 

export { createServer };
