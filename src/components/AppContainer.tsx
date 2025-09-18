import { useState } from "react";
import { DailyOverview } from "./DailyOverviewApple";
import { PrepPage } from "./PrepPage";
import { DebriefForm } from "./DebriefForm";
import { AIAssistant } from "./AIAssistant";
import { VoiceRecorder } from "./VoiceRecorder";

type AppView = "overview" | "prep" | "debrief";

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
  keyConcerns: string[];
  nextSteps: string;
  notes: string;
}

export const AppContainer = () => {
  const [currentView, setCurrentView] = useState<AppView>("overview");
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

  const handleStartMeeting = () => {
    // Simulate meeting in progress, then go to debrief
    setTimeout(() => {
      setCurrentView("debrief");
    }, 1000);
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedMeetingId(null);
  };

  const handleSaveDebrief = (data: DebriefData) => {
    console.log("Debrief saved:", data);
    // Here you would save to database/API
    handleBackToOverview();
  };

  const handleSaveVoiceRecording = (recording: VoiceRecording) => {
    console.log("Voice recording saved:", recording);
    // Here you would save to database/API
  };

  const handleVoiceNote = () => {
    setIsVoiceRecorderOpen(true);
  };

  const handleAskAI = () => {
    setIsAIOpen(true);
  };

  const handleReports = () => {
    console.log("Opening reports modal");
    // TODO: Implement reports modal
  };

  const handleNewAction = () => {
    console.log("Creating new action");
    // TODO: Implement new action creation
  };

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

  return (
    <>
      <DailyOverview
        onPrepare={handlePrepare}
        onDebrief={handleDebrief}
        onVoiceNote={handleVoiceNote}
        onAskAI={handleAskAI}
        onReports={handleReports}
        onNewAction={handleNewAction}
      />
      
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