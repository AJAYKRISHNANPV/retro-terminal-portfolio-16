import { Github, Linkedin, Mail, TerminalSquare, ArrowUpRight, Cloud, Cog, Workflow, Brain } from "lucide-react";

type Props = {
  onLaunchTerminal: () => void;
};

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const PROJECTS = [
  {
    title: "Zenoure Jewels — Infrastructure Automation",
    blurb:
      "End-to-end IaC + CI/CD for a luxury e-commerce stack. Zero-touch deploys, observability, and cost-optimised AWS footprint.",
    tags: ["AWS", "Terraform", "GitHub Actions"],
  },
  {
    title: "Custom Telegram / Discord Bots",
    blurb:
      "Self-hosted automation bots wired into personal workflows — monitoring, alerts, and on-the-fly ops controls.",
    tags: ["Python", "n8n", "Docker"],
  },
  {
    title: "Self-Hosted Cloud Environments",
    blurb:
      "Private cloud labs running on bare-metal Linux + Kubernetes. A real playground for MLOps and platform experiments.",
    tags: ["Kubernetes", "Linux", "MLOps"],
  },
];

const SKILLS: { group: string; icon: React.ReactNode; items: string[] }[] = [
  {
    group: "DevOps",
    icon: <Cog className="h-4 w-4" />,
    items: ["Jenkins", "GitHub Actions", "n8n", "Bash", "Shell automation"],
  },
  {
    group: "Cloud Architecture",
    icon: <Cloud className="h-4 w-4" />,
    items: ["AWS", "Terraform", "Kubernetes", "Docker", "Networking"],
  },
  {
    group: "Automation",
    icon: <Workflow className="h-4 w-4" />,
    items: ["Python", "n8n", "CI/CD pipelines", "Webhooks", "Telegram/Discord bots"],
  },
  {
    group: "MLOps",
    icon: <Brain className="h-4 w-4" />,
    items: ["Model serving", "Pipelines", "Observability", "GPU infra"],
  },
];

export function GuiPortfolio({ onLaunchTerminal }: Props) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.12),_transparent_60%),radial-gradient(ellipse_at_bottom_right,_rgba(168,85,247,0.10),_transparent_55%),#070710] text-white font-sans">
      {/* sticky glass nav */}
      <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => scrollTo("home")}
            className="text-sm font-semibold tracking-wide text-white/90"
          >
            ajay<span className="text-cyan-400">.</span>dev
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <button
            onClick={onLaunchTerminal}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-xl transition hover:scale-[1.03] hover:bg-white/15"
          >
            <TerminalSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Launch Terminal Mode</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgb(52,211,153)]" />
          Available for new infrastructure work
        </p>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          Hi, I'm <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-purple-400 bg-clip-text text-transparent">Ajay</span>.
          <br />
          IT & DevOps Professional.
        </h1>
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/70">
          I design and automate cloud infrastructure — pipelines, IaC, observability, and the
          unglamorous Linux glue that keeps modern products shipping.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => scrollTo("projects")}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium transition hover:scale-[1.02]"
          >
            View projects <ArrowUpRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            Get in touch
          </button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">About</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { k: "3+", v: "Years building cloud infra" },
            { k: "20+", v: "Pipelines shipped" },
            { k: "100%", v: "IaC-managed environments" },
          ].map((s) => (
            <div
              key={s.v}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="text-3xl font-semibold text-white">{s.k}</div>
              <div className="mt-1 text-sm text-white/60">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Skills</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <div
              key={s.group}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-2 text-white/90">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                  {s.icon}
                </span>
                <span className="text-sm font-medium">{s.group}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/80 transition hover:scale-105 hover:bg-white/10"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Projects</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <article
              key={p.title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_-20px_rgba(56,189,248,0.35)]"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <h3 className="relative text-lg font-semibold text-white">{p.title}</h3>
              <p className="relative mt-2 text-sm text-white/70">{p.blurb}</p>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-12 backdrop-blur-xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Let's build something reliable.</h2>
          <p className="mt-3 max-w-xl text-white/70">
            Whether it's a platform migration, a CI/CD overhaul, or a homelab gone professional —
            I'd love to hear about it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="mailto:you@example.com"
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium transition hover:scale-[1.02]"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Ajay. Crafted with care.
        </p>
      </section>
    </div>
  );
}
