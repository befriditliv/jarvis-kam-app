import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Loader2, FileText, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";

interface HCPAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  hcpName: string;
  showBriefing?: boolean;
}

interface QuerySuggestion {
  id: string;
  text: string;
  category: "background" | "insights" | "strategy" | "clinical";
}

interface AIResponse {
  query: string;
  response: string;
  timestamp: Date;
  category: string;
  isBriefing?: boolean;
}

const getQuerySuggestions = (hcpName: string): QuerySuggestion[] => [
  {
    id: "1",
    text: `What are the key talking points for ${hcpName}?`,
    category: "insights"
  },
  {
    id: "2",
    text: `Show me ${hcpName}'s prescription history`,
    category: "background"
  },
  {
    id: "3",
    text: `What's the best engagement strategy for ${hcpName}?`,
    category: "strategy"
  },
  {
    id: "4",
    text: `Any recent clinical interests for ${hcpName}?`,
    category: "clinical"
  }
];

const categoryConfig = {
  background: {
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  insights: {
    icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  strategy: {
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  clinical: {
    icon: AlertCircle,
    color: "text-blue-600",
    bg: "bg-blue-600/10"
  }
};

export const HCPAssistant = ({ isOpen, onClose, hcpName, showBriefing = false }: HCPAssistantProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [hasSentBriefing, setHasSentBriefing] = useState(false);
  
  const querySuggestions = getQuerySuggestions(hcpName);

  // Auto-send briefing when opened with showBriefing
  useEffect(() => {
    if (showBriefing && isOpen && !hasSentBriefing && responses.length === 0) {
      setHasSentBriefing(true);
      setIsLoading(true);
      setTimeout(() => {
        const briefingResponse: AIResponse = {
          query: "",
          response: "",
          timestamp: new Date(),
          category: "insights",
          isBriefing: true
        };
        setResponses([briefingResponse]);
        setIsLoading(false);
      }, 1500);
    }
  }, [showBriefing, isOpen, hasSentBriefing, hcpName, responses.length]);

  const BriefingContent = ({ name }: { name: string }) => (
    <div className="text-sm text-card-foreground leading-relaxed space-y-3">
      <p>Metro Medical Center er en kardiologisk klinik med 12 specialister. {name} leder hjertesvigtklinikken.</p>
      
      <div>
        <p className="font-medium mb-1">Seneste møde (7. jan)</p>
        <p className="text-muted-foreground">Telefonopkald om Wegovy og patient-adherence. God dialog, ønsker opfølgning på CARDIAC-ADVANCE.</p>
      </div>

      <div>
        <p className="font-medium mb-1">Nøglepersoner</p>
        <ul className="text-muted-foreground space-y-0.5">
          <li>• {name} – Leder, hjertesvigt</li>
          <li>• Dr. Hansen – Diabetes, OPT IN</li>
        </ul>
      </div>

      <div>
        <p className="font-medium mb-1">Digitalt engagement</p>
        <ul className="text-muted-foreground space-y-0.5">
          <li>• 3/12 HCP'er har marketingtilladelse</li>
          <li>• Åbnet 3 nyhedsbreve (SGLT2)</li>
          <li>• Downloadet 2 whitepapers</li>
        </ul>
      </div>

      <p className="text-muted-foreground italic pt-1">Er der andet du vil vide?</p>
    </div>
  );

  const handleSendQuery = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      const mockResponse: AIResponse = {
        query: finalQuery,
        response: getAIResponse(finalQuery, hcpName),
        timestamp: new Date(),
        category: "insights"
      };
      setResponses(prev => [mockResponse, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const getAIResponse = (query: string, hcpName: string): string => {
    if (query.toLowerCase().includes("talking points") || query.toLowerCase().includes("key")) {
      return `For ${hcpName}, focus on: 1) New cardiovascular outcomes data showing 25% risk reduction, 2) Simplified dosing schedule improving patient adherence by 40%, 3) Recent formulary approval at their institution. They've expressed interest in patient compliance solutions in previous meetings.`;
    }
    if (query.toLowerCase().includes("prescription history") || query.toLowerCase().includes("history")) {
      return `${hcpName} has written 127 prescriptions in the last 12 months, showing a 15% increase quarter-over-quarter. Peak activity in Q2 2024. Strong preference for combination therapy approaches. Average patient age 55-70.`;
    }
    if (query.toLowerCase().includes("engagement strategy") || query.toLowerCase().includes("strategy")) {
      return `Best approach for ${hcpName}: Schedule 30-45 minute meetings focusing on clinical data and patient outcomes. They respond well to case studies and real-world evidence. Follow up within 2 weeks with relevant research papers. Avoid heavy promotional content.`;
    }
    if (query.toLowerCase().includes("clinical interests") || query.toLowerCase().includes("interests")) {
      return `${hcpName} recently attended the ACC conference and showed interest in heart failure prevention strategies. They've downloaded 3 whitepapers on SGLT2 inhibitors and requested information on our CARDIAC-ADVANCE trial. Consider discussing our upcoming Phase 3 results.`;
    }
    return `Based on ${hcpName}'s profile and recent activity, I recommend focusing on value-based outcomes and patient quality of life improvements. Their practice shows strong alignment with evidence-based medicine approaches.`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-xl border-l border-border">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">Ask Jarvis about {hcpName}</h2>
                  <p className="text-sm text-muted-foreground">HCP-specific insights and recommendations</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                ×
              </Button>
            </div>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {responses.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-card-foreground mb-2">Ask about {hcpName}</h3>
                <p className="text-sm text-muted-foreground mb-6">Get personalized insights and recommendations</p>
                
                {/* Quick Query Suggestions */}
                <div className="space-y-2 max-w-sm mx-auto">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick suggestions</p>
                  {querySuggestions.map((suggestion) => {
                    const config = categoryConfig[suggestion.category];
                    const Icon = config.icon;
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSendQuery(suggestion.text)}
                        className="w-full p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-all duration-200 group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-md ${config.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                          </div>
                          <p className="text-sm text-card-foreground">{suggestion.text}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isLoading && (
              <Card className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing {hcpName}'s profile...</span>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="space-y-3 animate-slide-up">
                  {/* User Query - hide for briefings */}
                  {!response.isBriefing && response.query && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] p-3 bg-primary text-primary-foreground rounded-2xl rounded-br-sm">
                        <p className="text-sm">{response.query}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Response */}
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        {response.isBriefing ? (
                          <BriefingContent name={hcpName} />
                        ) : (
                          <p className="text-sm text-card-foreground leading-relaxed">{response.response}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          {response.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Ask about ${hcpName}...`}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                className="flex-1 rounded-xl border-border/50 focus:border-primary bg-background"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendQuery()}
                disabled={!query.trim() || isLoading}
                size="sm"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
