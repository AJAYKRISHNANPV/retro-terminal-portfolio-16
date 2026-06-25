import { useEffect, useRef, useState } from "react";

type Pos = { x: number; y: number };
const W = 24;
const H = 14;

export function SnakeGame({ onExit }: { onExit: () => void }) {
  const [snake, setSnake] = useState<Pos[]>([{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }]);
  const [food, setFood] = useState<Pos>({ x: 14, y: 7 });
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onExit(); return; }
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && d.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && d.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && d.x !== -1) setDir({ x: 1, y: 0 });
      if (dead && (e.key === "r" || e.key === "R")) {
        setSnake([{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }]);
        setFood({ x: 14, y: 7 });
        setDir({ x: 1, y: 0 });
        setScore(0);
        setDead(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit, dead]);

  useEffect(() => {
    if (dead) return;
    const id = window.setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H || prev.some((p) => p.x === head.x && p.y === head.y)) {
          setDead(true);
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev];
        if (ate) {
          setScore((s) => s + 1);
          let nf: Pos;
          do { nf = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) }; }
          while (next.some((p) => p.x === nf.x && p.y === nf.y));
          setFood(nf);
        } else {
          next.pop();
        }
        return next;
      });
    }, 110);
    return () => window.clearInterval(id);
  }, [dead, food]);

  const rows: string[] = [];
  for (let y = 0; y < H; y++) {
    let row = "";
    for (let x = 0; x < W; x++) {
      if (snake[0].x === x && snake[0].y === y) row += "@";
      else if (snake.some((p) => p.x === x && p.y === y)) row += "█";
      else if (food.x === x && food.y === y) row += "◆";
      else row += "·";
    }
    rows.push(row);
  }

  return (
    <div className="crt-glow font-mono">
      <div className="mb-1">snake — arrows to move · Esc to exit{dead ? " · R to restart" : ""}</div>
      <div className="mb-1">score: {score}</div>
      <pre className="leading-[1.05] text-[color:var(--term-green)]">
{`┌${"─".repeat(W)}┐
${rows.map((r) => `│${r}│`).join("\n")}
└${"─".repeat(W)}┘`}
      </pre>
      {dead && <div className="mt-1 text-red-400">[ game over ] press R to restart, Esc to exit</div>}
    </div>
  );
}
