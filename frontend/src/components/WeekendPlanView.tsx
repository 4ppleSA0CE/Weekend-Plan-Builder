"use client";

import type { WeekendPlan, ActivityItem, ActivityCategory } from "@/types";

const CATEGORY_CONFIG: Record<
  ActivityCategory,
  { icon: string; color: string; bg: string }
> = {
  food: { icon: "🍽️", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  activity: { icon: "🎯", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  rest: { icon: "☕", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  travel: { icon: "🚗", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
};

function ActivityCard({ item }: { item: ActivityItem }) {
  const config = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.activity;

  return (
    <div className={`rounded-lg border p-4 ${config.bg} transition-shadow hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <span className="text-lg">{config.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-slate-500 bg-white/70 px-2 py-0.5 rounded">
              {item.time}
            </span>
            <h4 className={`text-sm font-semibold ${config.color}`}>
              {item.title}
            </h4>
          </div>

          {item.location && (
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {item.location}
            </p>
          )}

          {item.note && (
            <p className="text-xs text-slate-500 mt-1.5 italic">{item.note}</p>
          )}

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {item.estimated_cost !== undefined && item.estimated_cost !== null && (
              <span className="text-xs font-medium text-slate-600 bg-white/70 px-2 py-0.5 rounded">
                ${item.estimated_cost.toFixed(0)}
              </span>
            )}
            {item.source_url && (
              <a
                href={item.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5"
              >
                Source
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day }: { day: { day: string; theme: string; items: ActivityItem[] } }) {
  const totalCost = day.items.reduce(
    (sum, item) => sum + (item.estimated_cost ?? 0),
    0
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{day.day}</h3>
            <p className="text-indigo-100 text-sm">{day.theme}</p>
          </div>
          {totalCost > 0 && (
            <span className="text-sm font-medium text-indigo-100 bg-white/20 px-3 py-1 rounded-full">
              ~${totalCost.toFixed(0)}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">
        {day.items.map((item, idx) => (
          <ActivityCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
}

export function WeekendPlanView({ plan }: { plan: WeekendPlan }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3 py-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {plan.city}
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{plan.title}</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">{plan.summary}</p>
        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {plan.budget_note}
        </div>
      </div>

      <div className="space-y-5">
        {plan.days.map((day, idx) => (
          <DayCard key={idx} day={day} />
        ))}
      </div>
    </div>
  );
}
