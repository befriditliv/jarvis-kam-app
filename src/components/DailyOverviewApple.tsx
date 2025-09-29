import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, User, Plus, Calendar, Bell, CheckCircle, Settings, Mic, Sparkles, BarChart3, Zap } from "lucide-react";
import { MeetingCard } from "./MeetingCard";
import { SmartNudges } from "./SmartNudges";
import { QuickActions } from "./QuickActions";

interface DailyOverviewProps {
  onPrepare: (id: string) => void;
  onDebrief: (id: string) => void;
  onVoiceNote: () => void;
  onAskAI: () => void;
  onReports: () => void;
  onNewAction: () => void;
  onIntelligence: () => void;
}

interface Meeting {
  id: string;
  time: string;
  duration: string;
  hcpName: string;
  specialty: string;
  location: string;
  status: "upcoming" | "in-progress" | "debrief-needed" | "done";
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    time: "9:00 AM",
    duration: "45 min",
    hcpName: "Dr. Sarah Johnson",
    specialty: "Cardiology", 
    location: "Metro Medical Center",
    status: "upcoming"
  },
  {
    id: "2",
    time: "11:30 AM",
    duration: "30 min",
    hcpName: "Dr. Michael Chen",
    specialty: "Oncology",
    location: "City General Hospital",
    status: "debrief-needed"
  },
  {
    id: "3",
    time: "2:00 PM",
    duration: "60 min",
    hcpName: "Dr. Emily Rodriguez",
    specialty: "Endocrinology",
    location: "University Health System",
    status: "upcoming"
  },
  {
    id: "4",
    time: "4:30 PM",
    duration: "30 min",
    hcpName: "Dr. James Wilson",
    specialty: "Nephrology",
    location: "Regional Medical Center",
    status: "done"
  }
];

export const DailyOverviewApple = ({ 
  onPrepare, 
  onDebrief, 
  onVoiceNote, 
  onAskAI, 
  onReports, 
  onNewAction,
  onIntelligence 
}: DailyOverviewProps) => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);

  const handlePrepare = (id: string) => {
    onPrepare(id);
  };

  const handleDebrief = (id: string) => {
    onDebrief(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 overflow-hidden no-pull-refresh">
      {/* Mobile Status Bar Spacing */}
      <div className="h-safe-top bg-gradient-to-r from-primary/10 to-secondary/10"></div>
      
      {/* Header with Mobile-First Design */}
      <div className="relative bg-gradient-to-r from-primary/5 to-secondary/5 backdrop-blur-sm border-b border-border/50">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-mobile-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Today
              </h1>
              <p className="text-mobile-sm text-muted-foreground font-medium">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="touch-target rounded-xl border-border/50 bg-card/80 backdrop-blur-sm hover:bg-primary/10 transition-all duration-200"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="touch-target rounded-xl border-border/50 bg-card/80 backdrop-blur-sm hover:bg-primary/10 transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content with Mobile Padding */}
      <div className="px-4 pb-safe-bottom">
        {/* Mobile Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6 mt-4">
          <Card className="text-center p-4 bg-gradient-to-br from-card to-primary-light/20 border-border/30 shadow-mobile-card hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-target">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="text-mobile-xl font-bold text-foreground">3</div>
              <div className="text-mobile-xs text-muted-foreground font-medium">Upcoming</div>
            </div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-card to-warning-light/20 border-border/30 shadow-mobile-card hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-target">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-warning/20 to-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div className="text-mobile-xl font-bold text-foreground">2</div>
              <div className="text-mobile-xs text-muted-foreground font-medium">Need Debrief</div>
            </div>
          </Card>
          <Card className="text-center p-4 bg-gradient-to-br from-card to-success-light/20 border-border/30 shadow-mobile-card hover:shadow-lg transition-all duration-300 transform hover:scale-105 touch-target">
            <div className="flex flex-col items-center gap-2">
              <div className="p-2 rounded-full bg-gradient-to-r from-success/20 to-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div className="text-mobile-xl font-bold text-foreground">4</div>
              <div className="text-mobile-xs text-muted-foreground font-medium">Completed</div>
            </div>
          </Card>
        </div>

        {/* Smart Nudges Mobile */}
        <div className="mb-6">
          <SmartNudges />
        </div>

        {/* Today's Schedule Mobile */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-mobile-lg font-semibold text-foreground">Today's Schedule</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
          </div>
          <div className="space-y-3">
            {meetings.map((meeting, index) => (
              <div 
                key={meeting.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MeetingCard
                  meeting={meeting}
                  onPrepare={handlePrepare}
                  onDebrief={handleDebrief}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Quick Actions at Bottom */}
        <div className="pb-6">
          <QuickActions
            onVoiceNote={onVoiceNote}
            onAskAI={onAskAI}
            onReports={onReports}
            onNewAction={onNewAction}
            onIntelligence={onIntelligence}
          />
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-4 z-50">
        <Button
          onClick={onNewAction}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-mobile-fab hover:shadow-xl transform hover:scale-110 transition-all duration-300 touch-target animate-pulse-glow"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};