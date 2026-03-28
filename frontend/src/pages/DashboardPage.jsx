import { Activity, Boxes, ChartNoAxesColumn, PackageCheck, Users } from "lucide-react";

import Leaderboard from "../components/Leaderboard";
import MapView from "../components/MapView";
import PageShell from "../components/PageShell";
import { useAppContext } from "../context/AppContext";

function CounterCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{value}</div>
    </article>
  );
}

export default function DashboardPage({ navigate }) {
  const {
    activityFeed,
    foods,
    selectedFoodId,
    setSelectedFoodId,
    stats,
    userLocation,
  } = useAppContext();

  const total = Math.max(foods.length, 1);
  const statusSegments = [
    { label: "Draft", value: stats.draftCount, color: "bg-violet-500" },
    { label: "Available", value: stats.availableCount, color: "bg-emerald-500" },
    { label: "Requested", value: stats.requestedCount, color: "bg-amber-500" },
    { label: "Completed", value: stats.completedCount, color: "bg-slate-500" },
  ];

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Operational dashboard for the full rescue workflow"
      description="Monitor network health, request progress, activity logs, and status distribution while keeping the live map and current pickup load in view."
      action={
        <button
          type="button"
          onClick={() => navigate("/pickup")}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-lg transition hover:scale-[1.02]"
        >
          Open pickup queue
        </button>
      }
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <CounterCard icon={Boxes} label="Available inventory" value={stats.availableCount} />
        <CounterCard icon={Users} label="Requested items" value={stats.requestedCount} />
        <CounterCard icon={PackageCheck} label="Completed pickups" value={stats.completedCount} />
        <CounterCard icon={Activity} label="My active requests" value={stats.myActiveRequests} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <MapView
          foods={foods}
          onSelectFood={setSelectedFoodId}
          selectedFoodId={selectedFoodId}
          userLocation={userLocation}
        />

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                <ChartNoAxesColumn className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">Status distribution</h2>
                <p className="text-sm text-slate-500">Live workflow mix across the platform</p>
              </div>
            </div>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
              <div className="flex h-full w-full">
                {statusSegments.map((segment) => (
                  <div
                    key={segment.label}
                    className={segment.color}
                    style={{ width: `${(segment.value / total) * 100}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {statusSegments.map((segment) => (
                <div key={segment.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className={`h-3 w-3 rounded-full ${segment.color}`} />
                    {segment.label}
                  </div>
                  <span className="font-semibold text-slate-900">{segment.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recent activity</h2>
            <p className="mt-1 text-sm text-slate-500">Latest changes across the system</p>

            <div className="mt-6 space-y-4">
              {activityFeed.slice(0, 6).map((activity) => (
                <div key={activity.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="font-medium text-slate-900">{activity.message}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {activity.actor?.name || "ZeroWasteX"} | {activity.target?.food_name || "Network event"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Gamification Leaderboard */}
      <section className="mt-8">
        <Leaderboard />
      </section>
    </PageShell>
  );
}
