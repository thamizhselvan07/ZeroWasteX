import { motion } from "framer-motion";
import { Camera, CheckCircle2, MapPinned, TimerReset } from "lucide-react";
import { useState } from "react";

import PageShell from "../components/PageShell";
import { useAppContext } from "../context/AppContext";

const steps = [
  { id: 1, title: "Add Food" },
  { id: 2, title: "Confirm Location" },
  { id: 3, title: "Publish" },
];

const initialForm = {
  name: "",
  quantity: "",
  type: "veg",
  expiry_time: "",
  image_url: "",
  address: "",
  lat: "",
  lng: "",
  pickup_notes: "",
};

function AddFoodPage({ navigate }) {
  const { addFood, loadingState } = useAppContext();
  const [formData, setFormData] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [locating, setLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleUseCurrentLocation = () => {
    setErrorMessage("");

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported in this browser.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((current) => ({
          ...current,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      (error) => {
        setErrorMessage(error.message || "Unable to fetch current location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePublish = async () => {
    setErrorMessage("");

    try {
      await addFood({
        name: formData.name,
        quantity: formData.quantity,
        type: formData.type,
        status: "available",
        expiry_time: formData.expiry_time,
        pickup_notes: formData.pickup_notes,
        image_url: formData.image_url,
        location: {
          address: formData.address,
          lat: Number(formData.lat),
          lng: Number(formData.lng),
        },
      });

      setFormData(initialForm);
      setStep(1);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const canContinueStepOne =
    formData.name && formData.quantity && formData.type && formData.expiry_time;
  const canContinueStepTwo = formData.address && formData.lat && formData.lng;

  return (
    <PageShell
      eyebrow="Donation Workflow"
      title="Draft -> available in one clear publishing flow"
      description="Step through food details, confirm the pickup location, and publish the listing so it appears immediately on the pickup board, map, and dashboard."
    >
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
              <MapPinned className="h-4 w-4" />
              Donation lifecycle
            </div>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
              Draft, validate, publish
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              The donor flow is explicit: <span className="font-semibold text-slate-900">draft</span> while editing,
              then <span className="font-semibold text-slate-900">available</span> once published for pickup teams.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Listing time", value: "< 60 sec", icon: TimerReset },
              { label: "Location aware", value: "GPS ready", icon: MapPinned },
              { label: "Media support", value: "Photo URL", icon: Camera },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-xl shadow-slate-200/60 backdrop-blur">
                  <Icon className="h-5 w-5 text-teal-600" />
                  <div className="mt-4 text-sm font-medium text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur sm:p-8">
          <div className="mb-6 flex flex-wrap gap-3">
            {steps.map((item) => (
              <div
                key={item.id}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  step === item.id
                    ? "bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {item.id}. {item.title}
              </div>
            ))}
          </div>

          {errorMessage ? (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Food name</span>
                <input name="name" value={formData.name} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="Fresh rice meal boxes" required />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Quantity</span>
                  <input name="quantity" value={formData.quantity} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="25 meal packs" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Food type</span>
                  <select name="type" value={formData.type} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100">
                    <option value="veg">Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Expiry time</span>
                <input name="expiry_time" type="datetime-local" value={formData.expiry_time} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" required />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Image URL</span>
                <input name="image_url" type="url" value={formData.image_url} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="Optional visual for pickup teams" />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Pickup notes</span>
                <textarea name="pickup_notes" value={formData.pickup_notes} onChange={handleChange} rows="3" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="Pickup from side entrance before 6 PM" />
              </label>

              <button
                type="button"
                disabled={!canContinueStepOne}
                onClick={() => setStep(2)}
                className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 disabled:opacity-60"
              >
                Continue to location
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Location label</span>
                <input name="address" value={formData.address} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" placeholder="Anna Nagar Community Kitchen" required />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Latitude</span>
                  <input name="lat" type="number" step="any" value={formData.lat} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Longitude</span>
                  <input name="lng" type="number" step="any" value={formData.lng} onChange={handleChange} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-100" required />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(1)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Back
                </button>
                <button type="button" onClick={handleUseCurrentLocation} disabled={locating} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700 disabled:opacity-60">
                  {locating ? "Detecting location..." : "Use current location"}
                </button>
                <button
                  type="button"
                  disabled={!canContinueStepTwo}
                  onClick={() => setStep(3)}
                  className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 disabled:opacity-60"
                >
                  Review publish
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Ready to publish as AVAILABLE
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div><span className="font-semibold text-slate-900">Food:</span> {formData.name}</div>
                  <div><span className="font-semibold text-slate-900">Quantity:</span> {formData.quantity}</div>
                  <div><span className="font-semibold text-slate-900">Type:</span> {formData.type}</div>
                  <div><span className="font-semibold text-slate-900">Location:</span> {formData.address}</div>
                  <div><span className="font-semibold text-slate-900">Coordinates:</span> {formData.lat}, {formData.lng}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(2)} className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                  Back
                </button>
                <button
                  type="button"
                  disabled={loadingState.addFood}
                  onClick={handlePublish}
                  className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:scale-[1.01] disabled:opacity-70"
                >
                  {loadingState.addFood ? "Publishing..." : "Publish to pickup board"}
                </button>
              </div>
            </div>
          ) : null}
        </motion.section>
      </div>
    </PageShell>
  );
}

export default AddFoodPage;
