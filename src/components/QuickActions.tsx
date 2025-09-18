import { Button } from "@/components/ui/button";
import { Mic, Brain, FileText, Plus } from "lucide-react";

interface QuickActionsProps {
  onVoiceNote: () => void;
  onAskAI: () => void;
  onReports: () => void;
  onNewAction: () => void;
}

export const QuickActions = ({ onVoiceNote, onAskAI, onReports, onNewAction }: QuickActionsProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 bg-card/95 backdrop-blur-sm border border-border rounded-full px-4 py-3 shadow-floating">
        <Button
          variant="ghost"
          size="sm"
          onClick={onVoiceNote}
          className="rounded-full h-12 w-12 p-0 hover:bg-accent hover:text-accent-foreground"
        >
          <Mic className="h-5 w-5" />
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAskAI}
          className="rounded-full h-12 w-12 p-0 hover:bg-primary hover:text-primary-foreground group"
        >
          <Brain className="h-5 w-5 group-hover:scale-110 transition-transform" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReports}
          className="rounded-full h-12 w-12 p-0 hover:bg-accent hover:text-accent-foreground"
        >
          <FileText className="h-5 w-5" />
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <Button
          variant="default"
          size="sm"
          onClick={onNewAction}
          className="rounded-full h-12 w-12 p-0 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};