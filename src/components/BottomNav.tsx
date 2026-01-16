import { Home, MessageCircle, User } from "lucide-react";

interface BottomNavProps {
  activeTab: "home" | "jarvis" | "profile";
  onTabChange: (tab: "home" | "jarvis" | "profile") => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs = [
    { id: "home" as const, label: "Hjem", icon: Home },
    { id: "jarvis" as const, label: "Spørg Jarvis", icon: MessageCircle },
    { id: "profile" as const, label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border/40 pb-safe">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] transition-colors active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
              <span className={`text-[10px] mt-0.5 ${isActive ? "font-semibold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
