import { Calendar, Users, GraduationCap, HelpCircle, Settings, LogOut, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
interface BurgerMenuProps {
  trigger: React.ReactNode;
}
export const BurgerMenu = ({
  trigger
}: BurgerMenuProps) => {
  return <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground">Menu</h2>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 space-y-1">
            <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors text-left">
              <Calendar className="h-5 w-5 text-foreground" />
              <span className="text-base text-foreground">Go to Webplatform</span>
            </button>

            

            

            <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors text-left">
              <HelpCircle className="h-5 w-5 text-foreground" />
              <span className="text-base text-foreground">Support</span>
            </button>

            <Separator className="my-4" />

            <button className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors text-left">
              <Settings className="h-5 w-5 text-foreground" />
              <span className="text-base text-foreground">Indstillinger</span>
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">John Doe</p>
                  <p className="text-sm text-muted-foreground">jdoe@novonordisk.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-xl border border-border">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};