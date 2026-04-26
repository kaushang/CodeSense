import json
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.tools import tool
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0)

def clean_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    text = re.sub(r"^`", "", text).strip()
    text = re.sub(r"`$", "", text).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"[Tools] JSON decode error: {e}")
        print(f"[Tools] Raw text was: {text[:300]}")
        raise

def parse_input(input: str) -> tuple:
    """Safely parse tool input handling special characters in code."""
    try:
        data = json.loads(input)
        return data["code"], data["language"]
    except json.JSONDecodeError:
        try:
            lang_match = re.search(r'"language"\s*:\s*"([^"]+)"', input)
            language = lang_match.group(1) if lang_match else "unknown"
            code_match = re.search(r'"code"\s*:\s*"(.*)",\s*"language"', input, re.DOTALL)
            if not code_match:
                code_match = re.search(r'"code"\s*:\s*"(.*)"', input, re.DOTALL)
            code = code_match.group(1) if code_match else input
            code = code.replace('\\n', '\n').replace('\\t', '\t')
            print(f"[Tools] Used fallback parser, language: {language}")
            return code, language
        except Exception as e:
            print(f"[Tools] Input parse fallback failed: {e}")
            return input, "unknown"

@tool
def detect_bugs(input: str) -> str:
    """Detects bugs in code. Input must be a JSON string with 'code' and 'language' keys."""
    code, language = parse_input(input)
    prompt = f"""You are a bug detection tool. Analyze the following {language} code strictly for bugs.

Look for: logical errors, off-by-one errors, null/undefined references, infinite loops, wrong conditions, unhandled exceptions.

Return ONLY a raw JSON object with no markdown, no explanation, no code fences. Format:
{{"severity": "clean" | "warning" | "critical", "issues": ["issue 1", "issue 2"]}}

If no issues found, return: {{"severity": "clean", "issues": []}}

Code:
{code}"""
    response = llm.invoke(prompt)
    return response.content

@tool
def check_security(input: str) -> str:
    """Checks code for security vulnerabilities. Input must be a JSON string with 'code' and 'language' keys."""
    code, language = parse_input(input)
    prompt = f"""You are a security analysis tool. Analyze the following {language} code strictly for security vulnerabilities.

Look for: SQL injection, hardcoded secrets or API keys, unsafe user input handling, insecure dependencies, exposed sensitive data.

Return ONLY a raw JSON object with no markdown, no explanation, no code fences. Format:
{{"severity": "clean" | "warning" | "critical", "issues": ["issue 1", "issue 2"]}}

If no issues found, return: {{"severity": "clean", "issues": []}}

Code:
{code}"""
    response = llm.invoke(prompt)
    return response.content

@tool
def check_quality(input: str) -> str:
    """Checks code quality. Input must be a JSON string with 'code' and 'language' keys."""
    code, language = parse_input(input)
    prompt = f"""You are a code quality analysis tool. Analyze the following {language} code strictly for quality issues.

Look for: poor naming conventions, redundant or dead code, missing error handling, overly complex logic, lack of comments on complex sections.

Return ONLY a raw JSON object with no markdown, no explanation, no code fences. Format:
{{"severity": "clean" | "warning" | "critical", "issues": ["issue 1", "issue 2"]}}

If no issues found, return: {{"severity": "clean", "issues": []}}

Code:
{code}"""
    response = llm.invoke(prompt)
    return response.content

@tool
def explain_code(input: str) -> str:
    """Explains what a piece of code does in plain English. Input must be a JSON string with 'code' and 'language' keys."""
    code, language = parse_input(input)
    prompt = f"""You are a code explainer. Explain the following {language} code in simple plain English.

Return ONLY a raw JSON object with no markdown, no explanation, no code fences. Format:
{{
  "tool": "explainer",
  "summary": "one paragraph plain English explanation of what this code does",
  "inputs": ["input1", "input2"],
  "outputs": "what the code returns or produces",
  "logic_steps": ["step 1", "step 2", "step 3"]
}}

Code:
{code}"""
    response = llm.invoke(prompt)
    return response.content

@tool
def generate_tests(input: str) -> str:
    """Generates unit test cases for code. Input must be a JSON string with 'code' and 'language' keys."""
    code, language = parse_input(input)
    prompt = f"""You are a test case generator. Generate unit tests for the following {language} code.

Cover normal cases, edge cases, and error cases. Write actual test code using the appropriate framework for {language}.

Return ONLY a raw JSON object with no markdown, no explanation, no code fences. Format:
{{
  "tool": "test_generator",
  "framework": "pytest or jest or junit depending on language",
  "test_cases": [
    {{
      "name": "test case name",
      "input": "input value",
      "expected_output": "expected result",
      "type": "normal or edge or error"
    }}
  ],
  "test_code": "the full written test code as a single string with newlines as \\n"
}}

Code:
{code}"""
    response = llm.invoke(prompt)
    return response.content

@tool
def refactor_code(input: str) -> str:
    """Refactors code to be cleaner and more readable. Input must be a JSON string with 'code' and 'language' keys."""
    code, language = parse_input(input)
    prompt = f"""You are a code refactoring expert. Suggest a cleaner, more readable rewritten version of the following {language} code.

Return ONLY a raw JSON object with no markdown, no explanation, no code fences. Format:
{{
  "tool": "refactor",
  "issues_found": ["issue 1", "issue 2"],
  "refactored_code": "the full rewritten code as a single string with newlines as \\n",
  "changes_made": ["change 1", "change 2"]
}}

Code:
{code}"""
    response = llm.invoke(prompt)
    return response.content