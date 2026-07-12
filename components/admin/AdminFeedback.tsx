"use client";

import { useEffect, useState } from "react";
import * as Icons from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

// ponytail: module singleton, not context — one mount in the admin layout.

type ToastType = "success" | "error";
interface ToastItem {
  id: number;
  type: ToastType;
  text: string;
}

interface ConfirmRequest {
  message: string;
  title?: string;
  confirmLabel?: string;
  danger?: boolean;
  resolve: (ok: boolean) => void;
}

let pushToast: ((type: ToastType, text: string) => void) | null = null;
let pushConfirm: ((req: ConfirmRequest) => void) | null = null;
let confirmPending = false;

export function toast(type: ToastType, text: string) {
  pushToast?.(type, text);
}

export function confirmDialog(
  message: string,
  opts?: { title?: string; confirmLabel?: string; danger?: boolean }
): Promise<boolean> {
  if (!pushConfirm || confirmPending) return Promise.resolve(false);
  confirmPending = true;
  return new Promise<boolean>((resolve) => {
    pushConfirm!({
      message,
      ...opts,
      resolve: (ok) => {
        confirmPending = false;
        resolve(ok);
      },
    });
  });
}

const TOAST_DURATION = 3500;
let nextId = 1;

export function AdminFeedback() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null);

  useEffect(() => {
    pushToast = (type, text) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, text }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), TOAST_DURATION);
    };
    pushConfirm = (req) => setConfirm(req);
    return () => {
      pushToast = null;
      pushConfirm = null;
    };
  }, []);

  useEffect(() => {
    if (!confirm) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") answer(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirm]);

  function answer(ok: boolean) {
    confirm?.resolve(ok);
    setConfirm(null);
  }

  return (
    <>
      {/* Toast stack */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-full max-w-xs flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium shadow-lg backdrop-blur-sm animate-in",
              t.type === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                : "border-red-200 bg-red-50/95 text-red-700"
            )}
          >
            {t.type === "success" ? (
              <Icons.Check size={14} className="mt-0.5 shrink-0" />
            ) : (
              <Icons.X size={14} className="mt-0.5 shrink-0" />
            )}
            <span className="min-w-0 leading-5">{t.text}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-auto shrink-0 opacity-50 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <Icons.X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4"
          onClick={() => answer(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={confirm.title ?? "Confirm action"}
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  confirm.danger ? "bg-red-50 text-red-600" : "bg-[#E6F1FB] text-[#185FA5]"
                )}
              >
                {confirm.danger ? <Icons.Trash2 size={16} /> : <Icons.AlertTriangle size={16} />}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-900">
                  {confirm.title ?? (confirm.danger ? "Are you sure?" : "Please confirm")}
                </h2>
                <p className="mt-1 whitespace-pre-line text-xs leading-5 text-slate-600">{confirm.message}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => answer(false)} className="admin-action secondary text-xs">
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => answer(true)}
                className={cn("admin-action text-xs", confirm.danger && "danger")}
              >
                {confirm.confirmLabel ?? (confirm.danger ? "Delete" : "Confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
