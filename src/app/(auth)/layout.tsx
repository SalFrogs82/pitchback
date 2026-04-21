export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — dugout dark brand panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[var(--dugout)] text-white flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Softball stitching decoration */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="stitch" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M0 30 C10 20, 20 20, 30 30 S50 40, 60 30" fill="none" stroke="white" strokeWidth="1.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#stitch)" />
          </svg>
        </div>
        <div className="relative z-10 text-center space-y-6 max-w-sm">
          {/* Softball SVG */}
          <svg viewBox="0 0 100 100" className="w-24 h-24 mx-auto drop-shadow-xl" fill="none">
            <circle cx="50" cy="50" r="46" fill="#f5a623" stroke="#e8941a" strokeWidth="2" />
            <path d="M30 20 C35 30, 35 40, 30 50 C25 60, 25 70, 30 80" stroke="#c82014" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M70 20 C65 30, 65 40, 70 50 C75 60, 75 70, 70 80" stroke="#c82014" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <h1 className="text-3xl font-bold tracking-tight">PitchBack</h1>
          <p className="text-white/70 text-lg" style={{ fontFamily: "var(--font-lora), serif" }}>
            Your comeback starts here.
          </p>
          <div className="flex justify-center gap-1 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-8 h-1.5 rounded-full bg-white" style={{ opacity: 0.2 + i * 0.16 }} />
            ))}
          </div>
          <p className="text-white/50 text-xs">5 phases to your return</p>
        </div>
      </div>

      {/* Right side — warm cream form area */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--background)]">
        <div className="w-full max-w-sm space-y-6">{children}</div>
      </div>
    </div>
  );
}
