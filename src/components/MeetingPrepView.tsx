import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, MessageCircle, Brain, Calendar, User, Building } from "lucide-react";

interface PrepViewProps {
  meetingId: string;
  onBack: () => void;
  onStartMeeting: () => void;
}

interface ClientData {
  name: string;
  specialty: string;
  hospital: string;
  lastInteraction: string;
  sentiment: "positive" | "neutral" | "negative";
  prescribingBehavior: string;
  formularyStatus: string;
}

interface Objective {
  id: string;
  type: "primary" | "secondary";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const mockClientData: ClientData = {
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  hospital: "Metro Medical Center",
  lastInteraction: "2 weeks ago",
  sentiment: "positive",
  prescribingBehavior: "Conservative, evidence-based",
  formularyStatus: "Preferred provider access"
};

const mockObjectives: Objective[] = [
  {
    id: "1",
    type: "primary",
    title: "Introduce CV Protocol Update",
    description: "Present new cardiovascular treatment protocol with improved patient outcomes",
    priority: "high"
  },
  {
    id: "2",
    type: "secondary", 
    title: "Discuss Adherence Solutions",
    description: "Address patient adherence challenges with new formulation benefits",
    priority: "medium"
  },
  {
    id: "3",
    type: "secondary",
    title: "Schedule Follow-up",
    description: "Plan next quarterly review meeting for Q2 outcomes discussion",
    priority: "medium"
  }
];

export const MeetingPrepView = ({ meetingId, onBack, onStartMeeting }: PrepViewProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("objectives");

  const sentimentColor = {
    positive: "text-success",
    neutral: "text-warning", 
    negative: "text-destructive"
  };

  return (
    <div className="min-h-screen bg-gradient-surface animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-full p-2 hover:bg-secondary/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Meeting Preparation</h1>
                <p className="text-sm text-muted-foreground">9:00 AM • 45 minutes</p>
              </div>
            </div>
            <Button 
              onClick={onStartMeeting}
              className="bg-gradient-primary hover:shadow-lg transition-all duration-300 rounded-xl px-6"
            >
              Start Meeting
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Client Snapshot */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">{mockClientData.name}</h3>
                <p className="text-sm text-muted-foreground">{mockClientData.specialty}</p>
              </div>
            </div>
            <Badge 
              variant={mockClientData.sentiment === "positive" ? "success" : 
                      mockClientData.sentiment === "neutral" ? "warning" : "destructive"}
              className="capitalize"
            >
              {mockClientData.sentiment} relationship
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Hospital</p>
                <p className="text-sm font-medium">{mockClientData.hospital}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Last Contact</p>
                <p className="text-sm font-medium">{mockClientData.lastInteraction}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Prescribing Behavior</p>
              <p className="text-sm">{mockClientData.prescribingBehavior}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Formulary Status</p>
              <p className="text-sm">{mockClientData.formularyStatus}</p>
            </div>
          </div>
        </Card>

        {/* Meeting Objectives */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">Meeting Objectives</h3>
          </div>

          <div className="space-y-3">
            {mockObjectives.map((objective) => (
              <div 
                key={objective.id}
                className="p-4 border border-border/50 rounded-lg hover:bg-secondary/20 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={objective.type === "primary" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {objective.type}
                    </Badge>
                    <Badge 
                      variant={objective.priority === "high" ? "destructive" : 
                              objective.priority === "medium" ? "warning" : "secondary"}
                      className="text-xs"
                    >
                      {objective.priority}
                    </Badge>
                  </div>
                </div>
                <h4 className="font-medium text-card-foreground mb-1">{objective.title}</h4>
                <p className="text-sm text-muted-foreground">{objective.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-primary-soft/50 to-accent-soft/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary animate-pulse-glow" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">AI-Powered Insights</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Recommended Talking Point</span>
              </div>
              <p className="text-sm text-card-foreground">
                "Dr. Johnson has shown interest in patient adherence solutions. The new formulation's 
                simplified dosing schedule directly addresses her previous concerns about compliance."
              </p>
            </div>

            <div className="p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-accent">Strategic Opportunity</span>
              </div>
              <p className="text-sm text-card-foreground">
                "Metro Medical Center recently updated their formulary. This is an excellent time to 
                discuss expanded access for your cardiovascular portfolio."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};