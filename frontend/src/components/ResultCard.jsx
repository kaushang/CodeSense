// Existing three tools - severity based cards
const SEVERITY = {
  clean: {
    label: "CLEAN",
    text: "text-green",
    bg: "bg-green/8",
    dot: "bg-green",
    border: "border-green/10",
  },
  warning: {
    label: "WARNING",
    text: "text-yellow",
    bg: "bg-yellow/8",
    dot: "bg-yellow",
    border: "border-yellow/10",
  },
  critical: {
    label: "CRITICAL",
    text: "text-red",
    bg: "bg-red/8",
    dot: "bg-red",
    border: "border-red/10",
  },
};

const TEST_TYPE_COLORS = {
  normal: "text-green bg-green/8 border-green/10",
  edge: "text-yellow bg-yellow/8 border-yellow/10",
  error: "text-red bg-red/8 border-red/10",
};

// ---- Severity card (bugs, security, quality) ----
function SeverityCard({ title, index, data }) {
  const s = SEVERITY[data.severity] || SEVERITY.clean;
  const hasIssues = data.issues?.length > 0;

  return (
    <div
      className="bg-surface border border-border rounded-md overflow-hidden animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-medium text-primary tracking-tight">
            {title}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 ${s.bg} border ${s.border} rounded px-2 py-1`}
        >
          <div className={`w-1 h-1 rounded-full ${s.dot}`} />
          <span
            className={`font-mono text-[9px] font-medium ${s.text} tracking-widest`}
          >
            {s.label}
          </span>
        </div>
      </div>
      <div className="px-4 py-3">
        {hasIssues ? (
          <ul className="flex flex-col gap-2.5">
            {data.issues.map((issue, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <div
                  className={`mt-[7px] shrink-0 w-1 h-1 rounded-full ${s.dot} opacity-60`}
                />
                <span className="text-[13px] text-secondary leading-relaxed">
                  {issue}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-2">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="text-[13px] text-secondary">No issues found</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Explainer card ----
function ExplainerCard({ index, data }) {
  return (
    <div
      className="bg-surface border border-border rounded-md overflow-hidden animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-medium text-primary tracking-tight">
            Code Explanation
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/10 rounded px-2 py-1">
          <div className="w-1 h-1 rounded-full bg-primary opacity-40" />
          <span className="font-mono text-[9px] text-secondary tracking-widest">
            EXPLAIN
          </span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Summary */}
        <div>
          <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
            Summary
          </p>
          <p className="text-[13px] text-secondary leading-relaxed">
            {data.summary}
          </p>
        </div>

        {/* Inputs */}
        {data.inputs?.length > 0 && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Inputs
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.inputs.map((inp, i) => (
                <span
                  key={i}
                  className="font-mono text-[11px] text-secondary bg-bg border border-border rounded px-2 py-0.5"
                >
                  {inp}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Outputs */}
        {data.outputs && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Output
            </p>
            <p className="text-[13px] text-secondary leading-relaxed">
              {data.outputs}
            </p>
          </div>
        )}

        {/* Logic steps */}
        {data.logic_steps?.length > 0 && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Logic Steps
            </p>
            <ol className="flex flex-col gap-2">
              {data.logic_steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="font-mono text-[10px] text-tertiary shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13px] text-secondary leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Test Generator card ----
function TestGeneratorCard({ index, data }) {
  return (
    <div
      className="bg-surface border border-border rounded-md overflow-hidden animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-medium text-primary tracking-tight">
            Test Cases
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow/8 border border-yellow/10 rounded px-2 py-1">
          <div className="w-1 h-1 rounded-full bg-yellow" />
          <span className="font-mono text-[9px] text-yellow tracking-widest uppercase">
            {data.framework || "tests"}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Test cases table */}
        {data.test_cases?.length > 0 && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Test Cases
            </p>
            <div className="border border-border rounded overflow-hidden">
              <div className="grid grid-cols-3 bg-bg px-3 py-2 border-b border-border">
                <span className="font-mono text-[9px] text-tertiary uppercase tracking-wider">
                  Name
                </span>
                <span className="font-mono text-[9px] text-tertiary uppercase tracking-wider">
                  Expected
                </span>
                <span className="font-mono text-[9px] text-tertiary uppercase tracking-wider">
                  Type
                </span>
              </div>
              {data.test_cases.map((tc, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-3 px-3 py-2 items-center ${i < data.test_cases.length - 1 ? "border-b border-border-subtle" : ""}`}
                >
                  <span className="text-[12px] text-secondary pr-2 truncate">
                    {tc.name}
                  </span>
                  <span className="text-[12px] text-secondary pr-2 truncate font-mono">
                    {tc.expected_output}
                  </span>
                  <span
                    className={`font-mono text-[9px] w-fit px-1.5 py-0.5 rounded border ${TEST_TYPE_COLORS[tc.type] || TEST_TYPE_COLORS.normal}`}
                  >
                    {tc.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test code block */}
        {data.test_code && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Test Code
            </p>
            <div className="bg-bg border border-border rounded overflow-auto max-h-64">
              <pre className="font-mono text-[11px] text-secondary leading-relaxed p-3 whitespace-pre">
                {data.test_code}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Refactor card ----
function RefactorCard({ index, data }) {
  return (
    <div
      className="bg-surface border border-border rounded-md overflow-hidden animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-[13px] font-medium text-primary tracking-tight">
            Refactored Code
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-green/8 border border-green/10 rounded px-2 py-1">
          <div className="w-1 h-1 rounded-full bg-green" />
          <span className="font-mono text-[9px] text-green tracking-widest">
            REFACTOR
          </span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Issues found */}
        {data.issues_found?.length > 0 && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Issues Found
            </p>
            <ul className="flex flex-col gap-2">
              {data.issues_found.map((issue, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-yellow opacity-60" />
                  <span className="text-[13px] text-secondary leading-relaxed">
                    {issue}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Refactored code block */}
        {data.refactored_code && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Refactored Code
            </p>
            <div className="bg-bg border border-border rounded overflow-auto max-h-64">
              <pre className="font-mono text-[11px] text-secondary leading-relaxed p-3 whitespace-pre">
                {data.refactored_code}
              </pre>
            </div>
          </div>
        )}

        {/* Changes made */}
        {data.changes_made?.length > 0 && (
          <div>
            <p className="font-mono text-[9px] text-tertiary uppercase tracking-widest mb-2">
              Changes Made
            </p>
            <ul className="flex flex-col gap-2">
              {data.changes_made.map((change, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-green opacity-60" />
                  <span className="text-[13px] text-secondary leading-relaxed">
                    {change}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Main export - routes to correct card type ----
export default function ResultCard({ toolKey, index, data }) {
  if (toolKey === "explanation")
    return <ExplainerCard index={index} data={data} />;
  if (toolKey === "tests")
    return <TestGeneratorCard index={index} data={data} />;
  if (toolKey === "refactor") return <RefactorCard index={index} data={data} />;

  // bugs, security, quality
  const titles = {
    bugs: "Bug Detection",
    security: "Security Analysis",
    quality: "Code Quality",
  };
  return (
    <SeverityCard
      title={titles[toolKey] || toolKey}
      index={index}
      data={data}
    />
  );
}
