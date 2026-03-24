// --- collect_preferences tool types ---

export type FieldType = "select" | "text" | "multi_select";

export interface PreferenceField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface CollectPreferencesArgs {
  title: string;
  description: string;
  fields: PreferenceField[];
}

// --- set_weekend_plan tool types ---

export type ActivityCategory = "food" | "activity" | "rest" | "travel";

export interface ActivityItem {
  time: string;
  title: string;
  category: ActivityCategory;
  location?: string;
  note?: string;
  estimated_cost?: number;
  source_url?: string;
}

export interface DayPlan {
  day: string;
  theme: string;
  items: ActivityItem[];
}

export interface WeekendPlan {
  title: string;
  city: string;
  summary: string;
  budget_note: string;
  days: DayPlan[];
}
