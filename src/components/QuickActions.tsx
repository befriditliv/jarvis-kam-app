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
    <div className="w-full">
      {/* Mobile Action Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button
          variant="outline"
          onClick={onVoiceNote}
          className="h-16 touch-target rounded-xl border-border/30 bg-card/80 backdrop-blur-sm hover:bg-accent/10 transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 group-hover:from-accent/20 group-hover:to-accent/10 transition-all">
              <Mic className="h-5 w-5 text-accent" />
            </div>
            <span className="text-mobile-xs font-medium">Voice Note</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          onClick={onAskAI}
          className="h-16 touch-target rounded-xl border-border/30 bg-card/80 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <span className="text-mobile-xs font-medium">Ask AI</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          onClick={onIntelligence}
          className="h-16 touch-target rounded-xl border-border/30 bg-card/80 backdrop-blur-sm hover:bg-secondary/10 transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-gradient-to-r from-secondary/10 to-secondary/5 group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all">
              <Zap className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-mobile-xs font-medium">Intelligence</span>
          </div>
        </Button>
        
        <Button
          variant="outline"
          onClick={onReports}
          className="h-16 touch-target rounded-xl border-border/30 bg-card/80 backdrop-blur-sm hover:bg-muted/50 transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-gradient-to-r from-muted/20 to-muted/10 group-hover:from-muted/30 group-hover:to-muted/20 transition-all">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-mobile-xs font-medium">Reports</span>
          </div>
        </Button>
      </div>
      
      {/* Primary Action Button */}
      <Button
        onClick={onNewAction}
        className="w-full h-14 touch-target rounded-xl bg-gradient-to-r from-primary to-secondary shadow-mobile-card hover:shadow-lg text-white font-semibold text-mobile-base transition-all duration-300 hover:scale-105"
      >
        <Plus className="h-5 w-5 mr-2" />
        New Action
      </Button>
    </div>
  );
};