import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current) {
        return;
      }

      if (!accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new Event("current-user-changed"));
    setAccountMenuOpen(false);
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuOpen}
        aria-label="Open menu"
        className="h-11 w-11 rounded-xl"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <span className="text-sm font-semibold tracking-wide text-foreground/80">
        MindBridge
      </span>

      {currentUser ? (
        <div className="relative" ref={accountMenuRef}>
          <button
            type="button"
            onClick={() => setAccountMenuOpen((prev) => !prev)}
            className="h-11 min-w-[44px] max-w-[150px] px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground flex items-center justify-center truncate"
            aria-label={`Account menu for ${getUserLabel(currentUser)}`}
          >
            {getUserLabel(currentUser)}
          </button>
          {accountMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-md p-2 space-y-1">
              <p className="px-2 py-1 text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
              <Link
                to="/auth"
                onClick={() => setAccountMenuOpen(false)}
                className="block px-2 py-2 text-xs rounded-md hover:bg-muted transition-colors"
              >
                Account
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-2 py-2 text-xs rounded-md hover:bg-muted transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/auth"
          aria-label="Go to login"
          className="h-11 min-w-[44px] max-w-[150px] px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground flex items-center justify-center truncate"
        >
          Log In
        </Link>
      )}
    </header>
  );
};

export default TopBar;