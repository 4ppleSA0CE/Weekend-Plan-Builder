"use client";

import { useState, type ReactNode } from "react";
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
    <div className="space-y-3">
      <label className="block text-[0.7rem] uppercase tracking-[0.2em] font-medium text-dusk-dim">
        {field.label}
        {field.required && <span className="text-dusk-rose ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-3.5 py-2 text-sm rounded-full border transition-all duration-200 ${
              value === opt
                ? "bg-gradient-to-br from-dusk-copper to-dusk-copper/85 text-dusk-cream border-dusk-copper shadow-[0_0_20px_-4px_rgba(200,121,65,0.45)]"
                : "bg-dusk-surface/60 text-dusk-muted border-dusk-border hover:border-dusk-copper/50 hover:text-dusk-cream"
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
    <div className="space-y-3">
      <label className="block text-[0.7rem] uppercase tracking-[0.2em] font-medium text-dusk-dim">
        {field.label}
        {field.required && <span className="text-dusk-rose ml-1">*</span>}
      </label>
      <div className="flex flex-wrap gap-2">
        {field.options?.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3.5 py-2 text-sm rounded-full border transition-all duration-200 ${
              value.includes(opt)
                ? "bg-gradient-to-br from-dusk-copper to-dusk-copper/85 text-dusk-cream border-dusk-copper shadow-[0_0_20px_-4px_rgba(200,121,65,0.45)]"
                : "bg-dusk-surface/60 text-dusk-muted border-dusk-border hover:border-dusk-copper/50 hover:text-dusk-cream"
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
    <div className="space-y-3">
      <label className="block text-[0.7rem] uppercase tracking-[0.2em] font-medium text-dusk-dim">
        {field.label}
        {field.required && <span className="text-dusk-rose ml-1">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? ""}
        className="w-full px-4 py-3 rounded-xl text-sm text-dusk-cream bg-dusk-deep/80 border border-dusk-border
                   placeholder:text-dusk-dim
                   focus:outline-none focus:ring-2 focus:ring-dusk-copper/50 focus:border-dusk-copper/60
                   transition-shadow"
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
      <div className="p-5 rounded-2xl bg-dusk-surface/90 border border-dusk-border-accent shadow-[0_0_32px_-12px_rgba(200,121,65,0.2)]">
        <div className="flex items-center gap-3 text-dusk-copper">
          <div className="h-4 w-4 border-2 border-dusk-copper border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium tracking-wide text-dusk-muted">
            Preparing form…
          </span>
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
    <div className="rounded-2xl border border-dusk-border-accent bg-dusk-surface/95 overflow-hidden shadow-[0_16px_48px_-20px_rgba(0,0,0,0.55)]">
      <div className="px-5 py-4 border-b border-dusk-border bg-gradient-to-r from-dusk-copper/10 to-transparent">
        <h3 className="font-display text-lg text-dusk-cream tracking-tight">
          {args.title ?? "Your preferences"}
        </h3>
        {args.description && (
          <p className="text-sm text-dusk-muted mt-2 leading-relaxed">
            {args.description}
          </p>
        )}
      </div>

      <div className="px-5 py-5 space-y-6">
        {fields.map((field, i) => {
          const wrap = (node: ReactNode) => (
            <div
              key={field.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              {node}
            </div>
          );
          switch (field.type) {
            case "select":
              return wrap(
                <SelectField
                  field={field}
                  value={(values[field.id] as string) ?? ""}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [field.id]: v }))
                  }
                />
              );
            case "multi_select":
              return wrap(
                <MultiSelectField
                  field={field}
                  value={(values[field.id] as string[]) ?? []}
                  onChange={(v) =>
                    setValues((prev) => ({ ...prev, [field.id]: v }))
                  }
                />
              );
            case "text":
              return wrap(
                <TextField
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

      <div className="px-5 py-4 border-t border-dusk-border bg-dusk-deep/50">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full px-4 py-3 rounded-xl text-sm font-semibold tracking-wide text-dusk-cream
                     bg-gradient-to-br from-dusk-copper via-dusk-copper to-dusk-amber/90
                     hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-dusk-copper/60 focus:ring-offset-2 focus:ring-offset-dusk-deep
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100
                     transition-all duration-200 shadow-[0_8px_28px_-8px_rgba(200,121,65,0.45)]"
        >
          Submit preferences
        </button>
      </div>
    </div>
  );
}
