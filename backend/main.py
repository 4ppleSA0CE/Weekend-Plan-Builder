from dotenv import load_dotenv
load_dotenv()

from agno.os import AgentOS
from agno.os.interfaces.agui import AGUI

from src.agent import weekend_agent

agent_os = AgentOS(
    agents=[weekend_agent],
    interfaces=[AGUI(agent=weekend_agent)],
)
app = agent_os.get_app()

if __name__ == "__main__":
    agent_os.serve(app="main:app", host="0.0.0.0", port=8000, reload=True)
