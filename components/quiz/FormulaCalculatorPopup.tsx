"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useFormulaCalc } from "@/components/layout/FormulaCalculatorProvider";
import {
  FormulaCalculatorBody,
  FormulaCalculatorModeTabs,
  useFormulaCalculatorShell,
  type CalcMode,
} from "@/components/layout/FormulaCalculatorBody";

// ── Sizing constants ───────────────────────────────────────────────────────────

const WIDTH_MIN = 280;
const WIDTH_MAX = 700;
const HEIGHT_MIN = 260;
const HEIGHT_MAX_VH = 0.88; // 88% of viewport

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function loadSavedSize(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 384, height: 520 };
  try {
    const raw = localStorage.getItem("impact_calc_popup_size");
    if (raw) {
      const { w, h } = JSON.parse(raw);
      return {
        width: clamp(Number(w) || 384, WIDTH_MIN, WIDTH_MAX),
        height: clamp(Number(h) || 520, HEIGHT_MIN, Math.floor(window.innerHeight * HEIGHT_MAX_VH)),
      };
    }
  } catch { /* ignore */ }
  return { width: 384, height: 520 };
}

function saveSavedSize(w: number, h: number) {
  try { localStorage.setItem("impact_calc_popup_size", JSON.stringify({ w, h })); } catch { /* ignore */ }
}

// ── Draggable popup (desktop) / bottom-sheet (mobile) ─────────────────────────

interface PopupPosition { x: number; y: number }

const DEFAULT_POS: PopupPosition = { x: 24, y: 24 }; // distance from bottom-right

/**
 * Floating quiz calculator popup.
 * - Desktop: draggable + resizable floating card (bottom-right origin)
 * - Mobile: slide-up bottom sheet
 * - Persists formula + values across quiz question navigation via context
 */
export function FormulaCalculatorPopup({
  onAttachToAnswer,
}: {
  onAttachToAnswer?: (formatted: string) => void;
}) {
  const {
    isOpen,
    isMinimized,
    activeFormula,
    showSelectorPane,
    minimize,
    restore,
    close,
    toggleSelectorPane,
  } = useFormulaCalc();

  const {
    calcMode,
    setCalcMode,
    engine,
    showSteps,
    activeConfig,
    activeFormulaCode,
  } = useFormulaCalculatorShell();

  // ── Popup size ─────────────────────────────────────────────────────────────
  const [popupWidth, setPopupWidth] = useState(384);
  const [popupHeight, setPopupHeight] = useState(520);
  // Initialise from localStorage on mount (avoid SSR mismatch)
  useEffect(() => {
    const saved = loadSavedSize();
    setPopupWidth(saved.width);
    setPopupHeight(saved.height);
  }, []);

  // ── Dragging state ─────────────────────────────────────────────────────────
  const [pos, setPos] = useState<PopupPosition>(DEFAULT_POS);
  const dragOrigin = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button,input,select,textarea")) return;
    dragOrigin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    setIsDragging(true);
    e.preventDefault();
  }, [pos]);

  useEffect(() => {
    if (!isDragging) return;
    function onMove(e: MouseEvent) {
      if (!dragOrigin.current) return;
      const dx = e.clientX - dragOrigin.current.mx;
      const dy = e.clientY - dragOrigin.current.my;
      const maxY = window.innerHeight - 120;
      setPos({
        x: Math.max(0, dragOrigin.current.px - dx),
        y: clamp(dragOrigin.current.py - dy, 0, maxY),
      });
    }
    function onUp() { dragOrigin.current = null; setIsDragging(false); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging]);

  // ── Resize state ───────────────────────────────────────────────────────────
  // Popup is anchored bottom-right, so resize handle is at the top-left corner.
  // Dragging left  → wider;  dragging right → narrower
  // Dragging up    → taller; dragging down  → shorter
  type ResizeEdge = "nw" | "w" | "n";
  const resizeOrigin = useRef<{
    mx: number; my: number;
    startW: number; startH: number;
    edge: ResizeEdge;
  } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  function startResize(e: React.MouseEvent, edge: ResizeEdge) {
    e.preventDefault();
    e.stopPropagation();
    resizeOrigin.current = {
      mx: e.clientX, my: e.clientY,
      startW: popupWidth, startH: popupHeight,
      edge,
    };
    setIsResizing(true);
  }

  useEffect(() => {
    if (!isResizing) return;
    function onMove(e: MouseEvent) {
      const o = resizeOrigin.current;
      if (!o) return;
      const dx = e.clientX - o.mx; // positive = moved right
      const dy = e.clientY - o.my; // positive = moved down
      const maxH = Math.floor(window.innerHeight * HEIGHT_MAX_VH);
      let newW = o.startW;
      let newH = o.startH;
      if (o.edge === "nw" || o.edge === "w") newW = clamp(o.startW - dx, WIDTH_MIN, WIDTH_MAX);
      if (o.edge === "nw" || o.edge === "n") newH = clamp(o.startH - dy, HEIGHT_MIN, maxH);
      setPopupWidth(newW);
      setPopupHeight(newH);
    }
    function onUp() {
      const o = resizeOrigin.current;
      if (o) saveSavedSize(popupWidth, popupHeight);
      resizeOrigin.current = null;
      setIsResizing(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing]);

  // Persist size after resize ends
  useEffect(() => {
    if (!isResizing) saveSavedSize(popupWidth, popupHeight);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  if (!isOpen) return null;

  // ── Mobile: bottom sheet ──────────────────────────────────────────────────
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  if (isMobile) {
    return (
      <>
        {!isMinimized && (
          <div
            className="fixed inset-0 z-[205] bg-black/30 sm:hidden"
            aria-hidden="true"
            onClick={minimize}
          />
        )}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Formula Calculator"
          className={cn(
            "fixed inset-x-0 bottom-0 z-[210] flex flex-col rounded-t-2xl bg-white shadow-2xl ring-1 ring-black/10 transition-transform duration-300 sm:hidden",
            isMinimized ? "translate-y-[calc(100%-3.25rem)]" : "translate-y-0"
          )}
          style={{ maxHeight: "78vh" }}
        >
          <PopupHeader
            activeFormula={activeFormula}
            isMinimized={isMinimized}
            showSelectorPane={showSelectorPane}
            calcMode={calcMode}
            onSetCalcMode={setCalcMode}
            isMobile
            onMinimize={isMinimized ? restore : minimize}
            onClose={close}
            onToggleSelector={toggleSelectorPane}
          />
          {!isMinimized && (
            <FormulaCalculatorBody
              engine={engine}
              activeFormula={activeFormula}
              activeConfig={activeConfig}
              showSelectorPane={showSelectorPane}
              showSteps={showSteps}
              calcMode={calcMode}
              onAttachToAnswer={onAttachToAnswer}
              onToggleSelector={toggleSelectorPane}
              variant="popup"
            />
          )}
        </div>
      </>
    );
  }

  // ── Desktop: draggable + resizable floating card ──────────────────────────
  const cursor = isDragging ? "cursor-grabbing" : isResizing ? "cursor-nwse-resize" : "";

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label="Formula Calculator"
      className={cn(
        "fixed z-[210] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10",
        "hidden sm:flex",
        cursor,
        (isDragging || isResizing) ? "select-none" : ""
      )}
      style={{
        bottom: pos.y,
        right: pos.x,
        width: isMinimized ? 288 : popupWidth,
        height: isMinimized ? "auto" : popupHeight,
        transition: (isDragging || isResizing) ? "none" : "width 120ms ease, height 120ms ease",
      }}
    >
      {/* ── Resize handles (top-left corner + edges) — only when expanded ── */}
      {!isMinimized && (
        <>
          {/* NW corner — resizes both width and height */}
          <div
            className="absolute left-0 top-0 z-20 h-4 w-4 cursor-nwse-resize"
            onMouseDown={(e) => startResize(e, "nw")}
          >
            {/* Visual grip dots */}
            <svg width="12" height="12" viewBox="0 0 12 12" className="absolute left-1 top-1 text-slate-300">
              <circle cx="2" cy="2" r="1.2" fill="currentColor" />
              <circle cx="6" cy="2" r="1.2" fill="currentColor" />
              <circle cx="2" cy="6" r="1.2" fill="currentColor" />
              <circle cx="6" cy="6" r="1.2" fill="currentColor" />
              <circle cx="2" cy="10" r="1.2" fill="currentColor" />
              <circle cx="10" cy="2" r="1.2" fill="currentColor" />
            </svg>
          </div>
          {/* W edge — width only */}
          <div
            className="absolute bottom-8 left-0 top-4 z-20 w-1 cursor-ew-resize hover:bg-[#185FA5]/20"
            onMouseDown={(e) => startResize(e, "w")}
          />
          {/* N edge — height only */}
          <div
            className="absolute left-4 right-0 top-0 z-20 h-1 cursor-ns-resize hover:bg-[#185FA5]/20"
            onMouseDown={(e) => startResize(e, "n")}
          />
        </>
      )}

      <PopupHeader
        activeFormula={activeFormula}
        isMinimized={isMinimized}
        showSelectorPane={showSelectorPane}
        calcMode={calcMode}
        onSetCalcMode={setCalcMode}
        isMobile={false}
        isDraggable
        popupWidth={isMinimized ? 288 : popupWidth}
        onMouseDown={onMouseDown}
        onMinimize={isMinimized ? restore : minimize}
        onClose={close}
        onToggleSelector={toggleSelectorPane}
      />
      {!isMinimized && (
        <FormulaCalculatorBody
          engine={engine}
          activeFormula={activeFormula}
          activeConfig={activeConfig}
          showSelectorPane={showSelectorPane}
          showSteps={showSteps}
          calcMode={calcMode}
          onAttachToAnswer={onAttachToAnswer}
          onToggleSelector={toggleSelectorPane}
          variant="popup"
        />
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PopupHeader({
  activeFormula,
  isMinimized,
  showSelectorPane,
  calcMode,
  onSetCalcMode,
  isMobile,
  isDraggable,
  popupWidth,
  onMouseDown,
  onMinimize,
  onClose,
  onToggleSelector,
}: {
  activeFormula: ReturnType<typeof useFormulaCalc>["activeFormula"];
  isMinimized: boolean;
  showSelectorPane: boolean;
  calcMode: CalcMode;
  onSetCalcMode: (m: CalcMode) => void;
  isMobile: boolean;
  isDraggable?: boolean;
  popupWidth?: number;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMinimize: () => void;
  onClose: () => void;
  onToggleSelector: () => void;
}) {
  // When the popup is narrow, collapse mode tabs to icons only
  const compact = (popupWidth ?? 400) < 340;

  return (
    <div className={cn("shrink-0", isMobile && "rounded-t-2xl")}>
      <div
        className={cn(
          "flex items-center gap-2 px-3.5 py-2.5",
          isDraggable && !isMobile ? "cursor-grab active:cursor-grabbing" : ""
        )}
        onMouseDown={isDraggable ? onMouseDown : undefined}
      >
        {isMobile && (
          <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-slate-300" />
        )}

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E6F1FB]">
            <Icons.Calculator size={14} className="text-[#185FA5]" />
          </div>
          {!compact && (
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#185FA5]">
                Calculator
              </p>
              {calcMode === "formula" && activeFormula && !isMinimized && (
                <p className="truncate text-[11px] font-semibold text-slate-600">{activeFormula.name}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {!isMinimized && calcMode === "formula" && (
            <button
              type="button"
              onClick={onToggleSelector}
              aria-pressed={showSelectorPane}
              title="Switch formula"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]",
                showSelectorPane
                  ? "border-[#185FA5] bg-[#E6F1FB] text-[#185FA5]"
                  : "border-slate-200 text-slate-500 hover:border-[#185FA5] hover:text-[#185FA5]"
              )}
            >
              <Icons.ArrowLeftRight size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={onMinimize}
            aria-label={isMinimized ? "Expand calculator" : "Minimize calculator"}
            title={isMinimized ? "Expand" : "Minimize"}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#185FA5] hover:text-[#185FA5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#185FA5]"
          >
            {isMinimized ? <Icons.ChevronUp size={13} /> : <Icons.ChevronDown size={13} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close calculator"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-red-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Icons.X size={13} />
          </button>
        </div>
      </div>

      {/* Mode tabs (hidden when minimized) */}
      {!isMinimized && (
        <FormulaCalculatorModeTabs
          calcMode={calcMode}
          onSetCalcMode={onSetCalcMode}
          compact={compact}
        />
      )}
    </div>
  );
}
