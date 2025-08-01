import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain
} from "lucide-react";
import { RoommatePreferences, RoomPreferences, VoiceSurveyResponse } from "@shared/roommate";

interface Question {
  id: string;
  text: string;
  category: keyof RoommatePreferences | keyof RoomPreferences;
  followUp?: string;
  options?: string[];
}

const surveyQuestions: Question[] = [
  {
    id: "sleep",
    text: "Tell me about your sleep schedule. Are you more of an early bird who likes to wake up early, or a night owl who stays up late?",
    category: "sleepSchedule",
    followUp: "What time do you usually go to bed and wake up?",
    options: ["early-bird", "night-owl", "flexible"]
  },
  {
    id: "cleanliness",
    text: "How would you describe your cleanliness preferences? Do you like everything spotless, moderately tidy, or are you more relaxed about it?",
    category: "cleanliness",
    followUp: "Can you share what cleanliness means to you in shared spaces?",
    options: ["very-clean", "moderately-clean", "relaxed"]
  },
  {
    id: "social", 
    text: "What's your social style like? Do you love having friends over and chatting, prefer moderate social interaction, or do you value quiet personal time?",
    category: "socialLevel",
    followUp: "How do you like to unwind after a long day?",
    options: ["very-social", "moderately-social", "quiet"]
  },
  {
    id: "work",
    text: "Tell me about your work situation. Do you work from home, go to an office, or have a flexible arrangement?",
    category: "workSchedule", 
    followUp: "How does your work schedule affect your daily routine at home?",
    options: ["work-from-home", "office-based", "flexible"]
  },
  {
    id: "room",
    text: "What kind of room setup appeals to you? Would you prefer sharing a twin room with a roommate, having your own single room, or are you open to either?",
    category: "roomType",
    followUp: "What factors are most important in your living space?",
    options: ["twin-sharing", "single", "any"]
  }
];

interface VoiceSurveyProps {
  onComplete: (responses: VoiceSurveyResponse[], preferences: Partial<RoommatePreferences & RoomPreferences>) => void;
  onClose: () => void;
}

export default function VoiceSurvey({ onComplete, onClose }: VoiceSurveyProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<VoiceSurveyResponse[]>([]);
  const [preferences, setPreferences] = useState<Partial<RoommatePreferences & RoomPreferences>>({});
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;
  const isComplete = currentQuestionIndex >= surveyQuestions.length;

  // Mock speech synthesis and recognition
  const speakText = (text: string) => {
    if (!audioEnabled) return;
    
    setIsPlaying(true);
    // Simulate speaking duration
    const words = text.split(' ').length;
    const duration = (words / 3) * 1000; // ~3 words per second
    
    setTimeout(() => {
      setIsPlaying(false);
    }, Math.min(duration, 5000));
  };

  const startListening = () => {
    if (isListening) return;
    
    setIsListening(true);
    setCurrentResponse("");
    
    // Mock voice recognition with realistic delay
    setTimeout(() => {
      const mockResponses = {
        sleep: "I'm definitely a night owl! I usually stay up until around midnight or 1 AM working on projects or reading, and I wake up around 8 or 9 AM. I'm pretty flexible though if my roommate has different hours.",
        cleanliness: "I'd say I'm moderately clean. I like common areas to be tidy and I clean up after myself, but I'm not obsessive about it. As long as everything is reasonably organized and hygienic, I'm happy.",
        social: "I'm moderately social. I enjoy having friends over occasionally and chatting with my roommate, but I also really value my alone time to recharge. I like a good balance of social interaction and quiet personal time.",
        work: "I work from home most days as a software developer, but I go into the office maybe once or twice a week. So I'm home quite a bit during the day, which is why having a compatible roommate is really important to me.",
        room: "I think I'd prefer twin-sharing actually. I like the idea of having a roommate to chat with and share experiences, plus it's more affordable. As long as we're compatible, I think it could be really nice."
      };
      
      const response = mockResponses[currentQuestion.id as keyof typeof mockResponses] || 
                      "I think that sounds good to me. I'm pretty flexible and easy-going about most things.";
      
      setCurrentResponse(response);
      setIsListening(false);
      setIsProcessing(true);
      
      // Simulate AI processing
      setTimeout(() => {
        processResponse(response);
        setIsProcessing(false);
      }, 2000);
    }, 3000);
  };

  const processResponse = (response: string) => {
    const newResponse: VoiceSurveyResponse = {
      question: currentQuestion.text,
      answer: response,
      confidence: 0.85 + Math.random() * 0.15 // Mock confidence score
    };
    
    // Mock AI interpretation to extract preference
    const interpretedPreference = interpretResponse(currentQuestion, response);
    
    setResponses(prev => [...prev, newResponse]);
    setPreferences(prev => ({ ...prev, ...interpretedPreference }));
  };

  const interpretResponse = (question: Question, response: string): Partial<RoommatePreferences & RoomPreferences> => {
    // Mock AI interpretation logic
    const result: any = {};
    
    switch (question.id) {
      case "sleep":
        if (response.toLowerCase().includes("night owl") || response.toLowerCase().includes("midnight")) {
          result.sleepSchedule = "night-owl";
        } else if (response.toLowerCase().includes("early") || response.toLowerCase().includes("morning")) {
          result.sleepSchedule = "early-bird";
        } else {
          result.sleepSchedule = "flexible";
        }
        break;
      case "cleanliness":
        if (response.toLowerCase().includes("spotless") || response.toLowerCase().includes("very clean")) {
          result.cleanliness = "very-clean";
        } else if (response.toLowerCase().includes("relaxed") || response.toLowerCase().includes("not obsessive")) {
          result.cleanliness = "relaxed";
        } else {
          result.cleanliness = "moderately-clean";
        }
        break;
      case "social":
        if (response.toLowerCase().includes("love") && response.toLowerCase().includes("friends")) {
          result.socialLevel = "very-social";
        } else if (response.toLowerCase().includes("quiet") || response.toLowerCase().includes("alone time")) {
          result.socialLevel = "quiet";
        } else {
          result.socialLevel = "moderately-social";
        }
        break;
      case "work":
        if (response.toLowerCase().includes("home")) {
          result.workSchedule = "work-from-home";
        } else if (response.toLowerCase().includes("office")) {
          result.workSchedule = "office-based";
        } else {
          result.workSchedule = "flexible";
        }
        break;
      case "room":
        if (response.toLowerCase().includes("twin") || response.toLowerCase().includes("sharing")) {
          result.roomType = "twin-sharing";
        } else if (response.toLowerCase().includes("single") || response.toLowerCase().includes("own")) {
          result.roomType = "single";
        } else {
          result.roomType = "any";
        }
        break;
    }
    
    return result;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setCurrentResponse("");
      
      // Auto-play next question
      setTimeout(() => {
        speakText(surveyQuestions[currentQuestionIndex + 1].text);
      }, 500);
    } else {
      // Survey complete
      onComplete(responses, preferences);
    }
  };

  // Auto-play first question
  useEffect(() => {
    if (currentQuestionIndex === 0) {
      setTimeout(() => {
        speakText(currentQuestion.text);
      }, 1000);
    }
  }, []);

  if (isComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Survey Complete!</CardTitle>
          <CardDescription>
            Great! I've learned a lot about your preferences. Let me find your perfect roommate match.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="bg-purple-50 rounded-lg p-3">
                  <div className="font-medium text-purple-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </div>
                  <div className="text-purple-600 capitalize">
                    {String(value).replace(/-/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => onComplete(responses, preferences)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Find My Match
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            Question {currentQuestionIndex + 1} of {surveyQuestions.length}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="text-gray-500 hover:text-gray-700"
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
        
        <Progress value={progress} className="mb-6" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
            <CardDescription>Powered by Omnidim.io Voice AI</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Question Display */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🤖</div>
            <div>
              <p className="text-gray-800 leading-relaxed">{currentQuestion.text}</p>
              {isPlaying && (
                <div className="flex items-center gap-2 mt-2 text-purple-600">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Speaking...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="text-center space-y-4">
          <Button
            onClick={startListening}
            disabled={isListening || isProcessing}
            size="lg"
            className={`w-32 h-32 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-gradient-to-br from-primary to-purple-600 hover:from-purple-600 hover:to-primary'
            }`}
          >
            {isListening ? (
              <div className="text-center">
                <Mic className="w-8 h-8 mb-1" />
                <div className="text-xs">Listening...</div>
              </div>
            ) : (
              <div className="text-center">
                <Mic className="w-8 h-8 mb-1" />
                <div className="text-xs">Tap to Speak</div>
              </div>
            )}
          </Button>
          
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => speakText(currentQuestion.text)}
              disabled={isPlaying}
              className="border-purple-200 hover:bg-purple-50"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Playing...' : 'Repeat Question'}
            </Button>
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Brain className="w-5 h-5 animate-pulse" />
              <span>AI is processing your response...</span>
            </div>
          </div>
        )}

        {/* Response Display */}
        {currentResponse && !isProcessing && (
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">👤</div>
                <div>
                  <p className="text-gray-800 italic">"{currentResponse}"</p>
                  <div className="flex items-center gap-2 mt-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Response captured</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={nextQuestion}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
              >
                {currentQuestionIndex < surveyQuestions.length - 1 ? 'Next Question' : 'Finish Survey'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Skip Option */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={nextQuestion}
            className="text-gray-500 hover:text-gray-700"
          >
            Skip this question
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
