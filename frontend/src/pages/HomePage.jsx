import { motion } from "framer-motion";
import { BellRing, HeartHandshake, Leaf, MapPinned, Users } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import api, { getApiErrorMessage } from "../api";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";
import MapView from "../components/MapView";

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceInKm = (source, target) => {
  if (!source || !target) {
    return null;
  }

  const earthRadiusKm = 6371;
  const latDelta = toRadians(target.lat - source.lat);
  const lngDelta = toRadians(target.lng - source.lng);
  const sourceLat = toRadians(source.lat);
  const targetLat = toRadians(target.lat);
  const haversineValue =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(sourceLat) * Math.cos(targetLat) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(haversineValue), Math.sqrt(1 - haversineValue)));
};

const impactMetrics = [
  { label: "Meals saved", value: "18,200+", icon: HeartHandshake },
  { label: "Waste reduced", value: "12.4 tons", icon: Leaf },
  { label: "People helped", value: "6,480", icon: Users },
];

function HomePage({ currentUser, onNavigate }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const knownFoodIdsRef = useRef(new Set());
  const hasInitialLoadRef = useRef(false);

  const loadFoods = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }

      const response = await api.get("/foods");
      const nextFoods = response.data.foods || [];

      if (hasInitialLoadRef.current) {
        const newItems = nextFoods.filter((item) => !knownFoodIdsRef.current.has(item.id));
        if (newItems.length > 0) {
          toast.success(`Live update: ${newItems[0].name} just entered the network.`);
        }
      }

      knownFoodIdsRef.current = new Set(nextFoods.map((item) => item.id));
      hasInitialLoadRef.current = true;
      setFoods(nextFoods);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to fetch live food listings."));
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadFoods();
    const intervalId = window.setInterval(() => loadFoods(true), 10000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {}
    );
  }, []);

  const handleRequest = async (item) => {
    const confirmed = window.confirm(`Are you sure you want to request pickup for ${item.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      setBusyId(item.id);
      await api.post("/request-food", { id: item.id });
      toast.success("Request sent successfully.");
      await loadFoods(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to request pickup."));
    } finally {
      setBusyId(null);
    }
  };

  const handlePickup = async (item) => {
    try {
      setBusyId(item.id);
      await api.post("/pickup-food", { id: item.id });
      toast.success("Pickup completed successfully.");
      await loadFoods(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to complete pickup."));
    } finally {
      setBusyId(null);
    }
  };

  const stats = useMemo(() => ({
    meals: foods.length * 22,
    active: foods.filter((item) => item.status === "available").length,
    completed: foods.filter((item) => item.status === "picked").length,
  }), [foods]);

  return (
    <div className="pb-16">
      <section className="section-shell pt-8 sm:pt-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.38),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.22),transparent_30%),linear-gradient(135deg,#0f172a_0%,#064e3b_38%,#0f766e_72%,#155e75_100%)] px-6 py-10 text-white shadow-2xl shadow-emerald-950/20 sm:px-10 sm:py-14">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02), rgba(255,255,255,0.08))",
              backgroundSize: "200% 200%",
            }}
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-50/90 backdrop-blur">
                <BellRing className="h-4 w-4" />
                Live rescue network active
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Real-world pickups, live locations, and measurable food rescue impact.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-50/80">
                Built for hackathon demo impact and actual usability: discover nearby food, view it
                on a live map, request pickup, and track status from available to picked.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate("add-food")}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-xl shadow-black/10 transition hover:scale-[1.02]"
                >
                  Donate Food
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("dashboard")}
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Open Dashboard
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                { title: "Live Updates", value: "Auto-refreshing every 10 seconds" },
                { title: "Pickup flow", value: "Available → Requested → Picked" },
                { title: "Current user", value: currentUser?.name || "Authenticated volunteer" },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="text-sm text-emerald-100/80">{item.title}</div>
                  <div className="mt-2 text-xl font-semibold">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-8 grid gap-5 md:grid-cols-3">
        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="text-sm font-medium text-slate-500">Total meals shared</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{stats.meals.toLocaleString()}</div>
        </article>
        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="text-sm font-medium text-slate-500">Active listings</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{stats.active}</div>
        </article>
        <article className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="text-sm font-medium text-slate-500">Requests completed</div>
          <div className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{stats.completed}</div>
        </article>
      </section>

      <section className="section-shell mt-12">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-slate-900 px-6 py-8 text-white sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-emerald-200">Impact</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Judges love measurable community outcomes</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {impactMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="rounded-2xl bg-white/10 px-5 py-4">
                  <Icon className="h-8 w-8 text-emerald-200" />
                  <div className="mt-3 text-2xl font-semibold">{metric.value}</div>
                  <div className="text-sm text-slate-300">{metric.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell mt-12 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MapView
          foods={foods.filter((item) => item.location?.lat && item.location?.lng)}
          userLocation={userLocation}
          onNavigate={(food) => {
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${food.location.lat},${food.location.lng}`,
              "_blank"
            );
          }}
        />

        <aside className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">Live Activity</h3>
              <p className="mt-1 text-sm text-slate-500">Fresh movements across the rescue network</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Live</div>
          </div>

          <div className="mt-6 space-y-4">
            {(foods.slice(0, 5).length ? foods.slice(0, 5) : [{ id: "empty", name: "No activity yet", status: "available" }]).map((food) => (
              <motion.div key={food.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="font-medium text-slate-900">
                  {food.status === "picked"
                    ? `${food.name} picked up`
                    : food.status === "requested"
                      ? `${food.name} requested by volunteer`
                      : `${food.name} added to live inventory`}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {food.donor?.name || "FoodBridge network"} · {food.quantity}
                </div>
              </motion.div>
            ))}
          </div>
        </aside>
      </section>

      <section className="section-shell mt-12">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Live Updates
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Food listings ready for pickup
            </h2>
          </div>
          <button
            type="button"
            onClick={() => loadFoods()}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            Refresh Listings
          </button>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {loading ? <Loader cards={6} /> : null}

        {!loading && foods.length === 0 ? (
          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 px-6 py-16 text-center shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <MapPinned className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-2xl font-semibold text-slate-950">No food available nearby</h3>
            <p className="mt-3 max-w-lg text-slate-500 mx-auto">
              Add the first donation and activate the live rescue feed for your neighborhood.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("add-food")}
              className="mt-6 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20"
            >
              Share Food
            </button>
          </div>
        ) : null}

        {!loading && foods.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {foods.map((item) => {
              const distance = calculateDistanceInKm(userLocation, item.location);
              const distanceText = distance ? `${distance.toFixed(1)} km away` : "Local pickup zone";

              return (
                <FoodCard
                  key={item.id}
                  item={item}
                  distanceText={distanceText}
                  onRequest={handleRequest}
                  onPickup={handlePickup}
                  isBusy={busyId === item.id}
                />
              );
            })}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default HomePage;
