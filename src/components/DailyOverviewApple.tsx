// Daily Overview Component for Apple-style interface
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, MessageCircle, Calendar, Bell, Lightbulb, Target, TrendingUp, ChevronDown, ChevronUp, Mic } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { TaskCenter } from "./TaskCenter";
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
  const [isTaskCenterOpen, setIsTaskCenterOpen] = useState(false);
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>("1");
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
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <img src={jarvisLogo} alt="Jarvis" className="h-16 w-16" />
            <div className="flex items-center gap-3">
              <Button onClick={onAskAI} className="rounded-xl bg-primary hover:bg-primary/90 px-6 text-sm font-medium">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Jarvis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Today's Schedule */}
          <div className="relative">
            <h2 className="text-lg font-semibold text-foreground mb-4">Schedule</h2>
            <div className="space-y-3">
              {meetings.map((meeting, index) => {
              const isNextUpcoming = meeting.status === "upcoming" && index === meetings.findIndex(m => m.status === "upcoming");
              const hcpData = mockHCPData[meeting.hcpName];
              const isExpanded = expandedMeetingId === meeting.id;
              
              return (
                <div key={meeting.id}>
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 border rounded-xl hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm ${isNextUpcoming ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/50"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-left sm:text-right min-w-[70px] sm:min-w-[80px]">
                          <div className="font-semibold text-foreground text-sm">{meeting.time}</div>
                          <div className="text-xs text-muted-foreground">{meeting.duration}</div>
                        </div>
                        
                        <div className="hidden sm:block w-px h-10 bg-border/50" />
                        
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">{meeting.hcpName}</h3>
                            <p className="text-xs text-muted-foreground">{meeting.specialty}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground ml-0 sm:ml-4 pl-0 sm:pl-0">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{meeting.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0 justify-between sm:justify-end">
                      <div className={`text-xs font-medium px-2 py-1 rounded-lg ${isNextUpcoming ? "bg-primary/10 text-primary" : statusStyles[meeting.status]}`}>
                        {isNextUpcoming ? "Next Call" : statusLabels[meeting.status]}
                      </div>
                      
                      {meeting.status === "upcoming" && (
                        <div className="flex items-center gap-2">
                          <Button onClick={onAskAI} size="sm" className="rounded-xl text-xs font-medium">
                            <Mic className="h-3 w-3 mr-1" />
                            Ask
                          </Button>
                          {hcpData && (
                            <Button 
                              onClick={() => setExpandedMeetingId(isExpanded ? null : meeting.id)}
                              variant="ghost" 
                              size="sm" 
                              className="rounded-xl p-2"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {meeting.status === "debrief-needed" && <Button onClick={() => onDebrief(meeting.id)} className="rounded-xl bg-destructive hover:bg-destructive/90 text-xs font-medium">
                          Debrief
                        </Button>}
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && hcpData && (
                    <div className="mt-3 p-4 sm:p-5 bg-card border border-border/50 rounded-xl ml-0 sm:ml-4">
                      <div className="mb-4 pb-3 border-b border-border/30">
                        <h3 className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-primary" />
                          Jarvis Recommended Actions
                        </h3>
                        <p className="text-xs text-muted-foreground">Personalized recommendations for your upcoming call</p>
                      </div>
                      
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                        {hcpData.importantPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-secondary/20 rounded-lg border border-border/20">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 sm:mt-2 flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-foreground">{point}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Access Level and Consent Status */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="px-2 sm:px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                          <span className="text-xs font-medium text-muted-foreground">Access Level</span>
                          <div className="text-sm font-semibold text-foreground">{hcpData.accessLevel}</div>
                        </div>
                        <div className="px-2 sm:px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                          <span className="text-xs font-medium text-muted-foreground">Consent Status</span>
                          <div className={`text-sm font-semibold ${hcpData.consentStatus === "OPT IN" ? "text-primary" : hcpData.consentStatus === "OPT OUT" ? "text-destructive" : "text-warning"}`}>
                            {hcpData.consentStatus}
                          </div>
                        </div>
                        <div className="px-2 sm:px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                          <span className="text-xs font-medium text-muted-foreground">Segmentation</span>
                          <div className={`text-sm font-semibold ${hcpData.segmentationStatus === "At risk" ? "text-yellow-500" : hcpData.segmentationStatus === "Growing" ? "text-primary" : "text-warning"}`}>
                            {hcpData.segmentationStatus}
                          </div>
                        </div>
                        <div className="px-2 sm:px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                          <span className="text-xs font-medium text-muted-foreground">Days since Engagement</span>
                          <div className="text-sm font-semibold text-primary">{hcpData.daysSinceLastInteraction}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-8 right-8">
        <div className="flex flex-col gap-3">
          
          
        </div>
      </div>

      {/* Task Center Modal */}
      {isTaskCenterOpen && <TaskCenter onClose={() => setIsTaskCenterOpen(false)} />}
    </div>;
};