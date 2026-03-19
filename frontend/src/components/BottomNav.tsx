import { useEffect, useMemo, useState } from "react";
import { Home, HeartPulse, HandHeart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const CURRENT_USER_KEY = "mindbridge-current-user";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: HeartPulse, label: "I Need Help", to: "/for-me" },
  { icon: HandHeart, label: "Supporters", to: "/supporters" },
  { icon: User, label: "Account", to: "/auth" },
];

const BottomNav = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const rawUser = localStorage.getItem(CURRENT_USER_KEY);
      if (!rawUser) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const parsed = JSON.parse(rawUser) as { id?: number; email?: string };
        setIsLoggedIn(Boolean(parsed?.id && parsed?.email));
      } catch {
        setIsLoggedIn(false);
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

  const resolvedNavItems = useMemo(
    () =>
      navItems.map((item) =>
        item.label === "Account"
          ? { ...item, to: isLoggedIn ? "/profile" : "/auth" }
          : item,
      ),
    [isLoggedIn],
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {resolvedNavItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[64px] min-h-[44px] justify-center ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={item.label}
            >
              <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
