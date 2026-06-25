import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { runCommand } from "@/lib/commands";

type HistoryEntry = {
  id: number;
  command: string;
  output: string[];
};

type Props = {
  onSwitchToGui?: () => void;
  active?: boolean;
};

export function Terminal({ onSwitchToGui, active = true }: Props) {
  const [username, setUsername] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [recall, setRecall] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const focusInput = () => {
    if (username) inputRef.current?.focus();
    else nameRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history, username]);

  const prompt = username ? `${username}@ajay-portfolio:~$` : "guest@ajay-portfolio:~$";

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
    if (result.gui && onSwitchToGui) {
      window.setTimeout(() => onSwitchToGui(), 450);
    }
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

  const submitName = () => {
    const trimmed = nameInput.trim().replace(/\s+/g, "_").toLowerCase();
    if (!trimmed) return;
    setUsername(trimmed);
  };

  const onNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitName();
    }
  };

  return (
    <div
      onClick={focusInput}
      className="terminal-root relative h-full w-full overflow-hidden bg-[#0a0a0a] p-3 sm:p-6 font-mono text-[13px] sm:text-[14px] leading-relaxed text-[color:var(--term-green)]"
    >
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-lg border border-[color:var(--term-green-dim)]/40 shadow-[0_0_40px_rgba(0,255,140,0.08)]">

        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-[color:var(--term-green-dim)]/30 bg-black/60 px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-[color:var(--term-green-dim)] truncate">
            {username ?? "guest"}@ajay-portfolio: ~
          </span>
        </div>

        {/* screen */}
        <div className="crt-screen relative flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
          {!username ? (
            <>
              <pre className="crt-glow whitespace-pre-wrap break-words">
{`Initializing session...

Before we begin, what's your name?`}
              </pre>
              <div className="crt-glow mt-2 flex items-center gap-2 break-all">
                <span className="text-[color:var(--term-prompt)] shrink-0">name:</span>
                <span className="whitespace-pre-wrap">{nameInput}</span>
                <span className="cursor-block" aria-hidden="true" />
              </div>
              <input
                ref={nameRef}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={onNameKeyDown}
                autoFocus
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Your name"
                className="sr-only-input"
              />
            </>
          ) : (
            <>
              <pre className="crt-glow whitespace-pre-wrap break-words">
{`Welcome, ${username}!

You've just connected to Ajay's portfolio terminal — a retro Linux-style
shell where you can explore who I am, what I build, and how to reach me.

Type 'help' to see the list of available commands.`}
              </pre>

              {history.map((entry) => (
                <div key={entry.id} className="crt-glow">
                  <div className="flex gap-2 break-all">
                    <span className="text-[color:var(--term-prompt)] shrink-0">{prompt}</span>
                    <span>{entry.command}</span>
                  </div>
                  {entry.output.length > 0 && (
                    <pre className="whitespace-pre-wrap break-words pb-2">
{entry.output.join("\n")}
                    </pre>
                  )}
                </div>
              ))}

              <div className="crt-glow flex items-center gap-2 break-all">
                <span className="text-[color:var(--term-prompt)] shrink-0">{prompt}</span>
                <span className="whitespace-pre-wrap">{input}</span>
                <span className="cursor-block" aria-hidden="true" />
              </div>

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
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
