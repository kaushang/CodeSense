const LANGUAGES = ["python", "javascript", "typescript", "java", "c++", "go"];

export default function CodeInput({
  code,
  language,
  instruction,
  onCodeChange,
  onLanguageChange,
  onInstructionChange,
  onSubmit,
  loading,
}) {
  const disabled = loading || !code.trim() || !instruction.trim();

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest">
            Language
          </span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-bg border border-border rounded text-primary font-mono text-[11px] px-2 py-1 outline-none cursor-pointer appearance-none pr-5"
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
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
        </div>
      </div>

      {/* Editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line numbers */}
        <div className="w-11 shrink-0 py-4 bg-surface border-r border-border-subtle flex flex-col items-end pr-2.5 overflow-hidden select-none">
          {(code || "\n").split("\n").map((_, i) => (
            <div
              key={i}
              className="font-mono text-[12px] text-tertiary leading-[1.65]"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="// Paste your code here..."
          spellCheck={false}
          className="flex-1 bg-surface text-primary font-mono text-[12px] leading-[1.65] p-4 resize-none outline-none border-none caret-accent placeholder-tertiary"
        />
      </div>

      {/* Instruction input */}
      <div className="border-t border-border px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] text-tertiary uppercase tracking-widest">
            Instruction
          </span>
          <span className="font-mono text-[9px] text-red/60">required</span>
        </div>
        <input
          type="text"
          value={instruction}
          onChange={(e) => onInstructionChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !disabled && onSubmit()}
          placeholder="e.g. explain this code, find bugs, write tests, refactor it..."
          className="w-full bg-bg border border-border rounded px-3 py-2 text-[13px] text-primary placeholder-tertiary outline-none font-sans focus:border-secondary transition-colors duration-150"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border shrink-0">
        <span className="font-mono text-[10px] text-tertiary">
          {code.split("\n").length} lines / {code.length} chars
        </span>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 rounded text-[13px] font-medium transition-all duration-150
            ${
              disabled
                ? "bg-border text-tertiary cursor-not-allowed"
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
                width="11"
                height="11"
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
  );
}
