import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, MapPin, User, ChevronDown } from "lucide-react";

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
  onQuickAction?: (id: string, action: string) => void;
}

const statusConfig = {
  upcoming: { 
    label: "Upcoming", 
    variant: "info" as const,
    actionLabel: "Prepare"
  },
  "in-progress": { 
    label: "In Progress", 
    variant: "warning" as const,
    actionLabel: "In Meeting"
  },
  "debrief-needed": { 
    label: "Debrief Needed", 
    variant: "destructive" as const,
    actionLabel: "Debrief"
  },
  done: { 
    label: "Done", 
    variant: "success" as const,
    actionLabel: "Complete"
  }
};

export const MeetingCard = ({ meeting, onPrepare, onDebrief, onQuickAction }: MeetingCardProps) => {
  const config = statusConfig[meeting.status];
  
  const handleAction = () => {
    if (meeting.status === "debrief-needed") {
      onDebrief(meeting.id);
    } else if (meeting.status === "upcoming") {
      onPrepare(meeting.id);
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm shadow-card hover:scale-[1.02] animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{meeting.time}</span>
              <span className="text-sm">({meeting.duration})</span>
            </div>
            <Badge variant={config.variant}>
              {config.label}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-card-foreground">{meeting.hcpName}</span>
              <span className="text-sm text-muted-foreground">• {meeting.specialty}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{meeting.location}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          {meeting.status === "debrief-needed" ? (
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                size="sm"
                onClick={handleAction}
                className="min-w-[80px]"
              >
                {config.actionLabel}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="px-2">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border border-border">
                  <DropdownMenuItem 
                    onClick={() => onQuickAction?.(meeting.id, "nothing-to-debrief")}
                    className="cursor-pointer hover:bg-accent"
                  >
                    Nothing to debrief
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onQuickAction?.(meeting.id, "materials-handed-over")}
                    className="cursor-pointer hover:bg-accent"
                  >
                    Materials handed over
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onQuickAction?.(meeting.id, "schedule-3-months")}
                    className="cursor-pointer hover:bg-accent"
                  >
                    Schedule meeting in 3 months
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onQuickAction?.(meeting.id, "schedule-6-months")}
                    className="cursor-pointer hover:bg-accent"
                  >
                    Schedule meeting in 6 months
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : meeting.status === "upcoming" ? (
            <Button 
              variant="default"
              size="sm"
              onClick={handleAction}
              className="min-w-[80px]"
            >
              {config.actionLabel}
            </Button>
          ) : meeting.status === "in-progress" ? (
            <div className="px-3 py-1 bg-warning/10 text-warning-foreground rounded-md text-sm font-medium">
              Active
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};