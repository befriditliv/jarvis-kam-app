import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Mic, Lightbulb, AlertCircle, RotateCcw, FileText } from "lucide-react";
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
  const [phase, setPhase] = useState<'template' | 'debrief' | 'saved' | 'failed'>('template');
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

  const handleSaveDebrief = () => {
    const debriefData: DebriefData = {
      quickDebrief: template.quickDebrief,
      outcome: 0,
      objectivesAchieved: [],
      keyConcerns: template.hasObjections || false,
      hasInizioFollowUp: template.hasFollowUpTasks || false,
      materialsShared: template.materialsShared || false,
      voiceNotes
    };
    
    // Add to queue for syncing
    addToQueue(meetingId, debriefData);
    
    // Go to saved confirmation
    setPhase('saved');
  };

  const handleRetryDebrief = () => {
    setPhase('template');
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

        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Quick Debrief Options */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Quick options</p>
            <div className="flex flex-wrap gap-2">
              {quickDebriefOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTemplate(prev => ({ 
                    ...prev, 
                    quickDebrief: prev.quickDebrief === option.value ? undefined : option.value 
                  }))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    template.quickDebrief === option.value 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
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
                    onClick={handleSaveDebrief}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-xl px-8 py-3 text-base font-semibold"
                  >
                    <CheckCircle className="h-5 w-5 mr-3" />
                    Gem Debrief
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

  // Saved Confirmation Phase
  if (phase === 'saved') {
    return (
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl p-2 h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold text-foreground">Debrief</h1>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main Content - Centered success message */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center space-y-6 max-w-sm mx-auto">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Debrief gemt succesfuldt</h2>
              <p className="text-sm text-muted-foreground">
                Dit debrief behandles nu. Du får en notifikation, når det er klar til gennemgang.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom button */}
        <div className="px-6 pb-8">
          <Button 
            onClick={onBack}
            size="lg"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-2xl py-4 text-base font-semibold"
          >
            OK
          </Button>
        </div>
      </div>
    );
  }

  // Failed Phase
  if (phase === 'failed') {
    return (
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl p-2 h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Møde debrief</h1>
              <p className="text-xs text-muted-foreground">Dr. Sarah Johnson • 2026-01-16</p>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="px-6 pt-4 flex justify-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Fejlet
          </div>
        </div>

        {/* Debrief Card - Loading/Empty state */}
        <div className="px-6 py-4">
          <Card className="p-5 border-0 bg-muted/30 rounded-xl">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-3">Debrief</h3>
                <div className="h-1 w-8 bg-primary/40 rounded-full animate-pulse" />
              </div>
            </div>
          </Card>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom buttons */}
        <div className="px-6 pb-8 space-y-3">
          <Button 
            onClick={handleRetryDebrief}
            size="lg"
            className="w-full bg-destructive hover:bg-destructive/90 text-white rounded-2xl py-4 text-base font-semibold"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Redo Debrief
          </Button>
          <Button 
            onClick={onBack}
            variant="outline"
            size="lg"
            className="w-full rounded-2xl py-4 text-base font-medium border-2"
          >
            Tilbage
          </Button>
        </div>
      </div>
    );
  }

  // Debrief Phase - Simplified flow
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('template')}
            className="rounded-xl p-2 h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">Voice Debrief</h1>
            <p className="text-xs text-muted-foreground truncate">Dr. Sarah Johnson</p>
          </div>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {!isRecording ? (
          // Start state
          <div className="text-center space-y-8 max-w-sm mx-auto">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Ready to Debrief</h2>
              <p className="text-muted-foreground text-sm">
                Tap the button below to start recording. Jarvis will guide you through the debrief.
              </p>
            </div>
            
            <button
              onClick={handleVoiceRecording}
              className="w-28 h-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95"
            >
              <Mic className="h-10 w-10" />
            </button>
            
            <p className="text-xs text-muted-foreground">Tap to start recording</p>
          </div>
        ) : (
          // Recording state
          <div className="text-center space-y-8 max-w-sm mx-auto w-full">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <h2 className="text-xl font-semibold text-foreground">Recording...</h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Speak naturally about your meeting. Tap below when finished.
              </p>
            </div>

            {/* Recording visualization */}
            <div className="flex items-center justify-center gap-1 h-16">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 40}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                  }}
                />
              ))}
            </div>
            
            {/* Finish button - Primary action */}
            <button
              onClick={() => {
                setIsRecording(false);
                // Generate notes and save debrief
                const adaptivePrompt = generateAdaptivePrompt(template);
                setVoiceNotes(prev => prev + (prev ? "\n\n" : "") + adaptivePrompt);
                handleSaveDebrief();
              }}
              className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <CheckCircle className="h-5 w-5" />
              Afslut Debrief
            </button>
            
            <button
              onClick={() => setIsRecording(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};