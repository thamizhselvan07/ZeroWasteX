import { AnimatePresence } from "framer-motion";
import { MapPinned, PackageSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import EmptyState from "../components/EmptyState";
import FoodCard from "../components/FoodCard";
import MapView from "../components/MapView";
import PageShell from "../components/PageShell";
import { useAppContext } from "../context/AppContext";
import { buildMapsUrl, calculateDistanceInKm, isUrgentFood } from "../utils/food";

const filters = [
  { key: "all", label: "All available" },
  { key: "nearby", label: "Nearby" },
  { key: "urgent", label: "Urgent" },
];

export default function PickupPage({ navigate }) {
  const {
    foods,
    loadingState,
    requestFood,
    refreshFoods,
    refreshMyRequests,
    selectedFoodId,
    setSelectedFoodId,
    userLocation,
  } = useAppContext();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    Promise.all([refreshFoods(), refreshMyRequests()]).catch(() => {});
  }, [refreshFoods, refreshMyRequests]);

  const availableFoods = useMemo(() => {
    const base = foods.filter((food) => food.status === "available");

    return base.filter((food) => {
      if (activeFilter === "nearby") {
        const distance = calculateDistanceInKm(userLocation, food.location);
        return distance !== null && distance <= 10;
      }

      if (activeFilter === "urgent") {
        return isUrgentFood(food);
      }

      return true;
    });
  }, [activeFilter, foods, userLocation]);

  return (
    <PageShell
      eyebrow="Pickup"
      title="Food ready for pickup"
      description="This queue only shows listings that are still available. Requesting an item immediately moves it into your active requests workflow."
    >
      <section className="mb-8 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter.key
                ? "bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 text-white shadow-lg shadow-teal-500/20"
                : "border border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          {availableFoods.length === 0 ? (
            <EmptyState
              icon={PackageSearch}
              title="No food available"
              description="Nothing matches the current pickup filter. Try switching filters or wait for the next live donation."
              action={
                <button
                  type="button"
                  onClick={() => navigate("/discover")}
                  className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20"
                >
                  Back to discover
                </button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <AnimatePresence>
                {availableFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    item={food}
                    onSelect={setSelectedFoodId}
                    selected={selectedFoodId === food.id}
                    userLocation={userLocation}
                    primaryAction={{
                      label: "Request Pickup",
                      loading: loadingState.requestFood === food.id,
                      onClick: async (item) => {
                        try {
                          await requestFood(item.id);
                        } catch {
                          // Toasts are handled in context.
                        }
                      },
                    }}
                    secondaryAction={{
                      label: "Open in Maps",
                      onClick: (item) => window.open(buildMapsUrl(item), "_blank", "noopener,noreferrer"),
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <MapView
            foods={foods}
            onSelectFood={setSelectedFoodId}
            onRequestFood={requestFood}
            requestLoadingId={loadingState.requestFood}
            selectedFoodId={selectedFoodId}
            userLocation={userLocation}
          />
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                <MapPinned className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Pickup workflow</h2>
                <p className="text-sm text-slate-500">Available -&gt; Requested -&gt; Picked</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Requesting a card immediately changes its backend status to
              <span className="font-semibold text-slate-900"> requested</span>, removes the item from this page,
              and places it under <span className="font-semibold text-slate-900">My Requests</span>.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
