import { motion } from "framer-motion";
import { Activity, Boxes, HandHeart, PackageCheck, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

import api, { getApiErrorMessage } from "../api";
import Loader from "./Loader";
import MapView from "./MapView";

const statConfig = [
  { key: "meals", label: "Total meals shared", icon: HandHeart },
  { key: "active", label: "Active listings", icon: Boxes },
  { key: "completed", label: "Requests completed", icon: PackageCheck },
];

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
}

function Dashboard({ currentUser, onNavigate }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get("/foods");
        setFoods(response.data.foods || []);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, "Unable to load dashboard data."));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    const intervalId = window.setInterval(loadDashboard, 10000);
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

  const stats = {
    meals: foods.length * 22,
    active: foods.filter((item) => item.status === "available").length,
    completed: foods.filter((item) => item.status === "picked").length,
  };

  const recentActivity = foods.slice(0, 5).map((item, index) => ({
    id: `${item.id}-${index}`,
    title:
      item.status === "picked"
        ? `${item.name} completed pickup`
        : item.status === "requested"
          ? `${item.name} requested by volunteer`
          : `${item.name} added to the network`,
    subtitle: item.donor?.name || currentUser?.name || "FoodBridge user",
  }));

  return (
    <div className="section-shell py-10 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-900 px-8 py-10 text-white shadow-2xl shadow-emerald-950/20">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-emerald-100">
              <TrendingUp className="h-4 w-4" />
              Live operations dashboard
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight">
              Welcome back, {currentUser?.name || "Volunteer"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50/80">
              Track impact, see live rescue activity, and coordinate the next pickup from one place.
            </p>
          </div>

          {loading ? <Loader cards={3} /> : (
            <div className="grid gap-5 md:grid-cols-3">
              {statConfig.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.article
                    key={stat.key}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-500">{stat.label}</span>
                      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
                      <AnimatedNumber value={stats[stat.key]} />
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}

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
        </section>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950">Live Activity</h2>
                <p className="mt-1 text-sm text-slate-500">Updated every few seconds for demo impact</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                Live
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {(recentActivity.length ? recentActivity : [{
                id: "empty",
                title: "No activity yet",
                subtitle: "Start by adding food or requesting a pickup",
              }]).map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="mt-1 rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20">
            <div className="text-sm font-medium text-emerald-50/90">Next best action</div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Publish a new donation</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-50/85">
              Fast listing flow with auto-location, live map placement, and protected donation records.
            </p>
            <button
              type="button"
              onClick={() => onNavigate("add-food")}
              className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-lg shadow-emerald-950/15 transition hover:scale-[1.02]"
            >
              Share Food
            </button>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
