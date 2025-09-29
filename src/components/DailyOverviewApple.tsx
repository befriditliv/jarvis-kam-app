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
      <div className="px-6 pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <img src={jarvisLogo} alt="Jarvis" className="h-16 w-16" />
            <div className="flex items-center gap-3">
              <Button onClick={onAskAI} className="rounded-xl bg-primary hover:bg-primary/90 px-6">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Jarvis
              </Button>
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
                Next call with <span className="underline text-primary">{nextHCPData.name}</span> at {nextMeeting.time}
              </h2>
              
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/50">
                <div className="w-6 h-6 bg-yellow-500/10 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-3 h-3 text-yellow-500" />
                </div>
                <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Jarvis Suggestions</h3>
              </div>
              
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

          {/* Task Center Preview */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">AI Recommendations</h2>
              <Button onClick={() => setIsTaskCenterOpen(true)} variant="outline" size="sm" className="rounded-xl">
                <Target className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* High Priority Task Preview */}
              <div className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-200 bg-gradient-to-r from-red-500/5 to-transparent">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">Schedule Meeting with Category A Client</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                        High Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Dr. Patricia Williams (Cardiology) - Last interaction 89 days ago</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg flex-shrink-0">
                    Schedule
                  </Button>
                </div>
              </div>

              {/* Medium Priority Task Preview */}
              <div className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-all duration-200 bg-gradient-to-r from-green-500/5 to-transparent">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">Follow-up on Study Download</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        High Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Dr. James Martinez downloaded cardiovascular study yesterday</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg flex-shrink-0">
                    Follow-up
                  </Button>
                </div>
              </div>
              
              {/* View more indicator */}
              <div className="text-center">
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