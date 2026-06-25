import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { BANNER, runCommand } from "@/lib/commands";

type HistoryEntry = {
  id: number;
  command: string;
  output: string[];
};

const PROMPT = "visitor@ajay-portfolio:~$";

export function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const focusInput = () => inputRef.current?.focus();

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history, input]);

  const submit = () => {
    const raw = input;
    const result = runCommand(raw);
    if (result.clear) {
      setHistory([]);
    } else {
      idRef.current += 1;
      setHistory((h) => [
        ...h,
        { id: idRef.current, command: raw, output: result.lines },
      ]);
    }
    setInput("");
    setRecall(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const commands = history.map((h) => h.command).filter(Boolean);
      if (!commands.length) return;
      const next = recall === null ? commands.length - 1 : Math.max(0, recall - 1);
      setRecall(next);
      setInput(commands[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const commands = history.map((h) => h.command).filter(Boolean);
      if (recall === null) return;
      const next = recall + 1;
      if (next >= commands.length) {
        setRecall(null);
        setInput("");
      } else {
        setRecall(next);
        setInput(commands[next] ?? "");
      }
    }
  };

  return (
    <div
      onClick={focusInput}
      className="terminal-root relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] p-3 sm:p-6 font-mono text-[13px] sm:text-[14px] leading-relaxed text-[color:var(--term-green)]"
    >
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] sm:h-[calc(100vh-3rem)] max-w-5xl flex-col overflow-hidden rounded-lg border border-[color:var(--term-green-dim)]/40 shadow-[0_0_40px_rgba(0,255,140,0.08)]">
        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-[color:var(--term-green-dim)]/30 bg-black/60 px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-[color:var(--term-green-dim)] truncate">
            visitor@ajay-portfolio: ~
          </span>
        </div>

        {/* screen */}
        <div className="crt-screen relative flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
          <pre className="crt-glow whitespace-pre-wrap break-words text-[color:var(--term-green)]">
{BANNER.join("\n")}
          </pre>

          {history.map((entry) => (
            <div key={entry.id} className="crt-glow">
              <div className="flex gap-2 break-all">
                <span className="text-[color:var(--term-prompt)] shrink-0">{PROMPT}</span>
                <span>{entry.command}</span>
              </div>
              {entry.output.length > 0 && (
                <pre className="whitespace-pre-wrap break-words pb-2">
{entry.output.join("\n")}
                </pre>
              )}
            </div>
          ))}

          {/* live prompt */}
          <div className="crt-glow flex items-center gap-2 break-all">
            <span className="text-[color:var(--term-prompt)] shrink-0">{PROMPT}</span>
            <span className="whitespace-pre-wrap">{input}</span>
            <span className="cursor-block" aria-hidden="true" />
          </div>

          <div ref={bottomRef} />

          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Terminal command input"
            className="sr-only-input"
          />
        </div>
      </div>
    </div>
  );
}
