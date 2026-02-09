import { useState } from "react";
import { ArrowLeft, Heart, Sprout, Zap, ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertTriangle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import heroSupporters from "@/assets/hero-supporters.jpg";

const overviewCards = [
  {
    icon: Heart, emoji: "💛", title: "Care for yourself first", color: "text-accent", bgColor: "bg-accent/10",
    tips: [
      "You can't pour from an empty cup — rest is not selfish",
      "Set boundaries that protect your energy",
      "Talk to someone about your own feelings too",
      "Take breaks from caregiving without guilt",
    ],
  },
  {
    icon: Sprout, emoji: "🌱", title: "Build resilience", color: "text-secondary", bgColor: "bg-secondary/10",
    tips: [
      "Practice grounding techniques daily (deep breathing, walks)",
      "Maintain your own hobbies and social connections",
      "Accept that you can't fix everything — presence matters most",
      "Learn to recognize your own stress signals",
    ],
  },
  {
    icon: Zap, emoji: "💪", title: "Show up stronger", color: "text-primary", bgColor: "bg-primary/10",
    tips: [
      "Listen without trying to solve the problem",
      "Small consistent gestures matter more than grand ones",
      "Educate yourself about what they're going through",
      "Celebrate small wins together",
    ],
  },
];

const whatToSay = [
  { say: '"I\'m here for you, no matter what."', avoid: '"Just cheer up."' },
  { say: '"That sounds really hard."', avoid: '"Others have it worse."' },
  { say: '"How can I support you?"', avoid: '"I know exactly how you feel."' },
  { say: '"Take your time. No rush."', avoid: '"You should try harder."' },
  { say: '"I care about you."', avoid: '"It\'s all in your head."' },
];

const urgencySteps = [
  {
    question: "Are they in immediate danger?",
    description: "Signs: talking about ending their life, giving away belongings, saying goodbye",
    action: "Call 988 (Suicide & Crisis Lifeline) or take them to the nearest emergency room.",
    level: "critical",
  },
  {
    question: "Have they mentioned self-harm?",
    description: "Signs: talking about hurting themselves, showing unexplained injuries, withdrawal",
    action: "Gently express your concern. Offer to help them reach a professional. Stay calm and listen.",
    level: "urgent",
  },
  {
    question: "Are they withdrawing or struggling?",
    description: "Signs: pulling away from activities, changes in sleep/appetite, seeming distant",
    action: "Start a conversation. Try: 'I've noticed you seem different lately. I care about you — want to talk?'",
    level: "moderate",
  },
];

const Supporters = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [urgencyStep, setUrgencyStep] = useState(0);

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src={heroSupporters} alt="Mountain sunrise" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-2 min-h-[44px]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <h1 className="text-xl font-bold text-foreground">Thank you for caring</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Being here shows your strength</p>
        </div>
      </div>

      <div className="px-5 pb-32">
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="w-full grid grid-cols-3 rounded-xl bg-muted h-11">
            <TabsTrigger value="overview" className="rounded-lg text-xs">Overview</TabsTrigger>
            <TabsTrigger value="whattodo" className="rounded-lg text-xs">What To Do</TabsTrigger>
            <TabsTrigger value="urgency" className="rounded-lg text-xs">How Urgent?</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-5 space-y-3">
            {overviewCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <button
                  onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                  className="w-full bg-card rounded-xl border border-border p-4 text-left transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{card.emoji} {card.title}</p>
                    </div>
                    {expandedCard === i ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <AnimatePresence>
                    {expandedCard === i && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 ml-13 space-y-2 overflow-hidden"
                      >
                        {card.tips.map((tip, j) => (
                          <li key={j} className="text-sm text-muted-foreground flex gap-2">
                            <span className={`${card.color} shrink-0`}>•</span> {tip}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </TabsContent>

          {/* What To Do Tab */}
          <TabsContent value="whattodo" className="mt-5 space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-base font-semibold text-foreground mb-3">How to have a supportive conversation</h3>
              <ol className="space-y-3">
                {[
                  "Choose a quiet, private moment",
                  "Start with 'I' statements: 'I've noticed...', 'I care about you...'",
                  "Listen more than you speak",
                  "Don't try to fix — just be present",
                  "Follow up. One conversation isn't enough.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-base font-semibold text-foreground mb-3">What to say vs. what to avoid</h3>
              <div className="space-y-2">
                {whatToSay.map((pair, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <div className="bg-secondary/10 p-3 rounded-lg flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground">{pair.say}</p>
                    </div>
                    <div className="bg-accent/10 p-3 rounded-lg flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-xs text-foreground">{pair.avoid}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* How Urgent Tab */}
          <TabsContent value="urgency" className="mt-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Answer each question step by step. Take your time.
            </p>
            {urgencySteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-card rounded-xl border p-4 space-y-3 transition-all ${
                  urgencyStep === i ? "border-primary/30 shadow-md" : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${
                    step.level === "critical" ? "text-accent" : step.level === "urgent" ? "text-primary" : "text-secondary"
                  }`} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{step.question}</p>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg text-sm ${
                  step.level === "critical" ? "bg-accent/10 text-foreground" : step.level === "urgent" ? "bg-primary/10 text-foreground" : "bg-secondary/10 text-foreground"
                }`}>
                  <p className="text-xs font-medium mb-1">What to do:</p>
                  <p className="text-xs">{step.action}</p>
                </div>
                {step.level === "critical" && (
                  <a href="tel:988" className="flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-medium min-h-[44px] justify-center">
                    <Phone className="h-4 w-4" /> Call 988 Now
                  </a>
                )}
                {i < urgencySteps.length - 1 && (
                  <button
                    onClick={() => setUrgencyStep(i + 1)}
                    className="text-xs text-primary hover:underline"
                  >
                    No → Continue to next question
                  </button>
                )}
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default Supporters;
