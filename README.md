# CodeSense
 
An AI-powered code assistant agent that accepts a code snippet and a natural language instruction, reasons about the intent, and autonomously selects and runs only the relevant analysis tools. Built with LangChain, Google Gemini, FastAPI, and React.js.
 
---
 
## What Makes This an Agent - Not a Pipeline
 
Most code review tools run every check on every submission regardless of what the user asked. CodeSense is different. The LangChain agent reads the user's natural language instruction alongside the code, reasons about which tools are actually relevant to fulfill that specific request, and calls only those tools - sometimes one, sometimes three, depending on the task.
 
Calling the wrong tool does not just waste time - it produces irrelevant results. The agent is designed so that tool selection directly affects output quality, which forces genuine reasoning on every request.
 
---
 
## Tech Stack
 
**Backend**
- Python 3.11
- FastAPI - REST API server
- LangChain 0.3.x - agent framework and tool orchestration
- `langchain-google-genai` - Gemini API integration
- Google Gemini 2.5 Flash - underlying LLM for both the agent and all tools
- Uvicorn - ASGI server
- Python-dotenv - environment variable management
**Frontend**
- React.js with Vite
- Tailwind CSS v4 - utility-first styling
- DM Sans + DM Mono - typography
**DevOps**
- Render - backend deployment
- Vercel - frontend deployment
- GitHub - version control
---
 
## Project Structure
 
```
codesense/
  backend/
    main.py         - FastAPI server, request validation, CORS
    agent.py        - LangChain agent setup, tool selection logic, result parsing
    tools.py        - Six tool definitions, each calling Gemini with a focused prompt
    requirements.txt
    .env
  frontend/
    src/
      components/
        CodeInput.jsx    - Language selector, code editor, instruction input
        ReviewPanel.jsx  - Dynamic results panel, renders only tools that ran
        ResultCard.jsx   - Six card layouts, one per tool type
      App.jsx
      main.jsx
```
 
---
 
## The Six Tools
 
Each tool is a focused single-purpose function decorated with LangChain's `@tool` decorator. Every tool takes a JSON string input containing `code` and `language`, sends the code to Gemini with a specific system prompt, and returns structured JSON.
 
| Tool | Purpose | Returns |
|---|---|---|
| `detect_bugs` | Finds logical errors, off-by-one errors, unhandled exceptions, wrong conditions | `severity`, `issues[]` |
| `check_security` | Finds SQL injection, hardcoded secrets, unsafe input handling, exposed sensitive data | `severity`, `issues[]` |
| `check_quality` | Checks naming conventions, redundant code, missing error handling, readability | `severity`, `issues[]` |
| `explain_code` | Explains what the code does in plain English with inputs, outputs, and logic steps | `summary`, `inputs[]`, `outputs`, `logic_steps[]` |
| `generate_tests` | Generates unit test cases with actual written test code for the given language | `framework`, `test_cases[]`, `test_code` |
| `refactor_code` | Rewrites the code to be cleaner and more readable, explains what changed | `issues_found[]`, `refactored_code`, `changes_made[]` |
 
---
 
## Agent Architecture and Full Request Flow
 
```
User inputs:
  - Code snippet
  - Language selection
  - Natural language instruction
          |
          v
React frontend sends POST /review
{
  "code": "...",
  "language": "...",
  "instruction": "..."
}
          |
          v
FastAPI receives request
Validates all three fields are non-empty
Calls run_agent(code, language, instruction)
          |
          v
LangChain AgentExecutor initializes
System prompt + all 6 tools passed to Gemini 2.5 Flash
          |
          v
Agent reasoning loop begins:
 
  Step 1 - Agent reads the instruction and reasons about intent
  Step 2 - Agent decides which tool(s) to call first
  Step 3 - Agent calls the tool with { "code": "...", "language": "..." }
  Step 4 - Tool sends code to Gemini with a focused single-purpose prompt
  Step 5 - Gemini returns structured JSON
  Step 6 - Agent reads the tool result
  Step 7 - Agent decides if another tool is needed based on the result
  Step 8 - Repeat until the instruction is fully fulfilled
          |
          v
AgentExecutor returns intermediate_steps[]
Each step contains: (tool_name, raw_json_output)
          |
          v
run_agent() parses intermediate_steps
Maps tool names to clean keys:
  detect_bugs   -> "bugs"
  check_security -> "security"
  check_quality  -> "quality"
  explain_code   -> "explanation"
  generate_tests -> "tests"
  refactor_code  -> "refactor"
          |
          v
FastAPI returns combined JSON response
Only keys for tools that actually ran are present
          |
          v
ReviewPanel renders one card per key returned
Cards that were not needed are never shown
```
 
---
 
## Tool Selection Examples
 
The agent selects tools based on the instruction. These are real examples of correct behavior:
 
| Instruction | Tools Called |
|---|---|
| `explain this code` | `explain_code` |
| `is this code secure?` | `check_security` |
| `write unit tests` | `generate_tests` |
| `find bugs and write tests to verify fixes` | `detect_bugs`, `generate_tests` |
| `this feels messy, clean it up` | `check_quality`, `refactor_code` |
| `do a full review` | `detect_bugs`, `check_security`, `check_quality` |
| `explain this and check for bugs` | `explain_code`, `detect_bugs` |
 
---
 
## How Each Tool Prompt Is Designed
 
Each tool uses a single-purpose system prompt with three specific constraints:
 
1. **Role isolation** - the prompt tells Gemini it is only that specific tool, nothing else. The bug detector does not comment on code quality. The explainer does not flag security issues.
2. **Strict JSON output** - every prompt explicitly says "Return ONLY a raw JSON object with no markdown, no explanation, no code fences." A `clean_json()` utility strips any code fences Gemini adds anyway.
3. **Temperature 0** - all tool calls use `temperature=0` for deterministic, consistent structured output. The agent itself also uses temperature 0 for reliable tool selection.
---
 
## API Reference
 
### `POST /review`
 
**Request**
```json
{
  "code": "def add(a, b):\n    return a + b",
  "language": "python",
  "instruction": "explain this code and find any bugs"
}
```
 
**Response** - only keys for tools that ran are present
```json
{
  "explanation": {
    "tool": "explainer",
    "summary": "This function takes two numbers and returns their sum.",
    "inputs": ["a", "b"],
    "outputs": "The sum of a and b",
    "logic_steps": ["Accept two arguments", "Return their sum"]
  },
  "bugs": {
    "severity": "clean",
    "issues": []
  }
}
```
 
### `GET /health`
Returns `{ "status": "ok" }` - used to verify the backend is running.
 
---
 
## Running Locally
 
**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
```
 
Create a `.env` file in the `backend` folder:
```
GEMINI_API_KEY=your_key_here
```
 
Start the server:
```bash
uvicorn main:app --reload
```
 
Backend runs on `http://localhost:8000`
 
**Frontend**
```bash
cd frontend
npm install
```
 
Create a `.env` file in the `frontend` folder:
```
VITE_API_URL=http://localhost:8000
```
 
Start the dev server:
```bash
npm run dev
```
 
Frontend runs on `http://localhost:5173`
 
---
 
## Environment Variables
 
| Variable | Location | Description |
|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` | Google Gemini API key from aistudio.google.com |
| `VITE_API_URL` | `frontend/.env` | Backend base URL |
 
---
 
## Deployment
 
- Backend is deployed on **Render** as a web service with `uvicorn main:app --host 0.0.0.0 --port $PORT` as the start command
- Frontend is deployed on **Vercel** with `VITE_API_URL` set to the Render backend URL
- CORS is configured to allow requests from `*.vercel.app` and `localhost:5173`