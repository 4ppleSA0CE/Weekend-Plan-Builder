# Weekend Plan Builder

A full-stack agentic web application that helps users plan personalized weekends. The app uses a conversational AI agent to gather preferences, search for real venues and activities, and produce a structured weekend plan rendered as polished UI.

![Architecture](https://img.shields.io/badge/Backend-Python%20%2B%20Agno-blue) ![Frontend](https://img.shields.io/badge/Frontend-Next.js%20%2B%20CopilotKit-black) ![Protocol](https://img.shields.io/badge/Protocol-AG--UI-green)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                             │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐ │
│  │ CopilotSidebar│  │  Main Content Area                      │ │
│  │  (Chat UI)    │  │  ┌──────────────────────────────────┐   │ │
│  │               │  │  │  WeekendPlanView (result panel)   │   │ │
│  │  ┌──────────┐ │  │  │  - Day cards with timelines       │   │ │
│  │  │ Prefs    │ │  │  │  - Activity details + costs       │   │ │
│  │  │ Form     │ │  │  │  - Source links from search       │   │ │
│  │  │ (in-chat)│ │  │  └──────────────────────────────────┘   │ │
│  │  └──────────┘ │  └──────────────────────────────────────────┘ │
│  └──────┬───────┘                                               │
│         │ AG-UI events                                          │
│  ┌──────┴────────────────┐                                      │
│  │ API Route /api/copilotkit │ ─── CopilotRuntime + EmptyAdapter │
│  └──────┬────────────────┘                                      │
└─────────┼───────────────────────────────────────────────────────┘
          │ POST /agui
┌─────────┴───────────────────────────────────────────────────────┐
│  Backend (Python + Agno)                                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Agno Agent (Gemini 2.5 Flash)                              ││
│  │  ┌──────────────────┐ ┌───────────┐ ┌────────────────────┐ ││
│  │  │collect_preferences│ │web_search │ │ set_weekend_plan   │ ││
│  │  │(external_execution)│ │(DuckDuckGo)│ │(external_execution)│ ││
│  │  └──────────────────┘ └───────────┘ └────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
│  AgentOS + AGUI interface (FastAPI, port 8000)                  │
└─────────────────────────────────────────────────────────────────┘
```

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A Google API key (for Gemini)

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
GOOGLE_API_KEY=your_google_api_key
```

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows

# Install dependencies
pip install -e .

# Run the backend
python main.py
```

The backend starts on `http://localhost:8000`. The AG-UI endpoint is at `POST /agui`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

The frontend starts on `http://localhost:3000`.

## Tool Schema Design

### 1. `collect_preferences` (frontend-executed)

The most important tool — it drives the generative UI for gathering user input.

**Design rationale:** Instead of defining a fixed set of questions, the tool uses a flexible `fields` array where each field has a `type`, `label`, `options`, etc. This lets the agent decide *at runtime* which preferences to collect based on what the user already mentioned. If the user says "Plan a weekend in NYC," the agent won't ask for the city again.

**Schema:**
```python
collect_preferences(
    title: str,           # Form heading
    description: str,     # Context for the user
    fields: list[dict]    # Dynamic field definitions
)
```

Each field supports 3 input types:
- **`select`** — Single-choice pill buttons (budget range, group type)
- **`multi_select`** — Multi-choice pill buttons (interests, vibes)
- **`text`** — Free-text input (dietary restrictions, special requests)

The frontend renders each field based on its `type` and returns a `Record<string, string | string[]>` back to the agent.

### 2. `web_search` (backend-executed)

A DuckDuckGo wrapper that grounds the plan in real data.

```python
web_search(
    query: str,           # Search query including city name
    max_results: int = 5  # Number of results
)
```

Returns formatted search results with title, URL, and snippet. The agent uses this to find real venues, restaurants, and activities. Source URLs are carried through to the final plan.

### 3. `set_weekend_plan` (frontend-executed)

Delivers the structured plan to the frontend for rendering outside the chat.

```python
set_weekend_plan(
    title: str,
    city: str,
    summary: str,
    budget_note: str,
    days: list[dict]      # Day-by-day breakdown with timed activities
)
```

Each day contains a theme and a list of activity items with: time, title, category (`food`/`activity`/`rest`/`travel`), location, note, estimated cost, and source URL. This structure gives the frontend enough data to render a rich, categorized timeline.

## How the Frontend Maps Tool Schemas to UI

1. **`collect_preferences`** → Uses CopilotKit's `renderAndWaitForResponse` pattern. The `PreferencesForm` component dynamically renders fields based on the `type` property:
   - `select` → Pill button group (single selection)
   - `multi_select` → Pill button group (multi selection)
   - `text` → Text input with placeholder
   
   The form waits for user submission before calling `respond()` to return the result to the agent.

2. **`set_weekend_plan`** → Uses a standard `handler` + `render` pattern. The handler sets the plan into React state; the `WeekendPlanView` component renders it in the main content area with:
   - Day header cards with gradient backgrounds
   - Activity cards color-coded by category
   - Cost badges, location pins, and source links

3. **`web_search`** → Marked as `available: "remote"` so execution happens on the backend. The `render` function shows a search-in-progress spinner and a completion indicator in the chat.

## End-to-End Flow

1. User types a planning request (e.g., "Plan a fun weekend in NYC for two under $300")
2. Agent responds with streamed text and calls `collect_preferences` with contextual fields
3. Frontend renders an interactive preference form in the chat
4. User fills out and submits the form
5. Agent receives preferences and calls `web_search` multiple times for venues, food, activities
6. Search progress is shown in the chat
7. Agent synthesizes results and calls `set_weekend_plan` with a structured plan
8. The weekend plan renders in the main content panel with day cards, activity timelines, costs, and source links
9. Agent sends a follow-up message asking if the user wants changes

## Trade-offs & Improvements

**Current trade-offs:**
- **v1 CopilotKit API**: Uses `useCopilotAction` with `Parameter[]` arrays instead of the newer v2 Zod-based `useFrontendTool` due to a barrel export compatibility issue with Next.js 15. The v1 API is stable and fully functional.
- **DuckDuckGo for search**: Free and requires no API key, but less reliable than paid search APIs. Sufficient for demo purposes.
- **Single model**: Uses one model for all tasks. A production system might use cheaper models for search query generation.

**With more time:**
- Add plan editing — let users modify individual activities or request re-planning
- Persist conversation threads across page refreshes
- Add map integration showing activity locations
- Support date-specific planning (weather, events on specific dates)
- Add more input types (date picker, slider for budget, star rating)
- Improve error handling with retry logic for failed searches
- Add loading skeletons for the plan view while it streams in
- Mobile-responsive layout optimization
