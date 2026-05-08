"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { evalExpression } from "@/lib/admin/formula-eval";

// ─── Constants ─────────────────────────────────────────────────────────────────

const PI_VAL = "3.14159265358979";
const E_VAL  = "2.71828182845905";

// Tokens that, when backspaced as a unit, are removed entirely
const FN_TOKENS = [
  "sind(", "cosd(", "tand(", "asind(", "acosd(", "atand(",
  "sin(", "cos(", "tan(", "asin(", "acos(", "atan(",
  "sqrt(", "log(", "ln(",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function normalise(expr: string): string {
  return expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-");
}

function formatResult(n: number): string {
  if (!isFinite(n)) return "Error";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return String(n);
  // Up to 10 significant digits, strip trailing zeros
  const s = n.toPrecision(10);
  const f = parseFloat(s);
  // Use exponential for very large/small
  if (Math.abs(f) >= 1e10 || (Math.abs(f) < 1e-6 && f !== 0)) {
    return f.toExponential(6).replace(/\.?0+e/, "e");
  }
  return String(f);
}

function smartBackspace(expr: string): string {
  if (!expr) return "";
  // Remove a full function token if the expression ends with one
  for (const token of FN_TOKENS) {
    if (expr.endsWith(token)) return expr.slice(0, -token.length);
  }
  return expr.slice(0, -1);
}

// ─── Types ─────────────────────────────────────────────────────────────────────

type AngleMode = "deg" | "rad";

interface CalcButton {
  label: string;           // display label
  action: string;          // semantic action key
  wide?: boolean;          // span 2 columns
  tone?: "op" | "eq" | "fn" | "mem" | "toggle" | "clear";
}

// ─── Button grid definitions ────────────────────────────────────────────────────

const SCI_ROWS: CalcButton[][] = [
  [
    { label: "sin", action: "fn:sin", tone: "fn" },
    { label: "cos", action: "fn:cos", tone: "fn" },
    { label: "tan", action: "fn:tan", tone: "fn" },
    { label: "π",   action: "const:pi", tone: "fn" },
  ],
  [
    { label: "log", action: "fn:log", tone: "fn" },
    { label: "ln",  action: "fn:ln",  tone: "fn" },
    { label: "√x",  action: "fn:sqrt", tone: "fn" },
    { label: "e",   action: "const:e", tone: "fn" },
  ],
  [
    { label: "x²",  action: "sq",     tone: "fn" },
    { label: "xʸ",  action: "pow",    tone: "fn" },
    { label: "(",   action: "(",       tone: "fn" },
    { label: ")",   action: ")",       tone: "fn" },
  ],
];

const BASE_ROWS: CalcButton[][] = [
  [
    { label: "C",  action: "clear", tone: "clear" },
    { label: "±",  action: "sign"  },
    { label: "⌫",  action: "back"  },
    { label: "÷",  action: "÷", tone: "op" },
  ],
  [
    { label: "7", action: "7" }, { label: "8", action: "8" }, { label: "9", action: "9" },
    { label: "×", action: "×", tone: "op" },
  ],
  [
    { label: "4", action: "4" }, { label: "5", action: "5" }, { label: "6", action: "6" },
    { label: "−", action: "−", tone: "op" },
  ],
  [
    { label: "1", action: "1" }, { label: "2", action: "2" }, { label: "3", action: "3" },
    { label: "+", action: "+", tone: "op" },
  ],
  [
    { label: "0",  action: "0"     },
    { label: ".",  action: "."     },
    { label: "%",  action: "%"     },
    { label: "=",  action: "=", tone: "eq" },
  ],
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface BasicCalculatorProps {
  isScientific?: boolean;
  /** Whether the calculator is the visible/active pane (enables keyboard) */
  isVisible?: boolean;
}

export function BasicCalculator({ isScientific = false, isVisible = true }: BasicCalculatorProps) {
  const [expr, setExpr]               = useState("");
  const [result, setResult]           = useState<string | null>(null);
  const [justComputed, setJustComputed] = useState(false);
  const [angleMode, setAngleMode]     = useState<AngleMode>("deg");
  const [memory, setMemory]           = useState(0);
  const [hasMemory, setHasMemory]     = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Core action handler ────────────────────────────────────────────────────

  const dispatch = useCallback((action: string) => {
    setError(null);

    // ── Clear ────────────────────────────────────────────────────────────────
    if (action === "clear") {
      setExpr(""); setResult(null); setJustComputed(false);
      return;
    }

    // ── Backspace ────────────────────────────────────────────────────────────
    if (action === "back") {
      setExpr((prev) => smartBackspace(prev));
      if (justComputed) { setResult(null); setJustComputed(false); }
      return;
    }

    // ── Equals ───────────────────────────────────────────────────────────────
    if (action === "=") {
      if (!expr && result === null) return;
      const toEval = normalise(justComputed && result !== null ? result : expr);
      if (!toEval.trim()) return;
      try {
        const val = evalExpression(toEval, {});
        if (!isFinite(val)) { setError("Cannot compute (overflow or division by zero)"); return; }
        const fmt = formatResult(val);
        setResult(fmt);
        setJustComputed(true);
      } catch {
        setError("Invalid expression");
      }
      return;
    }

    // ── Memory ────────────────────────────────────────────────────────────────
    if (action === "mc")  { setMemory(0); setHasMemory(false); return; }
    if (action === "mr")  {
      const s = formatResult(memory);
      if (justComputed) { setExpr(s); setResult(null); setJustComputed(false); }
      else setExpr((prev) => prev + s);
      return;
    }
    if (action === "m+" || action === "m-") {
      const cur = justComputed && result !== null ? parseFloat(result) : parseFloat(normalise(expr));
      if (!isNaN(cur)) {
        const next = action === "m+" ? memory + cur : memory - cur;
        setMemory(next); setHasMemory(true);
      }
      return;
    }

    // ── Sign toggle ────────────────────────────────────────────────────────────
    if (action === "sign") {
      if (justComputed && result !== null) {
        const n = parseFloat(result);
        setResult(formatResult(-n));
        return;
      }
      setExpr((prev) => {
        if (!prev) return "-";
        if (prev.startsWith("-(") && prev.endsWith(")")) return prev.slice(2, -1);
        return `-( ${prev} )`;
      });
      return;
    }

    // ── Percent ────────────────────────────────────────────────────────────────
    if (action === "%") {
      if (justComputed && result !== null) {
        const n = parseFloat(result);
        setResult(formatResult(n / 100));
        return;
      }
      setExpr((prev) => `(${prev})/100`);
      return;
    }

    // ── Power shortcuts ──────────────────────────────────────────────────────
    if (action === "sq") {
      if (justComputed && result !== null) {
        setExpr(`(${result})^2`); setResult(null); setJustComputed(false);
      } else {
        setExpr((prev) => prev ? `(${prev})^2` : "");
      }
      return;
    }

    if (action === "pow") {
      const base = justComputed && result !== null ? result : expr;
      setExpr(base ? `(${base})^` : "");
      setResult(null); setJustComputed(false);
      return;
    }

    // ── Constants ────────────────────────────────────────────────────────────
    if (action === "const:pi") {
      appendToken(PI_VAL); return;
    }
    if (action === "const:e") {
      appendToken(E_VAL); return;
    }

    // ── Functions ─────────────────────────────────────────────────────────────
    if (action.startsWith("fn:")) {
      const fn = action.slice(3);
      let token: string;
      if (fn === "sqrt") {
        token = "sqrt(";
      } else if (["sin","cos","tan"].includes(fn)) {
        token = angleMode === "deg" ? `${fn}d(` : `${fn}(`;
      } else if (["asin","acos","atan"].includes(fn)) {
        token = angleMode === "deg" ? `${fn}d(` : `${fn}(`;
      } else {
        token = `${fn}(`;
      }
      appendToken(token); return;
    }

    // ── Operators ──────────────────────────────────────────────────────────────
    if (["÷","×","−","+", "(", ")"].includes(action)) {
      if (justComputed && result !== null && action !== "(" && action !== ")") {
        setExpr(result + action);
        setResult(null); setJustComputed(false);
      } else {
        appendToken(action);
        if (justComputed) { setResult(null); setJustComputed(false); }
      }
      return;
    }

    // ── Digits & decimal ──────────────────────────────────────────────────────
    if (justComputed) {
      setExpr(action);
      setResult(null); setJustComputed(false);
    } else {
      setExpr((prev) => prev + action);
    }

    function appendToken(token: string) {
      if (justComputed) {
        setExpr(token); setResult(null); setJustComputed(false);
      } else {
        setExpr((prev) => prev + token);
      }
    }
  }, [expr, result, justComputed, angleMode, memory]);

  // ── Keyboard support ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!isVisible) return;
    function onKey(e: KeyboardEvent) {
      // Don't intercept when focus is in an input outside this component
      const active = document.activeElement;
      if (active && active !== document.body && !containerRef.current?.contains(active)) return;

      if ("0123456789.".includes(e.key)) { e.preventDefault(); dispatch(e.key); }
      else if (e.key === "+") { e.preventDefault(); dispatch("+"); }
      else if (e.key === "-") { e.preventDefault(); dispatch("−"); }
      else if (e.key === "*") { e.preventDefault(); dispatch("×"); }
      else if (e.key === "/") { e.preventDefault(); dispatch("÷"); }
      else if (e.key === "(" || e.key === ")") { e.preventDefault(); dispatch(e.key); }
      else if (e.key === "%" ) { e.preventDefault(); dispatch("%"); }
      else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); dispatch("="); }
      else if (e.key === "Backspace") { e.preventDefault(); dispatch("back"); }
      else if (e.key === "Escape") { e.preventDefault(); dispatch("clear"); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, dispatch]);

  // ── Display ────────────────────────────────────────────────────────────────

  const displayTop = justComputed
    ? `= ${expr}`
    : expr || "0";

  const displayMain = justComputed && result !== null
    ? result
    : expr || "0";

  // ─── Render ────────────────────────────────────────────────────────────────

  const allRows = isScientific ? [...SCI_ROWS, ...BASE_ROWS] : BASE_ROWS;

  return (
    <div ref={containerRef} className="select-none space-y-2">
      {/* Display */}
      <div className="rounded-xl border border-[#b8d7f0] bg-[#f0f7ff] px-4 py-3">
        <p className="truncate text-right font-mono text-[11px] text-slate-400 min-h-[1rem]">
          {justComputed ? displayTop : (expr ? expr : "")}
        </p>
        <p className={cn(
          "mt-1 truncate text-right font-mono font-bold tabular-nums leading-none",
          error ? "text-red-500 text-base" : "text-slate-900",
          displayMain.length > 12 ? "text-lg" : "text-2xl"
        )}>
          {error ?? displayMain}
        </p>
        {hasMemory && (
          <p className="mt-1 text-right font-mono text-[9px] font-bold uppercase tracking-widest text-[#185FA5]">
            M = {formatResult(memory)}
          </p>
        )}
      </div>

      {/* DEG / RAD toggle (scientific only) */}
      {isScientific && (
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-bold">
          {(["deg", "rad"] as AngleMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAngleMode(mode)}
              className={cn(
                "flex-1 py-1.5 uppercase tracking-widest transition",
                angleMode === mode
                  ? "bg-[#185FA5] text-white"
                  : "bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      )}

      {/* Button grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {allRows.flatMap((row, ri) =>
          row.map((btn, ci) => (
            <CalcBtn
              key={`${ri}-${ci}`}
              btn={btn}
              onPress={() => dispatch(btn.action)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ── CalcBtn ────────────────────────────────────────────────────────────────────

function CalcBtn({ btn, onPress }: { btn: CalcButton; onPress: () => void }) {
  const base =
    "flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5] focus-visible:ring-offset-1 h-11 text-sm select-none cursor-pointer";

  const TONES: Record<string, string> = {
    op:     "bg-[#E6F1FB] text-[#185FA5] hover:bg-[#d0e8f8]",
    eq:     "bg-[#185FA5] text-white hover:bg-[#134d88] shadow-sm",
    fn:     "bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px]",
    mem:    "bg-slate-100 text-slate-600 hover:bg-slate-200 text-[10px] font-bold uppercase",
    toggle: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    clear:  "bg-red-50 text-red-600 hover:bg-red-100",
  };
  const toneClass = btn.tone ? (TONES[btn.tone] ?? "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50") : "bg-white border border-slate-200 text-slate-800 hover:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(base, toneClass, btn.wide && "col-span-2")}
    >
      {btn.label}
    </button>
  );
}
