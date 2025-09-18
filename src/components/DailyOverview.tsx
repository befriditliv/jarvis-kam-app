import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeetingCard } from "./MeetingCard";
import { SmartNudges } from "./SmartNudges";
import { QuickActions } from "./QuickActions";
import { Calendar, User, TrendingUp } from "lucide-react";

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

export const DailyOverview = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);

  const handlePrepare = (id: string) => {
    console.log("Preparing for meeting:", id);
    // Navigate to prep view
  };

  const handleDebrief = (id: string) => {
    console.log("Starting debrief for meeting:", id);
    // Navigate to debrief view
  };

  const handleVoiceNote = () => {
    console.log("Starting voice note recording");
  };

  const handleAskAI = () => {
    console.log("Opening AI assistant");
  };

  const handleReports = () => {
    console.log("Opening reports modal");
  };

  const handleNewAction = () => {
    console.log("Creating new action");
  };

  const todayDate = new Date().toLocaleDateString("en-US", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  const upcomingCount = meetings.filter(m => m.status === "upcoming").length;
  const debriefCount = meetings.filter(m => m.status === "debrief-needed").length;
  const completedCount = meetings.filter(m => m.status === "done").length;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Daily Overview</h1>
            <p className="text-muted-foreground">{todayDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{upcomingCount}</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{debriefCount}</div>
            <div className="text-sm text-muted-foreground">Need Debrief</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Smart Nudges */}
        <SmartNudges />

        {/* Today's Meetings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Today's Schedule</h2>
            <Button variant="ghost" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
          
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onPrepare={handlePrepare}
                onDebrief={handleDebrief}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Dock */}
      <QuickActions 
        onVoiceNote={handleVoiceNote}
        onAskAI={handleAskAI}
        onReports={handleReports}
        onNewAction={handleNewAction}
      />
    </div>
  );
};