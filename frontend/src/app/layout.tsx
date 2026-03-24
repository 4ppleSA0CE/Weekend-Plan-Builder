import type { Metadata } from "next";
import { DM_Serif_Display, JetBrains_Mono, Outfit } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weekend Plan Builder",
  description: "AI-powered weekend planning with real venues and activities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <CopilotKit runtimeUrl="/api/copilotkit" agent="weekend_agent">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
