import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

type OkrStats = {
  totalUsers: number;
  totalEntries: number;
  usersWithEntries: number;
  activeLast30Days: number;
  entriesWithMood: number;
  activationRate: number;
};

type KR = {
  label: string;
  description: string;
  value: number;
  target: number;
  unit: string;
  format: "percent" | "number";
};

const ProgressBar = ({ value, target }: { value: number; target: number }) => {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-400" : "bg-primary";
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const OkrCard = () => {
  const [stats, setStats] = useState<OkrStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(buildApiUrl("/api/okr-stats"));
        if (!res.ok) throw new Error();
        const data = await res.json() as OkrStats;
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">
        Loading engagement stats...
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const keyResults: KR[] = [
    {
      label: "Journal Activation Rate",
      description: "Registered users who have written at least one entry",
      value: stats.activationRate,
      target: 100,
      unit: "%",
      format: "percent",
    },
    {
      label: "Total Journal Entries",
      description: "All entries written across every user",
      value: stats.totalEntries,
      target: 100,
      unit: " entries",
      format: "number",
    },
    {
      label: "Active Journalers (30 days)",
      description: "Users who wrote at least once in the last 30 days",
      value: stats.activeLast30Days,
      target: 20,
      unit: " users",
      format: "number",
    },
    {
      label: "Mood + Journal Pairing",
      description: "Entries that were linked to a mood check-in",
      value:
        stats.totalEntries > 0
          ? Math.round((stats.entriesWithMood / stats.totalEntries) * 100)
          : 0,
      target: 70,
      unit: "%",
      format: "percent",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
          Objective
        </p>
        <h2 className="text-base font-bold text-foreground">
          Help users build a consistent journaling habit
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {stats.totalUsers} registered user{stats.totalUsers !== 1 ? "s" : ""} &middot;{" "}
          {stats.usersWithEntries} have journaled
        </p>
      </div>

      <div className="space-y-4">
        {keyResults.map((kr, i) => {
          const pct = Math.min(100, Math.round((kr.value / kr.target) * 100));
          const displayValue =
            kr.format === "percent" ? `${kr.value}%` : `${kr.value}${kr.unit}`;
          const displayTarget =
            kr.format === "percent" ? `${kr.target}%` : `${kr.target}${kr.unit}`;
          return (
            <div key={i} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    KR{i + 1}: {kr.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{kr.description}</p>
                </div>
                <span className="text-xs font-mono text-foreground shrink-0">
                  {displayValue} / {displayTarget}
                </span>
              </div>
              <ProgressBar value={kr.value} target={kr.target} />
              <p className="text-[11px] text-muted-foreground text-right">{pct}% of target</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OkrCard;
