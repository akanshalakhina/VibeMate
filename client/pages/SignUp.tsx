import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign up failed");
      setSuccess("Sign up successful! Redirecting...");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign Up for VIBEMATE</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="rounded-xl"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="rounded-xl"
            />
            <Button type="submit" className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary rounded-xl py-3 text-lg">
              Create Account
            </Button>
            {error && <div className="text-red-500 text-center">{error}</div>}
            {success && <div className="text-green-600 text-center">{success}</div>}
            <div className="text-center text-gray-500 mt-2">
              Already have an account? <Link to="/signin" className="text-primary font-semibold hover:underline">Sign In</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
