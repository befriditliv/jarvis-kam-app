import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, ChevronRight } from "lucide-react";

interface Meeting {
  id: string;
  time: string;
  duration: string;
  hcpName: string;
  specialty: string;
  location: string;
  status: "upcoming" | "in-progress" | "debrief-needed" | "done";
}

interface MeetingCardProps {
  meeting: Meeting;
  onPrepare: (id: string) => void;
  onDebrief: (id: string) => void;
}

const statusConfig = {
  upcoming: { 
    label: "Upcoming", 
    variant: "default" as const,
    actionLabel: "Prepare",
    bgClass: "bg-gradient-to-r from-primary/5 to-primary/10",
    borderClass: "border-primary/20"
  },
  "in-progress": { 
    label: "In Progress", 
    variant: "secondary" as const,
    actionLabel: "In Meeting",
    bgClass: "bg-gradient-to-r from-warning/5 to-warning/10",
    borderClass: "border-warning/20"
  },
  "debrief-needed": { 
    label: "Debrief Needed", 
    variant: "destructive" as const,
    actionLabel: "Debrief",
    bgClass: "bg-gradient-to-r from-destructive/5 to-destructive/10",
    borderClass: "border-destructive/20"
  },
  done: { 
    label: "Complete", 
    variant: "outline" as const,
    actionLabel: "Complete",
    bgClass: "bg-gradient-to-r from-success/5 to-success/10",
    borderClass: "border-success/20"
  }
};

export const MeetingCard = ({ meeting, onPrepare, onDebrief }: MeetingCardProps) => {
  const config = statusConfig[meeting.status];
  
  const handleAction = () => {
    if (meeting.status === "debrief-needed") {
      onDebrief(meeting.id);
    } else if (meeting.status === "upcoming") {
      onPrepare(meeting.id);
    }
  };

  return (
    <Card className={`p-5 hover:shadow-mobile-card transition-all duration-300 border ${config.borderClass} ${config.bgClass} backdrop-blur-sm hover:scale-[1.02] animate-fade-in touch-target`}>
      {/* Mobile-optimized layout */}
      <div className="space-y-4">
        {/* Header with time and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-foreground">
              <div className="p-2 rounded-full bg-card/80">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-semibold text-mobile-base">{meeting.time}</span>
                <span className="text-mobile-xs text-muted-foreground ml-2">({meeting.duration})</span>
              </div>
            </div>
          </div>
          <Badge 
            variant={config.variant} 
            className="text-mobile-xs px-3 py-1 rounded-full font-medium"
          >
            {config.label}
          </Badge>
        </div>
        
        {/* Doctor info */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary/20 to-accent/20 flex items-center justify-center">
              <User className="h-5 w-5 text-secondary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-mobile-base text-foreground">{meeting.hcpName}</h3>
              <p className="text-mobile-sm text-muted-foreground">{meeting.specialty}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-mobile-sm text-muted-foreground ml-13">
            <MapPin className="h-4 w-4" />
            <span>{meeting.location}</span>
          </div>
        </div>
        
        {/* Action button */}
        {meeting.status !== "done" && meeting.status !== "in-progress" && (
          <Button 
            variant={meeting.status === "debrief-needed" ? "destructive" : "default"}
            size="sm"
            onClick={handleAction}
            className="w-full touch-target rounded-xl text-mobile-sm font-medium py-3 transition-all duration-200 hover:scale-105"
          >
            <span>{config.actionLabel}</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        {meeting.status === "in-progress" && (
          <div className="w-full text-center py-3 bg-warning/10 text-warning rounded-xl text-mobile-sm font-medium">
            Meeting in Progress
          </div>
        )}
      </div>
    </Card>
  );
};