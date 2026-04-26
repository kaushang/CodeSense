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
      className="bg-surface border border-border rounded-md animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="text-md text-priamry">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg font-medium text-primary">{title}</span>
        </div>
        <div
          className={`flex items-center gap-1.5 ${s.bg} border ${s.border} rounded px-2 py-1`}
        >
          <div className={`w-1 h-1 rounded-full ${s.dot}`} />
          <span className={`text-xs font-medium ${s.text} tracking-widest`}>
            {s.label}
          </span>
        </div>
      </div>
      <div className="px-4 py-2">
        {hasIssues ? (
          <ul className="flex flex-col gap-2.5">
            {data.issues.map((issue, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <div
                  className={`mt-[7px] shrink-0 w-2 h-2 rounded-full ${s.dot} opacity-60`}
                />
                <span className="text-md text-prisec leading-relaxed">
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
            <span className="text-md text-secondary">No issues found</span>
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
      className="bg-surface border border-border rounded-md animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="text-md text-priamry">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg font-medium text-primary  ">
            Code Explanation
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/5 border border-primary/20 rounded px-2 py-1">
          <div className="w-1 h-1 rounded-full bg-primary opacity-60" />
          <span className="text-xs text-secondary tracking-widest">
            EXPLAIN
          </span>
        </div>
      </div>

      <div className="px-4 py-2 flex flex-col gap-4">
        {/* Summary */}
        <div>
          <p className="text-md text-primary  mb-2">Summary</p>
          <p className="text-md text-prisec leading-relaxed">{data.summary}</p>
        </div>

        {/* Inputs */}
        {data.inputs?.length > 0 && (
          <div>
            <p className="text-md text-primary  mb-2">Inputs</p>
            <div className="flex flex-wrap gap-1.5">
              {data.inputs.map((inp, i) => (
                <span
                  key={i}
                  className="text-sm text-prisec bg-bg border border-border rounded px-2 py-1"
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
            <p className="text-md text-primary  mb-2">Output</p>
            <p className="text-md text-prisec leading-relaxed">
              {data.outputs}
            </p>
          </div>
        )}

        {/* Logic steps */}
        {data.logic_steps?.length > 0 && (
          <div>
            <p className="text-md text-primary  mb-2">Logic Steps</p>
            <ol className="flex flex-col gap-2">
              {data.logic_steps.map((step, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="text-md text-prisec shrink-0">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="text-md text-prisec leading-relaxed">
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
      className="bg-surface border border-border rounded-md  animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="text-md text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg font-medium text-primary">Test Cases</span>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow/8 border border-yellow/10 rounded px-2 py-1">
          <div className="w-1 h-1 rounded-full bg-yellow" />
          <span className="  text-[9px] text-yellow tracking-widest uppercase">
            {data.framework || "tests"}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col gap-4">
        {/* Test cases table */}
        {data.test_cases?.length > 0 && (
          <div>
            <p className="text-md text-primary mb-2">Test Cases</p>
            <div className="border border-border rounded">
              <div className="grid grid-cols-[3fr_3fr_1fr] bg-bg px-3 py-2 border-b border-border">
                <span className="text-sm text-secondary uppercase tracking-wider">
                  Name
                </span>
                <span className="text-sm text-secondary uppercase tracking-wider">
                  Expected
                </span>
                <span className="text-sm text-secondary uppercase tracking-wider">
                  Type
                </span>
              </div>
              {data.test_cases.map((tc, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[3fr_3fr_1fr] px-3 py-2 items-center ${i < data.test_cases.length - 1 ? "border-b border-border-subtle" : ""}`}
                >
                  <span className="text-sm text-secondary pr-2 truncate">
                    {tc.name}
                  </span>
                  <span className="text-sm text-secondary pr-2 truncate  ">
                    {tc.expected_output}
                  </span>
                  <span
                    className={`text-xs w-fit px-1.5 py-0.5 rounded border ${TEST_TYPE_COLORS[tc.type] || TEST_TYPE_COLORS.normal}`}
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
            <p className="text-md text-primary mb-2">
              Test Code
            </p>
            <div className="bg-bg border border-border rounded overflow-auto max-h-64">
              <pre className="  text-[11px] text-secondary leading-relaxed p-3 whitespace-pre">
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
      className="bg-surface border border-border rounded-md animate-fadeslide"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <span className="text-md text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-lg font-medium text-primary">
            Refactored Code
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-green/8 border border-green/10 rounded px-2 py-1">
          <div className="w-1 h-1 rounded-full bg-green" />
          <span className="  text-[9px] text-green tracking-widest">
            REFACTOR
          </span>
        </div>
      </div>

      <div className="px-4 py-2 flex flex-col gap-4">
        {/* Issues found */}
        {data.issues_found?.length > 0 && (
          <div>
            <p className="text-md text-primary mb-2">Issues Found</p>
            <ul className="flex flex-col gap-2">
              {data.issues_found.map((issue, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-yellow opacity-60" />
                  <span className="text-md text-prisec leading-relaxed">
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
            <p className="text-md text-primary mb-2">Refactored Code</p>
            <div className="bg-bg border border-border rounded overflow-auto max-h-fill">
              <pre className="text-md text-prisec leading-relaxed p-3 whitespace-pre">
                {data.refactored_code}
              </pre>
            </div>
          </div>
        )}

        {/* Changes made */}
        {data.changes_made?.length > 0 && (
          <div>
            <p className="text-md text-primary mb-2">Changes Made</p>
            <ul className="flex flex-col gap-2">
              {data.changes_made.map((change, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <div className="mt-[7px] shrink-0 w-1 h-1 rounded-full bg-green opacity-60" />
                  <span className="text-md text-prisec leading-relaxed">
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
