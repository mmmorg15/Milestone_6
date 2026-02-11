import { useState } from "react";
import { motion } from "framer-motion";
import TopBar from "./TopBar";
import NavigationMenu from "./NavigationMenu";
import FloatingCrisisButton from "./FloatingCrisisButton";
import BottomNav from "./BottomNav";

interface PageWrapperProps {
  children: React.ReactNode;
  showBackButton?: boolean;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar onMenuOpen={() => setMenuOpen(true)} />
      <NavigationMenu open={menuOpen} onOpenChange={setMenuOpen} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="max-w-[480px] mx-auto"
      >
        {children}
      </motion.main>
      <FloatingCrisisButton />
      <BottomNav />
    </div>
  );
};

export default PageWrapper;
