import { useEffect, useState } from "react";

function parts(target: number) {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    done: diff === 0,
  };
}

export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso).getTime();
  const [t, setT] = useState(() => parts(target));
  useEffect(() => {
    const id = window.setInterval(() => setT(parts(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const cell = (n: number, label: string) => (
    <div className="flex min-w-12 flex-col items-center">
      <span className="font-display text-2xl font-semibold tabular leading-none text-fg sm:text-3xl">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-subtle">{label}</span>
    </div>
  );

  if (t.done) {
    return <p className="font-display text-lg text-fg">Kick-off</p>;
  }

  return (
    <div className="flex items-end gap-3 sm:gap-4">
      {cell(t.d, "days")}
      {cell(t.h, "hrs")}
      {cell(t.m, "min")}
      {cell(t.s, "sec")}
    </div>
  );
}
