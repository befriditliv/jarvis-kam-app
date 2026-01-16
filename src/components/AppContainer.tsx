import { useState } from "react";
import { DailyOverviewApple } from "./DailyOverviewApple";
import { PrepPage } from "./PrepPage";
import { DebriefForm } from "./DebriefForm";
import { DebriefReview } from "./DebriefReview";
import { AIAssistant } from "./AIAssistant";
import { BottomNav } from "./BottomNav";

type AppView = "overview" | "prep" | "debrief" | "debrief-review" | "profile";
type BottomTab = "home" | "jarvis" | "profile";

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
    setActiveTab("home");
  };

  const handleSaveDebrief = (data: DebriefData) => {
    console.log("Debrief saved:", data);
    handleBackToOverview();
  };

  const handleTabChange = (tab: BottomTab) => {
    setActiveTab(tab);
    if (tab === "home") {
      setCurrentView("overview");
      setSelectedMeetingId(null);
    } else if (tab === "jarvis") {
      setIsAIOpen(true);
    } else if (tab === "profile") {
      setCurrentView("profile");
    }
  };

  // Sub-views without bottom nav
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

  // Profile view
  if (currentView === "profile") {
    return (
      <>
        <div className="min-h-screen bg-background pb-20">
          <div className="px-4 pt-10 pb-6">
            <h1 className="text-2xl font-bold text-foreground">Profil</h1>
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
              <div className="space-y-3">
                <button className="w-full text-left py-3 text-sm text-foreground border-b border-border/30">Notifikationer</button>
                <button className="w-full text-left py-3 text-sm text-foreground border-b border-border/30">Support</button>
                <button className="w-full text-left py-3 text-sm text-destructive">Log ud</button>
              </div>
            </div>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  // Main overview
  return (
    <>
      <DailyOverviewApple
        onPrepare={handlePrepare}
        onDebrief={handleDebrief}
        onDebriefReview={handleDebriefReview}
        onVoiceNote={() => {}}
        onAskAI={() => setIsAIOpen(true)}
        onReports={() => {}}
        onNewAction={() => {}}
        onIntelligence={() => {}}
      />
      
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      
      <AIAssistant 
        isOpen={isAIOpen} 
        onClose={() => {
          setIsAIOpen(false);
          setActiveTab("home");
        }} 
      />
    </>
  );
};
