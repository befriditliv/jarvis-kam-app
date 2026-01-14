// Daily Overview Component for Apple-style interface
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, MessageCircle, Calendar, Bell, Lightbulb, Target, TrendingUp, ChevronDown, ChevronUp, Mic, Menu, Phone, Loader2, CheckCircle2, WifiOff, CloudUpload } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { TaskCenter } from "./TaskCenter";
import { HCPAssistant } from "./HCPAssistant";
import { SyncStatus } from "./SyncStatus";
import { BurgerMenu } from "./BurgerMenu";
interface DailyOverviewProps {
  onPrepare: (id: string) => void;
  onDebrief: (id: string) => void;
  onVoiceNote: () => void;
  onAskAI: () => void;
  onReports: () => void;
  onNewAction: () => void;
  onIntelligence: () => void;
}
interface Participant {
  name: string;
  specialty: string;
}

interface Meeting {
  id: string;
  time: string;
  duration: string;
  hcpName: string;
  specialty: string;
  location: string;
  address?: string;
  phone?: string;
  status: "upcoming" | "in-progress" | "debrief-needed" | "debrief-submitting" | "debrief-processing" | "debrief-ready" | "done";
  participants?: Participant[];
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
  address: "1234 Healthcare Blvd, Suite 200, New York, NY 10001",
  phone: "+1 (212) 555-0123",
  status: "debrief-processing"
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
  status: "upcoming",
  participants: [
    { name: "Dr. Emily Rodriguez", specialty: "Endocrinology" },
    { name: "Dr. Thomas Baker", specialty: "Diabetology" },
    { name: "Nurse Patricia Hall", specialty: "Diabetes Care" }
  ]
}, {
  id: "4",
  time: "4:30 PM",
  duration: "30 min",
  hcpName: "Dr. James Wilson",
  specialty: "Neurology",
  location: "Central Neuroscience Clinic",
  address: "890 Brain Way, Suite 500, New York, NY 10003",
  phone: "+1 (212) 555-0456",
  status: "upcoming"
}, {
  id: "5",
  time: "Yesterday",
  duration: "45 min",
  hcpName: "Dr. Amanda Peters",
  specialty: "Rheumatology",
  location: "Wellness Medical Group",
  status: "done"
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
  },
  "Dr. Emily Rodriguez": {
    id: "3",
    name: "Dr. Emily Rodriguez",
    accessLevel: "High",
    consentStatus: "OPT IN",
    segmentationStatus: "Growing",
    daysSinceLastInteraction: 14,
    importantPoints: ["Discuss multi-disciplinary approach with team", "Review diabetes management protocols", "Address coordination between specialists"]
  }
};
const statusStyles = {
  upcoming: "text-primary",
  "in-progress": "text-warning",
  "debrief-needed": "text-destructive",
  "debrief-submitting": "text-muted-foreground",
  "debrief-processing": "text-primary",
  "debrief-ready": "text-green-600",
  done: "text-muted-foreground"
};
const statusLabels = {
  upcoming: "Upcoming",
  "in-progress": "In Progress",
  "debrief-needed": "Needs Debrief",
  "debrief-submitting": "Syncing...",
  "debrief-processing": "Processing",
  "debrief-ready": "Ready for Review",
  done: "Debriefed"
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
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>("3");
  const [hcpAssistantOpen, setHcpAssistantOpen] = useState(false);
  const [selectedHCP, setSelectedHCP] = useState<string>("");
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
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border/40 bg-background sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={jarvisLogo} alt="Jarvis" className="h-10 w-10 sm:h-12 sm:w-12" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">{greeting()}</h1>
                <p className="text-sm text-muted-foreground">{todayDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <SyncStatus />
              <Button onClick={onAskAI} size="sm" className="rounded-xl bg-primary hover:bg-primary/90 px-3 sm:px-4 text-xs sm:text-sm font-medium">
                <MessageCircle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Ask Jarvis</span>
              </Button>
              <BurgerMenu 
                trigger={
                  <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
            </div>
          </div>
          
          {/* Mobile greeting - shows below header on small screens */}
          <div className="sm:hidden mt-4">
            <h1 className="text-xl font-semibold text-foreground">{greeting()}</h1>
            <p className="text-sm text-muted-foreground">{todayDate}</p>
          </div>
          
          {/* Quick stats for mobile */}
          <div className="flex items-center gap-4 mt-4 sm:mt-0 sm:hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">{meetings.length} meetings</span>
            </div>
            {debriefCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full">
                <Bell className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs font-medium text-destructive">{debriefCount} pending</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 pb-20 sm:pb-16">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Today's Schedule */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Today's Schedule</h2>
              <span className="text-xs text-muted-foreground hidden sm:block">{meetings.length} meetings</span>
            </div>
            <div className="space-y-3">
              {meetings.map((meeting, index) => {
              const isNextUpcoming = meeting.status === "upcoming" && index === meetings.findIndex(m => m.status === "upcoming");
              const hcpData = mockHCPData[meeting.hcpName];
              const isExpanded = expandedMeetingId === meeting.id;
              
              return (
                <div key={meeting.id}>
                  <div className={`p-4 sm:p-5 border rounded-2xl hover:shadow-md transition-all duration-300 bg-card backdrop-blur-sm ${isNextUpcoming ? "border-primary/30 bg-primary/5 shadow-sm ring-1 ring-primary/10" : "border-border/50"}`}>
                    {/* Main content */}
                    <div className="flex items-start gap-4">
                      {/* Time column */}
                      <div className="text-center min-w-[56px]">
                        <div className="font-semibold text-foreground text-base">{meeting.time}</div>
                        <div className="text-xs text-muted-foreground">{meeting.duration}</div>
                      </div>
                      
                      {/* Avatar and info - takes full width on mobile */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5">
                          {/* Smaller avatar with participant count */}
                          <div className="relative flex-shrink-0">
                            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            {meeting.participants && meeting.participants.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-semibold shadow-sm">
                                +{meeting.participants.length - 1}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm leading-snug">{meeting.hcpName}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{meeting.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom row: Status + Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                      {/* Status indicator */}
                      <div className="flex items-center gap-2">
                        {meeting.status === "debrief-submitting" && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                            <WifiOff className="h-3.5 w-3.5 text-muted-foreground animate-pulse" />
                            <span className="text-xs font-medium text-muted-foreground">Syncing...</span>
                          </div>
                        )}
                        
                        {meeting.status === "debrief-processing" && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
                            <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                            <span className="text-xs font-medium text-primary">Processing...</span>
                          </div>
                        )}
                        
                        {!["debrief-submitting", "debrief-processing", "debrief-ready", "debrief-needed"].includes(meeting.status) && (
                          <span className={`text-xs font-medium ${isNextUpcoming ? "text-primary" : statusStyles[meeting.status]}`}>
                            {isNextUpcoming ? "Next Call" : statusLabels[meeting.status]}
                          </span>
                        )}
                        
                        {meeting.status === "debrief-needed" && (
                          <span className="text-xs font-medium text-destructive">Needs Debrief</span>
                        )}
                        
                        {/* Quick actions */}
                        {(meeting.address || meeting.phone) && (
                          <div className="flex items-center gap-2 ml-2">
                            {meeting.address && (
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meeting.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5 active:scale-95"
                              >
                                <MapPin className="h-3.5 w-3.5" />
                                Directions
                              </a>
                            )}
                            {meeting.phone && (
                              <a 
                                href={`tel:${meeting.phone}`}
                                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center gap-1.5 active:scale-95"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Call
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {meeting.status === "debrief-ready" && (
                          <Button 
                            onClick={() => console.log('Approve debrief for', meeting.id)} 
                            size="sm"
                            className="rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 h-auto"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                            Approve
                          </Button>
                        )}
                        
                        {meeting.status === "upcoming" && (
                          <>
                            <Button 
                              onClick={() => {
                                setSelectedHCP(meeting.hcpName);
                                setHcpAssistantOpen(true);
                              }} 
                              size="sm" 
                              className="rounded-xl h-9 w-9 p-0 bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            {hcpData && (
                              <Button 
                                onClick={() => setExpandedMeetingId(isExpanded ? null : meeting.id)}
                                variant="ghost" 
                                size="sm" 
                                className="rounded-xl h-9 w-9 p-0"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            )}
                          </>
                        )}
                        
                        {meeting.status === "debrief-needed" && (
                          <Button 
                            onClick={() => onDebrief(meeting.id)} 
                            size="sm"
                            className="rounded-xl bg-destructive hover:bg-destructive/90 text-xs font-medium px-4 py-2 h-auto"
                          >
                            Debrief
                          </Button>
                        )}
                        
                        {meeting.status === "done" && (
                          <Button 
                            onClick={() => onDebrief(meeting.id)} 
                            variant="outline"
                            size="sm"
                            className="rounded-xl text-xs font-medium px-4 py-2 h-auto"
                          >
                            Redo Debrief
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && hcpData && (
                    <div className="mt-3 p-4 sm:p-5 bg-card border border-border/50 rounded-xl ml-0 sm:ml-4">
                      {/* Participants section - if multiple */}
                      {meeting.participants && meeting.participants.length > 1 && (
                        <div className="mb-4 pb-3 border-b border-border/30">
                          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            Meeting Participants ({meeting.participants.length})
                          </h3>
                          <div className="space-y-2">
                            {meeting.participants.map((participant, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg">
                                <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <User className="h-3.5 w-3.5 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-foreground truncate">{participant.name}</p>
                                  <p className="text-xs text-muted-foreground">{participant.specialty}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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
      
      {/* HCP Assistant Modal */}
      {hcpAssistantOpen && (
        <HCPAssistant 
          isOpen={hcpAssistantOpen} 
          onClose={() => setHcpAssistantOpen(false)} 
          hcpName={selectedHCP}
        />
      )}
    </div>;
};