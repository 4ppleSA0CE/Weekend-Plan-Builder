import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";
import { NextRequest } from "next/server";

const backendBase = (process.env.BACKEND_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

export const POST = async (req: NextRequest) => {
  const runtime = new CopilotRuntime({
    agents: {
      weekend_agent: new HttpAgent({
        url: `${backendBase}/agui`,
      }),
    },
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
