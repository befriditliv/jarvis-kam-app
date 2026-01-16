import { useState } from "react";
import { DailyOverviewApple } from "./DailyOverviewApple";
import { PrepPage } from "./PrepPage";
import { DebriefForm } from "./DebriefForm";
import { DebriefReview } from "./DebriefReview";
import { AIAssistant } from "./AIAssistant";
import { VoiceRecorder } from "./VoiceRecorder";
import { BottomNav } from "./BottomNav";

type AppView = "overview" | "prep" | "debrief" | "debrief-review" | "profile";
type BottomTab = "home" | "meetings" | "profile";

interface VoiceRecording {
  id: string;
  title: string;
  duration: number;
  transcription: string;
  timestamp: Date;
  tags: string[];
}

interface DebriefData {
  outcome: number;
  objectivesAchieved: string[];
  keyConcerns: boolean;
  hasInizioFollowUp: boolean;
  materialsShared: boolean;
  voiceNotes: string;
}

export const AppContainer = () => {
  const [currentView, setCurrentView] = useState<AppView>("overview");
  const [activeTab, setActiveTab] = useState<BottomTab>("home");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isVoiceRecorderOpen, setIsVoiceRecorderOpen] = useState(false);

  const handlePrepare = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView("prep");
  };

  const handleDebrief = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView("debrief");
  };

  const handleDebriefReview = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView("debrief-review");
  };

  const handleApproveDebrief = () => {
    console.log("Debrief approved and sent to IOengage");
    handleBackToOverview();
  };

  const handleStartMeeting = () => {
    if (selectedMeetingId) {
      setCurrentView("debrief");
    }
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedMeetingId(null);
  };

  const handleSaveDebrief = (data: DebriefData) => {
    console.log("Debrief saved:", data);
    handleBackToOverview();
  };

  const handleSaveVoiceRecording = (recording: VoiceRecording) => {
    console.log("Voice recording saved:", recording);
  };

  const handleVoiceNote = () => {
    setIsVoiceRecorderOpen(true);
  };

  const handleAskAI = () => {
    setIsAIOpen(true);
  };

  const handleTabChange = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      setCurrentView("overview");
      setSelectedMeetingId(null);
    } else if (tab === "profile") {
      setCurrentView("profile");
    }
  };

  // Check if we're in a sub-view (no bottom nav)
  const isSubView = currentView === "prep" || currentView === "debrief" || currentView === "debrief-review";

  if (currentView === "prep" && selectedMeetingId) {
    return (
      <PrepPage
        meetingId={selectedMeetingId}
        onBack={handleBackToOverview}
        onStartMeeting={handleStartMeeting}
      />
    );
  }

  if (currentView === "debrief" && selectedMeetingId) {
    return (
      <DebriefForm
        meetingId={selectedMeetingId}
        onBack={handleBackToOverview}
        onSave={handleSaveDebrief}
      />
    );
  }

  if (currentView === "debrief-review" && selectedMeetingId) {
    return (
      <DebriefReview
        meetingId={selectedMeetingId}
        onBack={handleBackToOverview}
        onApprove={handleApproveDebrief}
      />
    );
  }

  if (currentView === "profile") {
    return (
      <>
        <div className="min-h-screen bg-background pb-24">
          <div className="px-4 pt-12 pb-6">
            <h1 className="text-2xl font-bold text-foreground">Profil</h1>
            <p className="text-muted-foreground mt-1">Administrer din konto</p>
          </div>
          <div className="px-4 space-y-4">
            <div className="p-4 bg-card rounded-xl border border-border/40">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">JD</span>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">John Doe</h2>
                  <p className="text-sm text-muted-foreground">jdoe@novonordisk.com</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-border/40">
              <h3 className="font-semibold text-foreground mb-3">Indstillinger</h3>
              <div className="space-y-3">
                <button className="w-full text-left py-2 text-sm text-muted-foreground">Notifikationer</button>
                <button className="w-full text-left py-2 text-sm text-muted-foreground">Sprog</button>
                <button className="w-full text-left py-2 text-sm text-muted-foreground">Support</button>
                <button className="w-full text-left py-2 text-sm text-destructive">Log ud</button>
              </div>
            </div>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  return (
    <>
      <DailyOverviewApple
        onPrepare={handlePrepare}
        onDebrief={handleDebrief}
        onDebriefReview={handleDebriefReview}
        onVoiceNote={handleVoiceNote}
        onAskAI={handleAskAI}
        onReports={() => {}}
        onNewAction={() => {}}
        onIntelligence={() => {}}
      />
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      <AIAssistant 
        isOpen={isAIOpen} 
        onClose={() => setIsAIOpen(false)} 
      />
      
      <VoiceRecorder
        isOpen={isVoiceRecorderOpen}
        onClose={() => setIsVoiceRecorderOpen(false)}
        onSave={handleSaveVoiceRecording}
      />
    </>
  );
};
