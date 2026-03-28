import { motion } from "framer-motion";
import { Crown, Flame, Medal, Star, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import api from "../api";
import PageShell from "../components/PageShell";

const rankMedals = ["🥇", "🥈", "🥉"];
const rankGradients = [
  "from-fuchsia-400 to-purple-600",
  "from-slate-300 to-slate-500",
  "from-rose-400 to-orange-500",
];

export default function LeaderboardPage() {
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
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageShell
      eyebrow="Gamification"
      title="🏆 Volunteer Leaderboard"
      description="Every pickup earns points. Urgent rescues earn bonus rewards. Climb the ranks and become a ZeroWasteX hero!"
    >
      {/* Points legend banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 shadow-lg shadow-emerald-500/20">
            <Medal className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">+10</div>
            <div className="text-sm text-slate-500">Points per pickup</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 p-3 shadow-lg shadow-rose-500/20">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">+50</div>
            <div className="text-sm text-slate-500">Urgent rescue bonus</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <div className="rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 p-3 shadow-lg shadow-fuchsia-500/20">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalVolunteers}</div>
            <div className="text-sm text-slate-500">Active volunteers</div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-100 border-t-fuchsia-500" />
            <p className="mt-4 text-sm text-slate-500">Loading rankings...</p>
          </div>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="py-20 text-center">
          <Crown className="mx-auto h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No completed pickups yet</h3>
          <p className="mt-2 text-slate-400">Complete food pickups to earn points and appear on the leaderboard!</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {leaderboard.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-10 grid grid-cols-3 items-end gap-4"
            >
              {[1, 0, 2].map((podiumIdx) => {
                const vol = leaderboard[podiumIdx];
                if (!vol) return null;
                const isFirst = podiumIdx === 0;
                return (
                  <motion.div
                    key={vol.user_id}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + podiumIdx * 0.15 }}
                    className={`relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white shadow-sm ${
                      isFirst ? "pb-10 pt-8" : "pb-8 pt-6"
                    }`}
                  >
                    {isFirst && (
                      <div className="absolute -top-4 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
                        CHAMPION
                      </div>
                    )}
                    <div className="text-4xl mb-3">{rankMedals[podiumIdx]}</div>
                    <div
                      className={`flex items-center justify-center rounded-full font-bold text-white ${
                        isFirst ? "h-16 w-16 text-xl" : "h-12 w-12 text-lg"
                      } bg-gradient-to-br ${rankGradients[podiumIdx]}`}
                    >
                      {vol.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className={`mt-4 font-bold text-slate-900 text-center truncate w-full px-2 ${isFirst ? "text-lg" : "text-sm"}`}>
                      {vol.name}
                    </div>
                    <div className="mt-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      {vol.role}
                    </div>
                    <div className={`mt-4 font-extrabold text-fuchsia-600 ${isFirst ? "text-3xl" : "text-2xl"}`}>
                      {vol.points}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">points</div>
                    <div className="mt-4 flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span>{vol.pickups} pickups</span>
                      {vol.urgent_rescues > 0 && (
                        <span className="flex items-center gap-1 text-rose-500">
                          <Flame className="h-3.5 w-3.5" />
                          {vol.urgent_rescues} urgent
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Full rankings table */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-5">
              <Trophy className="h-5 w-5 text-fuchsia-500" />
              <h2 className="text-lg font-bold text-slate-800">Full Rankings</h2>
              <div className="ml-auto flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Zap className="h-4 w-4 text-amber-500" />
                Live Hub
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {leaderboard.map((volunteer, idx) => (
                <motion.div
                  key={volunteer.user_id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50 ${
                    idx < 3 ? "bg-slate-50/50" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-12 flex-shrink-0 text-center">
                    {idx < 3 ? (
                      <span className="text-2xl">{rankMedals[idx]}</span>
                    ) : (
                      <span className="text-lg font-bold text-slate-400">#{volunteer.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full font-bold ${
                      idx < 3
                        ? `bg-gradient-to-br ${rankGradients[idx]} text-white shadow-sm`
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {volunteer.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-800 truncate">{volunteer.name}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {volunteer.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <Medal className="h-3.5 w-3.5 text-emerald-500" />
                        {volunteer.pickups} pickups
                      </span>
                      {volunteer.urgent_rescues > 0 && (
                        <span className="flex items-center gap-1 text-rose-500">
                          <Flame className="h-3.5 w-3.5" />
                          {volunteer.urgent_rescues} urgent
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xl font-bold text-fuchsia-600">{volunteer.points}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">pts</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}
