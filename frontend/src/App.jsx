import { useState } from "react";
import CodeInput from "./components/CodeInput";
import ReviewPanel from "./components/ReviewPanel";

function AgentThinking() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 px-8 bg-surface">
      <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center">
        <svg
          className="animate-spin-slow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="2"
        >
          <path d="M21 12a9 9 0 11-6.219-8.56" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-md text-primary">Agent is thinking...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [instruction, setInstruction] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileTab, setMobileTab] = useState("code");

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
      const data = await res.json();
      setResult(data);
      setMobileTab("review");
    } catch (err) {
      setError(err.message);
      setMobileTab("review");
    } finally {
      setLoading(false);
    }
  }

  const renderCodeInput = () => (
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
  );

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden font-sans">
      {/* Header */}
      <header className="border-b border-border flex flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3  shrink-0">
        <div className="flex items-center gap-3">
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
        <span className="font-mono text-md text-gray-200 ">Code Assistant Agent</span>
      </header>

      {/* Mobile tabbed layout */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden md:hidden">
        <div className="grid grid-cols-2 border-b border-border shrink-0 bg-bg">
          <button
            type="button"
            onClick={() => setMobileTab("code")}
            className={`py-3 text-sm font-medium border-b transition-colors ${
              mobileTab === "code"
                ? "border-primary text-primary"
                : "border-transparent text-secondary"
            }`}
          >
            Code Input
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("review")}
            className={`py-3 text-sm font-medium border-b transition-colors ${
              mobileTab === "review"
                ? "border-primary text-primary"
                : "border-transparent text-secondary"
            }`}
          >
            Review Panel
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {mobileTab === "code" ? (
            loading ? (
              <AgentThinking />
            ) : (
              <div className="h-full min-h-0 overflow-hidden bg-surface">
                {renderCodeInput()}
              </div>
            )
          ) : (
            <div className="h-full min-h-0 overflow-hidden bg-bg">
              <ReviewPanel result={result} loading={loading} error={error} />
            </div>
          )}
        </div>
      </main>

      {/* Desktop two column layout */}
      <main className="hidden flex-1 min-h-0 md:grid grid-cols-2 overflow-hidden">
        <div className="border-r border-border overflow-hidden flex flex-col bg-surface min-h-0">
          {renderCodeInput()}
        </div>
        <div className="overflow-hidden flex flex-col bg-bg min-h-0">
          <ReviewPanel result={result} loading={loading} error={error} />
        </div>
      </main>

      {/* Status bar */}
      <footer className="h-6 border-t border-border flex items-center justify-between px-4 sm:px-5 gap-3 shrink-0">
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
