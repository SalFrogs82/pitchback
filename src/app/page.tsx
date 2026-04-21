import Link from "next/link";
import { Button } from "@/components/ui/button";

function SoftballIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" fill="#f5a623" stroke="#e8941a" strokeWidth="2" />
      <path d="M30 20 C35 30, 35 40, 30 50 C25 60, 25 70, 30 80" stroke="#c82014" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M70 20 C65 30, 65 40, 70 50 C75 60, 75 70, 70 80" stroke="#c82014" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Stitching details */}
      <path d="M32 24 L27 22" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M34 32 L28 30" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 40 L27 39" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 52 L23 51" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27 60 L22 59" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M29 68 L24 67" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 76 L27 75" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 24 L73 22" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66 32 L72 30" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M67 40 L73 39" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M72 52 L77 51" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M73 60 L78 59" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M71 68 L76 67" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 76 L73 75" stroke="#c82014" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section — warm cream */}
      <section className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <SoftballIcon className="w-20 h-20 md:w-24 md:h-24 drop-shadow-lg" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1a6b3c]">
              PitchBack
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto font-medium" style={{ fontFamily: "var(--font-lora), serif" }}>
              Your comeback starts here.
            </p>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              Track your rehab progress, pitching data, strength training, and every step of your return-to-play journey.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Band — dugout dark (Starbucks House Green equivalent) */}
      <section className="bg-[var(--dugout)] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Everything you need for your comeback</h2>
            <p className="text-white/70 max-w-lg mx-auto">
              Built by someone who gets it. Track every metric that matters on your road back to the circle.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Rehab Tracking", desc: "Daily logs, ROM charts, pain trends, wellness check-ins, and red flag alerts.", icon: "🏥" },
              { title: "Pitch Analytics", desc: "Upload Rapsodo data, track velocity trends, compare against D1 benchmarks.", icon: "🥎" },
              { title: "Strength & Goals", desc: "Log workouts, track e1RM progress, set goals, celebrate every milestone.", icon: "💪" },
            ].map((f) => (
              <div key={f.title} className="text-center space-y-3">
                <div className="text-4xl">{f.icon}</div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-white/70 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Band — warm ceramic */}
      <section className="bg-[#f2f0eb] py-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1a6b3c]">
            Built for the journey back
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            From surgery day through your first competitive pitch.
            PitchBack tracks your 5-phase rehab, interval throwing program, and return to the mound — so you can focus on what matters.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((phase) => (
                <div
                  key={phase}
                  className="w-12 h-2 rounded-full bg-[#22874a]"
                  style={{ opacity: 0.3 + phase * 0.14 }}
                />
              ))}
            </div>
            <span>5 phases to your comeback</span>
          </div>
        </div>
      </section>

      {/* Footer — dugout dark */}
      <footer className="bg-[var(--dugout)] text-white/70 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SoftballIcon className="w-6 h-6" />
            <span className="font-semibold text-white text-sm">PitchBack</span>
          </div>
          <p className="text-xs">
            Softball pitching rehab &amp; performance tracking.
          </p>
        </div>
      </footer>
    </div>
  );
}
