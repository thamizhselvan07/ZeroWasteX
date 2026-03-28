import { motion } from "framer-motion";
import { ArrowRight, Compass, HeartHandshake, MapPinned, ShieldCheck } from "lucide-react";

function FloatingCard({ className, title, subtitle, duration = 6, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-3xl border border-white/20 bg-white/10 p-5 shadow-glow backdrop-blur-xl hover:scale-[1.05] transition-transform ${className}`}
    >
      <div className="text-sm font-medium text-brand-200">{subtitle}</div>
      <div className="mt-2 text-lg font-semibold text-white">{title}</div>
    </motion.div>
  );
}

function LandingPage({ onGetStarted, onLogin }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-60 mix-blend-screen" />
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(217,70,239,0.1) 0%, rgba(14,165,233,0.1) 40%, rgba(236,72,153,0.1) 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Ambient Particle/Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute rounded-full bg-white/20 blur-[2px] ${
              Math.random() > 0.5 ? 'bg-purple-500/30' : 'bg-pink-500/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
            }}
          />
        ))}
      </div>

      <div className="section-shell relative flex min-h-screen flex-col justify-between py-10 z-10 pt-28">
        <div className="grid items-center gap-16 py-16 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
            className="max-w-3xl"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-900/40 px-4 py-2 text-sm text-purple-100 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              <ShieldCheck className="h-4 w-4 text-purple-300" />
              Real-time surplus food coordination platform
            </motion.div>
            
            <h1 className="mt-8 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 via-pink-300 to-orange-300 bg-clip-text text-transparent pb-2 drop-shadow-[0_0_20px_rgba(217,70,239,0.4)] animate-pulse-glow">
              Redistribute Food. Reduce Waste. Feed Communities.
            </h1>
            
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300/90 font-light">
              A real-time platform connecting surplus food with people in need. Built for volunteers,
              NGOs, donor kitchens, and community teams to move food before it expires.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 px-8 py-4 text-base font-bold text-white shadow-glow transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onLogin}
                className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              >
                Login
              </motion.button>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                { icon: HeartHandshake, label: "Meals matched", value: "18,200+", color: "text-purple-300" },
                { icon: Compass, label: "Live pickups", value: "126 active", color: "text-pink-300" },
                { icon: MapPinned, label: "Coverage", value: "12 city zones", color: "text-orange-300" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    key={item.label} 
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all cursor-default"
                  >
                    <div className={`p-3 rounded-2xl bg-white/10 w-max ${item.color} mb-4`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">{item.value}</div>
                    <div className="mt-2 text-sm font-medium text-slate-400">{item.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <div className="relative min-h-[38rem] lg:min-h-full perspective-1000">
            <motion.div
              animate={{ rotateY: [0, 5, -5, 0], rotateX: [0, 2, -2, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 w-full h-full transform-style-3d"
            >
              <FloatingCard
                className="absolute left-[5%] top-[10%] w-64 z-20"
                title="Restaurant added 50 meals"
                subtitle="Live Activity"
                duration={7}
                delay={0}
              />
              <FloatingCard
                className="absolute right-[5%] top-[30%] w-72 z-10"
                title="Volunteer en route for pickup"
                subtitle="Operations"
                duration={5}
                delay={1}
              />
              <FloatingCard
                className="absolute left-[15%] bottom-[25%] w-64 z-30"
                title="Shelter received same-day delivery"
                subtitle="Impact"
                duration={8}
                delay={2}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                className="absolute bottom-5 right-5 w-[85%] rounded-[2rem] border border-white/20 bg-slate-900/60 p-6 shadow-glow-lg backdrop-blur-3xl animate-float-delayed"
              >
                <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/30 rounded-full blur-3xl" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="text-sm font-medium text-purple-200">Today&apos;s live overview</div>
                      <div className="mt-2 text-3xl font-bold text-white">6 rescue routes active</div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 15 }}
                      className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-4 shadow-lg shadow-pink-500/40"
                    >
                      <MapPinned className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>

                  <div className="mt-8 grid gap-4 relative z-10">
                    {[
                      "Donors publish live surplus inventory",
                      "Nearby volunteers request pickup in seconds",
                      "Communities receive food before expiry",
                    ].map((item, i) => (
                      <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        key={item} 
                        className="rounded-2xl border border-white/5 bg-white/10 px-5 py-4 text-sm font-medium text-white/90 backdrop-blur-sm flex items-center gap-3"
                      >
                        <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
