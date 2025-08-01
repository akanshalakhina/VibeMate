import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// User type for demo (in-memory storage)
interface User {
  email: string;
  passwordHash: string;
}

// In-memory user store (replace with DB in production)
const users: User[] = [];
// Simple session store (for demo only)
const sessions: { [token: string]: string } = {};

// Middleware to require authentication
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (token && sessions[token]) {
    (req as any).user = { email: sessions[token] };
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

// Sign up handler
export const handleSignUp: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || password.length < 6) {
      return res.status(400).json({ error: "Valid email and password (min 6 chars) required" });
    }
    if (users.find((u) => u.email === email)) {
      return res.status(409).json({ error: "User already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ email, passwordHash });
    res.status(201).json({ message: "Sign up successful!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Sign in handler
export const handleSignIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Create session token
    const token = crypto.randomBytes(16).toString("hex");
    sessions[token] = email;
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.status(200).json({ message: "Sign in successful!" });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
