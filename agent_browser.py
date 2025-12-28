from langchain_groq import ChatGroq
from browser_use import Agent
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

# We use the same GROQ_API_KEY you already have
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY")
)

async def run_browser_task(task_description):
    print(f"🌐 BROWSER AGENT STARTING (Powered by Llama 3): {task_description}")
    
    agent = Agent(
        task=task_description,
        llm=llm,
    )
    
    result = await agent.run()
    return result


    
