export type CommandOutput = {
  lines: string[];
  clear?: boolean;
  gui?: boolean;
};

const help: CommandOutput = {
  lines: [
    "Available commands:",
    "",
    "  bio        About me",
    "  skills     Tech stack & tools",
    "  projects   Notable work",
    "  work       Professional timeline",
    "  social     Where to find me",
    "  secret     ???",
    "  clear      Wipe the screen",
    "  help       Show this list",
  ],
};

const bio: CommandOutput = {
  lines: [
    "Ajay — IT Professional & DevOps / Cloud Infrastructure enthusiast.",
    "I build automated pipelines, wire up cloud infrastructure, and",
    "spend far too much time tinkering with Linux systems.",
  ],
};

const skills: CommandOutput = {
  lines: [
    "~ skills.yaml",
    "",
    "  devops_cicd:    Jenkins · GitHub Actions · n8n",
    "  cloud_iac:      AWS · Terraform",
    "  containers:     Kubernetes · Docker",
    "  scripting:      Bash · Python · Shell automation",
    "  systems:        Linux · Networking · Monitoring",
  ],
};

const projects: CommandOutput = {
  lines: [
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
  ],
};

const work: CommandOutput = {
  lines: [
    "~ work.log",
    "",
    "  2024 — present   DevOps / Cloud Infrastructure",
    "                   Building pipelines, IaC, observability.",
    "",
    "  2022 — 2024      IT Systems & Automation",
    "                   Linux administration and scripting at scale.",
    "",
    "  earlier          IT support, homelab, breaking things to learn.",
  ],
};

const social: CommandOutput = {
  lines: [
    "~ contact",
    "",
    "  github     github.com/your-handle",
    "  linkedin   linkedin.com/in/your-handle",
    "  email      you@example.com",
  ],
};

const secret: CommandOutput = {
  lines: [
    "You found it. ☕",
    "> executing coffee.sh ... done.",
  ],
};

const sudo: CommandOutput = {
  lines: [
    "[sudo] password for visitor:",
    "Permission denied: Standard user account does not have root privileges. Nice try!",
  ],
};

const registry: Record<string, CommandOutput> = {
  help: {
    lines: [
      ...help.lines,
      "  gui        Launch the visual portfolio",
      "  exit       Leave the terminal (same as gui)",
    ],
  },
  bio,
  skills,
  projects,
  work,
  social,
  secret,
  sudo,
  clear: { lines: [], clear: true },
  gui: { lines: ["Booting visual interface..."], gui: true },
  exit: { lines: ["Closing session... launching visual interface."], gui: true },
};

export const commandNames = Object.keys(registry);

export function runCommand(input: string): CommandOutput {
  const cmd = input.trim().toLowerCase();
  if (!cmd) return { lines: [] };
  if (cmd in registry) return registry[cmd];
  if (cmd.startsWith("sudo ")) return registry.sudo;
  return {
    lines: [`Command not found: ${input}. Type 'help' for a list of commands.`],
  };
}

export const BANNER = [
  "Hi, welcome. Please type help to know the commands to know more about me",
  "",
];
