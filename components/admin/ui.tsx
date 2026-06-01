"use client";

import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-black gradient-text">{title}</h1>
        {subtitle && <p className="text-white/40 text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center gap-2 text-white/30">
      <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string | null;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 max-w-lg">
      <div className="flex items-center gap-2 text-red-400 font-bold">
        <AlertTriangle className="w-4 h-4" /> Algo salió mal
      </div>
      <p className="text-white/50 text-sm">
        {message ?? "No se pudo cargar la información."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Reintentar
        </button>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: `${color}1a`, color, border: `1px solid ${color}33` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function Progress({ value, color = "#1E90FF" }: { value: number; color?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${v}%`, background: color }}
      />
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-dark border border-white/10 rounded-3xl p-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
