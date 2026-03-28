import { motion } from "framer-motion";
import { ArrowRight, Clock3, HeartHandshake, PackageCheck, PackageOpen } from "lucide-react";

import EmptyState from "../components/EmptyState";
import FoodCard from "../components/FoodCard";
import MapView from "../components/MapView";
import PageShell from "../components/PageShell";
import { useAppContext } from "../context/AppContext";
import { buildMapsUrl } from "../utils/food";

export default function DiscoverPage({ navigate }) {
  const { activityFeed, foods, requestFood, loadingState, selectedFoodId, setSelectedFoodId, stats, userLocation } =
    useAppContext();

  const availableFoods = foods.filter((food) => food.status === "available").slice(0, 3);
  const mapFoods = foods;

  return (
    <PageShell
      eyebrow="Discover"
      title="See the live ZeroWasteX rescue network in one place"
      description="Track what is available right now, where the next pickup is happening, and how the lifecycle moves from draft to available to requested to picked."
      action={
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/pickup")}
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-lg transition hover:scale-[1.02]"
          >
            Start pickup
          </button>
          <button
            type="button"
            onClick={() => navigate("/add-food")}
            className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Donate food
          </button>
        </div>
      }
    >
      <section className="grid gap-5 md:grid-cols-4">
        {[
          { label: "Drafts", value: stats.draftCount, icon: HeartHandshake },
          { label: "Available", value: stats.availableCount, icon: PackageOpen },
          { label: "Requested", value: stats.requestedCount, icon: Clock3 },
          { label: "Completed", value: stats.completedCount, icon: PackageCheck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-500">{item.label}</div>
                <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{item.value}</div>
            </article>
          );
        })}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MapView
          foods={mapFoods}
          onSelectFood={setSelectedFoodId}
          onRequestFood={requestFood}
          requestLoadingId={loadingState.requestFood}
          selectedFoodId={selectedFoodId}
          userLocation={userLocation}
        />

        <aside className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Activity feed</h2>
              <p className="mt-1 text-sm text-slate-500">Real-time donor and volunteer actions</p>
            </div>
            <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">Live</div>
          </div>

          <div className="mt-6 space-y-4">
            {activityFeed.length === 0 ? (
              <EmptyState
                icon={HeartHandshake}
                title="No network activity yet"
                description="Create the first donation to bring the live rescue map online."
              />
            ) : (
              activityFeed.slice(0, 6).map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl bg-slate-50 px-4 py-4"
                >
                  <div className="font-medium text-slate-900">{activity.message}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {activity.actor?.name || "ZeroWasteX"} | {activity.target?.food_name || "Network event"}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </aside>
      </section>

      <section className="mt-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Available now</h2>
            <p className="mt-2 text-sm text-slate-500">This view previews the live pickup inventory.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/pickup")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
          >
            Open pickup board
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {availableFoods.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No food available"
            description="The pickup board will update as soon as a donor publishes a new listing."
            action={
              <button
                type="button"
                onClick={() => navigate("/add-food")}
                className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20"
              >
                Publish a donation
              </button>
            }
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
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
                      // Toast handled in context.
                    }
                  },
                }}
                secondaryAction={{
                  label: "Open in Maps",
                  onClick: (item) => window.open(buildMapsUrl(item), "_blank", "noopener,noreferrer"),
                }}
              />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
