from agno.tools import tool


@tool(external_execution=True)
def collect_preferences(
    title: str,
    description: str,
    fields: list[dict],
) -> str:
    """Collect structured preferences from the user via an interactive form.

    Call this tool to gather specific user preferences before planning.
    The frontend will render an interactive form based on the fields you provide
    and return the user's selections.

    Args:
        title: Title for the preferences form (e.g. "Weekend Preferences")
        description: Brief context explaining what info is needed
        fields: List of field definitions. Each field is a dict with:
            - id (str): unique field identifier (e.g. "budget", "vibe")
            - label (str): display label shown to the user
            - type (str): one of "select", "text", "multi_select"
            - required (bool): whether the field must be filled
            - options (list[str], optional): choices for select/multi_select types
            - placeholder (str, optional): placeholder text for text fields
    """


@tool(external_execution=True)
def set_weekend_plan(
    title: str,
    city: str,
    summary: str,
    budget_note: str,
    days: list[dict],
) -> str:
    """Deliver the final weekend plan to be rendered in the UI.

    Call this tool ONLY after you have gathered preferences and searched for
    real venues/activities. The frontend will render this as a structured plan.

    Args:
        title: Plan title (e.g. "NYC Weekend for Two")
        city: City name
        summary: 1-2 sentence summary of the weekend plan
        budget_note: Budget estimate or note (e.g. "Estimated total: $250-300")
        days: List of day plans. Each day is a dict with:
            - day (str): "Saturday" or "Sunday"
            - theme (str): theme for the day (e.g. "Culture & Cuisine")
            - items (list[dict]): activities, each with:
                - time (str): e.g. "10:00 AM"
                - title (str): activity name
                - category (str): one of "food", "activity", "rest", "travel"
                - location (str, optional): venue name or address
                - note (str, optional): brief note or tip
                - estimated_cost (float, optional): cost in dollars
                - source_url (str, optional): link from web search results
    """
