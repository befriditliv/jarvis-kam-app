import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Edit3, Send, User, Calendar, MapPin, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DebriefReviewProps {
  meetingId: string;
  onBack: () => void;
  onApprove: () => void;
}

// Mock data for the debrief
const mockDebriefData = {
  meeting: {
    hcpName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    date: "16. januar 2026",
    time: "9:00",
    location: "Metro Medical Center"
  },
  summary: "Produktivt møde om nye kardiovaskulære protokolopdateringer.",
  keyPoints: [
    "Dr. Johnson viste stærk interesse i den opdaterede CV-protokol",
    "Diskuterede forenklet dosisplan som kan forbedre patientens compliance",
    "Ca. 40% af hendes nuværende CV-patienter kæmper med den nuværende kompleksitet",
    "Klinisk forsøgsdata viser 23% forbedring i adherence-rater"
  ],
  concerns: [
    "Spørgsmål om refusionsveje for de nye overvågningsenheder"
  ],
  followUp: [
    "Pilot-implementering med 20 patienter starter næste måned",
    "Opfølgningsmøde planlagt om 6 uger"
  ],
  materialsShared: [
    "Ny protokoldokumentation",
    "Patientuddannelsesmaterialer"
  ]
};

export const DebriefReview = ({ meetingId, onBack, onApprove }: DebriefReviewProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(mockDebriefData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Debrief sendt",
      description: "Dit debrief er nu sendt til IOengage",
    });
    
    setIsSubmitting(false);
    onApprove();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border/30">
        <div className="px-4 sm:px-6 py-4">
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
              <h1 className="text-lg font-semibold text-foreground">Gennemse Debrief</h1>
              <p className="text-xs text-muted-foreground">{notes.meeting.hcpName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="px-6 pt-4 flex justify-end">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
          <CheckCircle className="h-4 w-4" />
          Klar til godkendelse
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 space-y-4 overflow-y-auto">
        {/* Summary */}
        <Card className="p-4 border-0 bg-card rounded-xl">
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Sammenfatning
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notes.summary}
          </p>
        </Card>

        {/* Key Points */}
        <Card className="p-4 border-0 bg-card rounded-xl">
          <h3 className="font-semibold text-foreground mb-3">Vigtigste punkter</h3>
          <ul className="space-y-2">
            {notes.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Concerns */}
        {notes.concerns.length > 0 && (
          <Card className="p-4 border-0 bg-amber-50 dark:bg-amber-950/20 rounded-xl">
            <h3 className="font-semibold text-foreground mb-3">Bekymringer / Indvendinger</h3>
            <ul className="space-y-2">
              {notes.concerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Follow-up */}
        <Card className="p-4 border-0 bg-card rounded-xl">
          <h3 className="font-semibold text-foreground mb-3">Opfølgning</h3>
          <ul className="space-y-2">
            {notes.followUp.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Materials Shared */}
        {notes.materialsShared.length > 0 && (
          <Card className="p-4 border-0 bg-card rounded-xl">
            <h3 className="font-semibold text-foreground mb-3">Delte materialer</h3>
            <div className="flex flex-wrap gap-2">
              {notes.materialsShared.map((material, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-muted/50 text-muted-foreground text-xs rounded-lg"
                >
                  {material}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom action buttons */}
      <div className="px-6 pb-8 pt-4 space-y-3 bg-background border-t border-border/30">
        <Button 
          onClick={handleApprove}
          disabled={isSubmitting}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-4 text-base font-semibold disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Sender...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Godkend & Send til IOengage
            </>
          )}
        </Button>
        <Button 
          onClick={() => setIsEditing(true)}
          variant="outline"
          size="lg"
          className="w-full rounded-2xl py-4 text-base font-medium border-2"
        >
          <Edit3 className="h-5 w-5 mr-2" />
          Rediger noter
        </Button>
      </div>
    </div>
  );
};
