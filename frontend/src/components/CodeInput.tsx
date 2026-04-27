import Editor from "@monaco-editor/react";
import hljs from "highlight.js";

const LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "cpp",
  "go",
];

type CodeInputProps = {
  code: string;
  language: string;
  instruction: string;
  onCodeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onInstructionChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
};

const mapToMonaco = (lang: string) => {
  const map: Record<string, string> = {
    python: "python",
    javascript: "javascript",
    typescript: "typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
    go: "go",
  };

  return map[lang] || "javascript";
};

export default function CodeInput({
  code,
  language,
  instruction,
  onCodeChange,
  onLanguageChange,
  onInstructionChange,
  onSubmit,
  loading,
}: CodeInputProps) {
  const disabled = loading || !code.trim() || !instruction.trim();

const handleCodeChange = (value: string) => {
  onCodeChange(value);

  if (value.trim().length > 20) {
    const detected = hljs.highlightAuto(value, [
      "python",
      "javascript",
      "typescript",
      "java",
      "cpp",
      "c",
      "go",
    ]).language;

    if (detected) {
      onLanguageChange(mapToMonaco(detected));
    }
  }
};

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-border shrink-0 gap-3">
        <div className="flex items-center gap-2">
          <span className="text-md text-gray-200">Language:</span>

          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-bg border border-border rounded text-primary text-[11px] px-2 py-1 outline-none cursor-pointer appearance-none pr-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b6b6b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 6px center",
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Editor
          key={language}
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => handleCodeChange(value || "")}
          options={{
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 13,
          }}
        />
      </div>

      {/* Bottom panel */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-4">
          <div className="w-full lg:flex-1 min-w-0">
            <div className="flex flex-row items-center sm:gap-2 gap-1 mb-2">
              <span className="text-lg text-gray-200 font-sans">Instructions</span>
              <span className="text-xs text-red/60">(required)</span>
            </div>

            <input
              type="text"
              value={instruction}
              onChange={(e) => onInstructionChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !disabled && onSubmit()}
              placeholder="e.g. explain this code, find bugs, write tests..."
              className="w-full bg-bg border border-border rounded px-3 py-2 text-[13px] text-primary placeholder-secondary outline-none font-sans focus:border-secondary transition-colors duration-150"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={disabled}
            className={`w-full lg:w-auto flex items-center justify-center lg:mt-auto gap-2 px-4 py-2 rounded text-md font-medium transition-all duration-150 ${
              disabled
                ? "bg-secondary text-tertiary cursor-not-allowed"
                : "bg-primary text-bg cursor-pointer hover:bg-accent"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin-slow"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Run Agent
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
