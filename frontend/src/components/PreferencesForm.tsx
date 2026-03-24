"use client";

import { useState } from "react";
import type { CollectPreferencesArgs, PreferenceField } from "@/types";

interface PreferencesFormProps {
  args: Partial<CollectPreferencesArgs>;
  isStreaming: boolean;
  onSubmit: (values: Record<string, string | string[]>) => void;
}

function SelectField({
  field,
  value,
  onChange,
}: {
  field: PreferenceField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
              value === opt
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: PreferenceField;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
              value.includes(opt)
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TextField({
  field,
  value,
  onChange,
}: {
  field: PreferenceField;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? ""}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                   placeholder:text-slate-400"
      />
    </div>
  );
}

export function PreferencesForm({
  args,
  isStreaming,
  onSubmit,
}: PreferencesFormProps) {
  const [values, setValues] = useState<Record<string, string | string[]>>({});

  if (isStreaming || !args.fields) {
    return (
      <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100">
        <div className="flex items-center gap-2 text-indigo-600">
          <div className="h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Preparing form...</span>
        </div>
      </div>
    );
  }

  const fields = args.fields;

  const isValid = fields.every((f) => {
    if (!f.required) return true;
    const val = values[f.id];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== "";
  });

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit(values);
  };

  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-indigo-100">
        <h3 className="text-base font-semibold text-slate-800">
          {args.title ?? "Your Preferences"}
        </h3>
        {args.description && (
          <p className="text-sm text-slate-500 mt-1">{args.description}</p>
        )}
      </div>

      <div className="px-5 py-4 space-y-5">
        {fields.map((field) => {
          switch (field.type) {
            case "select":
              return (
                <SelectField
                  key={field.id}
                  field={field}
                  value={(values[field.id] as string) ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [field.id]: v }))
                  }
                />
              );
            case "multi_select":
              return (
                <MultiSelectField
                  key={field.id}
                  field={field}
                  value={(values[field.id] as string[]) ?? []}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [field.id]: v }))
                  }
                />
              );
            case "text":
              return (
                <TextField
                  key={field.id}
                  field={field}
                  value={(values[field.id] as string) ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [field.id]: v }))
                  }
                />
              );
            default:
              return null;
          }
        })}
      </div>

      <div className="px-5 py-4 border-t border-indigo-100 bg-white/50">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                     disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Submit Preferences
        </button>
      </div>
    </div>
  );
}
