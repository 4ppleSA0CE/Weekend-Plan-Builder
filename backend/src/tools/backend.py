from agno.tools import tool
from duckduckgo_search import DDGS


@tool
def web_search(query: str, max_results: int = 5) -> str:
    """Search the web for current information about activities, venues, restaurants, events, etc.

    Use this to find real, up-to-date places and activities for the weekend plan.
    Include the city name and specifics in your query for best results.

    Args:
        query: The search query (e.g. "best brunch spots in Brooklyn 2026")
        max_results: Maximum number of results to return (default 5)
    """
    results = DDGS().text(query, max_results=max_results)
    formatted = []
    for r in results:
        formatted.append(
            f"Title: {r['title']}\nURL: {r['href']}\nSnippet: {r['body']}"
        )
    return "\n\n".join(formatted) if formatted else "No results found."
