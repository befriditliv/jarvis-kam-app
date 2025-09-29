import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle, Star, Mic, Save, Send, Play, Settings } from "lucide-react";

interface DebriefFormProps {
  meetingId: string;
  onBack: () => void;
  onSave: (data: DebriefData) => void;
}

interface DebriefData {
  outcome: number;
  objectivesAchieved: string[];
  keyConcerns: boolean;
  hasInizioFollowUp: boolean;
  materialsShared: boolean;
  voiceNotes: string;
}

interface DebriefTemplate {
  outcome: number;
  objectives: string[];
  keyConcerns: boolean;
  hasInizioFollowUp: boolean;
  materialsShared: boolean;
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


export const DebriefForm = ({ meetingId, onBack, onSave }: DebriefFormProps) => {
  const [phase, setPhase] = useState<'template' | 'debrief'>('template');
  const [isRecording, setIsRecording] = useState(false);
  const [template, setTemplate] = useState<DebriefTemplate>({
    outcome: 3,
    objectives: [],
    keyConcerns: false,
    hasInizioFollowUp: false,
    materialsShared: false
  });
  const [voiceNotes, setVoiceNotes] = useState("");

  const toggleObjective = (objectiveTitle: string) => {
    setTemplate(prev => ({
      ...prev,
      objectives: prev.objectives.includes(objectiveTitle)
        ? prev.objectives.filter(obj => obj !== objectiveTitle)
        : [...prev.objectives, objectiveTitle]
    }));
  };


  const handleStartDebrief = () => {
    setPhase('debrief');
  };

  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate AI generating adaptive questions based on template
      setTimeout(() => {
        const adaptivePrompt = generateAdaptivePrompt(template);
        setVoiceNotes(prev => prev + (prev ? "\n\n" : "") + adaptivePrompt);
        setIsRecording(false);
      }, 2000);
    }
  };

  const generateAdaptivePrompt = (template: DebriefTemplate) => {
    let prompt = `AI: Based on your template, I have some targeted questions:\n\n`;
    
    if (template.outcome <= 2) {
      prompt += "• What specific challenges led to the lower outcome rating?\n";
    } else if (template.outcome >= 4) {
      prompt += "• What went particularly well that contributed to this excellent outcome?\n";
    }
    
    if (template.objectives.length > 0) {
      prompt += `• For the objectives you marked (${template.objectives.join(', ')}), tell me more about how they were achieved.\n`;
    }
    
    if (template.keyConcerns) {
      prompt += "• What were the specific concerns voiced by the client?\n";
    }
    
    if (template.materialsShared) {
      prompt += "• Tell me about the materials you shared or presented during the meeting.\n";
    }
    
    if (template.hasInizioFollowUp) {
      prompt += "• What specific follow-up actions need Inizio's involvement?\n";
    }
    
    prompt += "\nNow, please share your detailed thoughts about the meeting...";
    return prompt;
  };

  const handleSave = () => {
    const debriefData: DebriefData = {
      outcome: template.outcome,
      objectivesAchieved: template.objectives,
      keyConcerns: template.keyConcerns,
      hasInizioFollowUp: template.hasInizioFollowUp,
      materialsShared: template.materialsShared,
      voiceNotes
    };
    onSave(debriefData);
  };

  if (phase === 'template') {
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
                  <h1 className="text-xl font-semibold text-foreground">Quick Debrief Setup</h1>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Johnson • Set your template first</p>
                </div>
              </div>
              <Button 
                onClick={handleStartDebrief}
                disabled={template.objectives.length === 0}
                className="bg-gradient-primary hover:shadow-lg transition-all duration-300 rounded-xl"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Debrief
              </Button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Meeting Outcome */}
          <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Meeting Outcome</h3>
            <div className="grid grid-cols-5 gap-3">
              {outcomes.map((outcome) => (
                <div
                  key={outcome.value}
                  onClick={() => setTemplate(prev => ({ ...prev, outcome: outcome.value }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    template.outcome === outcome.value 
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

          {/* Objectives */}
          <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Select Achieved Objectives</h3>
            <div className="space-y-3">
              {mockObjectives.map((objective) => (
                <div
                  key={objective.id}
                  onClick={() => toggleObjective(objective.title)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    template.objectives.includes(objective.title)
                      ? "border-success/50 bg-success/5 hover:bg-success/10" 
                      : "border-border/50 hover:bg-secondary/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {template.objectives.includes(objective.title) ? (
                      <CheckCircle className="h-5 w-5 text-success animate-scale-in" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={`font-medium ${
                      template.objectives.includes(objective.title) ? "text-success" : "text-card-foreground"
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
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Any Key Concerns voiced?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={template.keyConcerns ? "default" : "outline"}
                onClick={() => setTemplate(prev => ({ ...prev, keyConcerns: true }))}
                className="h-16 rounded-xl text-lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Yes
              </Button>
              <Button
                variant={!template.keyConcerns ? "default" : "outline"}
                onClick={() => setTemplate(prev => ({ ...prev, keyConcerns: false }))}
                className="h-16 rounded-xl text-lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                No
              </Button>
            </div>
          </Card>

          {/* Materials Shared */}
          <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Materials shared or presented?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={template.materialsShared ? "default" : "outline"}
                onClick={() => setTemplate(prev => ({ ...prev, materialsShared: true }))}
                className="h-16 rounded-xl text-lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Yes
              </Button>
              <Button
                variant={!template.materialsShared ? "default" : "outline"}
                onClick={() => setTemplate(prev => ({ ...prev, materialsShared: false }))}
                className="h-16 rounded-xl text-lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                No
              </Button>
            </div>
          </Card>

          {/* Inizio Follow-up */}
          <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Follow-up Task for Inizio?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={template.hasInizioFollowUp ? "default" : "outline"}
                onClick={() => setTemplate(prev => ({ ...prev, hasInizioFollowUp: true }))}
                className="h-16 rounded-xl text-lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Yes
              </Button>
              <Button
                variant={!template.hasInizioFollowUp ? "default" : "outline"}
                onClick={() => setTemplate(prev => ({ ...prev, hasInizioFollowUp: false }))}
                className="h-16 rounded-xl text-lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                No
              </Button>
            </div>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            Select at least one objective to continue to the voice debrief
          </div>
        </div>
      </div>
    );
  }

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
                onClick={() => setPhase('template')}
                className="rounded-full p-2 hover:bg-secondary/80"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Voice Debrief</h1>
                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson • Adaptive interview mode</p>
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
        {/* Template Summary */}
        <Card className="p-4 bg-gradient-subtle border-primary/20 border">
          <h4 className="font-semibold text-sm mb-2 text-primary">Your Template Setup:</h4>
          <div className="text-xs space-y-1 text-muted-foreground">
            <div>Outcome: {outcomes.find(o => o.value === template.outcome)?.label} ({template.outcome}/5)</div>
            <div>Objectives: {template.objectives.length} selected</div>
            <div>Key Concerns: {template.keyConcerns ? 'Yes' : 'No'}</div>
            <div>Materials Shared: {template.materialsShared ? 'Yes' : 'No'}</div>
            <div>Inizio Follow-up: {template.hasInizioFollowUp ? 'Required' : 'Not needed'}</div>
          </div>
        </Card>

        {/* Voice Recording */}
        <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-card-foreground mb-2">Adaptive Voice Debrief</h3>
              <p className="text-muted-foreground">The AI will ask targeted questions based on your template</p>
            </div>
            
            <Button
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              onClick={handleVoiceRecording}
              className={`h-20 w-20 rounded-full text-lg transition-all duration-300 ${
                isRecording ? "animate-pulse-glow scale-110" : "hover:scale-105"
              }`}
            >
              <Mic className="h-8 w-8" />
            </Button>
            
            <div className="text-sm text-muted-foreground">
              {isRecording ? "Recording active - AI generating questions..." : "Tap to start your adaptive debrief"}
            </div>
          </div>
          
          {isRecording && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-3 h-3 bg-destructive rounded-full animate-bounce-gentle"></div>
                <span className="text-sm text-primary font-medium">AI preparing adaptive questions based on your template...</span>
              </div>
            </div>
          )}

          {voiceNotes && (
            <div className="mt-6">
              <Label className="text-sm font-medium mb-2 block">Conversation & Notes</Label>
              <Textarea
                value={voiceNotes}
                onChange={(e) => setVoiceNotes(e.target.value)}
                placeholder="Your adaptive debrief conversation will appear here..."
                className="min-h-[200px] resize-none border-border/50 focus:border-primary transition-colors"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};