export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M16 5.5 L18.2 13.1 L26 13.1 L19.9 17.7 L22.2 25.3 L16 20.6 L9.8 25.3 L12.1 17.7 L6 13.1 L13.8 13.1 Z"
        fill="currentColor"
      />
    </svg>
  );
}
