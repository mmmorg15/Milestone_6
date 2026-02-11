import { Link } from "react-router-dom";
import { Brain, Heart, HandHeart, Phone, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import heroHome from "@/assets/hero-home.jpg";

const crisisButtons = [
  { label: "988 Crisis Lifeline", icon: Phone, href: "tel:988", color: "bg-accent/15 text-accent" },
  { label: "Text Crisis Line", icon: MessageCircle, href: "sms:988", color: "bg-secondary/15 text-secondary" },
  { label: "Find a Provider", icon: ExternalLink, href: "#", color: "bg-primary/15 text-primary" },
];

const quickCards = [
  { emoji: "🧠", title: "Mental Health Assessment", desc: "Evaluate your current emotional state", to: "/for-me", icon: Brain },
  { emoji: "💙", title: "I Need Help Now", desc: "Access immediate support resources", to: "/for-me?mood=true", icon: Heart },
  { emoji: "🤝", title: "Supporting a Loved One", desc: "Caregiver guidance & resources", to: "/supporters", icon: HandHeart },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const Index = () => {
  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <img src={heroHome} alt="Peaceful sunset over mountains" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6">
          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-2xl font-bold text-foreground leading-tight">
            Hope begins with connection
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-sm text-muted-foreground mt-1">
            You deserve support, and it starts right here.
          </motion.p>
        </div>
      </div>

      <div className="px-5 pb-32 space-y-6">
        {/* What happens */}
        <motion.section {...fadeUp} transition={{ delay: 0.25 }} className="pt-4">
          <h2 className="text-base font-semibold text-foreground mb-2">What happens if I reach out?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is a safe space to explore your feelings, find resources, and connect with support. 
            Everything here is designed to meet you where you are — no pressure, no judgment. 
            Take your time.
          </p>
        </motion.section>

        {/* Crisis resources */}
        <motion.section {...fadeUp} transition={{ delay: 0.3 }}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {crisisButtons.map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-pill text-xs font-medium whitespace-nowrap min-h-[44px] transition-colors ${btn.color} hover:opacity-80`}
              >
                <btn.icon className="h-3.5 w-3.5" />
                {btn.label}
              </a>
            ))}
          </div>
        </motion.section>

        {/* Empathetic banner */}
        <motion.section {...fadeUp} transition={{ delay: 0.35 }}>
          <div className="bg-primary/8 border border-primary/15 rounded-xl p-5 text-center">
            <p className="text-sm font-medium text-foreground">
              You're not alone. People care about you. 💛
            </p>
          </div>
        </motion.section>

        {/* Quick access cards */}
        <motion.section {...fadeUp} transition={{ delay: 0.4 }} className="space-y-3">
          {quickCards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all min-h-[44px]"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                {card.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{card.title}</p>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </div>
            </Link>
          ))}
        </motion.section>

        {/* Footer */}
        <footer className="pt-4 border-t border-border text-center space-y-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This platform is for informational purposes only and does not provide medical advice, diagnosis, or treatment.
          </p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </footer>
      </div>
    </PageWrapper>
  );
};

export default Index;
