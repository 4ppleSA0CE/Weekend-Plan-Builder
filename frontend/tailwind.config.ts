import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dusk: {
          deep: "var(--bg-deep)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
          hover: "var(--bg-hover)",
          cream: "var(--text-primary)",
          muted: "var(--text-secondary)",
          dim: "var(--text-dim)",
          copper: "var(--accent-copper)",
          amber: "var(--accent-amber)",
          sage: "var(--accent-sage)",
          rose: "var(--accent-rose)",
          border: "var(--border)",
          "border-accent": "var(--border-accent)",
        },
      },
      fontFamily: {
        display: ["var(--font-dm-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.5s ease-out both",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
