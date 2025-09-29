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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <img src={jarvisLogo} alt="Jarvis" className="h-10 w-10" />
              <div>
                <h1 className="text-3xl font-light text-foreground mb-1">Today</h1>
                <p className="text-muted-foreground">{todayDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={onNewAction} className="rounded-xl bg-primary hover:bg-primary/90 px-6">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Jarvis
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-light text-foreground">{meetings.length}</div>
              <div className="text-sm text-muted-foreground">Total meetings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-primary">{upcomingCount}</div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-destructive">{debriefCount}</div>
              <div className="text-sm text-muted-foreground">Need debrief</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Important for Next Meeting */}
          {nextHCPData && <div className="bg-card border border-primary rounded-xl p-6 shadow-sm relative">
              
              <h2 className="text-lg font-medium text-foreground mb-4">
                Next call with <span className="underline text-primary">{nextHCPData.name}</span>
              </h2>
              <div className="space-y-2 mb-4">
                {nextHCPData.importantPoints.map((point, index) => <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                    <Lightbulb className="w-4 h-4 mt-1 text-yellow-500" />
                    <p className="text-foreground">{point}</p>
                  </div>)}
              </div>
              
              {/* Access Level and Consent Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="px-3 py-2 bg-accent rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    Access Level: <span className="text-primary">{nextHCPData.accessLevel}</span>
                  </span>
                </div>
                <div className="px-3 py-2 bg-accent rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    Consent Status: 
                    <span className={`ml-1 ${nextHCPData.consentStatus === "OPT IN" ? "text-primary" : nextHCPData.consentStatus === "OPT OUT" ? "text-destructive" : "text-warning"}`}>
                      {nextHCPData.consentStatus}
                      {nextHCPData.consentStatus === "OPT OUT" && " - Get consent back"}
                      {nextHCPData.consentStatus === "Blank" && " - Get consent if possible"}
                    </span>
                  </span>
                </div>
                <div className="px-3 py-2 bg-accent rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    Segmentation: 
                    <span className={`ml-1 ${nextHCPData.segmentationStatus === "At risk" ? "text-yellow-500" : nextHCPData.segmentationStatus === "Growing" ? "text-primary" : "text-warning"}`}>
                      {nextHCPData.segmentationStatus}
                    </span>
                  </span>
                </div>
                <div className="px-3 py-2 bg-accent rounded-lg">
                  <span className="text-sm font-medium text-foreground">
                    Days since Engagement: <span className="text-blue-500">{nextHCPData.daysSinceLastInteraction}</span>
                  </span>
                </div>
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