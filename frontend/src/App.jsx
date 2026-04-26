import { useState } from "react";
import CodeInput from "./components/CodeInput";
import ReviewPanel from "./components/ReviewPanel";

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleReview() {
    if (!code.trim() || !instruction.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, instruction }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Something went wrong");
      }
      setResult(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden font-sans">
      {/* Header */}
      <header className="border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3 py-3">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="2.5"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className="text-xl text-primary tracking-tight">CodeSense</span>
        </div>
        <span className="font-mono text-sm text-gray-200">
          AI Code Assistant
        </span>
      </header>

      {/* Two column layout */}
      <main className="flex-1 min-h-0 grid grid-cols-2 overflow-hidden">
        <div className="border-r border-border overflow-hidden flex flex-col bg-surface min-h-0">
          <CodeInput
            code={code}
            language={language}
            instruction={instruction}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onInstructionChange={setInstruction}
            onSubmit={handleReview}
            loading={loading}
          />
        </div>
        <div className="overflow-hidden flex flex-col bg-bg">
          <ReviewPanel result={result} loading={loading} error={error} />
        </div>
      </main>

      {/* Status bar */}
      <footer className="h-6 border-t border-border flex items-center px-5 gap-5 shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-green" />
          <span className="font-mono text-[10px] text-gray-200">
            Powered by Gemini 2.5 Flash
          </span>
        </div>
      </footer>
    </div>
  );
}
