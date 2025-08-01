import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TestTube, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function TestMatching() {
  const [testResult, setTestResult] = useState<string>("");

  const testScenarios = [
    {
      name: "High Compatibility (85%)",
      description: "Perfect match with no active measures needed",
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
      score: 85
    },
    {
      name: "Medium Compatibility (65%)",
      description: "Good match with active measures required",
      preferences: {
        sleepSchedule: "early-bird",
        cleanliness: "very-clean",
        socialLevel: "quiet",
        workSchedule: "office-based",
        lifestyle: "relaxed"
      },
      roomPreferences: {
        roomType: "twin-sharing",
        floorPreference: "ground",
        windowPreference: "away-from-window",
        quietLevel: "very-quiet"
      },
      score: 65
    },
    {
      name: "Low Compatibility (35%)",
      description: "Poor match - no room will be assigned",
      preferences: {
        sleepSchedule: "early-bird",
        cleanliness: "very-clean",
        socialLevel: "quiet",
        workSchedule: "office-based",
        lifestyle: "relaxed"
      },
      roomPreferences: {
        roomType: "single",
        floorPreference: "ground",
        windowPreference: "no-preference",
        quietLevel: "lively"
      },
      score: 35
    }
  ];

  const runTest = async (scenario: any) => {
    setTestResult(`Testing ${scenario.name}...`);
    
    try {
      const response = await fetch('/api/enhanced-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenario),
      });

      const data = await response.json();
      
      // Store in localStorage and navigate to matches
      localStorage.setItem('userPreferences', JSON.stringify(scenario));
      
      setTestResult(`✅ Test completed! Score: ${data.compatibilityScore}%, Room Assigned: ${data.roomAssigned ? 'Yes' : 'No'}, Active Measures: ${data.activeMeasures?.length || 0}`);
      
      // Navigate to enhanced matches after a short delay
      setTimeout(() => {
        window.location.href = '/matches';
      }, 2000);
      
    } catch (error) {
      setTestResult(`❌ Test failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-purple-600 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            Test Enhanced Matching
          </h1>
          <p className="text-xl text-gray-600">
            Test different compatibility scenarios to see how the enhanced matching algorithm works.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testScenarios.map((scenario, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  {scenario.name}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
                <Badge 
                  className={`${
                    scenario.score >= 80 
                      ? 'bg-green-100 text-green-700' 
                      : scenario.score >= 50 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-red-100 text-red-700'
                  } hover:bg-opacity-80`}
                >
                  {scenario.score}% Expected Score
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm mb-4">
                  <div><strong>Sleep:</strong> {scenario.preferences.sleepSchedule.replace('-', ' ')}</div>
                  <div><strong>Cleanliness:</strong> {scenario.preferences.cleanliness.replace('-', ' ')}</div>
                  <div><strong>Social:</strong> {scenario.preferences.socialLevel.replace('-', ' ')}</div>
                  <div><strong>Work:</strong> {scenario.preferences.workSchedule.replace('-', ' ')}</div>
                </div>
                
                <Button 
                  onClick={() => runTest(scenario)}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Run Test
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {testResult && (
          <Card className="border-0 shadow-xl bg-blue-50 backdrop-blur-sm border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700">{testResult}</p>
              {testResult.includes('✅') && (
                <p className="text-sm text-blue-600 mt-2">
                  Redirecting to matches page in 2 seconds...
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>How Enhanced Matching Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">80%+ Score</h3>
                <p className="text-green-700 text-sm">
                  Perfect match! Room assigned immediately with no conditions.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">50-79% Score</h3>
                <p className="text-yellow-700 text-sm">
                  Good match with active measures. Room assigned with specific guidelines to follow.
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">Below 50% Score</h3>
                <p className="text-red-700 text-sm">
                  Poor compatibility. No room assigned, recommendation to retake survey.
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Active Measures Include:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Quiet hours after 10 PM for sleep schedule conflicts</li>
                <li>No phone calls in room during quiet hours</li>
                <li>Weekly cleaning schedules for cleanliness differences</li>
                <li>Guest policy agreements for social level differences</li>
                <li>Shared space coordination for work schedule conflicts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
