import { Menu, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onMenuOpen: () => void;
}

const TopBar = ({ onMenuOpen }: TopBarProps) => {
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

      <Button
        variant="ghost"
        size="icon"
        asChild
        className="h-11 w-11 rounded-xl"
      >
        <Link to="/" aria-label="Home">
          <Home className="h-5 w-5" />
        </Link>
      </Button>
    </header>
  );
};

export default TopBar;
