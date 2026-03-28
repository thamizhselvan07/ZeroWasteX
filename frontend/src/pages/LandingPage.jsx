import { motion } from "framer-motion";
import { ArrowRight, Compass, HeartHandshake, MapPinned, ShieldCheck } from "lucide-react";

function FloatingCard({ className, title, subtitle }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-3xl border border-white/25 bg-white/10 p-5 backdrop-blur-xl ${className}`}
    >
      <div className="text-sm font-medium text-emerald-100">{subtitle}</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
    </motion.div>
  );
}

function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.32),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.26),transparent_30%),linear-gradient(135deg,#4ade80_0%,#10b981_35%,#14b8a6_68%,#0f766e_100%)]" />
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.08) 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      <div className="section-shell relative flex min-h-screen flex-col justify-between py-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <MapPinned className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">ZeroWasteX</div>
              <div className="text-sm text-emerald-100/80">Food rescue, reimagined</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogin}
            className="rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Login
          </button>
        </div>

        <div className="grid items-center gap-16 py-16 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-emerald-50 backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              Real-time surplus food coordination platform
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Redistribute Food. Reduce Waste. Feed Communities.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/85">
              A real-time platform connecting surplus food with people in need. Built for volunteers,
              NGOs, donor kitchens, and community teams to move food before it expires.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-emerald-700 shadow-2xl shadow-emerald-950/20 transition hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-full border border-white/25 bg-white/10 px-7 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Login
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                { icon: HeartHandshake, label: "Meals matched", value: "18,200+" },
                { icon: Compass, label: "Live pickups", value: "126 active" },
                { icon: MapPinned, label: "Coverage", value: "12 city zones" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
                    <Icon className="h-6 w-6 text-emerald-100" />
                    <div className="mt-4 text-2xl font-semibold">{item.value}</div>
                    <div className="mt-1 text-sm text-emerald-50/75">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <div className="relative min-h-[32rem]">
            <FloatingCard
              className="absolute left-0 top-4 w-56"
              title="Restaurant added 50 meals"
              subtitle="Live Activity"
            />
            <FloatingCard
              className="absolute right-8 top-28 w-60"
              title="Volunteer en route for pickup"
              subtitle="Operations"
            />
            <FloatingCard
              className="absolute left-10 bottom-14 w-60"
              title="Shelter received same-day delivery"
              subtitle="Impact"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="absolute bottom-0 right-0 w-full rounded-[2rem] border border-white/20 bg-slate-950/35 p-6 shadow-2xl backdrop-blur-2xl"
            >
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-emerald-100/80">Today&apos;s live overview</div>
                    <div className="mt-2 text-3xl font-semibold">6 rescue routes active</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <MapPinned className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    "Donors publish live surplus inventory",
                    "Nearby volunteers request pickup in seconds",
                    "Communities receive food before expiry",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl bg-white/10 px-4 py-4 text-sm text-emerald-50/90">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
