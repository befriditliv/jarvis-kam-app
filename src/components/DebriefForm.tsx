import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, XCircle, Star, Mic, Save, Send } from "lucide-react";

interface DebriefFormProps {
  meetingId: string;
  onBack: () => void;
  onSave: (data: DebriefData) => void;
}

interface DebriefData {
  outcome: number;
  objectivesAchieved: string[];
  keyConcerns: string[];
  nextSteps: string;
  notes: string;
}

interface Objective {
  id: string;
  title: string;
  achieved: boolean;
}

const mockObjectives: Objective[] = [
  { id: "1", title: "Introduce CV Protocol Update", achieved: false },
  { id: "2", title: "Discuss Adherence Solutions", achieved: false },
  { id: "3", title: "Schedule Follow-up", achieved: false }
];

const outcomes = [
  { value: 1, label: "Poor", color: "text-destructive", bgColor: "bg-destructive/10" },
  { value: 2, label: "Below Expected", color: "text-warning", bgColor: "bg-warning/10" },
  { value: 3, label: "Good", color: "text-info", bgColor: "bg-info/10" },
  { value: 4, label: "Very Good", color: "text-accent", bgColor: "bg-accent/10" },
  { value: 5, label: "Excellent", color: "text-success", bgColor: "bg-success/10" }
];

const suggestedConcerns = [
  "Budget constraints mentioned",
  "Competing priorities this quarter",
  "Need more clinical evidence",
  "Timeline concerns for implementation",
  "Staff training requirements"
];

export const DebriefForm = ({ meetingId, onBack, onSave }: DebriefFormProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [objectives, setObjectives] = useState(mockObjectives);
  const [selectedOutcome, setSelectedOutcome] = useState<number>(3);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [nextSteps, setNextSteps] = useState("");
  const [notes, setNotes] = useState("");

  const toggleObjective = (id: string) => {
    setObjectives(prev => 
      prev.map(obj => 
        obj.id === id ? { ...obj, achieved: !obj.achieved } : obj
      )
    );
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording logic
    if (!isRecording) {
      // Simulate AI transcription after 3 seconds
      setTimeout(() => {
        setNotes(prev => prev + (prev ? "\n\n" : "") + 
          "Meeting went very well. Dr. Johnson was receptive to the new protocol and asked thoughtful questions about implementation timeline. She expressed interest in participating in our upcoming clinical study."
        );
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSave = () => {
    const debriefData: DebriefData = {
      outcome: selectedOutcome,
      objectivesAchieved: objectives.filter(obj => obj.achieved).map(obj => obj.title),
      keyConcerns: selectedConcerns,
      nextSteps,
      notes
    };
    onSave(debriefData);
  };

  return (
    <div className="min-h-screen bg-gradient-surface animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-full p-2 hover:bg-secondary/80"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Meeting Debrief</h1>
                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson • Completed</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleSave}
                className="rounded-xl"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-gradient-primary hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Outcome Rating */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Meeting Outcome</h3>
          <div className="grid grid-cols-5 gap-3">
            {outcomes.map((outcome) => (
              <div
                key={outcome.value}
                onClick={() => setSelectedOutcome(outcome.value)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedOutcome === outcome.value 
                    ? `border-primary ${outcome.bgColor} scale-105 shadow-lg` 
                    : "border-border/50 hover:border-border"
                }`}
              >
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${outcome.color}`}>
                    {outcome.value}
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">
                    {outcome.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Objectives Achieved */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Objectives Achieved</h3>
          <div className="space-y-3">
            {objectives.map((objective) => (
              <div
                key={objective.id}
                onClick={() => toggleObjective(objective.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  objective.achieved 
                    ? "border-success/50 bg-success/5 hover:bg-success/10" 
                    : "border-border/50 hover:bg-secondary/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {objective.achieved ? (
                    <CheckCircle className="h-5 w-5 text-success animate-scale-in" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={`font-medium ${
                    objective.achieved ? "text-success" : "text-card-foreground"
                  }`}>
                    {objective.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Key Concerns */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Key Concerns Raised</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedConcerns.map((concern) => (
              <Badge
                key={concern}
                variant={selectedConcerns.includes(concern) ? "default" : "outline"}
                onClick={() => toggleConcern(concern)}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                {concern}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Next Steps</h3>
          <Textarea
            value={nextSteps}
            onChange={(e) => setNextSteps(e.target.value)}
            placeholder="What are the agreed next actions and timelines?"
            className="min-h-[100px] resize-none border-border/50 focus:border-primary transition-colors"
          />
        </Card>

        {/* Voice Notes */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">Meeting Notes</h3>
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={handleVoiceRecording}
              className={`rounded-full transition-all duration-300 ${
                isRecording ? "animate-pulse-glow" : ""
              }`}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isRecording ? "Stop Recording" : "Voice Note"}
            </Button>
          </div>
          
          {isRecording && (
            <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-destructive rounded-full animate-bounce-gentle"></div>
                <span className="text-sm text-primary font-medium">Recording... AI transcription active</span>
              </div>
            </div>
          )}

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes and observations from the meeting..."
            className="min-h-[150px] resize-none border-border/50 focus:border-primary transition-colors"
          />
        </Card>
      </div>
    </div>
  );
};