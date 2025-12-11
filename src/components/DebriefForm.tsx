import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, XCircle, Star, Mic, Save, Send, Play, Settings, Lightbulb } from "lucide-react";
import { useDebriefQueue } from "@/hooks/useDebriefQueue";
import { SyncStatus } from "./SyncStatus";

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
  hasObjections: boolean | undefined;
  materialsShared: boolean | undefined;
  hasFollowUpTasks: boolean | undefined;
  newMeetingScheduled: boolean | undefined;
}

const quickDebriefOptions = [
  { value: "meeting-cancelled", label: "Meeting Cancelled" },
  { value: "material-handover", label: "Debrief Not Relevant" }
];


export const DebriefForm = ({ meetingId, onBack, onSave }: DebriefFormProps) => {
  const { addToQueue } = useDebriefQueue();
  const [phase, setPhase] = useState<'template' | 'debrief' | 'preview'>('template');
  const [isRecording, setIsRecording] = useState(false);
  const [template, setTemplate] = useState<DebriefTemplate>({
    quickDebrief: undefined,
    hasObjections: undefined,
    materialsShared: undefined,
    hasFollowUpTasks: undefined,
    newMeetingScheduled: undefined
  });
  const [voiceNotes, setVoiceNotes] = useState("");


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
    
    if (template.hasObjections) {
      prompt += "• What were the specific objections raised by the client?\n";
    }
    
    if (template.materialsShared) {
      prompt += "• Tell me about the materials you shared or presented during the meeting.\n";
    }
    
    if (template.hasFollowUpTasks) {
      prompt += "• What specific follow-up tasks were identified?\n";
    }
    
    if (template.newMeetingScheduled) {
      prompt += "• When is the new meeting scheduled and what's the agenda?\n";
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
      outcome: 0, // Not used anymore but keeping for compatibility
      objectivesAchieved: [],
      keyConcerns: template.hasObjections || false,
      hasInizioFollowUp: template.hasFollowUpTasks || false,
      materialsShared: template.materialsShared || false,
      voiceNotes
    };
    
    // Add to queue for syncing
    addToQueue(meetingId, debriefData);
    
    // Call onSave callback
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
              <SyncStatus />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Quick Debrief Options - Less Prominent */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground mb-3">Quick option (if applicable)</p>
            <div className="flex gap-3">
              {quickDebriefOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={template.quickDebrief === option.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setTemplate(prev => ({ ...prev, quickDebrief: option.value }))}
                  className="rounded-lg text-sm font-medium"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Conditional rendering based on quick debrief selection */}
          {template.quickDebrief ? (
            <div className="space-y-4">
              <Card className="p-6 bg-gradient-subtle border-primary/20 border">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-lg mb-2 text-primary">Quick Debrief Selected</h4>
                  <p className="text-muted-foreground mb-6">
                    {quickDebriefOptions.find(o => o.value === template.quickDebrief)?.label}
                  </p>
                  <Button 
                    onClick={handleSave}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-xl px-8 py-3 text-base font-semibold"
                  >
                    <Send className="h-5 w-5 mr-3" />
                    Submit Debrief
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <>
              {/* Tips & Best Practices Info Box */}
              <Card className="p-6 shadow-card border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-card-foreground mb-3">Tips for a Great Debrief</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Be specific about key discussion points and outcomes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Note any objections or concerns raised during the meeting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Capture action items and follow-up commitments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Record any materials shared or requested</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Include relevant context for future reference</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="text-center pt-2">
                <Button 
                  onClick={handleStartDebrief}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-xl px-8 py-3 text-base font-semibold"
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