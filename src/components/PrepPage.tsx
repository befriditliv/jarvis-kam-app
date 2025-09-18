import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, User, MapPin, Calendar, Mic } from "lucide-react";

interface PrepPageProps {
  meetingId: string;
  onBack: () => void;
  onStartMeeting: () => void;
}

interface PrepItem {
  id: string;
  title: string;
  subtitle?: string;
  status: "pending" | "completed";
  action?: () => void;
}

const mockPrepItems: PrepItem[] = [
  {
    id: "1",
    title: "Review client history",
    subtitle: "Last interaction 2 weeks ago",
    status: "completed"
  },
  {
    id: "2", 
    title: "Check formulary status",
    subtitle: "Metro Health preferred access",
    status: "completed"
  },
  {
    id: "3",
    title: "Prepare key messages",
    subtitle: "CV protocol & adherence focus",
    status: "pending"
  },
  {
    id: "4",
    title: "Review clinical data",
    subtitle: "Latest trial results available",
    status: "pending"
  }
];

export const PrepPage = ({ meetingId, onBack, onStartMeeting }: PrepPageProps) => {
  const [prepItems, setPrepItems] = useState(mockPrepItems);
  const [isRecording, setIsRecording] = useState(false);

  const toggleItemStatus = (id: string) => {
    setPrepItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, status: item.status === "pending" ? "completed" : "pending" }
          : item
      )
    );
  };

  const completedItems = prepItems.filter(item => item.status === "completed").length;
  const totalItems = prepItems.length;
  const progress = (completedItems / totalItems) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-full p-2 hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Prepare</h1>
                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
              </div>
            </div>
            <Button 
              onClick={onStartMeeting}
              disabled={progress < 100}
              className="rounded-xl px-6 bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              Start Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-2xl mx-auto">
        {/* Meeting Info */}
        <div className="mb-8 p-6 bg-secondary/30 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Dr. Sarah Johnson</h2>
              <p className="text-muted-foreground">Cardiology • Metro Medical Center</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>9:00 AM • 45 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Conference Room B</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Preparation Progress</h3>
            <span className="text-sm text-muted-foreground">{completedItems}/{totalItems}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Prep Checklist */}
        <div className="space-y-3 mb-8">
          {prepItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItemStatus(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
                item.status === "completed" 
                  ? "border-primary/20 bg-primary-light" 
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  item.status === "completed"
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}>
                  {item.status === "completed" && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    item.status === "completed" ? "text-primary" : "text-foreground"
                  }`}>
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Notes */}
        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Voice Notes</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className={`rounded-xl ${isRecording ? "bg-destructive text-destructive-foreground" : ""}`}
            >
              <Mic className={`h-4 w-4 mr-2 ${isRecording ? "animate-pulse" : ""}`} />
              {isRecording ? "Stop" : "Record"}
            </Button>
          </div>
          
          {isRecording && (
            <div className="mb-4 p-3 bg-destructive-light rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <span className="text-sm text-destructive">Recording...</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="p-3 bg-accent rounded-lg">
              <p className="text-sm">Remember to discuss the new dosing schedule - Dr. Johnson mentioned patient compliance issues last time.</p>
              <span className="text-xs text-muted-foreground">2 minutes ago</span>
            </div>
          </div>
        </div>

        {/* Smart Insights */}
        <div className="mt-8 p-6 bg-primary-light rounded-xl border border-primary/10">
          <h3 className="font-medium text-primary mb-3">AI Insights</h3>
          <div className="space-y-3 text-sm">
            <p>Dr. Johnson has shown strong interest in patient adherence solutions based on previous interactions.</p>
            <p>Metro Medical Center recently updated their formulary - excellent opportunity to discuss expanded access.</p>
            <p>Consider mentioning the CARDIAC-ADVANCE trial results that were just published.</p>
          </div>
        </div>
      </div>
    </div>
  );
};