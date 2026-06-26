export type ThemeName = "matrix" | "ubuntu" | "dracula" | "hacker";

export type CommandResult = {
  lines?: string[];
  clear?: boolean;
  gui?: boolean;
  enterMode?: "snake" | "contact" | "hack" | "selfdestruct";
  theme?: ThemeName;
  download?: { url: string; filename?: string };
};

export type FsFile = { type: "file"; content: string[] | "binary"; hidden?: boolean };
export type FsDir = { type: "dir"; children: Record<string, FsFile | FsDir>; hidden?: boolean };

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

const zenoureJewels: string[] = [
  "~ projects/zenoure_jewels.md",
  "",
  "  Zenoure Jewels — Cloud Infrastructure & DevOps",
  "  ----------------------------------------------",
  "  • Designed end-to-end AWS infrastructure provisioned via Terraform",
  "    (VPC, ECS/Fargate, RDS, S3, CloudFront, Route53).",
  "  • Authored a Jenkins + GitHub Actions CI/CD pipeline with",
  "    automated build, test, container scan, and zero-downtime deploys.",
  "  • Wired up centralized logging and uptime monitoring with",
  "    CloudWatch + Grafana dashboards and alerting.",
  "  • Hardened the stack with WAF rules, IAM least-privilege,",
  "    automated SSL renewal, and nightly encrypted backups.",
  "",
  "  Stack: AWS · Terraform · Docker · Jenkins · GitHub Actions · Grafana",
];

const telegramBots: string[] = [
  "~ projects/telegram_bots.md",
  "",
  "  Custom Telegram & Discord Automation Bots",
  "  ------------------------------------------",
  "  • Self-hosted bots written in Python and Node.js for personal",
  "    workflows: reminders, scrapers, server health pings, and alerts.",
  "  • n8n + webhook integrations connecting Telegram to GitHub, AWS",
  "    billing, and home-lab metrics for one-tap operations.",
  "  • Dockerized deployment behind a reverse proxy with auto-restart",
  "    and structured logging for long-term reliability.",
  "",
  "  Stack: Python · Node.js · n8n · Docker · Telegram Bot API",
];

const selfhostedCloud: string[] = [
  "~ projects/selfhosted_cloud.md",
  "",
  "  Self-Hosted Cloud & Home-Lab",
  "  -----------------------------",
  "  • Bare-metal Linux cluster running k3s with GitOps-style",
  "    deployments via ArgoCD and private container registry.",
  "  • Privacy-focused hosting stack: Nextcloud, Vaultwarden, Jellyfin,",
  "    and personal Git server — all exposed via WireGuard VPN only.",
  "  • Local network automation: pi-hole DNS, reverse proxy, automated",
  "    TLS, off-site encrypted backups to S3-compatible storage.",
  "",
  "  Stack: Linux · k3s · ArgoCD · WireGuard · Nginx · Restic",
];

export const FS: FsDir = {
  type: "dir",
  children: {
    "bio.md": { type: "file", content: bio },
    "skills.md": { type: "file", content: skills },
    "work.md": { type: "file", content: work },
    "social.md": { type: "file", content: social },
    "resume.pdf": { type: "file", content: "binary", hidden: true },
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
        "zenoure_jewels.md": { type: "file", content: zenoureJewels },
        "telegram_bots.md": { type: "file", content: telegramBots },
        "selfhosted_cloud.md": { type: "file", content: selfhostedCloud },
      },
    },
  },
};


export const COMMANDS = [
  "help","bio","skills","projects","work","social","secret","sudo","clear",
  "gui","exit","whoami","history","ls","cd","cat","resume","contact",
  "metrics","snake","hack",
  "date","timedatectl","weather",
] as const;

const help: string[] = [
  "Available commands:",
  "",
  "  about            bio · skills · projects · work · social",
  "  files            ls · cd <dir> · cat <file>",
  "  system           whoami · history · date · weather · metrics",
  "  interactive      contact · snake · hack",
  "  shell            clear · sudo · gui · exit",
];

const sudoMsg: string[] = [
  "[sudo] password for visitor:",
  "Permission denied: Standard user account does not have root privileges. Nice try!",
];

const metrics = (cmdCount: number): string[] => {
  const mem = typeof performance !== "undefined" && (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory
    ? Math.round(((performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize) / 1024 / 1024)
    : Math.round(Math.random() * 30 + 20);
  const lat = (10 + Math.random() * 8).toFixed(1);

  const W = 56; // inner width
  const row = (label: string, value: string) => {
    const left = `  ${label.padEnd(26)}: ${value}`;
    return `│${left.padEnd(W)}│`;
  };
  const title = " portfolio.metrics ";
  const top = `┌─${title}${"─".repeat(W - title.length - 1)}┐`;
  const bot = `└${"─".repeat(W)}┘`;

  return [
    top,
    row("client_memory_mb", `${mem} MB`),
    row("active_sessions", "1"),
    row("http_requests_total", String(42 + cmdCount)),
    row("command_dispatches", String(cmdCount)),
    row("exec_latency_ms", `${lat} ms`),
    row("uptime", formatUptime()),
    row("bruno_sleep_efficiency", "100.0% ✅"),
    bot,
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

// Canonical directory keys (no singular aliases — strict Linux semantics).
const DIR_ALIASES: Record<string, string> = {
  projects: "projects",
};


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
      return { lines: [`${ctx.username}@local-session`, `logged in as: ${ctx.username}`, "ip: 127.0.0.1 (local · sandboxed)", "role: visitor"] };

    case "history":
      return { lines: ["__HISTORY__"] };

    case "date":
    case "timedatectl":
      return { lines: [istNow(), "Timezone: Asia/Kolkata (UTC+05:30)"] };

    case "weather": return { lines: weather };

    case "metrics": return { lines: metrics(ctx.cmdCount) };

    case "ls": {
      const node = resolvePath(ctx.cwd);
      if (!node) return { lines: ["ls: cannot access path"] };
      const showHidden = args.includes("-a") || args.includes("-la") || args.includes("-al");
      const entries = Object.keys(node.children).filter((n) => {
        const child = node.children[n];
        if (child.hidden && !showHidden) return false;
        if (!showHidden && n.startsWith(".")) return false;
        return true;
      });
      const formatted = entries.map((n) => {
        const child = node.children[n];
        return child.type === "dir" ? `\x1b[dir]${n}\x1b[/]` : n;
      });
      return { lines: [formatted.join("    ")] };
    }

    case "cd": {
      const rawTarget = args[0] ?? "";
      // strip surrounding whitespace + any trailing slashes (projects/ → projects)
      const target = rawTarget.trim().replace(/\/+$/g, "");
      if (!target || target === "~" || target === "/") { ctx.setCwd([]); return { lines: [] }; }
      if (target === "..") { ctx.setCwd(ctx.cwd.slice(0, -1)); return { lines: [] }; }
      if (target === ".") { return { lines: [] }; }
      const node = resolvePath(ctx.cwd);
      if (!node) return { lines: ["cd: invalid path"] };
      const aliased = DIR_ALIASES[target.toLowerCase()] ?? target;
      const direct = node.children[aliased] ?? node.children[target];
      if (!direct || direct.type !== "dir") return { lines: [`cd: no such directory: ${rawTarget}`] };
      const segName = node.children[aliased] ? aliased : target;
      ctx.setCwd([...ctx.cwd, segName]);
      return { lines: [] };
    }

    case "cat": {
      const rawTarget = args[0];
      if (!rawTarget) return { lines: ["cat: missing file operand"] };
      const target = rawTarget.replace(/\/+$/g, "");
      const node = resolvePath(ctx.cwd);
      if (!node) return { lines: ["cat: invalid path"] };
      const f = node.children[target];
      if (!f) return { lines: [`cat: ${rawTarget}: No such file or directory`] };
      if (f.type === "dir") return { lines: [`cat: ${rawTarget}: Is a directory`] };
      if (f.content === "binary") {
        if (target === "resume.pdf") {
          return { lines: ["Downloading Ajay's Resume... [SUCCESS]"], download: { url: "/resume.pdf", filename: "Ajay-Resume.pdf" } };
        }
        return { lines: [`cat: ${rawTarget}: binary file`] };
      }
      return { lines: f.content };
    }

    case "resume":
      return {
        lines: ["Fetching /resume.pdf ...", "Downloading Ajay's Resume... [SUCCESS]"],
        download: { url: "/resume.pdf", filename: "Ajay-Resume.pdf" },
      };

    case "contact": return { enterMode: "contact" };

    case "snake": return { enterMode: "snake" };
    case "hack": return { enterMode: "hack" };
  }

  return { lines: [`Permission denied! Command not found: Type 'help' for a list of commands`] };
}

export const BANNER = [
  "Hi, welcome. Please type help to know the commands to know more about me",
  "",
];
