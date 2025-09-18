import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";

interface Nudge {
  id: string;
  type: "reminder" | "opportunity" | "alert";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const nudgeTypeConfig = {
  reminder: {
    icon: Lightbulb,
    color: "text-info",
    bgColor: "bg-info/10"
  },
  opportunity: {
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10"
  },
  alert: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10"
  }
};

const mockNudges: Nudge[] = [
  {
    id: "1",
    type: "reminder",
    title: "Adherence Discussion",
    description: "Remember to bring up adherence with Dr. Johnson",
    priority: "high"
  },
  {
    id: "2",
    type: "alert",
    title: "Follow-up Overdue",
    description: "Michael Chen is overdue for follow-up scheduling",
    priority: "high"
  },
  {
    id: "3",
    type: "opportunity",
    title: "Formulary Update",
    description: "Metro Health just updated formulary access—worth mentioning",
    priority: "medium"
  }
];

export const SmartNudges = () => {
  return (
    <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground">Smart Nudges</h3>
        <Badge variant="secondary" className="text-xs">
          Top 3 for Today
        </Badge>
      </div>
      
      <div className="space-y-3">
        {mockNudges.map((nudge) => {
          const config = nudgeTypeConfig[nudge.type];
          const Icon = config.icon;
          
          return (
            <div 
              key={nudge.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className={`p-2 rounded-full ${config.bgColor}`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-card-foreground">{nudge.title}</h4>
                  {nudge.priority === "high" && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      High
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {nudge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};