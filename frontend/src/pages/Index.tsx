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
      <div className="relative h-72 md:h-80 lg:h-[26rem] overflow-hidden rounded-b-3xl lg:rounded-3xl lg:mt-6">
        <img src={heroHome} alt="Peaceful sunset over mountains" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-6 md:p-8 lg:p-10">
          <motion.h1 {...fadeUp} transition={{ delay: 0.1 }} className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight max-w-2xl">
            Hope begins with connection
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.2 }} className="text-sm md:text-base text-muted-foreground mt-2 max-w-xl">
            You deserve support, and it starts right here.
          </motion.p>
        </div>
      </div>

      <div className="px-5 md:px-8 lg:px-10 pb-32 pt-6 lg:pt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Intro content */}
        <motion.section {...fadeUp} transition={{ delay: 0.25 }} className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-foreground mb-2">What happens if I reach out?</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            This is a safe space to explore your feelings, find resources, and connect with support. 
            Everything here is designed to meet you where you are — no pressure, no judgment. 
            Take your time.
            </p>
          </div>

          {/* Empathetic banner */}
          <div className="bg-primary/8 border border-primary/15 rounded-xl p-5 md:p-6 text-center md:text-left">
            <p className="text-sm md:text-base font-medium text-foreground">You're not alone. People care about you. 💛</p>
          </div>

          {/* Quick access cards */}
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

        {/* Crisis resources + footer */}
        <motion.aside {...fadeUp} transition={{ delay: 0.3 }} className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 self-start">
          <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 md:p-5 space-y-5">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-3">Immediate options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {crisisButtons.map((btn) => (
                  <a
                    key={btn.label}
                    href={btn.href}
                    className={`flex items-center gap-2 px-4 py-3 rounded-pill text-xs md:text-sm font-medium min-h-[44px] transition-colors ${btn.color} hover:opacity-80`}
                  >
                    <btn.icon className="h-4 w-4" />
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>

            <footer className="pt-4 border-t border-border text-center lg:text-left space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed">
                This platform is for informational purposes only and does not provide medical advice, diagnosis, or treatment.
              </p>
              <div className="flex justify-center lg:justify-start gap-4 text-xs text-muted-foreground">
                <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
              </div>
            </footer>
          </div>
        </motion.aside>
      </div>
    </PageWrapper>
  );
};

export default Index;
