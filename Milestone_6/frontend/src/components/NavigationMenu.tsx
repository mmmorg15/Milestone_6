import { Home, User, Heart, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import navMosaic from "@/assets/nav-mosaic.jpg";

interface NavigationMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navItems = [
  { icon: Home, label: "Home", description: "Start here", to: "/" },
  { icon: User, label: "Login / Sign Up", description: "Save your progress", to: "/auth" },
  { icon: Heart, label: "I Need Help", description: "Get personalized support", to: "/for-me" },
  { icon: HandHeart, label: "For Supporters", description: "Help a loved one", to: "/supporters" },
];

const NavigationMenu = ({ open, onOpenChange }: NavigationMenuProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] bg-background p-0 flex flex-col">
        <SheetHeader className="p-5 pb-3 border-b border-border">
          <SheetTitle className="text-lg font-semibold text-foreground">Welcome</SheetTitle>
        </SheetHeader>

        <nav className="flex-1 p-3">
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Access</p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted transition-colors min-h-[44px]"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-5 pt-2">
          <img
            src={navMosaic}
            alt="Peaceful nature scenes"
            className="w-full h-32 object-cover rounded-xl opacity-80"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavigationMenu;
