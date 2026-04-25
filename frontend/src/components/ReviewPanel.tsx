import ResultCard from "./ResultCard";

const TOOL_ORDER = [
  "bugs",
  "security",
  "quality",
  "explanation",
  "tests",
  "refactor",
];

export default function ReviewPanel({ result, loading, error }) {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border border-border rounded-lg flex items-center justify-center">
          <svg
            className="animate-spin-slow"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3a3a3a"
            strokeWidth="2"
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[13px] text-secondary">Agent is thinking...</p>
          <p className="text-[12px] text-tertiary mt-1">
            Selecting and running relevant tools
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 px-10">
        <div className="w-10 h-10 border border-red/20 rounded-lg flex items-center justify-center bg-red/5">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[13px] text-secondary font-medium">Agent failed</p>
          <p className="text-[12px] text-tertiary mt-2 leading-relaxed">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 px-10">
        <div className="w-10 h-10 border border-border rounded-lg flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3a3a3a"
            strokeWidth="1.5"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[13px] text-secondary">
            Paste code and give an instruction
          </p>
          <p className="text-[12px] text-tertiary mt-1">
            The agent will decide which tools to run
          </p>
        </div>
      </div>
    );
  }

  // Sort keys by preferred display order, unknown keys go to the end
  const toolsRan = Object.keys(result).sort((a, b) => {
    const ai = TOOL_ORDER.indexOf(a);
    const bi = TOOL_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div>
          <p className="font-mono text-[10px] text-tertiary uppercase tracking-widest mb-1">
            Tools Used
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {toolsRan.map((key) => (
              <span
                key={key}
                className="font-mono text-[10px] text-secondary bg-bg border border-border rounded px-2 py-0.5"
              >
                {key}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="font-mono text-[10px] text-tertiary uppercase tracking-widest">
            Ran
          </p>
          <p className="font-mono text-xl font-medium text-primary leading-none">
            {toolsRan.length}
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {toolsRan.map((key, i) => (
          <ResultCard key={key} toolKey={key} index={i} data={result[key]} />
        ))}
      </div>
    </div>
  );
}
