import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Pencil, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "@/components/PageWrapper";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { buildApiUrl } from "@/lib/api";

const CURRENT_USER_KEY = "mindbridge-current-user";
const PAGE_SIZE = 10;

type CurrentUser = {
  id: number;
  name: string | null;
  email: string;
};

type JournalEntry = {
  id: number;
  user_id: number;
  mood_id: number | null;
  mood_code: string | null;
  mood_label: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

type EntryDraft = {
  id: number;
  originalContent: string;
  draftContent: string;
  moodCode: string | null;
  moodLabel: string | null;
  createdAt: string;
  updatedAt: string;
  isSaving: boolean;
  isDeleting: boolean;
  isEditing: boolean;
};

type MoodLog = {
  id: number;
  mood_code: string;
  logged_at: string;
  notes: string | null;
};

const moods = [
  { id: "okay", emoji: "😊", label: "Okay" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "frustrated", emoji: "😤", label: "Frustrated" },
  { id: "numb", emoji: "😶", label: "Numb" },
];

const getUserLabel = (user: CurrentUser) => {
  const name = user.name?.trim();
  if (name) return name;
  return user.email;
};

const formatDateTime = (isoDate: string) => {
  try {
    return new Date(isoDate).toLocaleString();
  } catch {
    return isoDate;
  }
};

const JournalEntries = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"journal" | "mood">("journal");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [entries, setEntries] = useState<EntryDraft[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);
  const [isLoadingMoods, setIsLoadingMoods] = useState(false);
  const [journalPage, setJournalPage] = useState(1);
  const [moodPage, setMoodPage] = useState(1);

  useEffect(() => {
    const syncUser = () => {
      const rawUser = localStorage.getItem(CURRENT_USER_KEY);
      if (!rawUser) { setCurrentUser(null); return; }
      try {
        const parsed = JSON.parse(rawUser) as CurrentUser;
        if (!parsed?.id || !parsed?.email) { setCurrentUser(null); return; }
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

  // Load journal entries
  useEffect(() => {
    if (!currentUser) { setEntries([]); return; }
    const load = async () => {
      setIsLoadingEntries(true);
      try {
        const response = await fetch(buildApiUrl(`/api/journal-entries?userId=${currentUser.id}`));
        const data = await response.json().catch(() => ({})) as { journalEntries?: JournalEntry[]; message?: string };
        if (!response.ok) {
          toast({ title: "Could not load journal entries", description: data.message || "Please try again.", variant: "destructive" });
          setEntries([]);
          return;
        }
        setEntries((data.journalEntries || []).map((entry) => ({
          id: entry.id,
          originalContent: entry.content,
          draftContent: entry.content,
          moodCode: entry.mood_code,
          moodLabel: entry.mood_label,
          createdAt: entry.created_at,
          updatedAt: entry.updated_at,
          isSaving: false,
          isDeleting: false,
          isEditing: false,
        })));
      } catch {
        toast({ title: "Request failed", description: "Could not reach the backend server.", variant: "destructive" });
        setEntries([]);
      } finally {
        setIsLoadingEntries(false);
      }
    };
    load();
  }, [currentUser, toast]);

  // Load mood logs
  useEffect(() => {
    if (!currentUser) { setMoodLogs([]); return; }
    const load = async () => {
      setIsLoadingMoods(true);
      try {
        const response = await fetch(buildApiUrl(`/api/mood-logs/${currentUser.id}`));
        const data = await response.json().catch(() => ({})) as { moodLogs?: MoodLog[]; message?: string };
        if (response.ok) setMoodLogs(data.moodLogs || []);
      } catch {
        // silently fail
      } finally {
        setIsLoadingMoods(false);
      }
    };
    load();
  }, [currentUser]);

  const hasUnsavedChanges = useMemo(
    () => entries.some((e) => e.originalContent !== e.draftContent),
    [entries]
  );

  // Pagination slices
  const journalTotalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const moodTotalPages = Math.max(1, Math.ceil(moodLogs.length / PAGE_SIZE));
  const pagedEntries = entries.slice((journalPage - 1) * PAGE_SIZE, journalPage * PAGE_SIZE);
  const pagedMoods = moodLogs.slice((moodPage - 1) * PAGE_SIZE, moodPage * PAGE_SIZE);

  const handleDraftChange = (id: number, value: string) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, draftContent: value } : e));
  };

  const handleStartEditing = (id: number) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, draftContent: e.originalContent, isEditing: true } : e));
  };

  const handleCancelEditing = (id: number) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, draftContent: e.originalContent, isEditing: false, isSaving: false } : e));
  };

  const handleSaveEntry = async (id: number) => {
    const target = entries.find((e) => e.id === id);
    if (!target || !currentUser) return;
    const trimmed = target.draftContent.trim();
    if (!trimmed) { toast({ title: "Journal is empty", variant: "destructive" }); return; }
    if (trimmed === target.originalContent) {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isEditing: false } : e));
      return;
    }
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isSaving: true } : e));
    try {
      const response = await fetch(buildApiUrl(`/api/journal-entries/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, content: trimmed, moodCode: target.moodCode }),
      });
      const data = await response.json().catch(() => ({})) as { journalEntry?: { content: string; updated_at: string }; message?: string };
      if (!response.ok) {
        toast({ title: "Could not save entry", description: data.message || "Please try again.", variant: "destructive" });
        setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isSaving: false } : e));
        return;
      }
      setEntries((prev) => prev.map((e) => e.id === id ? {
        ...e,
        originalContent: data.journalEntry?.content ?? trimmed,
        draftContent: data.journalEntry?.content ?? trimmed,
        updatedAt: data.journalEntry?.updated_at ?? e.updatedAt,
        isSaving: false, isEditing: false,
      } : e));
      toast({ title: "Entry saved" });
    } catch {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isSaving: false } : e));
      toast({ title: "Request failed", variant: "destructive" });
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!currentUser || !window.confirm("Are you sure?")) return;
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isDeleting: true } : e));
    try {
      const response = await fetch(buildApiUrl(`/api/journal-entries/${id}`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await response.json().catch(() => ({})) as { message?: string };
      if (!response.ok) {
        toast({ title: "Could not delete entry", description: data.message, variant: "destructive" });
        setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isDeleting: false } : e));
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Entry deleted" });
    } catch {
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, isDeleting: false } : e));
      toast({ title: "Request failed", variant: "destructive" });
    }
  };

  return (
    <PageWrapper>
      <div className="px-5 md:px-8 lg:px-10 py-6 pb-32 space-y-6">
        <div className="space-y-2">
          <Link to="/for-me" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary min-h-[44px]">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to I Need Help
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">My Journal & Mood History</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {currentUser ? `Viewing entries for ${getUserLabel(currentUser)}.` : "Log in to view your saved entries."}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("journal")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "journal" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Journal Entries ({entries.length})
          </button>
          <button
            onClick={() => setActiveTab("mood")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "mood" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Mood Logs ({moodLogs.length})
          </button>
        </div>

        {!currentUser && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <p className="text-sm text-muted-foreground">You need an account to view your saved entries.</p>
            <Button asChild className="h-10 rounded-xl text-sm font-semibold">
              <Link to="/auth">Go to Login / Sign Up</Link>
            </Button>
          </div>
        )}

        {/* Journal Tab */}
        {activeTab === "journal" && currentUser && (
          <>
            {isLoadingEntries && (
              <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">Loading your entries...</div>
            )}
            {!isLoadingEntries && entries.length === 0 && (
              <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">
                No entries found yet. Create one from the journaling section on the I Need Help page.
              </div>
            )}
            {!isLoadingEntries && entries.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {pagedEntries.map((entry) => {
                  const isDirty = entry.originalContent !== entry.draftContent;
                  return (
                    <article key={entry.id} className="bg-card border border-border rounded-xl p-4 md:p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Created: {formatDateTime(entry.createdAt)}</p>
                          <p className="text-xs text-muted-foreground">Last updated: {formatDateTime(entry.updatedAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.moodLabel && (
                            <span className="text-[11px] px-2 py-1 rounded-pill bg-primary/10 text-primary border border-primary/20">
                              Mood: {entry.moodLabel}
                            </span>
                          )}
                          <span className={`text-[11px] px-2 py-1 rounded-pill border ${isDirty ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground border-border"}`}>
                            {isDirty ? "Unsaved changes" : "Saved"}
                          </span>
                        </div>
                      </div>
                      {entry.isEditing ? (
                        <>
                          <Textarea value={entry.draftContent} onChange={(e) => handleDraftChange(entry.id, e.target.value)} className="min-h-[130px] rounded-xl border-border text-sm resize-none" />
                          <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => handleDeleteEntry(entry.id)} disabled={entry.isSaving || entry.isDeleting} className="h-10 rounded-xl text-sm font-semibold border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />{entry.isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => handleCancelEditing(entry.id)} disabled={entry.isSaving || entry.isDeleting} className="h-10 rounded-xl text-sm font-semibold">Cancel</Button>
                            <Button type="button" onClick={() => handleSaveEntry(entry.id)} disabled={entry.isSaving || entry.isDeleting || !isDirty || !entry.draftContent.trim()} className="h-10 rounded-xl text-sm font-semibold">
                              <Save className="h-4 w-4" />{entry.isSaving ? "Saving..." : "Save Entry"}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-xl border border-border bg-background/40 p-3">
                            <p className="text-sm text-foreground whitespace-pre-wrap break-words">{entry.originalContent}</p>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => handleDeleteEntry(entry.id)} disabled={entry.isDeleting} className="h-10 rounded-xl text-sm font-semibold border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />{entry.isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => handleStartEditing(entry.id)} disabled={entry.isDeleting} className="h-10 rounded-xl text-sm font-semibold">
                              <Pencil className="h-4 w-4" />Edit
                            </Button>
                          </div>
                        </>
                      )}
                    </article>
                  );
                })}
              </motion.div>
            )}
            {/* Journal Pagination */}
            {journalTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setJournalPage((p) => Math.max(1, p - 1))} disabled={journalPage === 1} className="h-9 rounded-xl text-sm">← Prev</Button>
                <span className="text-xs text-muted-foreground">Page {journalPage} of {journalTotalPages}</span>
                <Button variant="outline" onClick={() => setJournalPage((p) => Math.min(journalTotalPages, p + 1))} disabled={journalPage === journalTotalPages} className="h-9 rounded-xl text-sm">Next →</Button>
              </div>
            )}
            {currentUser && entries.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {hasUnsavedChanges ? "You have unsaved changes. Save each edited card to update the database." : "All visible edits are saved to the database."}
              </p>
            )}
          </>
        )}

        {/* Mood Logs Tab */}
        {activeTab === "mood" && currentUser && (
          <>
            {isLoadingMoods && (
              <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">Loading your mood logs...</div>
            )}
            {!isLoadingMoods && moodLogs.length === 0 && (
              <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">
                No mood logs found yet. Save a mood check-in from the I Need Help page.
              </div>
            )}
            {!isLoadingMoods && moodLogs.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                {pagedMoods.map((log) => {
                  const moodData = moods.find((m) => m.id === log.mood_code);
                  return (
                    <div key={log.id} className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3">
                      <span className="text-xl">{moodData?.emoji ?? "🙂"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{moodData?.label ?? log.mood_code}</p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(log.logged_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
            {/* Mood Pagination */}
            {moodTotalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setMoodPage((p) => Math.max(1, p - 1))} disabled={moodPage === 1} className="h-9 rounded-xl text-sm">← Prev</Button>
                <span className="text-xs text-muted-foreground">Page {moodPage} of {moodTotalPages}</span>
                <Button variant="outline" onClick={() => setMoodPage((p) => Math.min(moodTotalPages, p + 1))} disabled={moodPage === moodTotalPages} className="h-9 rounded-xl text-sm">Next →</Button>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default JournalEntries;