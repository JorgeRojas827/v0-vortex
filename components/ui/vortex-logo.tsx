import { cn } from "@/lib/utils";

export function VortexLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
    >
      <defs>
        <linearGradient id="vortex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Outer spiral */}
      <path
        d="M16 4C10.477 4 6 8.477 6 14c0 3.866 2.186 7.215 5.39 8.9"
        stroke="url(#vortex-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Middle spiral */}
      <path
        d="M16 8c-3.314 0-6 2.686-6 6 0 2.316 1.31 4.325 3.234 5.329"
        stroke="url(#vortex-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Inner spiral */}
      <path
        d="M16 12c-1.105 0-2 .895-2 2 0 .774.44 1.444 1.083 1.778"
        stroke="url(#vortex-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Center dot */}
      <circle cx="16" cy="14" r="1.5" fill="url(#vortex-grad)" />
      {/* Lower arc */}
      <path
        d="M20 24c3.204-1.685 5.39-5.034 5.39-8.9 0-1.572-.363-3.06-1.01-4.386"
        stroke="url(#vortex-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* "VORTEX" subtle text line at bottom */}
      <path
        d="M10 27h12"
        stroke="url(#vortex-grad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />
    </svg>
  );
}
