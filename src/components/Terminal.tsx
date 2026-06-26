import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { COMMANDS, FS, resolvePath, runCommand, type CommandResult, type ThemeName } from "@/lib/commands";
import { SnakeGame } from "./SnakeGame";

type HistoryEntry = {
  id: number;
  prompt?: string;
  command?: string;
  output: string[];
};

type Mode = "shell" | "snake" | "contact" | "hack" | "selfdestruct";

type Props = {
  onSwitchToGui?: () => void;
  active?: boolean;
};

const HACK_LINES = [
  "› nmap -sS -p 1-65535 target.local",
  "› bypassing firewall layer 1 ............ [OK]",
  "› injecting payload ./exploit.bin ........ [OK]",
  "› decrypting RSA-4096 handshake .......... [OK]",
  "› spoofing MAC 00:1B:44:11:3A:B7 ......... [OK]",
  "› brute-forcing /etc/shadow .............. [OK]",
  "› cracking AES-256-GCM ................... [OK]",
  "› routing traffic via 14 proxies ......... [OK]",
  "› patching kernel hooks .................. [OK]",
  "› dumping memory pages ................... [OK]",
  "› elevating privileges (CVE-2024-31337) .. [OK]",
  "› establishing reverse tunnel ............ [OK]",
];

const DESTRUCT_LINES = [
  "rm: removing /bin/bash",
  "rm: removing /etc/passwd",
  "rm: removing /var/log/syslog",
  "rm: removing /home/visitor/.bashrc",
  "rm: removing /usr/lib/python3.12",
  "rm: removing /boot/vmlinuz",
  "rm: removing /sys/kernel/firmware",
  "rm: removing /dev/null  (?!)",
  "rm: removing /opt/lovable/secrets",
  "rm: removing /  ███████ CRITICAL",
  "kernel panic — not syncing: VFS unable to mount root fs",
  "*** SEGMENTATION FAULT ***",
];

export function Terminal({ onSwitchToGui }: Props) {
  const [username, setUsername] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [caretPos, setCaretPos] = useState(0);
  const [recall, setRecall] = useState<number | null>(null);
  const [cwd, setCwd] = useState<string[]>([]);
  const [theme, setTheme] = useState<ThemeName>("matrix");
  const [mode, setMode] = useState<Mode>("shell");
  const [destructing, setDestructing] = useState(false);
  // contact wizard
  const [contactStep, setContactStep] = useState<"channel" | "email-addr" | "email-msg" | "wa-msg">("channel");
  const [contactEmail, setContactEmail] = useState("");
  // hack wizard
  const [hackStep, setHackStep] = useState<"target" | "running">("target");

  const [sessionCmds, setSessionCmds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const abortRef = useRef(0);


  const focusInput = () => {
    if (mode === "snake") return;
    if (username) inputRef.current?.focus();
    else nameRef.current?.focus();
  };

  useEffect(() => { focusInput(); }, [username, mode]);
  useEffect(() => {
    setCaretPos((p) => Math.min(p, input.length));
  }, [input]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [history, username]);
  useEffect(() => {
    if (mode !== "snake") return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [mode]);

  const cwdStr = cwd.length ? `~/${cwd.map((s) => s.replace(/\/$/, "")).join("/")}` : "~";
  const basePrompt = `${username ?? "guest"}@ajay-portfolio:${cwdStr}$`;
  const promptLabel = useMemo(() => {
    if (mode === "contact") {
      if (contactStep === "channel") return "channel (1: Email, 2: WhatsApp):";
      if (contactStep === "email-addr") return "your email:";
      if (contactStep === "email-msg") return "your message:";
      if (contactStep === "wa-msg") return "your message:";
    }
    if (mode === "hack" && hackStep === "target") return "target host:";
    return basePrompt;
  }, [mode, basePrompt, contactStep, hackStep]);

  const nextId = () => { idRef.current += 1; return idRef.current; };

  const append = (entry: Omit<HistoryEntry, "id">) => {
    setHistory((h) => [...h, { id: nextId(), ...entry }]);
  };
  const appendLines = (lines: string[]) => append({ output: lines });

  const streamLines = (lines: string[], delay: number, onDone?: () => void) => {
    const id = nextId();
    const token = abortRef.current;
    setHistory((h) => [...h, { id, output: [] }]);
    let i = 0;
    const tick = () => {
      if (abortRef.current !== token) return;
      if (i >= lines.length) { onDone?.(); return; }
      const line = lines[i++];
      setHistory((h) => h.map((e) => e.id === id ? { ...e, output: [...e.output, line] } : e));
      window.setTimeout(tick, delay);
    };
    tick();
  };


  const triggerDownload = (url: string, filename?: string) => {
    try {
      const a = document.createElement("a");
      a.href = url;
      if (filename) a.download = filename;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch { /* ignore */ }
  };

  // ====== handlers ======

  const submitShell = (raw: string) => {
    if (raw.trim()) setSessionCmds((c) => [...c, raw]);
    append({ prompt: basePrompt, command: raw, output: [] });
    if (!raw.trim()) return;

    const res: CommandResult = runCommand(raw, {
      username: username ?? "guest",
      cwd, setCwd, cmdCount: sessionCmds.length + 1,
    });

    if (res.clear) { setHistory([]); return; }

    let lines = res.lines ?? [];

    // history command
    if (lines[0] === "__HISTORY__") {
      const cmds = sessionCmds.filter((c) => c.trim());
      lines = cmds.map((c, i) => `  ${String(i + 1).padStart(3, " ")}  ${c}`);
      if (!lines.length) lines = ["(no commands yet)"];
    }

    if (lines.length) appendLines(lines);

    if (res.download) triggerDownload(res.download.url, res.download.filename);

    if (res.theme) setTheme(res.theme);

    if (res.gui && onSwitchToGui) {
      window.setTimeout(() => onSwitchToGui(), 450);
    }

    if (res.enterMode === "snake") setMode("snake");
    else if (res.enterMode === "contact") {
      setMode("contact"); setContactStep("channel");
      appendLines([
        "┌─ ⚡ QUICK CONNECT ────────────────────────────────────┐",
        "│  • type 'whatsapp' for instant chat                  │",
        "│  • book a call: https://calendly.com/your-handle     │",
        "└──────────────────────────────────────────────────────┘",
        "",
        "Choose interactive channel (1: Email, 2: WhatsApp Input):",
      ]);
    } else if (res.enterMode === "hack") {
      setMode("hack"); setHackStep("target");
      appendLines(["[hack.sh] specify target host (e.g. mainframe.corp):"]);
    } else if (res.enterMode === "selfdestruct") {
      setDestructing(true);
      streamLines(DESTRUCT_LINES, 180, () => {
        window.setTimeout(() => {
          setDestructing(false);
          appendLines(["", "...", "System restored successfully. Don't do that again! 😉"]);
        }, 700);
      });
    }
  };


  const submitContact = (raw: string) => {
    append({ prompt: promptLabel, command: raw, output: [] });
    const t = raw.trim().toLowerCase();
    if (t === "exit" || t === "cancel") {
      setMode("shell"); appendLines(["(contact cancelled)"]); return;
    }
    if (contactStep === "channel") {
      if (t === "1" || t === "email") { setContactStep("email-addr"); appendLines(["Enter your email address:"]); return; }
      if (t === "2" || t === "whatsapp" || t === "wa") { setContactStep("wa-msg"); appendLines(["Enter your message:"]); return; }
      appendLines(["Invalid choice. Enter 1 or 2 (or 'exit')."]); return;
    }
    if (contactStep === "email-addr") {
      setContactEmail(raw.trim());
      setContactStep("email-msg");
      appendLines(["Enter your message:"]); return;
    }
    if (contactStep === "email-msg") {
      const msg = raw;
      const email = contactEmail;
      streamLines(
        ["Sending mail via webhook...", "  › packaging payload", "  › POST /api/contact"],
        220,
        () => {
          window.setTimeout(() => {
            appendLines([
              "[!] webhook unreachable — graceful fallback:",
              `    mailto:hello@ajay.dev?subject=Hello&body=${encodeURIComponent(`From: ${email}\n\n${msg}`)}`,
              "Opening mail client...",
            ]);
            try { window.open(`mailto:hello@ajay.dev?subject=Hello&body=${encodeURIComponent(`From: ${email}\n\n${msg}`)}`); } catch { /* ignore */ }
            setMode("shell");
          }, 600);
        },
      );
      return;
    }
    if (contactStep === "wa-msg") {
      const msg = raw;
      streamLines(
        ["Constructing payload...", "  › encoding message", "  › Redirecting..."],
        220,
        () => {
          const url = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
          appendLines([`opening: ${url}`]);
          try { window.open(url, "_blank", "noopener"); } catch { /* ignore */ }
          setMode("shell");
        },
      );
    }
  };

  const submitHack = (raw: string) => {
    append({ prompt: promptLabel, command: raw, output: [] });
    if (hackStep === "target") {
      const target = raw.trim() || "mainframe.corp";
      setHackStep("running");
      appendLines([`[hack.sh] target locked: ${target}`, ""]);
      let pct = 0;
      const lines = [...HACK_LINES];
      const tick = () => {
        if (!lines.length) {
          appendLines([
            "  [██████████████████████████] 100%",
            "",
            "[ACCESS GRANTED] — system pwned 😎",
            "...just kidding. Now let's connect → type 'contact'.",
          ]);
          setMode("shell"); setHackStep("target");
          return;
        }
        const next = lines.shift()!;
        pct = Math.min(100, pct + Math.ceil(100 / HACK_LINES.length));
        const bar = "█".repeat(Math.floor(pct / 4)).padEnd(25, "░");
        appendLines([next, `  [${bar}] ${pct}%`]);
        window.setTimeout(tick, 320);
      };
      tick();
    }
  };

  const submit = () => {
    const raw = input;
    setInput("");
    setRecall(null);
    if (!raw.trim() && mode !== "shell") return;
    if (mode === "shell") submitShell(raw);
    else if (mode === "contact") submitContact(raw);
    else if (mode === "hack") submitHack(raw);
  };

  const completionPool = (): string[] => {
    const tokens = input.split(/\s+/);
    if (tokens.length <= 1) return [...COMMANDS];
    const head = tokens[0].toLowerCase();
    if (head === "cd" || head === "cat") {
      const node = resolvePath(cwd) ?? FS;
      return Object.keys(node.children);
    }
    if (head === "theme") return ["matrix","ubuntu","dracula","hacker"];
    return [];
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); submit(); return; }
    if (e.key === "Tab") {
      e.preventDefault();
      if (!input.trim()) return;
      const tokens = input.split(/\s+/);
      const last = tokens[tokens.length - 1] ?? "";
      if (!last) return;
      const pool = completionPool();
      const matches = pool.filter((c) => c.startsWith(last));
      if (matches.length === 1) {
        tokens[tokens.length - 1] = matches[0];
        setInput(tokens.join(" "));
      } else if (matches.length > 1) {
        append({ prompt: basePrompt, command: input, output: [matches.join("    ")] });
      }
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const cmds = sessionCmds.filter((c) => c.trim());
      if (!cmds.length) return;
      const next = recall === null ? cmds.length - 1 : Math.max(0, recall - 1);
      setRecall(next);
      const val = cmds[next] ?? "";
      setInput(val); setCaretPos(val.length);
      requestAnimationFrame(() => inputRef.current?.setSelectionRange(val.length, val.length));
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const cmds = sessionCmds.filter((c) => c.trim());
      if (recall === null) return;
      const next = recall + 1;
      if (next >= cmds.length) { setRecall(null); setInput(""); setCaretPos(0); }
      else {
        setRecall(next);
        const val = cmds[next] ?? "";
        setInput(val); setCaretPos(val.length);
        requestAnimationFrame(() => inputRef.current?.setSelectionRange(val.length, val.length));
      }
    }
  };

  const submitName = () => {
    const trimmed = nameInput.trim().replace(/\s+/g, "_").toLowerCase();
    if (!trimmed) return;
    setUsername(trimmed);
  };

  const onNameKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { e.preventDefault(); submitName(); }
  };

  // Render helpers
  const renderOutputLine = (line: string, key: number) => {
    // dir highlight tokens
    if (line.includes("\x1b[dir]")) {
      const parts = line.split(/\x1b\[dir\]|\x1b\[\/\]/);
      return (
        <span key={key}>
          {parts.map((p, i) => (i % 2 === 1
            ? <span key={i} className="text-[color:var(--term-prompt)]">{p}/</span>
            : <span key={i}>{p}</span>))}
          {"\n"}
        </span>
      );
    }
    return <span key={key}>{line}{"\n"}</span>;
  };

  const inputHighlight = () => {
    if (mode !== "shell" || !input) return <span className="whitespace-pre">{input}</span>;
    const [head, ...rest] = input.split(/(\s+)/); // keep spaces
    const headLower = head.toLowerCase();
    const valid = (COMMANDS as readonly string[]).includes(headLower);
    const isSudo = headLower === "sudo";
    return (
      <span className="whitespace-pre">
        <span className={valid ? "text-[color:var(--term-green)]" : isSudo ? "text-yellow-400" : "text-red-400"}>{head}</span>
        <span>{rest.join("")}</span>
      </span>
    );
  };

  const syncCaret = () => {
    const el = inputRef.current;
    if (!el) return;
    setCaretPos(el.selectionStart ?? el.value.length);
  };

  return (
    <div
      data-theme={theme}
      onClick={focusInput}
      className={`terminal-root relative h-full w-full overflow-hidden bg-[#0a0a0a] p-3 sm:p-6 font-mono text-[13px] sm:text-[14px] leading-relaxed text-[color:var(--term-green)] ${destructing ? "destruct-flash" : ""}`}
    >
      <div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-lg border border-[color:var(--term-green-dim)]/40 shadow-[0_0_40px_rgba(0,255,140,0.08)]">

        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-[color:var(--term-green-dim)]/30 bg-black/60 px-3 py-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-xs text-[color:var(--term-green-dim)] truncate">
            {username ?? "guest"}@ajay-portfolio: {cwdStr}
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-widest text-[color:var(--term-green-dim)]">{theme}</span>
        </div>

        {/* screen */}
        <div className="crt-screen relative flex-1 overflow-y-auto px-3 py-3 sm:px-5 sm:py-4">
          {mode === "snake" && username ? (
            <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-[#0a0a0a] p-3 sm:p-6">
              <SnakeGame onExit={() => { setMode("shell"); appendLines(["(exited snake)"]); }} />
            </div>
          ) : !username ? (
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
                autoFocus autoCapitalize="off" autoCorrect="off" spellCheck={false}
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
                  {entry.prompt !== undefined && (
                    <div className="flex gap-2 break-all">
                      <span className="text-[color:var(--term-prompt)] shrink-0">{entry.prompt}</span>
                      <span>{entry.command}</span>
                    </div>
                  )}
                  {entry.output.length > 0 && (
                    <pre className="whitespace-pre-wrap break-words pb-2">
                      {entry.output.map((l, i) => renderOutputLine(l, i))}
                    </pre>
                  )}
                </div>
              ))}

              <div className="crt-glow flex items-start gap-2 break-all">
                <span className="text-[color:var(--term-prompt)] shrink-0">{promptLabel}</span>
                <span className="relative inline-block whitespace-pre leading-[1.5]">
                  {inputHighlight()}
                  <span
                    className="cursor-underscore absolute bottom-0"
                    style={{ left: `${caretPos}ch` }}
                    aria-hidden="true"
                  >_</span>
                </span>
              </div>

              <input
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); requestAnimationFrame(syncCaret); }}
                onKeyDown={onKeyDown}
                onKeyUp={syncCaret}
                onClick={syncCaret}
                onSelect={syncCaret}
                onFocus={syncCaret}
                autoFocus autoCapitalize="off" autoCorrect="off" spellCheck={false}
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
