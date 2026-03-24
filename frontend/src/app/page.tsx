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
          description: "Budget estimate or note",
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
                  description: "Category",
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
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center gap-2 text-indigo-600">
              <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">
                Building your plan...
              </span>
            </div>
          );
        }
        if (status === "complete") {
          return (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-700">
              <svg
                className="w-4 h-4"
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
              <span className="text-sm font-medium">
                Your weekend plan is ready! Check the main panel.
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
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-500">
              <div className="h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Searching: {query ?? "..."}</span>
            </div>
          );
        }
        if (status === "complete") {
          return (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-500">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-xs">
                Searched: {query ?? "completed"}
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
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {weekendPlan ? (
            <WeekendPlanView plan={weekendPlan} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                <span className="text-4xl">🗓️</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-3">
                Weekend Plan Builder
              </h1>
              <p className="text-slate-500 max-w-sm mb-8">
                Describe the weekend you&apos;d like, and I&apos;ll create a
                personalized plan with real venues, restaurants, and activities.
              </p>
              <div className="grid gap-3 w-full max-w-md">
                {[
                  "Plan a fun weekend in NYC for two under $300",
                  "Quiet Sunday with coffee, books, and one museum in SF",
                  "Rainy weekend in Vancouver focused on food",
                ].map((suggestion) => (
                  <div
                    key={suggestion}
                    className="text-left text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-default"
                  >
                    &ldquo;{suggestion}&rdquo;
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </CopilotSidebar>
  );
}
