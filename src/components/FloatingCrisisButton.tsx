import { useState } from "react";
import { Phone, X, MessageCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingCrisisButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-card rounded-xl shadow-lg border border-border p-5 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">Crisis Resources</h3>
              <button onClick={() => setOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              If you or someone you know is in crisis, help is available 24/7.
            </p>
            <div className="space-y-2">
              <a href="tel:988" className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors min-h-[44px]">
                <Phone className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Call 988 Lifeline</p>
                  <p className="text-xs text-muted-foreground">Suicide & Crisis</p>
                </div>
              </a>
              <a href="sms:988" className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors min-h-[44px]">
                <MessageCircle className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Text "988"</p>
                  <p className="text-xs text-muted-foreground">Text-based support</p>
                </div>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors min-h-[44px]">
                <ExternalLink className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">More Resources</p>
                  <p className="text-xs text-muted-foreground">Find local help</p>
                </div>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="bg-accent text-accent-foreground px-4 py-2.5 rounded-pill shadow-lg hover:shadow-xl transition-all text-sm font-medium flex items-center gap-2 min-h-[44px]"
        aria-label="Need help now?"
      >
        <Phone className="h-4 w-4" />
        Need help now?
      </button>
    </div>
  );
};

export default FloatingCrisisButton;
