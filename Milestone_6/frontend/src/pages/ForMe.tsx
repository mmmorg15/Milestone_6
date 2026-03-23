import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Leaf, Brain, BookOpen, Lightbulb, ArrowRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import heroForMe from "@/assets/hero-forme.jpg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const CURRENT_USER_KEY = "mindbridge-current-user";
const JOURNAL_KEY_PREFIX = "mindbridge-journal";

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

  return user.email;
};

const getJournalStorageKey = (user: CurrentUser | null) => {
  return user ? `${JOURNAL_KEY_PREFIX}-${user.id}` : `${JOURNAL_KEY_PREFIX}-guest`;
};

const moods = [
  { id: "okay", emoji: "😊", label: "Okay", response: "That is great to hear. Here are some ways to maintain your well-being." },
  { id: "sad", emoji: "😔", label: "Sad", response: "It is okay to feel sad. Let us explore what might help." },
  { id: "anxious", emoji: "😰", label: "Anxious", response: "Anxiety can feel overwhelming. Let us find some calm together." },
  { id: "frustrated", emoji: "😤", label: "Frustrated", response: "Frustration is valid. Let us work through it step by step." },
  { id: "numb", emoji: "😶", label: "Numb", response: "Feeling numb can be your mind's way of coping. You are safe here." },
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
  "Write down three things you are grateful for",
  "Listen to a song that makes you feel calm",
  "Stretch your body gently for 5 minutes",
];

const copingStrategies = [
  "Name your feelings out loud. It helps process them.",
  "Try the 5-4-3-2-1 grounding technique (5 things you see, 4 you hear...)",
  "Talk to someone you trust, even about small things",
  "Break overwhelming tasks into tiny, manageable steps",
  "Set a timer for 15 minutes of worry, then let it go",
];

const ForMe = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [journal, setJournal] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [isSavingJournal, setIsSavingJournal] = useState(false);

  useEffect(() => {
    if (searchParams.get("mood") === "true") {
      // Kept for future scrolling behavior.
    }
  }, [searchParams]);

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
        localStorage.removeItem(CURRENT_USER_KEY);
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
    const savedJournal = localStorage.getItem(getJournalStorageKey(currentUser));
    setJournal(savedJournal || "");
  }, [currentUser]);

  const saveJournalLocal = useCallback(
    (value: string) => {
      setJournal(value);
      localStorage.setItem(getJournalStorageKey(currentUser), value);
    },
    [currentUser]
  );

  const orderedResources = selectedMood
    ? moodResourceOrder[selectedMood].map((id) => resourceCards.find((r) => r.id === id)!).filter(Boolean)
    : resourceCards;

  const selectedMoodData = moods.find((m) => m.id === selectedMood);

  const handleSaveMoodLog = async () => {
    if (!selectedMood) {
      toast({ title: "Select a mood first", description: "Choose how you are feeling before saving.", variant: "destructive" });
      return;
    }

    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to save mood check-ins to your account.", variant: "destructive" });
      return;
    }

    setIsSavingMood(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/mood-logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          moodCode: selectedMood,
          notes: selectedMoodData?.response || null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({ title: "Could not save mood", description: data.message || "Please try again.", variant: "destructive" });
        return;
      }

      toast({ title: "Mood saved", description: "Your check-in was saved to your account." });
    } catch {
      toast({ title: "Server unavailable", description: "Could not reach the backend server.", variant: "destructive" });
    } finally {
      setIsSavingMood(false);
    }
  };

  const handleSaveJournalEntry = async () => {
    if (!journal.trim()) {
      toast({ title: "Journal is empty", description: "Write something before saving.", variant: "destructive" });
      return;
    }

    if (!currentUser) {
      toast({ title: "Login required", description: "Please log in to save journal entries to your account.", variant: "destructive" });
      return;
    }

    setIsSavingJournal(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/journal-entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          moodCode: selectedMood,
          content: journal,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast({ title: "Could not save journal", description: data.message || "Please try again.", variant: "destructive" });
        return;
      }

      toast({ title: "Journal saved", description: "Your entry was saved to your account." });
    } catch {
      toast({ title: "Server unavailable", description: "Could not reach the backend server.", variant: "destructive" });
    } finally {
      setIsSavingJournal(false);
    }
  };

  return (
    <PageWrapper>
      <div className="relative h-48 overflow-hidden">
        <img src={heroForMe} alt="Peaceful forest with morning light" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-2 min-h-[44px]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <h1 className="text-xl font-bold text-foreground">I Need Help</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {currentUser ? `Logged in as ${getUserLabel(currentUser)}` : "Not logged in. Sign in to save entries to your account."}
          </p>
        </div>
      </div>

      <div className="px-5 pb-32 space-y-6">
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
          {selectedMood && (
            <Button type="button" onClick={handleSaveMoodLog} disabled={isSavingMood} className="mt-3 h-11 rounded-xl text-sm font-semibold">
              {isSavingMood ? "Saving mood..." : "Save Mood Check-In"}
            </Button>
          )}
        </motion.section>

        <a href="#" className="flex items-center justify-between p-4 bg-accent/10 rounded-xl border border-accent/20 hover:bg-accent/15 transition-colors min-h-[44px]">
          <span className="text-sm font-semibold text-foreground">Speak with a Counselor</span>
          <ArrowRight className="h-4 w-4 text-accent" />
        </a>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Support Resources</h2>
          <div className="grid grid-cols-2 gap-3">
            {orderedResources.map((card) => (
              <button
                key={card.id}
                onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                className={`p-4 rounded-xl border text-left transition-all min-h-[44px] ${
                  expandedCard === card.id ? "bg-card border-primary/30 shadow-md" : "bg-card border-border hover:shadow-sm"
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

        <AnimatePresence mode="wait">
          {expandedCard === "selfcare" && (
            <motion.div key="selfcare" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Wellness Practices</h3>
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
              <h3 className="text-sm font-semibold text-foreground">Coping Techniques</h3>
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
              <h3 className="text-sm font-semibold text-foreground">Guided Relaxation</h3>
              <div className="animate-breathe h-20 w-20 rounded-full bg-primary/15 border border-primary/20 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Focus on the circle. Breathe in as it expands, out as it contracts. Let each breath bring you calm.
              </p>
            </motion.div>
          )}
          {expandedCard === "journal" && (
            <motion.div key="journal" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Therapeutic Journaling</h3>
              <p className="text-xs text-muted-foreground">Write freely. The text auto-saves locally for this account; use the button to save to your account in the database.</p>
              <Textarea
                placeholder="What's on your mind today?"
                value={journal}
                onChange={(e) => saveJournalLocal(e.target.value)}
                className="min-h-[120px] rounded-xl border-border text-sm resize-none"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">Auto-saved locally (per account)</p>
                <Button type="button" onClick={handleSaveJournalEntry} disabled={isSavingJournal} className="h-10 rounded-xl text-sm font-semibold">
                  {isSavingJournal ? "Saving..." : "Save Journal Entry"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default ForMe;