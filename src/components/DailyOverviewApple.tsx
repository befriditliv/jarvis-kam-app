// Daily Overview Component for Apple-style interface
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, User, MessageCircle, Calendar, Bell, Lightbulb, Target, TrendingUp } from "lucide-react";
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
            <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" />
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
          {/* Important for Next Meeting */}
          {nextHCPData && <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Next call with <span className="text-primary">{nextHCPData.name}</span> at {nextMeeting.time}
              </h2>
              
              <div className="mb-4 pb-4 border-b border-border/30">
                <h3 className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  Jarvis Recommended Actions
                </h3>
                <p className="text-xs text-muted-foreground">Personalized recommendations for your upcoming call</p>
              </div>
              
              <div className="space-y-3 mb-6">
                {nextHCPData.importantPoints.map((point, index) => <div key={index} className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg border border-border/20">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-sm text-foreground">{point}</p>
                  </div>)}
              </div>
              
              {/* Access Level and Consent Status */}
              <div className="grid grid-cols-2 gap-3">
                <div className="px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                  <span className="text-xs font-medium text-muted-foreground">Access Level</span>
                  <div className="text-sm font-semibold text-foreground">{nextHCPData.accessLevel}</div>
                </div>
                <div className="px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                  <span className="text-xs font-medium text-muted-foreground">Consent Status</span>
                  <div className={`text-sm font-semibold ${nextHCPData.consentStatus === "OPT IN" ? "text-primary" : nextHCPData.consentStatus === "OPT OUT" ? "text-destructive" : "text-warning"}`}>
                    {nextHCPData.consentStatus}
                  </div>
                </div>
                <div className="px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                  <span className="text-xs font-medium text-muted-foreground">Segmentation</span>
                  <div className={`text-sm font-semibold ${nextHCPData.segmentationStatus === "At risk" ? "text-yellow-500" : nextHCPData.segmentationStatus === "Growing" ? "text-primary" : "text-warning"}`}>
                    {nextHCPData.segmentationStatus}
                  </div>
                </div>
                <div className="px-3 py-2 bg-secondary/30 rounded-lg border border-border/20">
                  <span className="text-xs font-medium text-muted-foreground">Days since Engagement</span>
                  <div className="text-sm font-semibold text-primary">{nextHCPData.daysSinceLastInteraction}</div>
                </div>
              </div>
            </div>}

          {/* Today's Schedule */}
          <div className="relative">
            <h2 className="text-lg font-semibold text-foreground mb-4">Schedule</h2>
            <div className="space-y-3">
              {meetings.map((meeting, index) => {
              const isNextUpcoming = meeting.status === "upcoming" && index === meetings.findIndex(m => m.status === "upcoming");
              return <div key={meeting.id} className={`flex items-center justify-between p-5 border rounded-xl hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm ${isNextUpcoming ? "border-primary/30 bg-primary/5 shadow-sm" : "border-border/50"}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-right min-w-[80px]">
                      <div className="font-semibold text-foreground text-sm">{meeting.time}</div>
                      <div className="text-xs text-muted-foreground">{meeting.duration}</div>
                    </div>
                    
                    <div className="w-px h-10 bg-border/50" />
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">{meeting.hcpName}</h3>
                        <p className="text-xs text-muted-foreground">{meeting.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-4">
                      <MapPin className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`text-xs font-medium px-2 py-1 rounded-lg ${isNextUpcoming ? "bg-primary/10 text-primary" : statusStyles[meeting.status]}`}>
                      {isNextUpcoming ? "Next Call" : statusLabels[meeting.status]}
                    </div>
                    
                    {meeting.status === "upcoming" && <Button onClick={() => onPrepare(meeting.id)} variant="outline" size="sm" className="rounded-xl text-xs font-medium">
                        Prepare
                      </Button>}
                    
                    {meeting.status === "debrief-needed" && <Button onClick={() => onDebrief(meeting.id)} className="rounded-xl bg-destructive hover:bg-destructive/90 text-xs font-medium">
                        Debrief
                      </Button>}
                   </div>
                 </div>;
            })}
            </div>
          </div>

          {/* Task Center Preview */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">AI Recommendations</h2>
              <Button onClick={() => setIsTaskCenterOpen(true)} variant="outline" size="sm" className="rounded-xl text-xs font-medium">
                <Target className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* High Priority Task Preview */}
              <div className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">Schedule Meeting with Category A Client</h3>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        High Priority
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Dr. Patricia Williams (Cardiology) - Last interaction 89 days ago</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-xl flex-shrink-0 text-xs font-medium">
                    Schedule
                  </Button>
                </div>
              </div>

              {/* Medium Priority Task Preview */}
              <div className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground text-sm">Follow-up on Study Download</h3>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        High Priority
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Dr. James Martinez downloaded cardiovascular study yesterday</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-xl flex-shrink-0 text-xs font-medium">
                    Follow-up
                  </Button>
                </div>
              </div>
              
              {/* View more indicator */}
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">+ 3 more AI-generated tasks</p>
              </div>
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