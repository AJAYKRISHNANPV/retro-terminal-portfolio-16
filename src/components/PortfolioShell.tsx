import { useEffect, useState } from "react";
import { Terminal } from "./Terminal";
import { GuiPortfolio } from "./GuiPortfolio";
import { MonitorPlay, TerminalSquare } from "lucide-react";

export type Mode = "terminal" | "gui";

export function PortfolioShell() {
  const [mode, setMode] = useState<Mode>("terminal");
  const [animating, setAnimating] = useState(false);

  const switchTo = (next: Mode) => {
    if (next === mode || animating) return;
    setAnimating(true);
    setMode(next);
    window.setTimeout(() => setAnimating(false), 1100);
  };

  useEffect(() => {
    document.documentElement.style.background = "#0a0a0a";
  }, []);

  const terminalActive = mode === "terminal";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* GUI layer (always mounted underneath) */}
      <div
        className={`absolute inset-0 transition-[opacity,filter,transform] duration-700 ease-out ${
          terminalActive
            ? "pointer-events-none scale-[0.98] opacity-0 blur-md"
            : "pointer-events-auto scale-100 opacity-100 blur-0"
        }`}
        aria-hidden={terminalActive}
      >
        <GuiPortfolio onLaunchTerminal={() => switchTo("terminal")} />
      </div>

      {/* Terminal layer (slides over) */}
      <div
        className={`fixed inset-0 z-40 transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
          terminalActive
            ? "translate-y-0 opacity-100 blur-0"
            : "pointer-events-none -translate-y-[105%] opacity-0 blur-sm"
        }`}
        aria-hidden={!terminalActive}
      >
        <Terminal
          onSwitchToGui={() => switchTo("gui")}
          active={terminalActive}
        />
      </div>

      {/* Floating launch button (only visible in terminal mode) */}
      <button
        onClick={() => switchTo("gui")}
        className={`fixed right-4 top-4 z-50 hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.03] hover:bg-white/15 hover:border-white/25 ${
          terminalActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <MonitorPlay className="h-4 w-4" />
        Launch GUI Mode
      </button>
      <button
        onClick={() => switchTo("gui")}
        aria-label="Launch GUI Mode"
        className={`fixed right-3 top-3 z-50 sm:hidden inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 p-2 text-white/90 backdrop-blur-xl transition-all duration-300 ${
          terminalActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <MonitorPlay className="h-4 w-4" />
      </button>

      {/* Mobile-only secondary "Back to Terminal" handled inside GUI */}
      <span className="sr-only">
        <TerminalSquare />
      </span>
    </div>
  );
}
