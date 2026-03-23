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

const getUserLabel = (user: CurrentUser) => {
  const name = user.name?.trim();
  if (name) {
    return name;
  }

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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [entries, setEntries] = useState<EntryDraft[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(false);

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
    if (!currentUser) {
      setEntries([]);
      return;
    }

    const loadEntries = async () => {
      setIsLoadingEntries(true);

      try {
        const response = await fetch(buildApiUrl(`/api/journal-entries?userId=${currentUser.id}`));
        const data = (await response.json().catch(() => ({}))) as { journalEntries?: JournalEntry[]; message?: string };

        if (!response.ok) {
          toast({
            title: "Could not load journal entries",
            description: data.message || "Please try again.",
            variant: "destructive",
          });
          setEntries([]);
          return;
        }

        const loadedEntries = (data.journalEntries || []).map((entry) => ({
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
        }));

        setEntries(loadedEntries);
      } catch {
        toast({
          title: "Request failed",
          description: "Could not reach the backend server or the frontend API URL is missing.",
          variant: "destructive",
        });
        setEntries([]);
      } finally {
        setIsLoadingEntries(false);
      }
    };

    loadEntries();
  }, [currentUser, toast]);

  const hasUnsavedChanges = useMemo(
    () => entries.some((entry) => entry.originalContent !== entry.draftContent),
    [entries]
  );

  const handleDraftChange = (entryId: number, value: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              draftContent: value,
            }
          : entry
      )
    );
  };

  const handleSaveEntry = async (entryId: number) => {
    const targetEntry = entries.find((entry) => entry.id === entryId);
    if (!targetEntry || !currentUser) {
      return;
    }

    const trimmedContent = targetEntry.draftContent.trim();
    if (!trimmedContent) {
      toast({ title: "Journal is empty", description: "Write something before saving.", variant: "destructive" });
      return;
    }

    if (trimmedContent === targetEntry.originalContent) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                draftContent: entry.originalContent,
                isEditing: false,
              }
            : entry
        )
      );
      return;
    }

    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, isSaving: true } : entry)));

    try {
      const response = await fetch(buildApiUrl(`/api/journal-entries/${entryId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content: trimmedContent,
          moodCode: targetEntry.moodCode,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        journalEntry?: { content: string; updated_at: string };
        message?: string;
      };

      if (!response.ok) {
        toast({ title: "Could not save entry", description: data.message || "Please try again.", variant: "destructive" });
        setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, isSaving: false } : entry)));
        return;
      }

      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === entryId
            ? {
                ...entry,
                originalContent: data.journalEntry?.content ?? trimmedContent,
                draftContent: data.journalEntry?.content ?? trimmedContent,
                updatedAt: data.journalEntry?.updated_at ?? entry.updatedAt,
                isSaving: false,
                isEditing: false,
              }
            : entry
        )
      );

      toast({ title: "Entry saved", description: "Your journal update was saved." });
    } catch {
      setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, isSaving: false } : entry)));
      toast({
        title: "Request failed",
        description: "Could not reach the backend server or the frontend API URL is missing.",
        variant: "destructive",
      });
    }
  };

  const handleStartEditing = (entryId: number) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              draftContent: entry.originalContent,
              isEditing: true,
            }
          : entry
      )
    );
  };

  const handleDeleteEntry = async (entryId: number) => {
    if (!currentUser) {
      return;
    }

    const shouldDelete = window.confirm("Are you sure?");
    if (!shouldDelete) {
      return;
    }

    setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, isDeleting: true } : entry)));

    try {
      const response = await fetch(buildApiUrl(`/api/journal-entries/${entryId}`), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        toast({ title: "Could not delete entry", description: data.message || "Please try again.", variant: "destructive" });
        setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, isDeleting: false } : entry)));
        return;
      }

      setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
      toast({ title: "Entry deleted", description: "Your journal entry has been removed." });
    } catch {
      setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, isDeleting: false } : entry)));
      toast({
        title: "Request failed",
        description: "Could not reach the backend server or the frontend API URL is missing.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEditing = (entryId: number) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId
          ? {
              ...entry,
              draftContent: entry.originalContent,
              isEditing: false,
              isSaving: false,
            }
          : entry
      )
    );
  };

  return (
    <PageWrapper>
      <div className="px-5 md:px-8 lg:px-10 py-6 pb-32 space-y-6">
        <div className="space-y-2">
          <Link
            to="/for-me"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary min-h-[44px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to I Need Help
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">My Journal Entries</h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            {currentUser
              ? `Viewing entries for ${getUserLabel(currentUser)}. Edit a card and save it anytime.`
              : "Log in to view and edit your saved journal entries."}
          </p>
        </div>

        {!currentUser && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-2">
            <p className="text-sm text-muted-foreground">You need an account to view your saved entries.</p>
            <Button asChild className="h-10 rounded-xl text-sm font-semibold">
              <Link to="/auth">Go to Login / Sign Up</Link>
            </Button>
          </div>
        )}

        {currentUser && isLoadingEntries && (
          <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">Loading your entries...</div>
        )}

        {currentUser && !isLoadingEntries && entries.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">
            No entries found yet. You can create one from the journaling section on the I Need Help page.
          </div>
        )}

        {currentUser && !isLoadingEntries && entries.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {entries.map((entry) => {
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
                      <span
                        className={`text-[11px] px-2 py-1 rounded-pill border ${
                          isDirty
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {isDirty ? "Unsaved changes" : "Saved"}
                      </span>
                    </div>
                  </div>

                  {entry.isEditing ? (
                    <>
                      <Textarea
                        value={entry.draftContent}
                        onChange={(event) => handleDraftChange(entry.id, event.target.value)}
                        className="min-h-[130px] rounded-xl border-border text-sm resize-none"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={entry.isSaving || entry.isDeleting}
                          className="h-10 rounded-xl text-sm font-semibold border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          {entry.isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleCancelEditing(entry.id)}
                          disabled={entry.isSaving || entry.isDeleting}
                          className="h-10 rounded-xl text-sm font-semibold"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleSaveEntry(entry.id)}
                          disabled={entry.isSaving || entry.isDeleting || !isDirty || !entry.draftContent.trim()}
                          className="h-10 rounded-xl text-sm font-semibold"
                        >
                          <Save className="h-4 w-4" />
                          {entry.isSaving ? "Saving..." : "Save Entry"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rounded-xl border border-border bg-background/40 p-3">
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words">{entry.originalContent}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={entry.isDeleting}
                          className="h-10 rounded-xl text-sm font-semibold border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          {entry.isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleStartEditing(entry.id)}
                          disabled={entry.isDeleting}
                          className="h-10 rounded-xl text-sm font-semibold"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </motion.div>
        )}

        {currentUser && entries.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {hasUnsavedChanges
              ? "You have unsaved changes. Save each edited card to update the database."
              : "All visible edits are saved to the database."}
          </p>
        )}
      </div>
    </PageWrapper>
  );
};

export default JournalEntries;
