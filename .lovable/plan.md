
## Retro Terminal Portfolio

A single-page interactive terminal that greets visitors with a banner + `help` hint, accepts commands, and prints formatted output in a scrollable history pane. Pitch-black canvas, glowing green monospaced text, scanline overlay, blinking block cursor.

### Files

- `src/routes/index.tsx` — replace placeholder; renders `<Terminal />`, sets page `<title>` and meta to "Ajay — Terminal Portfolio".
- `src/components/Terminal.tsx` — main terminal: history state, input handling, click-to-focus, auto-scroll on history change, command dispatch.
- `src/lib/commands.ts` — command registry: `help`, `bio`, `skills`, `projects`, `work`, `social`, `clear`, `secret`, `sudo`. Each returns either a string or JSX-ready lines array. Case-insensitive lookup; unknown → `Command not found. Type 'help' for a list of commands`.
- `src/styles.css` — add terminal design tokens (`--term-bg #0a0a0a`, `--term-green`, `--term-green-dim`), CRT `text-shadow` utility, scanline overlay utility (`repeating-linear-gradient`), blinking cursor keyframes, JetBrains Mono via `@fontsource-variable/jetbrains-mono`.

### Dependencies

- `@fontsource-variable/jetbrains-mono` (imported in `src/styles.css`)
- `lucide-react` (already present) — TerminalSquare icon for the header chrome only.

### Layout

```text
┌──────────────────────────────────────────────┐
│ ● ● ●   visitor@ajay-portfolio: ~            │  ← faux window chrome
├──────────────────────────────────────────────┤
│ welcome banner (ASCII)                       │
│ Type 'help' to get started.                  │
│                                              │
│ visitor@ajay-portfolio:~$ help               │  ← history entries
│   bio       short intro                      │
│   skills    tech stack                       │
│   ...                                        │
│ visitor@ajay-portfolio:~$ █                  │  ← live prompt + blink
└──────────────────────────────────────────────┘
  (scanline overlay on top, pointer-events:none)
```

Full viewport height, max content width ~1100px, centered, padded. Mobile: full width, smaller font, same behavior.

### Interaction

- Hidden `<input>` always rendered after the last history line; visible block cursor is a styled `<span>` next to the rendered current input value.
- A wrapper `<div onClick>` on the whole screen calls `inputRef.current.focus()`.
- Enter: push `{prompt, command, output}` to history, clear input. Up/Down arrow: navigate prior commands (nice-to-have, cheap).
- After every history update, `useEffect` scrolls a `bottomRef` into view with `behavior: 'smooth'`.
- `clear` resets history to `[]`.

### Command outputs (content)

- `bio` — "IT Professional and DevOps / Cloud Infrastructure enthusiast. I build automated pipelines and tinker with Linux systems."
- `skills` — grouped list: DevOps & CI/CD (Jenkins, GitHub Actions, n8n) · Cloud & IaC (AWS, Terraform) · Containers & Orchestration (Kubernetes, Docker) · Scripting & Automation (Bash, Python).
- `projects` — Zenoure Jewels Infrastructure Automation; Custom Telegram/Discord Bots; Self-Hosted Cloud Environments.
- `work` — simple timeline rows (year — role — stack).
- `social` — placeholder handles (GitHub / LinkedIn / Email) — to be filled by user later.
- `secret` — playful easter egg ("You found it. ☕ → coffee.sh executed.").
- `sudo` — "Permission denied: Standard user account does not have root privileges. Nice try!"
- `help` — two-column command/description list.

### CRT styling

- Body bg `#0a0a0a`, text `oklch` green ~ `oklch(0.85 0.18 145)`.
- `text-shadow: 0 0 6px currentColor` on terminal text for glow.
- Scanline overlay: absolutely positioned `::after` on the terminal container with `repeating-linear-gradient(transparent 0 2px, rgba(0,0,0,0.25) 2px 3px)` and `pointer-events:none`.
- Block cursor: 0.6em wide span with `animation: blink 1s steps(1) infinite`.

### Out of scope

- No backend, no Lovable Cloud, no analytics. Pure client-side. The portfolio content above is the seed; the user can update copy after they see it live.
