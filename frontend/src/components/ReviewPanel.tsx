import ResultCard from "./ResultCard";

type ReviewPanelProps = {
  result?: Record<string, any>;
  loading: boolean;
  error?: string | null;
};

const TOOL_ORDER = [
  "bugs",
  "security",
  "quality",
  "explanation",
  "tests",
  "refactor",
];

export default function ReviewPanel({ result, loading, error }: ReviewPanelProps) {
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
          <p className="text-md text-priamry">Agent is thinking...</p>
          <p className="text-sm text-secondary">
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
        <div className="text-center">
          <p className="text-md text-gray-400/80">
            Paste code and give an instruction
          </p>
          <p className="text-xs text-gray-400/80">
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
      <div className="flex items-center px-5 py-3 border-b border-border shrink-0">
        <div className="flex gap-2 items-center">
          <p className="text-md text-primary pt-0.5">
            Tools Used: 
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {toolsRan.map((key) => (
              <span
                key={key}
                className="text-xs text-primary bg-border border-secondary capitalize rounded px-1 py-0.5 pt-1"
              >
                {key}
              </span>
            ))}
          </div>
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
