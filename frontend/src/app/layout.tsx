import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <CopilotKit
          runtimeUrl="/api/copilotkit"
          agent="weekend_agent"
        >
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
