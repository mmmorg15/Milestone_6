import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Leaf, Brain, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Textarea } from "@/components/ui/textarea";
import heroForMe from "@/assets/hero-forme.jpg";

const moods = [
  { id: "okay", emoji: "😊", label: "Okay", response: "That's great to hear. Here are some ways to maintain your well-being." },
  { id: "sad", emoji: "😔", label: "Sad", response: "It's okay to feel sad. Let's explore what might help." },
  { id: "anxious", emoji: "😰", label: "Anxious", response: "Anxiety can feel overwhelming. Let's find some calm together." },
  { id: "frustrated", emoji: "😤", label: "Frustrated", response: "Frustration is valid. Let's work through it step by step." },
  { id: "numb", emoji: "😶", label: "Numb", response: "Feeling numb is your mind's way of coping. You're safe here." },
];

const resourceCards = [
  { id: "selfcare", icon: Leaf, title: "Wellness Practices", color: "text-secondary", bgColor: "bg-secondary/10" },
  { id: "coping", icon: Lightbulb, title: "Coping Techniques", color: "text-primary", bgColor: "bg-primary/10" },
  { id: "meditation", icon: Brain, title: "Guided Relaxation", color: "text-accent", bgColor: "bg-accent/10" },
  { id: "journal", icon: BookOpen, title: "Therapeutic Journaling", color: "text-secondary", bgColor: "bg-secondary/10" },
];

const moodResourceOrder: Record<string, string[]> = {
  okay: ["selfcare", "meditation", "journal", "coping"],
  sad: ["coping", "journal", "selfcare", "meditation"],
  anxious: ["coping", "meditation", "selfcare", "journal"],
  frustrated: ["coping", "selfcare", "journal", "meditation"],
  numb: ["journal", "meditation", "coping", "selfcare"],
};

const selfCareTips = [
  "Take a 10-minute walk outside in fresh air",
  "Drink a glass of water and take three deep breaths",
  "Write down three things you're grateful for",
  "Listen to a song that makes you feel calm",
  "Stretch your body gently for 5 minutes",
];

const copingStrategies = [
  "Name your feelings out loud — it helps process them",
  "Try the 5-4-3-2-1 grounding technique (5 things you see, 4 you hear...)",
  "Talk to someone you trust, even about small things",
  "Break overwhelming tasks into tiny, manageable steps",
  "Set a timer for 15 minutes of worry, then let it go",
];

const ForMe = () => {
  const [searchParams] = useSearchParams();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [journal, setJournal] = useState("");
  // Auto-open mood if linked from home
  useEffect(() => {
    if (searchParams.get("mood") === "true") {
      // Just scroll to mood section
    }
  }, [searchParams]);

  // Journal auto-save
  useEffect(() => {
    const saved = localStorage.getItem("mindbridge-journal");
    if (saved) setJournal(saved);
  }, []);

  const saveJournal = useCallback((value: string) => {
    setJournal(value);
    localStorage.setItem("mindbridge-journal", value);
  }, []);

  const orderedResources = selectedMood
    ? moodResourceOrder[selectedMood].map((id) => resourceCards.find((r) => r.id === id)!)
    : resourceCards;

  const selectedMoodData = moods.find((m) => m.id === selectedMood);

  return (
    <PageWrapper>
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <img src={heroForMe} alt="Peaceful forest with morning light" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-2 min-h-[44px]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <h1 className="text-xl font-bold text-foreground">I Need Help</h1>
        </div>
      </div>

      <div className="px-5 pb-32 space-y-6">
        {/* Mood check-in */}
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-base font-semibold text-foreground mb-3">How are you feeling today?</h2>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                className={`px-4 py-2.5 rounded-pill text-sm font-medium transition-all min-h-[44px] ${
                  selectedMood === mood.id
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                aria-label={`Feeling ${mood.label}`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {selectedMoodData && (
              <motion.p
                key={selectedMoodData.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-xl"
              >
                {selectedMoodData.response}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Talk to someone */}
        <a href="#" className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/20 hover:bg-accent/15 transition-colors min-h-[44px]">
          <span className="text-sm font-semibold text-foreground">Speak with a Counselor</span>
          <ArrowRight className="h-4 w-4 text-accent" />
        </a>

        {/* Resource cards */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Support Resources</h2>
          <div className="grid grid-cols-2 gap-3">
            {orderedResources.map((card) => (
              <button
                key={card.id}
                onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  expandedCard === card.id
                    ? "bg-card border-primary/30 shadow-md"
                    : "bg-card border-border hover:shadow-sm"
                }`}
              >
                <div className={`h-10 w-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-2`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <p className="text-sm font-medium text-foreground">{card.title}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Expanded content */}
        <AnimatePresence mode="wait">
          {expandedCard === "selfcare" && (
            <motion.div key="selfcare" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">🌿 Wellness Practices</h3>
              <ul className="space-y-2">
                {selfCareTips.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-secondary font-medium shrink-0">{i + 1}.</span> {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {expandedCard === "coping" && (
            <motion.div key="coping" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">💡 Coping Techniques</h3>
              <ul className="space-y-2">
                {copingStrategies.map((tip, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary font-medium shrink-0">{i + 1}.</span> {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {expandedCard === "meditation" && (
            <motion.div key="meditation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-xl border border-border p-5 text-center space-y-3">
              <h3 className="text-sm font-semibold text-foreground">🧘 Guided Relaxation</h3>
              <div className="animate-breathe h-20 w-20 rounded-full bg-primary/15 border border-primary/20 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Focus on the circle. Breathe in as it expands, out as it contracts. Let each breath bring you calm.
              </p>
            </motion.div>
          )}
          {expandedCard === "journal" && (
            <motion.div key="journal" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">📝 Therapeutic Journaling</h3>
              <p className="text-xs text-muted-foreground">Write freely. Your thoughts stay on this device.</p>
              <Textarea
                placeholder="What's on your mind today?"
                value={journal}
                onChange={(e) => saveJournal(e.target.value)}
                className="min-h-[120px] rounded-xl border-border text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">Auto-saved locally</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default ForMe;
