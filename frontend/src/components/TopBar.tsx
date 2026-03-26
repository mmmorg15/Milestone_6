import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CURRENT_USER_KEY = "mindbridge-current-user";

type CurrentUser = {
  id: number;
  name: string | null;
  email: string;
};

const getUserLabel = (user: CurrentUser) => {
  const name = user.name?.trim();
  if (name) {
    return name;
  }

  return user.email.split("@")[0];
};

interface TopBarProps {
  onMenuOpen: () => void;
}

const TopBar = ({ onMenuOpen }: TopBarProps) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const rawUser = localStorage.getItem(CURRENT_USER_KEY);
      if (!rawUser) {
        setCurrentUser(null);
        return;
      }

      try {
        const parsed = JSON.parse(rawUser) as CurrentUser;
        if (!parsed?.id || !parsed?.email) {
          setCurrentUser(null);
          return;
        }

        setCurrentUser(parsed);
      } catch {
        setCurrentUser(null);
      }
    };

    syncUser();

    window.addEventListener("storage", syncUser);
    window.addEventListener("current-user-changed", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("current-user-changed", syncUser);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 lg:px-10 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuOpen}
          aria-label="Open menu"
          className="h-11 w-11 rounded-xl"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <span className="text-lg font-semibold tracking-wide text-foreground/80">
          Connection to hope
        </span>

        <Link
          to={currentUser ? "/profile" : "/auth"}
          aria-label={
            currentUser
              ? `Go to account for ${getUserLabel(currentUser)}`
              : "Go to login"
          }
          className="h-11 min-w-[44px] max-w-[150px] px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground flex items-center justify-center truncate"
        >
          {currentUser ? getUserLabel(currentUser) : "Log in/Sign up"}
        </Link>
      </div>
    </header>
  );
};

export default TopBar;