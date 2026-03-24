"use client";

import type { WeekendPlan, ActivityItem, ActivityCategory } from "@/types";

const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { icon: string; accent: string; label: string }
> = {
  food: {
    icon: "🍽",
    accent: "border-l-dusk-copper",
    label: "text-dusk-copper",
  },
  activity: {
    icon: "◇",
    accent: "border-l-dusk-sage",
    label: "text-dusk-sage",
  },
  rest: {
    icon: "☕",
    accent: "border-l-dusk-rose",
    label: "text-dusk-rose",
  },
  travel: {
    icon: "→",
    accent: "border-l-dusk-amber",
    label: "text-dusk-amber",
  },
};

function ActivityCard({
  item,
  index,
}: {
  item: ActivityItem;
  index: number;
}) {
  const config = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.activity;

  return (
    <div
      className={`relative rounded-xl border border-dusk-border bg-dusk-card/80 pl-4 pr-4 py-4 border-l-4 ${config.accent} backdrop-blur-sm shadow-[0_8px_32px_-16px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_12px_40px_-12px_rgba(200,121,65,0.12)] animate-fade-in-up`}
      style={{ animationDelay: `${0.06 * index}s` }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 text-center pt-0.5">
          <span className={`text-lg ${config.label}`} aria-hidden>
            {config.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-mono text-[0.7rem] tracking-wide text-dusk-dim bg-dusk-surface/80 px-2 py-0.5 rounded-md border border-dusk-border/80">
              {item.time}
            </span>
            <h4
              className={`text-[0.95rem] font-semibold tracking-tight ${config.label}`}
            >
              {item.title}
            </h4>
          </div>

          {item.location && (
            <p className="text-xs text-dusk-muted mt-2 flex items-start gap-1.5">
              <svg
                className="w-3.5 h-3.5 shrink-0 mt-0.5 text-dusk-dim"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {item.location}
            </p>
          )}

          {item.note && (
            <p className="text-xs text-dusk-dim mt-2 italic leading-relaxed border-l border-dusk-border-accent/50 pl-3">
              {item.note}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            {item.estimated_cost !== undefined && item.estimated_cost !== null && (
              <span className="text-xs font-mono font-medium text-dusk-cream bg-dusk-copper/15 border border-dusk-copper/30 px-2.5 py-1 rounded-full">
                ${item.estimated_cost.toFixed(0)}
              </span>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-dusk-copper underline underline-offset-4 decoration-dusk-copper/50 hover:text-dusk-amber hover:decoration-dusk-amber flex items-center gap-1 transition-colors"
              >
                Source
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayCard({
  day,
  dayIndex,
}: {
  day: { day: string; theme: string; items: ActivityItem[] };
  dayIndex: number;
}) {
  const totalCost = day.items.reduce(
    (sum, item) => sum + (item.estimated_cost ?? 0),
    0
  );

  return (
    <div
      className="rounded-2xl border border-dusk-border-accent/40 bg-dusk-surface/50 overflow-hidden shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)] animate-fade-in-up"
      style={{ animationDelay: `${0.12 * dayIndex}s` }}
    >
      <div className="relative px-6 py-5 bg-gradient-to-br from-dusk-copper/90 via-dusk-copper/75 to-dusk-amber/50">
        <div
          className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_30%_20%,white,transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-dusk-cream/70 mb-1">
              Day
            </p>
            <h3 className="font-display text-2xl md:text-[1.65rem] text-dusk-cream tracking-tight">
              {day.day}
            </h3>
            <p className="text-dusk-cream/85 text-sm mt-1.5 max-w-md leading-relaxed">
              {day.theme}
            </p>
          </div>
          {totalCost > 0 && (
            <span className="font-mono text-sm text-dusk-cream bg-black/20 px-4 py-2 rounded-full border border-dusk-cream/20">
              ~${totalCost.toFixed(0)}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 space-y-4 bg-gradient-to-b from-dusk-deep/40 to-transparent">
        {day.items.map((item, idx) => (
          <ActivityCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </div>
  );
}

export function WeekendPlanView({ plan }: { plan: WeekendPlan }) {
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header className="text-left md:text-center space-y-5 py-2 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-dusk-amber border border-dusk-amber/35 bg-dusk-amber/5 px-4 py-2 rounded-full">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {plan.city}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-dusk-cream leading-tight tracking-tight">
          {plan.title}
        </h1>
        <p className="text-dusk-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          {plan.summary}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="text-dusk-dim text-[0.65rem] uppercase tracking-[0.2em]">
            Budget
          </span>
          <span className="text-sm text-dusk-cream font-medium border-b border-dusk-copper/40 pb-0.5">
            {plan.budget_note}
          </span>
        </div>
      </header>

      <div className="space-y-8">
        {plan.days.map((day, idx) => (
          <DayCard key={idx} day={day} dayIndex={idx} />
        ))}
      </div>
    </div>
  );
}
