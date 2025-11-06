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
  quickDebrief?: string;
  outcome: number;
  objectivesAchieved: string[];
  keyConcerns: boolean;
  hasInizioFollowUp: boolean;
  materialsShared: boolean;
  voiceNotes: string;
}

interface DebriefTemplate {
  quickDebrief?: string;
  outcome: number;
  objectives: string[];
  keyConcerns: boolean | undefined;
  hasInizioFollowUp: boolean | undefined;
  materialsShared: boolean | undefined;
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

const quickDebriefOptions = [
  { value: "meeting-cancelled", label: "Meeting Cancelled" },
  { value: "material-handover", label: "Material handover" },
  { value: "agreed-call-3", label: "Agreed to call in 3 months" },
  { value: "agreed-call-6", label: "Agreed to call in 6 months" }
];


export const DebriefForm = ({ meetingId, onBack, onSave }: DebriefFormProps) => {
  const [phase, setPhase] = useState<'template' | 'debrief' | 'preview'>('template');
  const [isRecording, setIsRecording] = useState(false);
  const [template, setTemplate] = useState<DebriefTemplate>({
    quickDebrief: undefined,
    outcome: 0,
    objectives: [],
    keyConcerns: undefined,
    hasInizioFollowUp: undefined,
    materialsShared: undefined
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
    setPhase('preview');
  };

  const handleFinalSubmit = () => {
    const debriefData: DebriefData = {
      quickDebrief: template.quickDebrief,
      outcome: template.outcome,
      objectivesAchieved: template.objectives,
      keyConcerns: template.keyConcerns || false,
      hasInizioFollowUp: template.hasInizioFollowUp || false,
      materialsShared: template.materialsShared || false,
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
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Quick Debrief Options */}
          <Card className="p-4 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
            <h3 className="text-base font-semibold text-card-foreground mb-3">Quick Debrief Option</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickDebriefOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={template.quickDebrief === option.value ? "default" : "outline"}
                  onClick={() => setTemplate(prev => ({ ...prev, quickDebrief: option.value }))}
                  className="h-12 rounded-lg text-sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Conditional rendering based on quick debrief selection */}
          {template.quickDebrief ? (
            <div className="text-center space-y-4">
              <Card className="p-6 bg-gradient-subtle border-primary/20 border">
                <div className="text-center">
                  <h4 className="font-semibold text-lg mb-2 text-primary">Quick Debrief Selected</h4>
                  <p className="text-muted-foreground mb-4">
                    {quickDebriefOptions.find(o => o.value === template.quickDebrief)?.label}
                  </p>
                  <Button 
                    onClick={handleSave}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-lg px-8 py-3 text-base font-semibold"
                  >
                    <Send className="h-5 w-5 mr-3" />
                    Submit Debrief
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <>
              {/* Meeting Outcome */}
              <Card className="p-4 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-card-foreground mb-3">Meeting Outcome</h3>
                <div className="grid grid-cols-5 gap-2">
                  {outcomes.map((outcome) => (
                    <div
                      key={outcome.value}
                      onClick={() => setTemplate(prev => ({ ...prev, outcome: outcome.value }))}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        template.outcome === outcome.value 
                          ? `border-primary ${outcome.bgColor} scale-105 shadow-lg` 
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-xl font-bold mb-1 ${outcome.color}`}>
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
              <Card className="p-4 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-card-foreground mb-3">Select Achieved Objectives</h3>
                <div className="space-y-2">
                  {mockObjectives.map((objective) => (
                    <div
                      key={objective.id}
                      onClick={() => toggleObjective(objective.title)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
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
              <Card className="p-4 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-card-foreground mb-3">Any Key Concerns voiced?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={template.keyConcerns === true ? "default" : "outline"}
                    onClick={() => setTemplate(prev => ({ ...prev, keyConcerns: true }))}
                    className="h-12 rounded-lg text-base"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant={template.keyConcerns === false ? "default" : "outline"}
                    onClick={() => setTemplate(prev => ({ ...prev, keyConcerns: false }))}
                    className="h-12 rounded-lg text-base"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    No
                  </Button>
                </div>
              </Card>

              {/* Materials Shared */}
              <Card className="p-4 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-card-foreground mb-3">Materials shared or presented?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={template.materialsShared === true ? "default" : "outline"}
                    onClick={() => setTemplate(prev => ({ ...prev, materialsShared: true }))}
                    className="h-12 rounded-lg text-base"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant={template.materialsShared === false ? "default" : "outline"}
                    onClick={() => setTemplate(prev => ({ ...prev, materialsShared: false }))}
                    className="h-12 rounded-lg text-base"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    No
                  </Button>
                </div>
              </Card>

              {/* Inizio Follow-up */}
              <Card className="p-4 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
                <h3 className="text-base font-semibold text-card-foreground mb-3">Follow-up Task for Inizio?</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={template.hasInizioFollowUp === true ? "default" : "outline"}
                    onClick={() => setTemplate(prev => ({ ...prev, hasInizioFollowUp: true }))}
                    className="h-12 rounded-lg text-base"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Yes
                  </Button>
                  <Button
                    variant={template.hasInizioFollowUp === false ? "default" : "outline"}
                    onClick={() => setTemplate(prev => ({ ...prev, hasInizioFollowUp: false }))}
                    className="h-12 rounded-lg text-base"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    No
                  </Button>
                </div>
              </Card>

              <div className="text-center">
                <Button 
                  onClick={handleStartDebrief}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-lg px-6 py-3 text-base font-semibold"
                >
                  <Mic className="h-5 w-5 mr-3" />
                  Start Voice Debrief
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Preview Phase
  if (phase === 'preview') {
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
                  <h1 className="text-xl font-semibold text-foreground">Debrief Preview</h1>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Johnson • Review before submitting</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Notes Preview Card */}
          <Card className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Meeting Notes</h3>
            
            {/* Meeting Summary */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Outcome: {outcomes.find(o => o.value === template.outcome)?.label || 'Not rated'}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {template.objectives.length} objectives achieved
                </Badge>
              </div>
            </div>

            {/* Detailed Notes */}
            <div className="prose prose-sm max-w-none">
              <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                <p className="text-foreground mb-3">
                  Meeting went very well with Dr. Sarah Johnson. We had a productive discussion about the new cardiovascular protocol updates and their potential impact on patient adherence rates in her practice.
                </p>
                <p className="text-foreground mb-3">
                  Dr. Johnson expressed strong interest in implementing the updated CV protocol, particularly the simplified dosing schedule which she believes will significantly improve patient compliance. She mentioned that approximately 40% of her current CV patients struggle with the current regimen complexity.
                </p>
                <p className="text-foreground mb-3">
                  Key discussion points included the recent clinical trial data showing 23% improvement in adherence rates, the new patient education materials, and the digital monitoring tools that integrate with her existing EHR system.
                </p>
                <p className="text-foreground mb-3">
                  Dr. Johnson raised concerns about reimbursement pathways for the new monitoring devices but was satisfied with the coverage information provided. She requested additional materials for her nursing staff and agreed to a pilot implementation with 20 patients starting next month.
                </p>
                <p className="text-foreground">
                  Follow-up scheduled for 6 weeks to review initial patient feedback and discuss expansion to her full CV patient panel of approximately 150 patients.
                </p>
              </div>
            </div>

          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pb-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setPhase('debrief')}
              className="rounded-xl px-8"
            >
              Edit Notes
            </Button>
            <Button
              variant="default"
              size="lg"
              onClick={handleFinalSubmit}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8 shadow-lg"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit to IOengage
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Debrief Phase
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
            <div>Quick Debrief: {template.quickDebrief ? quickDebriefOptions.find(o => o.value === template.quickDebrief)?.label : 'None selected'}</div>
            <div>Outcome: {template.outcome > 0 ? `${outcomes.find(o => o.value === template.outcome)?.label} (${template.outcome}/5)` : 'Not selected'}</div>
            <div>Objectives: {template.objectives.length} selected</div>
            <div>Key Concerns: {template.keyConcerns === undefined ? 'Not selected' : template.keyConcerns ? 'Yes' : 'No'}</div>
            <div>Materials Shared: {template.materialsShared === undefined ? 'Not selected' : template.materialsShared ? 'Yes' : 'No'}</div>
            <div>Inizio Follow-up: {template.hasInizioFollowUp === undefined ? 'Not selected' : template.hasInizioFollowUp ? 'Required' : 'Not needed'}</div>
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