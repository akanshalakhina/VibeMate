export interface UserProfile {
  id: string;
  name: string;
  age: number;
  email: string;
  createdAt: Date;
  preferences: RoommatePreferences;
  roomPreferences: RoomPreferences;
  currentMatch?: MatchResult;
}

export interface RoommatePreferences {
  sleepSchedule: 'early-bird' | 'night-owl' | 'flexible';
  cleanliness: 'very-clean' | 'moderately-clean' | 'relaxed';
  socialLevel: 'very-social' | 'moderately-social' | 'quiet';
  workSchedule: 'work-from-home' | 'office-based' | 'flexible';
  lifestyle: 'active' | 'balanced' | 'relaxed';
}

export interface RoomPreferences {
  roomType: 'twin-sharing' | 'single' | 'any';
  floorPreference: 'ground' | 'middle' | 'top' | 'any';
  windowPreference: 'near-window' | 'away-from-window' | 'no-preference';
  quietLevel: 'very-quiet' | 'moderate' | 'lively';
}

export interface Room {
  id: string;
  type: 'twin-sharing' | 'single';
  floor: number;
  hasWindow: boolean;
  isQuiet: boolean;
  isOccupied: boolean;
  occupants: string[]; // User IDs
  maxOccupants: number;
}

export interface MatchResult {
  roommateId: string;
  roommateName: string;
  compatibilityScore: number;
  compatibilityLevel: 'high' | 'medium' | 'low';
  suggestedRoom: Room;
  explanation: string;
  matchReasons: string[];
}

export interface VoiceSurveyResponse {
  question: string;
  answer: string;
  confidence: number;
}

export interface SurveySession {
  userId: string;
  responses: VoiceSurveyResponse[];
  isComplete: boolean;
  startedAt: Date;
  completedAt?: Date;
}
