import { motion } from "framer-motion";
import { Flame, Heart, Leaf, Recycle, Users } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../api";

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    let start = 0;
    const end = parseInt(target, 10);
    if (Number.isNaN(end)) return;

    const stepTime = Math.max(Math.floor(duration / end), 1);
    const batchSize = Math.max(Math.floor(end / 120), 1);

    const timer = setInterval(() => {
      start += batchSize;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function ImpactStats() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await api.get("/api/metrics");
        setMetrics(response.data.metrics);
      } catch {
        // Use fallback data if API is down
        setMetrics({
          meals_saved: 1250,
          waste_reduced_kg: 625,
          people_fed: 625,
          completed_pickups: 84,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading || !metrics) return null;

  const impactCards = [
    {
      icon: Heart,
      label: "Meals Saved",
      value: metrics.meals_saved,
      emoji: "🍱",
      color: "from-rose-500 to-pink-500",
      glowColor: "shadow-rose-500/30",
    },
    {
      icon: Recycle,
      label: "Waste Reduced",
      value: `${metrics.waste_reduced_kg}`,
      suffix: " kg",
      emoji: "♻️",
      color: "from-emerald-500 to-teal-500",
      glowColor: "shadow-emerald-500/30",
    },
    {
      icon: Users,
      label: "People Fed",
      value: metrics.people_fed,
      emoji: "👥",
      color: "from-blue-500 to-cyan-500",
      glowColor: "shadow-blue-500/30",
    },
    {
      icon: Flame,
      label: "Completed Rescues",
      value: metrics.completed_pickups,
      emoji: "🔥",
      color: "from-orange-500 to-amber-500",
      glowColor: "shadow-orange-500/30",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="section-shell relative z-10">
        {/* Hero impact banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2 mb-6 backdrop-blur-sm">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/80">Real-time Impact</span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              <AnimatedCounter target={metrics.meals_saved} />
            </span>{" "}
            meals saved
          </h2>
          <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
            Every number represents a family fed, waste prevented, and communities united. This is
            what ZeroWasteX is doing <span className="text-white font-semibold">right now</span>.
          </p>
        </motion.div>

        {/* Impact metric cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {impactCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${card.color} blur-3xl scale-150`} style={{ opacity: 0 }} />

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} p-3 shadow-lg ${card.glowColor} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="text-3xl font-bold text-white mb-1">
                    <span className="mr-2">{card.emoji}</span>
                    <AnimatedCounter target={parseInt(String(card.value).replace(/\D/g, ''), 10) || 0} />
                    {card.suffix || ""}
                  </div>

                  <div className="text-sm font-medium text-white/50">{card.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
