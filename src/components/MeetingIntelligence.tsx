import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Users, TrendingUp, AlertTriangle, Target, Waves, Lightbulb } from "lucide-react";

interface ParticipantDNA {
  id: string;
  name: string;
  energyLevel: number;
  communicationStyle: "direct" | "diplomatic" | "analytical" | "creative";
  influenceScore: number;
  engagementPattern: number[];
  conflictRisk: number;
  optimalSpeakingTime: number;
}

interface MeetingWeather {
  overall: "stormy" | "cloudy" | "partly-cloudy" | "sunny" | "electric";
  tension: number;
  energy: number;
  focus: number;
  collaboration: number;
  innovation: number;
}

interface SmartIntervention {
  id: string;
  type: "energy-boost" | "conflict-prevention" | "focus-redirect" | "time-optimization";
  urgency: "low" | "medium" | "high" | "critical";
  suggestion: string;
  impact: number;
  confidence: number;
}

export const MeetingIntelligence = () => {
  const [successProbability, setSuccessProbability] = useState(73);
  const [meetingWeather, setMeetingWeather] = useState<MeetingWeather>({
    overall: "partly-cloudy",
    tension: 25,
    energy: 75,
    focus: 60,
    collaboration: 80,
    innovation: 45
  });

  const [participants] = useState<ParticipantDNA[]>([
    {
      id: "1",
      name: "Sarah Chen",
      energyLevel: 85,
      communicationStyle: "direct",
      influenceScore: 92,
      engagementPattern: [80, 85, 90, 75, 70],
      conflictRisk: 15,
      optimalSpeakingTime: 8
    },
    {
      id: "2", 
      name: "Marcus Webb",
      energyLevel: 60,
      communicationStyle: "analytical",
      influenceScore: 78,
      engagementPattern: [70, 65, 80, 85, 90],
      conflictRisk: 30,
      optimalSpeakingTime: 12
    },
    {
      id: "3",
      name: "Elena Rodriguez", 
      energyLevel: 90,
      communicationStyle: "creative",
      influenceScore: 85,
      engagementPattern: [90, 95, 85, 80, 85],
      conflictRisk: 10,
      optimalSpeakingTime: 6
    }
  ]);

  const [interventions] = useState<SmartIntervention[]>([
    {
      id: "1",
      type: "energy-boost",
      urgency: "medium",
      suggestion: "Marcus is showing low energy patterns. Suggest a 2-min stand-up break or direct a question to him about data analysis.",
      impact: 85,
      confidence: 92
    },
    {
      id: "2", 
      type: "conflict-prevention",
      urgency: "high",
      suggestion: "Sarah and Marcus have opposing views brewing on budget allocation. Introduce Elena's creative perspective before tension escalates.",
      impact: 78,
      confidence: 88
    },
    {
      id: "3",
      type: "focus-redirect", 
      urgency: "low",
      suggestion: "Innovation score is low. Elena has optimal creative energy - redirect discussion to brainstorming solutions.",
      impact: 70,
      confidence: 85
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSuccessProbability(prev => {
        const change = Math.random() * 10 - 5;
        return Math.max(0, Math.min(100, prev + change));
      });

      setMeetingWeather(prev => ({
        ...prev,
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() * 6 - 3))),
        focus: Math.max(0, Math.min(100, prev.focus + (Math.random() * 8 - 4))),
        tension: Math.max(0, Math.min(100, prev.tension + (Math.random() * 4 - 2)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "stormy": return "⛈️";
      case "cloudy": return "☁️"; 
      case "partly-cloudy": return "⛅";
      case "sunny": return "☀️";
      case "electric": return "⚡";
      default: return "⛅";
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case "direct": return "bg-red-50 text-red-700 border-red-200";
      case "diplomatic": return "bg-blue-50 text-blue-700 border-blue-200"; 
      case "analytical": return "bg-purple-50 text-purple-700 border-purple-200";
      case "creative": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-50 text-red-700 border-red-200";
      case "high": return "bg-orange-50 text-orange-700 border-orange-200";
      case "medium": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-semibold text-foreground">Meeting Intelligence Engine</h1>
          </div>
          <p className="text-muted-foreground text-lg">Predicting outcomes, optimizing dynamics, preventing problems before they happen</p>
        </div>

        {/* Success Predictor */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Target className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Meeting Success Probability</h2>
              <p className="text-muted-foreground">Real-time prediction based on participant dynamics and agenda complexity</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{successProbability}%</div>
              <Progress value={successProbability} className="mb-2" />
              <p className="text-sm text-muted-foreground">Success Probability</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-semibold text-green-600 mb-2">12min</div>
              <p className="text-sm text-muted-foreground">Predicted Time Savings</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-semibold text-blue-600 mb-2">3</div>
              <p className="text-sm text-muted-foreground">Key Decisions Expected</p>
            </div>
          </div>
        </Card>

        {/* Meeting Weather */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Waves className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Meeting Weather</h2>
              <p className="text-muted-foreground">Real-time emotional and energy climate analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">{getWeatherIcon(meetingWeather.overall)}</div>
              <p className="text-sm font-medium capitalize">{meetingWeather.overall.replace('-', ' ')}</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold mb-1">{meetingWeather.energy}%</div>
              <Progress value={meetingWeather.energy} className="mb-1" />
              <p className="text-xs text-muted-foreground">Energy</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold mb-1">{meetingWeather.focus}%</div>
              <Progress value={meetingWeather.focus} className="mb-1" />
              <p className="text-xs text-muted-foreground">Focus</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold mb-1">{meetingWeather.collaboration}%</div>
              <Progress value={meetingWeather.collaboration} className="mb-1" />
              <p className="text-xs text-muted-foreground">Collaboration</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold mb-1">{meetingWeather.tension}%</div>
              <Progress value={meetingWeather.tension} className="mb-1" />
              <p className="text-xs text-muted-foreground">Tension</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold mb-1">{meetingWeather.innovation}%</div>
              <Progress value={meetingWeather.innovation} className="mb-1" />
              <p className="text-xs text-muted-foreground">Innovation</p>
            </div>
          </div>
        </Card>

        {/* Participant DNA */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Participant DNA Analysis</h2>
              <p className="text-muted-foreground">Individual communication patterns and optimization suggestions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {participants.map((participant) => (
              <div key={participant.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{participant.name}</h3>
                  <Badge className={getStyleColor(participant.communicationStyle)}>
                    {participant.communicationStyle}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Energy Level</span>
                      <span>{participant.energyLevel}%</span>
                    </div>
                    <Progress value={participant.energyLevel} />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Influence Score</span>
                      <span>{participant.influenceScore}%</span>
                    </div>
                    <Progress value={participant.influenceScore} />
                  </div>

                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Conflict Risk:</span> {participant.conflictRisk}%</p>
                    <p><span className="font-medium">Optimal Speaking Time:</span> {participant.optimalSpeakingTime} min</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Smart Interventions */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Lightbulb className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Smart Interventions</h2>
              <p className="text-muted-foreground">AI-powered suggestions to optimize meeting dynamics in real-time</p>
            </div>
          </div>

          <div className="space-y-4">
            {interventions.map((intervention) => (
              <div key={intervention.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getUrgencyColor(intervention.urgency)}>
                      {intervention.urgency}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {intervention.type === "energy-boost" && <Zap className="h-4 w-4" />}
                      {intervention.type === "conflict-prevention" && <AlertTriangle className="h-4 w-4" />}
                      {intervention.type === "focus-redirect" && <Target className="h-4 w-4" />}
                      {intervention.type === "time-optimization" && <TrendingUp className="h-4 w-4" />}
                      <span className="text-sm font-medium capitalize">{intervention.type.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Impact: {intervention.impact}%</div>
                    <div>Confidence: {intervention.confidence}%</div>
                  </div>
                </div>

                <p className="text-sm mb-3">{intervention.suggestion}</p>

                <div className="flex gap-2">
                  <Button size="sm" variant="default">Apply Suggestion</Button>
                  <Button size="sm" variant="outline">Dismiss</Button>
                  <Button size="sm" variant="ghost">Learn More</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};