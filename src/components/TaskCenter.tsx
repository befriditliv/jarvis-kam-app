import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Clock, Download, AlertTriangle, CheckCircle, Calendar, User, Brain } from "lucide-react";

interface TaskCenterProps {
  onClose: () => void;
}

interface Task {
  id: string;
  type: "schedule" | "follow-up" | "engagement" | "opportunity";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  hcpName?: string;
  category?: string;
  daysOverdue?: number;
  actionLabel: string;
  context?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    type: "schedule",
    priority: "high",
    title: "Schedule Meeting with Category A Client",
    description: "Dr. Patricia Williams (Cardiology) - Last interaction 89 days ago",
    hcpName: "Dr. Patricia Williams",
    category: "Category A",
    daysOverdue: 89,
    actionLabel: "Schedule Meeting",
    context: "High-value client, overdue for engagement"
  },
  {
    id: "2", 
    type: "follow-up",
    priority: "high",
    title: "Follow-up on Study Download",
    description: "Dr. James Martinez downloaded cardiovascular outcomes study yesterday",
    hcpName: "Dr. James Martinez",
    actionLabel: "Schedule Follow-up",
    context: "Downloaded: Cardiovascular Outcomes Study"
  },
  {
    id: "3",
    type: "engagement",
    priority: "medium", 
    title: "Re-engage Dormant High-Access HCP",
    description: "Dr. Lisa Thompson - High access level, no interaction in 67 days",
    hcpName: "Dr. Lisa Thompson",
    daysOverdue: 67,
    actionLabel: "Reach Out",
    context: "High access level, potentially valuable"
  },
  {
    id: "4",
    type: "opportunity",
    priority: "medium",
    title: "New Study Opportunity",
    description: "Recent diabetes study relevant to Dr. Kumar's patient population",
    hcpName: "Dr. Raj Kumar",
    actionLabel: "Share Study",
    context: "Endocrinology - Diabetes focus"
  },
  {
    id: "5",
    type: "schedule",
    priority: "low",
    title: "Quarterly Check-in Due",
    description: "Dr. Smith - Routine quarterly meeting is due next week",
    hcpName: "Dr. Smith",
    actionLabel: "Schedule Meeting",
    context: "Routine maintenance"
  }
];

const taskTypeConfig = {
  schedule: {
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  "follow-up": {
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  engagement: {
    icon: User,
    color: "text-orange-500", 
    bgColor: "bg-orange-500/10"
  },
  opportunity: {
    icon: Download,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
};

const priorityConfig = {
  high: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "High Priority"
  },
  medium: {
    color: "text-yellow-500", 
    bgColor: "bg-yellow-500/10",
    label: "Medium Priority"
  },
  low: {
    color: "text-green-500",
    bgColor: "bg-green-500/10", 
    label: "Low Priority"
  }
};

export const TaskCenter = ({ onClose }: TaskCenterProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleCompleteTask = (taskId: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
  };

  const activeTasks = tasks.filter(task => !completedTasks.includes(task.id));
  const highPriorityCount = activeTasks.filter(task => task.priority === "high").length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">AI Task Center</h2>
              <p className="text-sm text-muted-foreground">
                {activeTasks.length} active tasks • {highPriorityCount} high priority
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* Quick Queries */}
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Quick Queries</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-3 text-left"
                onClick={() => {/* Handle quick query */}}
              >
                <Brain className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm">Find best canvas targets near me</span>
              </Button>
            </div>
          </div>

          {activeTasks.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No active tasks at the moment.</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {activeTasks.map((task) => {
                const typeConfig = taskTypeConfig[task.type];
                const priorityConf = priorityConfig[task.priority];
                const TypeIcon = typeConfig.icon;
                
                return (
                  <div key={task.id} className="border border-border rounded-lg p-4 hover:bg-accent/30 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-8 h-8 ${typeConfig.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <TypeIcon className={`h-4 w-4 ${typeConfig.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-foreground">{task.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConf.bgColor} ${priorityConf.color}`}>
                              {priorityConf.label}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          
                          {task.context && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{task.context}</span>
                            </div>
                          )}
                          
                          {task.daysOverdue && (
                            <div className="flex items-center gap-1 text-xs text-orange-500 mb-3">
                              <Clock className="h-3 w-3" />
                              <span>{task.daysOverdue} days since last contact</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          {task.actionLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-accent/20">
          <p className="text-xs text-muted-foreground text-center">
            Tasks are generated by AI based on your interaction history, HCP data, and business priorities
          </p>
        </div>
      </div>
    </div>
  );
};