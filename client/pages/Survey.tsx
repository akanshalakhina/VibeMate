import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mic, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import VoiceSurvey from "@/components/VoiceSurvey";
import { VoiceSurveyResponse, RoommatePreferences, RoomPreferences } from "@shared/roommate";

export default function Survey() {
  const [surveyMode, setSurveyMode] = useState<'select' | 'voice' | 'text'>('select');
  const navigate = useNavigate();

  const handleSurveyComplete = (
    responses: VoiceSurveyResponse[],
    preferences: Partial<RoommatePreferences & RoomPreferences>
  ) => {
    // Store the survey results (would normally send to backend)
    localStorage.setItem('surveyResponses', JSON.stringify(responses));
    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    // Navigate to VibeMates matching results
    navigate('/matches');
  };

  const handleCloseSurvey = () => {
    setSurveyMode('select');
  };

  if (surveyMode === 'voice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <Button
              variant="ghost"
              onClick={handleCloseSurvey}
              className="inline-flex items-center text-primary hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Survey Options
            </Button>
          </div>

          <VoiceSurvey
            onComplete={handleSurveyComplete}
            onClose={handleCloseSurvey}
          />
        </div>
      </div>
    );
  }

  if (surveyMode === 'text') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={handleCloseSurvey}
              className="inline-flex items-center text-primary hover:text-purple-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Survey Options
            </Button>
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Text Survey Coming Soon
              </CardTitle>
              <CardDescription className="text-lg">
                Traditional form-based survey will be available here.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                For now, please try our innovative voice survey experience!
              </p>
              <Button
                onClick={() => setSurveyMode('voice')}
                className="bg-gradient-to-r from-primary to-purple-600"
              >
                <Mic className="w-4 h-4 mr-2" />
                Try Voice Survey Instead
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Survey Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get matched with your perfect roommate using our innovative AI-powered survey.
            Choose the experience that works best for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Voice Survey Option */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Voice Survey</CardTitle>
              <CardDescription className="text-lg">
                🎙️ Powered by Omnidim.io Voice AI
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Natural conversation experience</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">AI understands context & tone</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Personalized follow-up questions</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">5 minutes average completion</span>
                </div>
              </div>

              <Button
                onClick={() => setSurveyMode('voice')}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
                size="lg"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Voice Survey
              </Button>

              <div className="text-xs text-gray-500">
                ⭐ Recommended for best experience
              </div>
            </CardContent>
          </Card>

          {/* Text Survey Option */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Text Survey</CardTitle>
              <CardDescription className="text-lg">
                📝 Traditional form-based approach
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Familiar form interface</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Type your responses</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Review before submitting</span>
                </div>
                <div className="flex items-center gap-2 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Coming soon</span>
                </div>
              </div>

              <Button
                onClick={() => setSurveyMode('text')}
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Text Survey
              </Button>

              <div className="text-xs text-gray-500">
                🚧 Under development
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto">
            Both survey types use the same advanced AI matching algorithm to find your perfect roommate.
            The voice survey provides a more personalized experience with follow-up questions based on your responses.
          </p>
        </div>
      </div>
    </div>
  );
}
