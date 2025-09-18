import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Loader2, TrendingUp, Users, Calendar, Building } from "lucide-react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuerySuggestion {
  id: string;
  text: string;
  category: "insights" | "trends" | "competitive" | "clinical";
}

interface AIResponse {
  query: string;
  response: string;
  timestamp: Date;
  category: string;
}

const querySuggestions: QuerySuggestion[] = [
  {
    id: "1",
    text: "Show adoption trends in oncology at City Medical Center",
    category: "trends"
  },
  {
    id: "2", 
    text: "Compare our CV portfolio vs competitors this quarter",
    category: "competitive"
  },
  {
    id: "3",
    text: "What clinical trials are relevant for Dr. Johnson?",
    category: "clinical"
  },
  {
    id: "4",
    text: "Identify high-potential HCPs in cardiology",
    category: "insights"
  }
];

const categoryConfig = {
  insights: { icon: Brain, color: "text-primary", bg: "bg-primary/10" },
  trends: { icon: TrendingUp, color: "text-accent", bg: "bg-accent/10" },
  competitive: { icon: Users, color: "text-warning", bg: "bg-warning/10" },
  clinical: { icon: Calendar, color: "text-success", bg: "bg-success/10" }
};

export const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);

  const handleSendQuery = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      const mockResponse: AIResponse = {
        query: finalQuery,
        response: getAIResponse(finalQuery),
        timestamp: new Date(),
        category: "insights"
      };
      
      setResponses(prev => [mockResponse, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const getAIResponse = (query: string): string => {
    if (query.toLowerCase().includes("adoption trends")) {
      return "Oncology adoption at City Medical Center shows 23% increase in Q4. Key drivers: improved formulary access and positive physician feedback on efficacy. Dr. Chen and Dr. Martinez are top adopters with 45+ prescriptions each.";
    }
    if (query.toLowerCase().includes("competitors")) {
      return "CV portfolio performing well vs competitors. Market share up 8% this quarter. Key advantage: superior patient adherence due to simplified dosing. Competitor X losing ground due to recent safety concerns.";
    }
    if (query.toLowerCase().includes("clinical trials")) {
      return "3 relevant trials for Dr. Johnson: CARDIAC-ADVANCE (cardiovascular outcomes), ADHERENCE-PLUS (patient compliance study), and SAFETY-FIRST (long-term safety data). All show positive preliminary results.";
    }
    return "Based on current data analysis, I recommend focusing on value-based care discussions and patient outcome improvements. The data shows strong correlation between engagement frequency and prescription growth.";
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
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">AI Assistant</h2>
                  <p className="text-sm text-muted-foreground">Ask anything about your data</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
                ×
              </Button>
            </div>
          </div>

          {/* Query Suggestions */}
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-medium text-card-foreground mb-3">Quick Queries</h3>
            <div className="space-y-2">
              {querySuggestions.map((suggestion) => {
                const config = categoryConfig[suggestion.category];
                const Icon = config.icon;
                
                return (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSendQuery(suggestion.text)}
                    className="p-3 rounded-lg border border-border/50 hover:bg-secondary/30 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${config.bg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>
                      <p className="text-sm text-card-foreground leading-relaxed">{suggestion.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Response History */}
          <div className="flex-1 overflow-y-auto p-4">
            {responses.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Ask a question to get started</p>
              </div>
            )}

            {isLoading && (
              <Card className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is analyzing your request...</span>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="space-y-3 animate-slide-up">
                  {/* User Query */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] p-3 bg-primary text-primary-foreground rounded-2xl rounded-br-sm">
                      <p className="text-sm">{response.query}</p>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-card-foreground leading-relaxed">{response.response}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {response.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about trends, competitors, clinical data..."
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                className="flex-1 rounded-xl border-border/50 focus:border-primary"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendQuery()}
                disabled={!query.trim() || isLoading}
                className="rounded-xl bg-gradient-primary hover:shadow-lg"
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