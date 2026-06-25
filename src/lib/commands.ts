export type ThemeName = "matrix" | "ubuntu" | "dracula" | "hacker";

export type CommandResult = {
  lines?: string[];
  clear?: boolean;
  gui?: boolean;
  enterMode?: "snake" | "repl-py" | "repl-js" | "contact" | "hack" | "selfdestruct";
  theme?: ThemeName;
  download?: { url: string; filename?: string };
};

export type FsFile = { type: "file"; content: string[] | "binary" };
export type FsDir = { type: "dir"; children: Record<string, FsFile | FsDir> };

export const FS: FsDir = {
  type: "dir",
  children: {
    "bio.txt": {
      type: "file",
      content: [
        "Ajay — IT Professional & DevOps / Cloud Infrastructure enthusiast.",
        "I build automated pipelines, wire up cloud infrastructure, and",
        "spend far too much time tinkering with Linux systems.",
      ],
    },
    "skills.md": {
      type: "file",
      content: [
        "# skills",
        "",
        "- devops/cicd:  Jenkins · GitHub Actions · n8n",
        "- cloud/iac:    AWS · Terraform",
        "- containers:   Kubernetes · Docker",
        "- scripting:    Bash · Python",
        "- systems:      Linux · Networking · Monitoring",
      ],
    },
    "resume.pdf": { type: "file", content: "binary" },
    ".env_secret": {
      type: "file",
      content: [
        "🕵️  Curiosity rewarded.",
        "You found the hidden file. Shortcut unlocked:",
        "    → type 'contact' to reach Ajay directly.",
      ],
    },
    projects: {
      type: "dir",
      children: {
        "zenoure_jewels/": { type: "dir", children: {} },
        "telegram_bots/": { type: "dir", children: {} },
        "selfhosted_cloud/": { type: "dir", children: {} },
      },
    },
  },
};

export const COMMANDS = [
  "help","bio","skills","projects","work","social","secret","sudo","clear",
  "gui","exit","whoami","history","ls","cd","cat","resume","contact",
  "python","js","metrics","theme","snake","hack","neofetch","brunofetch",
  "date","timedatectl","weather",
] as const;

const help: string[] = [
  "Available commands:",
  "",
  "  about            help · bio · skills · projects · work · social · secret",
  "  files            ls · cd <dir> · cat <file> · resume",
  "  system           whoami · history · date · timedatectl · weather · metrics",
  "  interactive      contact · python · js · snake · hack",
  "  visuals          theme <matrix|ubuntu|dracula|hacker> · neofetch · brunofetch",
  "  shell            clear · sudo · gui · exit",
];

const bio: string[] = [
  "Ajay — IT Professional & DevOps / Cloud Infrastructure enthusiast.",
  "I build automated pipelines, wire up cloud infrastructure, and",
  "spend far too much time tinkering with Linux systems.",
  "",
  "Type 'resume' to download my full professional CV / Resume.",
];

const skills: string[] = [
  "~ skills.yaml",
  "",
  "  devops_cicd:    Jenkins · GitHub Actions · n8n",
  "  cloud_iac:      AWS · Terraform",
  "  containers:     Kubernetes · Docker",
  "  scripting:      Bash · Python · Shell automation",
  "  systems:        Linux · Networking · Monitoring",
];

const projects: string[] = [
  "~ projects/",
  "",
  "  [1] Zenoure Jewels — Infrastructure Automation",
  "      End-to-end IaC + CI/CD for an e-commerce stack.",
  "",
  "  [2] Custom Telegram / Discord Bots",
  "      Self-hosted automation bots wired into personal workflows.",
  "",
  "  [3] Self-Hosted Cloud Environments",
  "      Private cloud labs running on bare-metal Linux + K8s.",
];

const work: string[] = [
  "~ work.log",
  "",
  "  2024 — present   DevOps / Cloud Infrastructure",
  "                   Building pipelines, IaC, observability.",
  "",
  "  2022 — 2024      IT Systems & Automation",
  "                   Linux administration and scripting at scale.",
  "",
  "  earlier          IT support, homelab, breaking things to learn.",
];

const social: string[] = [
  "~ contact",
  "",
  "  github     github.com/your-handle",
  "  linkedin   linkedin.com/in/your-handle",
  "  email      you@example.com",
];

const sudoMsg: string[] = [
  "[sudo] password for visitor:",
  "Permission denied: Standard user account does not have root privileges. Nice try!",
];

const neofetch = (username: string): string[] => {
  const platform = typeof navigator !== "undefined" ? navigator.platform : "Web";
  const ua = typeof navigator !== "undefined" ? navigator.userAgent.split(") ")[0].split("(").pop() ?? "Browser" : "Browser";
  return [
    `     █████╗      ${username}@ajay-portfolio`,
    `    ██╔══██╗     -------------------------`,
    `    ███████║     OS:       ${platform}`,
    `    ██╔══██║     Host:     Ajay's Shell v1.0`,
    `    ██║  ██║     Kernel:   ${ua}`,
    `    ╚═╝  ╚═╝     Shell:    Vibe-Shell`,
    `                 Uptime:   ${formatUptime()}`,
    `                 Theme:    retro-crt`,
  ];
};

const brunofetch: string[] = [
  "       __                 bruno@ajay-desk",
  "  (___()'`;              -------------------------",
  "  /,    /`                OS:       Goodest Boy OS (v2020)",
  "  \\\\\"--\\\\                Host:     Under Ajay's Desk",
  "                          Uptime:   6 years of zoomies",
  "                          Memory:   100% allocated to treats",
  "                          Status:   Napping 💤",
];

const metrics = (cmdCount: number): string[] => {
  const mem = typeof performance !== "undefined" && (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
    ? Math.round(((performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize) / 1024 / 1024)
    : Math.round(Math.random() * 30 + 20);
  const lat = (10 + Math.random() * 8).toFixed(1);
  return [
    "┌─ portfolio.metrics ─────────────────────────────────┐",
    `│  client_memory_mb       : ${String(mem).padStart(6)}                   │`,
    `│  active_sessions        :      1                   │`,
    `│  http_requests_total    : ${String(42 + cmdCount).padStart(6)}                   │`,
    `│  command_dispatches     : ${String(cmdCount).padStart(6)}                   │`,
    `│  exec_latency_ms        : ${lat.padStart(6)}                   │`,
    `│  uptime                 : ${formatUptime().padEnd(16)}     │`,
    `│  bruno_sleep_efficiency : 100.0% ✅                 │`,
    "└─────────────────────────────────────────────────────┘",
  ];
};

const weather: string[] = [
  "      \\   /     ",
  "       .-.      Current Status: Cozy setup in Kerala, India 🌴",
  "    ‒ (   ) ‒   Conditions:     Warm · light breeze",
  "       `-’      Forecast:       Perfect weather for system automation.",
  "      /   \\     ",
];

function formatUptime(): string {
  if (typeof performance === "undefined") return "0s";
  const s = Math.floor(performance.now() / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function istNow(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short", year: "numeric", month: "short", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }) + " IST";
}

export function resolvePath(cwd: string[]): FsDir | null {
  let node: FsDir = FS;
  for (const seg of cwd) {
    const next = node.children[seg];
    if (!next || next.type !== "dir") return null;
    node = next;
  }
  return node;
}

export type RunCtx = {
  username: string;
  cwd: string[];
  setCwd: (next: string[]) => void;
  cmdCount: number;
};

export function runCommand(input: string, ctx: RunCtx): CommandResult {
  const raw = input.trim();
  if (!raw) return { lines: [] };
  const lower = raw.toLowerCase();

  if (lower === "sudo rm -rf /" || lower === "sudo rm -rf /*") {
    return { enterMode: "selfdestruct" };
  }
  if (lower.startsWith("sudo ")) return { lines: sudoMsg };

  const [cmd, ...args] = raw.split(/\s+/);
  const c = cmd.toLowerCase();

  switch (c) {
    case "help": return { lines: help };
    case "bio": return { lines: bio };
    case "skills": return { lines: skills };
    case "projects": return { lines: projects };
    case "work": return { lines: work };
    case "social": return { lines: social };
    case "secret": return { lines: ["You found it. ☕", "> executing coffee.sh ... done."] };
    case "sudo": return { lines: sudoMsg };
    case "clear": return { clear: true };
    case "gui": return { lines: ["Booting visual interface..."], gui: true };
    case "exit": return { lines: ["Closing session... launching visual interface."], gui: true };

    case "whoami":
      return { lines: [`${ctx.username}@local-session`, "ip: 127.0.0.1 (local · sandboxed)", "role: visitor"] };

    case "history":
      // handled by Terminal (needs session list); signal via lines marker
      return { lines: ["__HISTORY__"] };

    case "date":
    case "timedatectl":
      return { lines: [istNow(), "Timezone: Asia/Kolkata (UTC+05:30)"] };

    case "weather": return { lines: weather };

    case "neofetch": return { lines: neofetch(ctx.username) };
    case "brunofetch": return { lines: brunofetch };

    case "metrics": return { lines: metrics(ctx.cmdCount) };

    case "ls": {
      const node = resolvePath(ctx.cwd);
      if (!node) return { lines: ["ls: cannot access path"] };
      const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const entries = Object.keys(node.children).filter((n) => showHidden || !n.startsWith("."));
      const formatted = entries.map((n) => {
        const child = node.children[n];
        return child.type === "dir" ? `\x1b[dir]${n}\x1b[/]` : n;
      });
      return { lines: [formatted.join("    ")] };
    }

    case "cd": {
      const target = args[0] ?? "";
      if (!target || target === "~" || target === "/") { ctx.setCwd([]); return { lines: [] }; }
      if (target === "..") { ctx.setCwd(ctx.cwd.slice(0, -1)); return { lines: [] }; }
      const node = resolvePath(ctx.cwd);
      if (!node) return { lines: ["cd: invalid path"] };
      const key = target.endsWith("/") ? target : `${target}/`;
      const direct = node.children[target] ?? node.children[key];
      if (!direct || direct.type !== "dir") return { lines: [`cd: no such directory: ${target}`] };
      const segName = node.children[target] ? target : key;
      ctx.setCwd([...ctx.cwd, segName]);
      return { lines: [] };
    }

    case "cat": {
      const target = args[0];
      if (!target) return { lines: ["cat: missing file operand"] };
      const node = resolvePath(ctx.cwd);
      if (!node) return { lines: ["cat: invalid path"] };
      const f = node.children[target];
      if (!f) return { lines: [`cat: ${target}: No such file or directory`] };
      if (f.type === "dir") return { lines: [`cat: ${target}: Is a directory`] };
      if (f.content === "binary") {
        if (target === "resume.pdf") {
          return { lines: ["Downloading Ajay's Resume... [SUCCESS]"], download: { url: "/resume.pdf", filename: "Ajay-Resume.pdf" } };
        }
        return { lines: [`cat: ${target}: binary file`] };
      }
      return { lines: f.content };
    }

    case "resume":
      return {
        lines: ["Fetching /resume.pdf ...", "Downloading Ajay's Resume... [SUCCESS]"],
        download: { url: "/resume.pdf", filename: "Ajay-Resume.pdf" },
      };

    case "contact": return { enterMode: "contact" };
    case "python": case "py": return { enterMode: "repl-py", lines: ["Python 3.12.0 (vibe-build) on web", "Type 'exit()' to return to shell."] };
    case "js": case "node": return { enterMode: "repl-js", lines: ["Node.js v22.0.0 (vibe-build) — JavaScript REPL", "Type 'exit()' to return to shell."] };

    case "snake": return { enterMode: "snake" };
    case "hack": return { enterMode: "hack" };

    case "theme": {
      const t = (args[0] ?? "").toLowerCase() as ThemeName;
      if (!["matrix","ubuntu","dracula","hacker"].includes(t)) {
        return { lines: ["usage: theme <matrix|ubuntu|dracula|hacker>"] };
      }
      return { lines: [`Theme switched → ${t}`], theme: t };
    }
  }

  return { lines: [`Command not found: ${raw}. Type 'help' for a list of commands.`] };
}

export const BANNER = [
  "Hi, welcome. Please type help to know the commands to know more about me",
  "",
];
