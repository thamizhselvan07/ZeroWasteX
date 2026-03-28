import { motion } from "framer-motion";
import { Crown, Flame, Medal, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../api";

const rankMedals = ["🥇", "🥈", "🥉"];
const rankColors = [
  "from-amber-400 to-yellow-500",
  "from-slate-300 to-slate-400",
  "from-amber-600 to-orange-700",
];

export default function Leaderboard({ compact = false }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalVolunteers, setTotalVolunteers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get("/api/leaderboard");
        setLeaderboard(response.data.leaderboard || []);
        setTotalVolunteers(response.data.total_volunteers || 0);
      } catch {
        // Silently handle – leaderboard is supplementary
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-3">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Volunteer Leaderboard</h2>
            <p className="text-sm text-white/60">Loading rankings...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
        </div>
      </div>
    );
  }

  const displayList = compact ? leaderboard.slice(0, 5) : leaderboard;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 p-3 shadow-lg shadow-amber-500/30">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Volunteer Leaderboard</h2>
            <p className="text-sm text-white/60">{totalVolunteers} volunteers competing</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-white/50">
          <Zap className="h-4 w-4 text-amber-400" />
          Live
        </div>
      </div>

      {/* Points legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Medal className="h-3 w-3 text-emerald-400" />
          +10 per pickup
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Flame className="h-3 w-3 text-rose-400" />
          +50 urgent rescue
        </div>
      </div>

      {displayList.length === 0 ? (
        <div className="py-8 text-center text-white/40">
          <Crown className="mx-auto h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">No completed pickups yet. Be the first hero!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayList.map((volunteer, idx) => (
            <motion.div
              key={volunteer.user_id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-4 rounded-2xl p-3 transition-all hover:bg-white/10 ${
                idx < 3 ? "bg-white/5" : ""
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 text-center">
                {idx < 3 ? (
                  <span className="text-2xl">{rankMedals[idx]}</span>
                ) : (
                  <span className="text-sm font-bold text-white/40">#{volunteer.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-bold text-white text-sm ${
                  idx < 3
                    ? `bg-gradient-to-br ${rankColors[idx]}`
                    : "bg-white/10"
                }`}
              >
                {volunteer.name?.charAt(0)?.toUpperCase() || "?"}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white truncate">{volunteer.name}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60 uppercase tracking-wider">
                    {volunteer.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 mt-0.5">
                  <span>{volunteer.pickups} pickups</span>
                  {volunteer.urgent_rescues > 0 && (
                    <span className="flex items-center gap-1 text-rose-400">
                      <Flame className="h-3 w-3" />
                      {volunteer.urgent_rescues} urgent
                    </span>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-amber-400">{volunteer.points}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
