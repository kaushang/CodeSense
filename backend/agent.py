import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage
from tools import detect_bugs, check_security, check_quality, explain_code, generate_tests, refactor_code
from dotenv import load_dotenv
import os

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

tools = [detect_bugs, check_security, check_quality, explain_code, generate_tests, refactor_code]

prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="""You are an expert AI code assistant agent. You have access to six tools:

1. detect_bugs - finds logical errors, wrong conditions, unhandled exceptions, off-by-one errors
2. check_security - finds SQL injection, hardcoded secrets, unsafe input handling, exposed sensitive data
3. check_quality - checks naming conventions, redundant code, missing error handling, readability
4. explain_code - explains what the code does in plain English with inputs, outputs, and logic steps
5. generate_tests - generates unit test cases with actual test code for the given language
6. refactor_code - rewrites the code to be cleaner and more readable, explains what changed

RULES:
- Read the user's instruction carefully and call ONLY the tools relevant to that specific request
- Do NOT call tools that are not needed for the task
- You may call multiple tools if the instruction requires it
- Use the result of one tool to decide if another tool is needed
- Every tool requires a JSON string input with 'code' and 'language' keys

Examples of correct behavior:
- "explain this code" -> call explain_code only
- "find bugs and write tests" -> call detect_bugs, then generate_tests
- "is this secure?" -> call check_security only
- "clean this up" -> call check_quality, then refactor_code
- "full review" -> call detect_bugs, check_security, check_quality
"""),
    ("human", "Code ({language}):\n{code}\n\nInstruction: {instruction}"),
    ("placeholder", "{agent_scratchpad}"),
])

agent = create_tool_calling_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True, return_intermediate_steps=True)

def clean_json(text: str) -> dict:
    text = text.strip()
    import re
    text = re.sub(r"^```(?:json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    return json.loads(text)

def run_agent(code: str, language: str, instruction: str) -> dict:
    print(f"\n[Agent] Instruction: {instruction}")
    print(f"[Agent] Language: {language}")

    result = executor.invoke({
        "code": code,
        "language": language,
        "instruction": instruction,
    })

    # Parse intermediate steps to extract which tools were called and their results
    tool_results = {}
    for step in result.get("intermediate_steps", []):
        action, observation = step
        tool_name = action.tool
        try:
            parsed = clean_json(observation)
        except Exception:
            parsed = {"raw": observation}

        # Map tool names to clean keys
        key_map = {
            "detect_bugs": "bugs",
            "check_security": "security",
            "check_quality": "quality",
            "explain_code": "explanation",
            "generate_tests": "tests",
            "refactor_code": "refactor",
        }
        key = key_map.get(tool_name, tool_name)
        tool_results[key] = parsed
        print(f"[Agent] Tool called: {tool_name} -> stored as '{key}'")

    return tool_results