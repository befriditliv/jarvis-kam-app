import { Button } from "@/components/ui/button";
import { Mic, Brain, FileText, Plus, Zap } from "lucide-react";

interface QuickActionsProps {
  onVoiceNote: () => void;
  onAskAI: () => void;
  onReports: () => void;
  onNewAction: () => void;
  onIntelligence: () => void;
}

export const QuickActions = ({ onVoiceNote, onAskAI, onReports, onNewAction, onIntelligence }: QuickActionsProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl px-6 py-4 shadow-floating">
        <Button
          variant="ghost"
          size="sm"
          onClick={onVoiceNote}
          className="rounded-2xl h-14 w-14 p-0 hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-110"
        >
          <Mic className="h-5 w-5" />
        </Button>
        
        <div className="h-8 w-px bg-border/50" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAskAI}
          className="rounded-2xl h-14 w-14 p-0 hover:bg-primary/10 hover:text-primary group transition-all duration-200 hover:scale-110"
        >
          <Brain className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onIntelligence}
          className="rounded-2xl h-14 w-14 p-0 hover:bg-gradient-primary hover:text-white group transition-all duration-200 hover:scale-110"
        >
          <Zap className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReports}
          className="rounded-2xl h-14 w-14 p-0 hover:bg-accent/10 hover:text-accent transition-all duration-200 hover:scale-110"
        >
          <FileText className="h-6 w-6" />
        </Button>
        
        <div className="h-8 w-px bg-border/50" />
        
        <Button
          variant="default"
          size="sm"
          onClick={onNewAction}
          className="rounded-2xl h-14 w-14 p-0 bg-gradient-primary hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};