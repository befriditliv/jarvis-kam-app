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
const querySuggestions: QuerySuggestion[] = [{
  id: "1",
  text: "Find best canvas targets near me",
  category: "insights"
}, {
  id: "2",
  text: "Show adoption trends in oncology",
  category: "trends"
}, {
  id: "3",
  text: "Compare our portfolio vs competitors",
  category: "competitive"
}, {
  id: "4",
  text: "What clinical trials are relevant?",
  category: "clinical"
}];
const categoryConfig = {
  insights: {
    icon: Brain,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  trends: {
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  competitive: {
    icon: Building,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  clinical: {
    icon: Calendar,
    color: "text-green-500",
    bg: "bg-green-500/10"
  }
};
export const AIAssistant = ({
  isOpen,
  onClose
}: AIAssistantProps) => {
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
    if (query.toLowerCase().includes("canvas targets")) {
      return "Found 12 high-potential canvas targets within 25 miles. Top prospects: Dr. Amanda Foster (Endocrinology) - 0.8 miles, high access, no recent contact. Dr. Mark Stevens (Cardiology) - 3.2 miles, growing practice, downloaded recent study. Dr. Lisa Park (Oncology) - 5.1 miles, category A, 90+ days since last visit.";
    }
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
  return <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
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

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4">
            {responses.length === 0 && !isLoading && <div className="text-center py-12">
                
                <h3 className="text-lg font-medium text-card-foreground mb-2">Start a conversation</h3>
                <p className="text-sm text-muted-foreground mb-6">Ask me anything about your data and insights</p>
                
                {/* Quick Query Suggestions */}
                <div className="space-y-2 max-w-sm mx-auto">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick suggestions</p>
                  {querySuggestions.map(suggestion => {
                const config = categoryConfig[suggestion.category];
                const Icon = config.icon;
                return <button key={suggestion.id} onClick={() => handleSendQuery(suggestion.text)} className="w-full p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-all duration-200 group text-left">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-md ${config.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                          </div>
                          <p className="text-sm text-card-foreground">{suggestion.text}</p>
                        </div>
                      </button>;
              })}
                </div>
              </div>}

            {isLoading && <Card className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is analyzing your request...</span>
                </div>
              </Card>}

            <div className="space-y-4">
              {responses.map((response, index) => <div key={index} className="space-y-3 animate-slide-up">
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
                </div>)}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-3">
              <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Type your message here..." onKeyDown={e => e.key === "Enter" && handleSendQuery()} className="flex-1 rounded-xl border-border/50 focus:border-primary bg-background" disabled={isLoading} />
              <Button onClick={() => handleSendQuery()} disabled={!query.trim() || isLoading} size="sm" className="rounded-xl bg-gradient-primary hover:shadow-lg px-4">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
};