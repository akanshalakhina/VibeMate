import { RequestHandler } from "express";
import { UserProfile, RoommatePreferences, RoomPreferences, VoiceSurveyResponse } from "@shared/roommate";

// Mock database - in production, this would be a real database
let profiles: UserProfile[] = [
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
  }
];

export const getAllProfiles: RequestHandler = (req, res) => {
  res.json({ profiles });
};

export const getProfile: RequestHandler = (req, res) => {
  const { id } = req.params;
  const profile = profiles.find(p => p.id === id);
  
  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }
  
  res.json({ profile });
};

export const createProfile: RequestHandler = (req, res) => {
  try {
    const { name, age, email, preferences, roomPreferences } = req.body;
    
    // Validate required fields
    if (!name || !age || !email || !preferences || !roomPreferences) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Generate new ID
    const id = `user-${Date.now()}`;
    
    const newProfile: UserProfile = {
      id,
      name,
      age,
      email,
      createdAt: new Date(),
      preferences,
      roomPreferences
    };
    
    profiles.push(newProfile);
    
    res.status(201).json({ profile: newProfile });
  } catch (error) {
    res.status(500).json({ error: "Failed to create profile" });
  }
};

export const updateProfile: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const profileIndex = profiles.findIndex(p => p.id === id);
    if (profileIndex === -1) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    profiles[profileIndex] = { ...profiles[profileIndex], ...updates };
    
    res.json({ profile: profiles[profileIndex] });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const deleteProfile: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const profileIndex = profiles.findIndex(p => p.id === id);
    if (profileIndex === -1) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    profiles.splice(profileIndex, 1);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
};
