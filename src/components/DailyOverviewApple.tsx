// Daily Overview Component for Apple-style interface
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, MessageCircle, Calendar, Bell, Lightbulb } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";
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
interface Nudge {
  id: string;
  text: string;
  priority: "high" | "medium";
}
const mockMeetings: Meeting[] = [{
  id: "1",
  time: "9:00 AM",
  duration: "45 min",
  hcpName: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  location: "Metro Medical Center",
  status: "upcoming"
}, {
  id: "2",
  time: "11:30 AM",
  duration: "30 min",
  hcpName: "Dr. Michael Chen",
  specialty: "Oncology",
  location: "City General Hospital",
  status: "debrief-needed"
}, {
  id: "3",
  time: "2:00 PM",
  duration: "60 min",
  hcpName: "Dr. Emily Rodriguez",
  specialty: "Endocrinology",
  location: "University Health System",
  status: "upcoming"
}];

// HCP data with access level and consent status
interface HCPData {
  id: string;
  name: string;
  accessLevel: "High" | "Medium" | "Low";
  consentStatus: "OPT IN" | "OPT OUT" | "Blank";
  segmentationStatus: "At risk" | "Stable" | "Growing";
  daysSinceLastInteraction: number;
  importantPoints: string[];
}
const mockHCPData: Record<string, HCPData> = {
  "Dr. Sarah Johnson": {
    id: "1",
    name: "Dr. Sarah Johnson",
    accessLevel: "High",
    consentStatus: "OPT IN",
    segmentationStatus: "At risk",
    daysSinceLastInteraction: 34,
    importantPoints: ["Present new study data on cardiovascular outcomes", "Address patient adherence strategies and concerns", "Discuss formulary status updates and access"]
  },
  "Dr. Michael Chen": {
    id: "2",
    name: "Dr. Michael Chen",
    accessLevel: "Medium",
    consentStatus: "OPT OUT",
    segmentationStatus: "Stable",
    daysSinceLastInteraction: 21,
    importantPoints: ["Schedule overdue follow-up appointments", "Review recent treatment protocols"]
  }
};
const statusStyles = {
  upcoming: "text-primary",
  "in-progress": "text-warning",
  "debrief-needed": "text-destructive",
  done: "text-muted-foreground"
};
const statusLabels = {
  upcoming: "Upcoming",
  "in-progress": "In Progress",
  "debrief-needed": "Needs Debrief",
  done: "Complete"
};
export const DailyOverviewApple = ({
  onPrepare,
  onDebrief,
  onVoiceNote,
  onAskAI,
  onReports,
  onNewAction,
  onIntelligence
}: DailyOverviewProps) => {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  const upcomingCount = meetings.filter(m => m.status === "upcoming").length;
  const debriefCount = meetings.filter(m => m.status === "debrief-needed").length;

  // Get next upcoming meeting
  const nextMeeting = meetings.find(m => m.status === "upcoming");
  const nextHCPData = nextMeeting ? mockHCPData[nextMeeting.hcpName] : null;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" />
            <div className="flex items-center gap-3">
              <Button onClick={onNewAction} className="rounded-xl bg-primary hover:bg-primary/90 px-6">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Jarvis
              </Button>
            </div>
          </div>

          {/* Today Overview */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-8">
            <h2 className="text-base font-medium text-foreground mb-2">Today</h2>
            <p className="text-xs text-muted-foreground mb-3">{todayDate}</p>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-accent/30 rounded-lg p-3 text-center">
                <div className="text-lg font-medium text-foreground">{meetings.length}</div>
                <div className="text-xs text-muted-foreground">Total meetings</div>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <div className="text-lg font-medium text-primary">{upcomingCount}</div>
                <div className="text-xs text-muted-foreground">Upcoming</div>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <div className="text-lg font-medium text-destructive">{debriefCount}</div>
                <div className="text-xs text-muted-foreground">Need debrief</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Important for Next Meeting */}
          {nextHCPData && <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              {/* Background decoration */}
              
              
              {/* Header */}
              <div className="relative mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{nextHCPData.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{nextMeeting.time}</span>
                      <span>•</span>
                      <span>{nextMeeting.duration}</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick stats row */}
                <div className="flex items-center gap-4 mt-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${nextHCPData.accessLevel === "High" ? "bg-green-100 text-green-700" : nextHCPData.accessLevel === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                    {nextHCPData.accessLevel} Access
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${nextHCPData.consentStatus === "OPT IN" ? "bg-green-100 text-green-700" : nextHCPData.consentStatus === "OPT OUT" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                    {nextHCPData.consentStatus}
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    {nextHCPData.daysSinceLastInteraction} days ago
                  </div>
                </div>
              </div>
              
              {/* Jarvis Suggestions */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">Key Discussion Points</h3>
                </div>
                
                <div className="space-y-3">
                  {nextHCPData.importantPoints.map((point, index) => <div key={index} className="flex items-start gap-3 p-4 bg-white/50 border border-white/60 rounded-xl backdrop-blur-sm">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{point}</p>
                    </div>)}
                </div>
              </div>
              
              {/* Status indicators */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-4 bg-white/40 border border-white/60 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${nextHCPData.segmentationStatus === "At risk" ? "bg-red-400" : nextHCPData.segmentationStatus === "Growing" ? "bg-green-400" : "bg-yellow-400"}`} />
                    <span className="font-medium text-foreground">Relationship Status</span>
                  </div>
                  <span className={`font-semibold ${nextHCPData.segmentationStatus === "At risk" ? "text-red-600" : nextHCPData.segmentationStatus === "Growing" ? "text-green-600" : "text-yellow-600"}`}>
                    {nextHCPData.segmentationStatus}
                  </span>
                </div>
                
                {nextHCPData.consentStatus === "OPT OUT" && <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-red-600">!</span>
                      </div>
                      <span className="text-sm font-medium text-red-700">Priority: Regain consent during this call</span>
                    </div>
                  </div>}
              </div>
            </div>}

          {/* Today's Schedule */}
          <div className="relative">
            
            <h2 className="text-lg font-medium text-foreground mb-4">Schedule</h2>
            <div className="space-y-4">
              {meetings.map((meeting, index) => {
              const isNextUpcoming = meeting.status === "upcoming" && index === meetings.findIndex(m => m.status === "upcoming");
              return <div key={meeting.id} className={`flex items-center justify-between p-6 border rounded-xl hover:bg-accent/30 transition-all duration-200 ${isNextUpcoming ? "border-primary bg-primary/5 shadow-md" : "border-border"}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-foreground">{meeting.time}</div>
                      <div className="text-sm text-muted-foreground">{meeting.duration}</div>
                    </div>
                    
                    <div className="w-px h-12 bg-border" />
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{meeting.hcpName}</h3>
                        <p className="text-sm text-muted-foreground">{meeting.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-medium ${statusStyles[meeting.status]}`}>
                      {statusLabels[meeting.status]}
                    </div>
                    
                    {meeting.status === "upcoming" && <Button onClick={() => onPrepare(meeting.id)} variant="outline" size="sm" className="rounded-xl">
                        Prepare
                      </Button>}
                    
                    {meeting.status === "debrief-needed" && <Button onClick={() => onDebrief(meeting.id)} className="rounded-xl bg-destructive hover:bg-destructive/90">
                        Debrief
                      </Button>}
                   </div>
                 </div>;
            })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8">
        <div className="flex flex-col gap-3">
          <Button onClick={onVoiceNote} size="sm" variant="outline" className="rounded-full w-12 h-12 p-0 shadow-lg hover:bg-accent">
            <Bell className="h-5 w-5" />
          </Button>
          <Button onClick={onAskAI} className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 shadow-lg">
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>;
};