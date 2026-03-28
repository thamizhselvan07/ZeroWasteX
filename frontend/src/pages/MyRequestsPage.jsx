import { AnimatePresence } from "framer-motion";
import { ClipboardList, PackageCheck } from "lucide-react";
import { useEffect } from "react";

import EmptyState from "../components/EmptyState";
import FoodCard from "../components/FoodCard";
import MapView from "../components/MapView";
import PageShell from "../components/PageShell";
import { useAppContext } from "../context/AppContext";
import { buildMapsUrl, isCompletedStatus } from "../utils/food";

export default function MyRequestsPage({ navigate }) {
  const {
    myRequests,
    markPicked,
    loadingState,
    refreshMyRequests,
    selectedFoodId,
    setSelectedFoodId,
    userLocation,
  } = useAppContext();

  const activeRequests = myRequests.filter((food) => food.status === "requested");
  const completedPickups = myRequests.filter((food) => isCompletedStatus(food.status));

  useEffect(() => {
    refreshMyRequests().catch(() => {});
  }, [refreshMyRequests]);

  return (
    <PageShell
      eyebrow="My Requests"
      title="Manage your requested pickups"
      description="This page only shows the listings you have claimed. Marking one as picked completes the lifecycle and updates dashboard and profile statistics."
    >
      <section className="mb-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="text-sm font-medium text-slate-500">Active requests</div>
          <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{activeRequests.length}</div>
        </article>
        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="text-sm font-medium text-slate-500">Completed pickups</div>
          <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{completedPickups.length}</div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          {activeRequests.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No active requests"
              description="Request a listing from the pickup board to start managing your next rescue run."
              action={
                <button
                  type="button"
                  onClick={() => navigate("/pickup")}
                  className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20"
                >
                  Find food to pick up
                </button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <AnimatePresence>
                {activeRequests.map((food) => (
                  <FoodCard
                    key={food.id}
                    item={food}
                    onSelect={setSelectedFoodId}
                    selected={selectedFoodId === food.id}
                    userLocation={userLocation}
                    primaryAction={{
                      label: "Mark as Picked",
                      loading: loadingState.markPicked === food.id,
                      onClick: async (item) => {
                        try {
                          await markPicked(item.id);
                        } catch {
                          // Toast handled in context.
                        }
                      },
                    }}
                    secondaryAction={{
                      label: "Open in Maps",
                      onClick: (item) => window.open(buildMapsUrl(item), "_blank", "noopener,noreferrer"),
                    }}
                    extraContent={
                      <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                        Status: requested
                      </div>
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <MapView
            foods={activeRequests}
            onSelectFood={setSelectedFoodId}
            selectedFoodId={selectedFoodId}
            userLocation={userLocation}
          />
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <PackageCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Completion rule</h2>
                <p className="text-sm text-slate-500">Only the volunteer who requested the food can close it.</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              When you click <span className="font-semibold text-slate-900">Mark as Picked</span>, the backend
              stores the pickup user and timestamp, removes the item from active lists, and rolls the update into
              your profile history.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
