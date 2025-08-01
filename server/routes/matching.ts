import { RequestHandler } from "express";
import { UserProfile, MatchResult, Room, RoommatePreferences, RoomPreferences } from "@shared/roommate";

// Mock rooms data
const rooms: Room[] = [
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
    isOccupied: false,
    occupants: [],
    maxOccupants: 2
  },
  {
    id: "R-305",
    type: "single",
    floor: 3, 
    hasWindow: false,
    isQuiet: false,
    isOccupied: false,
    occupants: [],
    maxOccupants: 1
  }
];

// Mock users for matching
const mockUsers: UserProfile[] = [
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

function calculateCompatibilityScore(
  user1Prefs: RoommatePreferences,
  user2Prefs: RoommatePreferences
): number {
  let score = 0;
  let totalFactors = 0;

  // Sleep schedule compatibility (weight: 25%)
  if (user1Prefs.sleepSchedule === user2Prefs.sleepSchedule) {
    score += 25;
  } else if (
    (user1Prefs.sleepSchedule === 'flexible' || user2Prefs.sleepSchedule === 'flexible')
  ) {
    score += 15;
  }
  totalFactors += 25;

  // Cleanliness compatibility (weight: 20%)
  const cleanlinessScore = {
    'very-clean': 3,
    'moderately-clean': 2,
    'relaxed': 1
  };
  const user1Clean = cleanlinessScore[user1Prefs.cleanliness];
  const user2Clean = cleanlinessScore[user2Prefs.cleanliness];
  const cleanDiff = Math.abs(user1Clean - user2Clean);
  score += Math.max(0, 20 - (cleanDiff * 10));
  totalFactors += 20;

  // Social level compatibility (weight: 20%)
  const socialScore = {
    'very-social': 3,
    'moderately-social': 2,
    'quiet': 1
  };
  const user1Social = socialScore[user1Prefs.socialLevel];
  const user2Social = socialScore[user2Prefs.socialLevel];
  const socialDiff = Math.abs(user1Social - user2Social);
  score += Math.max(0, 20 - (socialDiff * 10));
  totalFactors += 20;

  // Work schedule compatibility (weight: 15%)
  if (user1Prefs.workSchedule === user2Prefs.workSchedule) {
    score += 15;
  } else if (
    user1Prefs.workSchedule === 'flexible' || user2Prefs.workSchedule === 'flexible'
  ) {
    score += 10;
  } else {
    score += 5; // Different but potentially complementary
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

function findBestRoom(
  user1RoomPrefs: RoomPreferences,
  user2RoomPrefs: RoomPreferences,
  availableRooms: Room[]
): Room | null {
  // Filter rooms based on type preference
  const suitableRooms = availableRooms.filter(room => {
    if (user1RoomPrefs.roomType === 'single' || user2RoomPrefs.roomType === 'single') {
      return false; // Can't match for single rooms
    }
    
    return room.type === 'twin-sharing' && !room.isOccupied;
  });

  if (suitableRooms.length === 0) return null;

  // Score rooms based on preferences
  const scoredRooms = suitableRooms.map(room => {
    let score = 0;

    // Floor preference scoring
    const floorPrefs = [user1RoomPrefs.floorPreference, user2RoomPrefs.floorPreference];
    if (floorPrefs.includes('any')) score += 5;
    if (floorPrefs.includes('ground') && room.floor === 1) score += 10;
    if (floorPrefs.includes('middle') && room.floor === 2) score += 10;
    if (floorPrefs.includes('top') && room.floor >= 3) score += 10;

    // Window preference scoring
    const windowPrefs = [user1RoomPrefs.windowPreference, user2RoomPrefs.windowPreference];
    if (windowPrefs.includes('near-window') && room.hasWindow) score += 10;
    if (windowPrefs.includes('away-from-window') && !room.hasWindow) score += 10;
    if (windowPrefs.includes('no-preference')) score += 5;

    // Quiet level scoring
    const quietPrefs = [user1RoomPrefs.quietLevel, user2RoomPrefs.quietLevel];
    if (quietPrefs.includes('very-quiet') && room.isQuiet) score += 15;
    if (quietPrefs.includes('moderate')) score += 8;
    if (quietPrefs.includes('lively') && !room.isQuiet) score += 10;

    return { room, score };
  });

  // Return the highest scoring room
  scoredRooms.sort((a, b) => b.score - a.score);
  return scoredRooms[0]?.room || null;
}

function generateMatchExplanation(
  user1Prefs: RoommatePreferences,
  user2Prefs: RoommatePreferences,
  score: number
): { explanation: string; reasons: string[] } {
  const reasons: string[] = [];
  
  if (user1Prefs.sleepSchedule === user2Prefs.sleepSchedule) {
    reasons.push(`Both are ${user1Prefs.sleepSchedule.replace('-', ' ')}s with similar sleep patterns`);
  }
  
  if (user1Prefs.cleanliness === user2Prefs.cleanliness) {
    reasons.push(`Shared ${user1Prefs.cleanliness.replace('-', ' ')} cleanliness standards`);
  }
  
  if (user1Prefs.socialLevel === user2Prefs.socialLevel) {
    reasons.push(`Compatible ${user1Prefs.socialLevel.replace('-', ' ')} social preferences`);
  }
  
  if (user1Prefs.workSchedule === user2Prefs.workSchedule) {
    reasons.push(`Similar ${user1Prefs.workSchedule.replace('-', ' ')} work arrangements`);
  }
  
  if (user1Prefs.lifestyle === user2Prefs.lifestyle) {
    reasons.push(`Shared ${user1Prefs.lifestyle} lifestyle approach`);
  }

  const levelMap = {
    high: "excellent",
    medium: "good", 
    low: "moderate"
  };
  
  const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
  
  const explanation = `This is an ${levelMap[level]} match with ${score}% compatibility. You both share many important lifestyle preferences that will make for a harmonious living situation.`;
  
  return { explanation, reasons };
}

export const findMatches: RequestHandler = (req, res) => {
  try {
    const { preferences, roomPreferences } = req.body;
    
    if (!preferences || !roomPreferences) {
      return res.status(400).json({ error: "Preferences are required" });
    }

    // Find potential roommates
    const potentialMatches = mockUsers.map(user => {
      const score = calculateCompatibilityScore(preferences, user.preferences);
      const { explanation, reasons } = generateMatchExplanation(preferences, user.preferences, score);
      
      // Find best room for this match
      const suggestedRoom = findBestRoom(roomPreferences, user.roomPreferences, rooms);
      
      if (!suggestedRoom) {
        return null; // No suitable room available
      }

      return {
        roommateId: user.id,
        roommateName: user.name,
        compatibilityScore: score,
        compatibilityLevel: score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low',
        suggestedRoom,
        explanation,
        matchReasons: reasons
      } as MatchResult;
    }).filter(match => match !== null);

    // Sort by compatibility score
    potentialMatches.sort((a, b) => b!.compatibilityScore - a!.compatibilityScore);

    // Return top matches (limit to 3)
    const topMatches = potentialMatches.slice(0, 3);

    res.json({ matches: topMatches });
  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({ error: "Failed to find matches" });
  }
};

export const getRooms: RequestHandler = (req, res) => {
  res.json({ rooms });
};

export const updateRoomOccupancy: RequestHandler = (req, res) => {
  try {
    const { roomId, occupants } = req.body;
    
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    
    room.occupants = occupants;
    room.isOccupied = occupants.length > 0;
    
    res.json({ room });
  } catch (error) {
    res.status(500).json({ error: "Failed to update room occupancy" });
  }
};
