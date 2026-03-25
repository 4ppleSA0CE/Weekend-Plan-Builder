"use client";

import { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { PreferencesForm } from "@/components/PreferencesForm";
import { WeekendPlanView } from "@/components/WeekendPlanView";
import type { WeekendPlan, CollectPreferencesArgs } from "@/types";

export default function Home() {
  const [weekendPlan, setWeekendPlan] = useState<WeekendPlan | null>(null);

  useCopilotAction(
    {
      name: "collect_preferences",
      description:
        "Collect structured preferences from the user via an interactive form",
      parameters: [
        {
          name: "title",
          type: "string",
          description: "Title for the preferences form",
          required: true,
        },
        {
          name: "description",
          type: "string",
          description: "Brief context explaining what info is needed",
          required: true,
        },
        {
          name: "fields",
          type: "object[]",
          description: "List of field definitions",
          required: true,
          attributes: [
            {
              name: "id",
              type: "string",
              description: "Unique field identifier",
              required: true,
            },
            {
              name: "label",
              type: "string",
              description: "Display label",
              required: true,
            },
            {
              name: "type",
              type: "string",
              description: 'Input type: "select", "text", or "multi_select"',
              enum: ["select", "text", "multi_select"],
              required: true,
            },
            {
              name: "required",
              type: "boolean",
              description: "Whether the field is required",
              required: true,
            },
            {
              name: "options",
              type: "string[]",
              description: "Choices for select/multi_select types",
              required: false,
            },
            {
              name: "placeholder",
              type: "string",
              description: "Placeholder text for text fields",
              required: false,
            },
          ],
        },
      ],
      renderAndWaitForResponse: ({ args, status, respond }) => {
        const isStreaming = status === "inProgress";

        return (
          <PreferencesForm
            args={args as Partial<CollectPreferencesArgs>}
            isStreaming={isStreaming}
            onSubmit={(values) => {
              if (respond) {
                respond(JSON.stringify(values));
              }
            }}
          />
        );
      },
    },
    []
  );

  useCopilotAction(
    {
      name: "set_weekend_plan",
      description: "Deliver the final weekend plan to be rendered in the UI",
      parameters: [
        {
          name: "title",
          type: "string",
          description: "Plan title",
          required: true,
        },
        {
          name: "city",
          type: "string",
          description: "City name",
          required: true,
        },
        {
          name: "summary",
          type: "string",
          description: "1-2 sentence summary",
          required: true,
        },
        {
          name: "budget_note",
          type: "string",
          description:
            "Estimated total budget with travel: activities/meals plus local transit and (if relevant) getting there/back. Ranges ok; label estimates.",
          required: true,
        },
        {
          name: "days",
          type: "object[]",
          description: "List of day plans",
          required: true,
          attributes: [
            {
              name: "day",
              type: "string",
              description: "Day name",
              required: true,
            },
            {
              name: "theme",
              type: "string",
              description: "Theme for the day",
              required: true,
            },
            {
              name: "items",
              type: "object[]",
              description: "List of activities",
              required: true,
              attributes: [
                {
                  name: "time",
                  type: "string",
                  description: "Time slot",
                  required: true,
                },
                {
                  name: "title",
                  type: "string",
                  description: "Activity name",
                  required: true,
                },
                {
                  name: "category",
                  type: "string",
                  description:
                    "food | activity | rest | travel (use travel for between-venue legs and main-trip transport)",
                  enum: ["food", "activity", "rest", "travel"],
                  required: true,
                },
                {
                  name: "location",
                  type: "string",
                  description: "Venue name",
                  required: false,
                },
                {
                  name: "note",
                  type: "string",
                  description: "Brief note",
                  required: false,
                },
                {
                  name: "estimated_cost",
                  type: "number",
                  description: "Cost in dollars",
                  required: false,
                },
                {
                  name: "source_url",
                  type: "string",
                  description: "Link to source",
                  required: false,
                },
              ],
            },
          ],
        },
      ],
      handler: async (args) => {
        setWeekendPlan(args as unknown as WeekendPlan);
        return "Weekend plan rendered successfully.";
      },
      render: ({ status }) => {
        if (status === "inProgress") {
          return (
            <div className="rounded-xl border border-dusk-border-accent bg-dusk-surface/90 px-4 py-3 flex items-center gap-3 text-dusk-muted shadow-[0_0_24px_-8px_rgba(200,121,65,0.35)]">
              <div className="h-4 w-4 shrink-0 rounded-full border-2 border-dusk-copper border-t-transparent animate-spin" />
              <span className="text-sm font-medium tracking-wide text-dusk-cream">
                Building your plan…
              </span>
            </div>
          );
        }
        if (status === "complete") {
          return (
            <div className="rounded-xl border border-dusk-sage/40 bg-dusk-sage/10 px-4 py-3 flex items-center gap-3 text-dusk-sage">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium tracking-wide">
                Your weekend plan is ready — see the main panel.
              </span>
            </div>
          );
        }
        return <></>;
      },
    },
    [setWeekendPlan]
  );

  useCopilotAction(
    {
      name: "web_search",
      description: "Search the web for information",
      parameters: [
        {
          name: "query",
          type: "string",
          description: "Search query",
          required: true,
        },
        {
          name: "max_results",
          type: "number",
          description: "Max results",
          required: false,
        },
      ],
      available: "remote",
      render: ({ status, args }) => {
        const query = (args as Record<string, unknown>)?.query as
          | string
          | undefined;
        if (status === "inProgress") {
          return (
            <div className="rounded-xl border border-dusk-border bg-dusk-surface/80 px-4 py-3 flex items-center gap-3 text-dusk-muted">
              <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-dusk-amber border-t-transparent animate-spin" />
              <span className="text-xs font-mono tracking-tight">
                Searching: {query ?? "…"}
              </span>
            </div>
          );
        }
        if (status === "complete") {
          return (
            <div className="rounded-xl border border-dusk-border-accent/60 bg-dusk-card/60 px-4 py-3 flex items-center gap-3 text-dusk-muted">
              <svg
                className="w-3.5 h-3.5 shrink-0 text-dusk-amber"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs font-mono tracking-tight">
                Searched: {query ?? "done"}
              </span>
            </div>
          );
        }
        return <></>;
      },
    },
    []
  );

  return (
    <CopilotSidebar
      defaultOpen={true}
      clickOutsideToClose={false}
      className="h-full"
      labels={{
        title: "Weekend Planner",
        initial:
          'Hi! Tell me what kind of weekend you\'d like to plan. For example: "Plan a fun weekend in New York for two under $300"',
      }}
    >
      <main className="relative min-h-screen bg-dusk-gradient bg-dot-grid overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto px-5 py-12 md:py-16">
          {weekendPlan ? (
            <WeekendPlanView plan={weekendPlan} />
          ) : (
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start md:gap-12">
              <div className="min-h-[52vh] flex flex-col justify-center md:min-h-[60vh]">
                <p className="animate-fade-in-up text-[0.65rem] uppercase tracking-[0.35em] text-dusk-amber mb-4 stagger-1">
                  Curated escapes
                </p>
                <h1 className="font-display text-4xl sm:text-5xl md:text-[2.85rem] leading-[1.08] text-dusk-cream mb-5 animate-fade-in-up stagger-2">
                  Weekend Plan
                  <br />
                  <span className="text-dusk-muted">Builder</span>
                </h1>
                <p className="text-dusk-muted text-base sm:text-lg max-w-md leading-relaxed animate-fade-in-up stagger-3">
                  Describe the weekend you want — we&apos;ll weave real venues,
                  food, and moments into a plan you can actually use.
                </p>
                <div className="mt-10 space-y-3 max-w-lg animate-fade-in-up stagger-4">
                  {[
                    "Plan a fun weekend in NYC for two under $300",
                    "Quiet Sunday with coffee, books, and one museum in SF",
                    "Rainy weekend in Vancouver focused on food",
                  ].map((suggestion, i) => (
                    <div
                      key={suggestion}
                      className="group rounded-xl border border-dusk-border bg-dusk-surface/40 px-4 py-3.5 text-left text-sm text-dusk-muted backdrop-blur-sm transition-all duration-300 animate-fade-in-up hover:border-dusk-copper/50 hover:bg-dusk-hover/60 hover:text-dusk-cream hover:shadow-[0_0_32px_-12px_rgba(200,121,65,0.25)]"
                      style={{
                        animationDelay: `${0.36 + i * 0.08}s`,
                      }}
                    >
                      <span className="text-dusk-dim font-mono text-[0.65rem] tracking-wider block mb-1 opacity-80">
                        Try asking
                      </span>
                      <span className="italic text-dusk-muted group-hover:text-dusk-cream transition-colors">
                        &ldquo;{suggestion}&rdquo;
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="hidden md:flex flex-col items-center justify-start pt-8 animate-fade-in stagger-5 opacity-90"
                aria-hidden
              >
                <div className="animate-float-soft relative w-36 h-36 rounded-full border border-dusk-border-accent/50 bg-gradient-to-br from-dusk-copper/15 to-transparent flex items-center justify-center shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-24 h-24 text-dusk-amber/90"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                  >
                    <circle cx="50" cy="50" r="46" className="opacity-40" />
                    <path d="M50 8 L50 92 M8 50 L92 50" className="opacity-30" />
                    <path
                      d="M50 12 L54 46 L50 50 L46 46 Z"
                      fill="currentColor"
                      className="opacity-90"
                    />
                    <text
                      x="50"
                      y="24"
                      textAnchor="middle"
                      className="fill-dusk-muted text-[7px] font-sans"
                      style={{ fontSize: "7px" }}
                    >
                      N
                    </text>
                  </svg>
                </div>
                <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.25em] text-dusk-dim max-w-[10rem] leading-relaxed">
                  Open the chat to begin
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </CopilotSidebar>
  );
}
