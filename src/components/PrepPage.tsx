import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Clock, User, MapPin, Calendar, Play, FileText, TrendingUp, Globe, History, ChevronRight } from "lucide-react";
interface PrepPageProps {
  meetingId: string;
  onBack: () => void;
  onStartMeeting: () => void;
}
interface PrepSection {
  id: string;
  title: string;
  icon: any;
  items: PrepItem[];
}
interface PrepItem {
  id: string;
  title: string;
  subtitle: string;
  status?: "completed" | "pending";
}
const prepSections: PrepSection[] = [{
  id: "overview",
  title: "Overview",
  icon: FileText,
  items: [{
    id: "1",
    title: "Review client history",
    subtitle: "Last interaction 2 weeks ago"
  }, {
    id: "2",
    title: "Access Level Analysis",
    subtitle: "High access • Cardiology specialist"
  }]
}, {
  id: "recent",
  title: "Recent Meetings",
  icon: History,
  items: [{
    id: "3",
    title: "Q4 Review Meeting",
    subtitle: "Discussed patient adherence strategies"
  }, {
    id: "4",
    title: "Protocol Update Session",
    subtitle: "Positive feedback on new guidelines"
  }]
}, {
  id: "actions",
  title: "Next Best Actions",
  icon: TrendingUp,
  items: [{
    id: "5",
    title: "Prepare key messages",
    subtitle: "CV protocol & adherence focus"
  }, {
    id: "6",
    title: "Review clinical data",
    subtitle: "Latest trial results available"
  }]
}, {
  id: "digital",
  title: "Digital Engagements",
  icon: Globe,
  items: [{
    id: "7",
    title: "Check formulary status",
    subtitle: "Metro Health preferred access"
  }, {
    id: "8",
    title: "Portal Activity Review",
    subtitle: "Downloaded 3 studies this month"
  }]
}];

const sectionDescriptions = {
  overview: "General client information including employee count, HCP network, and organizational structure to help you understand the healthcare landscape.",
  recent: "Summary of the last couple of engagements with this client, including key discussion points, outcomes, and follow-up items from previous meetings.",
  actions: "Strategic recommendations and objectives tailored for this meeting, including key messages to deliver and specific goals to achieve.",
  digital: "Overview of client's digital platform engagement including newsletter open rates, customer platform signups, portal usage, and online interaction patterns."
};
export const PrepPage = ({
  meetingId,
  onBack,
  onStartMeeting
}: PrepPageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full p-2 hover:bg-accent">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Prepare</h1>
                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
              </div>
            </div>
            <Button onClick={onStartMeeting} className="rounded-xl px-6 bg-primary hover:bg-primary/90">
              Start Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-4xl mx-auto">
        {/* Meeting Info */}
        <div className="mb-8 p-6 bg-secondary/30 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Dr. Sarah Johnson</h2>
              <p className="text-muted-foreground">Cardiology • Metro Medical Center</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>9:00 AM • 45 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Conference Room B</span>
            </div>
          </div>
        </div>

        {/* Preparation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {prepSections.map(section => {
            const IconComponent = section.icon;
            return (
              <Sheet key={section.id}>
                <SheetTrigger asChild>
                  <Card className="p-0 border-0 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{section.title}</h3>
                          <p className="text-sm text-muted-foreground">Click to explore details</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </SheetTrigger>
                <SheetContent side="right" className="w-[400px] sm:w-[500px]">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      {section.title}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <p className="text-muted-foreground mb-6">{sectionDescriptions[section.id as keyof typeof sectionDescriptions]}</p>
                    <div className="space-y-4">
                      {section.items.map(item => (
                        <div key={item.id} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                          <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            );
          })}
        </div>

        {/* Audio Presentation */}
        <Card className="p-6 border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Audio Presentation</h3>
                <p className="text-sm text-muted-foreground">Listen to detailed client insights</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)} className={`rounded-xl ${isPlaying ? "bg-primary text-primary-foreground" : ""}`}>
              <Play className={`h-4 w-4 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
              {isPlaying ? "Pause" : "Play"}
            </Button>
          </div>
          
          {isPlaying && <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary">Playing client overview...</span>
              </div>
              <div className="mt-2 h-1 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-1/3 animate-pulse" />
              </div>
            </div>}
          
          <div className="space-y-3">
            
            
          </div>
        </Card>

        {/* Smart Insights */}
        <div className="mt-8 p-6 bg-primary-light rounded-xl border border-primary/10">
          <h3 className="font-medium text-primary mb-3">AI Insights</h3>
          <div className="space-y-3 text-sm">
            <p>Dr. Johnson has shown strong interest in patient adherence solutions based on previous interactions.</p>
            <p>Metro Medical Center recently updated their formulary - excellent opportunity to discuss expanded access.</p>
            <p>Consider mentioning the CARDIAC-ADVANCE trial results that were just published.</p>
          </div>
        </div>
      </div>
    </div>;
};