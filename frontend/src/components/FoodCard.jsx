import { motion } from "framer-motion";
import { Clock3, ExternalLink, MapPin, Package2 } from "lucide-react";

import {
  getCountdownState,
  getDistanceLabel,
  getFoodLocationLabel,
  getStatusMeta,
  getTypeMeta,
} from "../utils/food";

function FoodCard({
  item,
  selected,
  userLocation,
  onSelect,
  primaryAction,
  secondaryAction,
  extraContent,
}) {
  const countdown = getCountdownState(item.expiry_time);
  const locationLabel = getFoodLocationLabel(item);
  const distanceLabel = getDistanceLabel(userLocation, item);
  const statusMeta = getStatusMeta(item.status);
  const typeMeta = getTypeMeta(item.type);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.96 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`overflow-hidden rounded-[1.75rem] border bg-white/75 shadow-xl shadow-slate-200/70 backdrop-blur ${
        selected ? "border-teal-300 ring-4 ring-teal-100" : "border-white/70"
      }`}
    >
      <button type="button" onClick={() => onSelect?.(item.id)} className="block w-full text-left">
        <div className="relative">
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className="h-56 w-full object-cover" />
          ) : (
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-teal-100 via-sky-50 to-green-100">
              <Package2 className="h-14 w-14 text-teal-600" />
            </div>
          )}

          <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
              {item.quantity}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeMeta.surfaceClass}`}>
              {typeMeta.label}
            </span>
          </div>

          {countdown.urgent ? (
            <div className="absolute bottom-4 right-4 rounded-full bg-rose-500/90 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              Urgent
            </div>
          ) : null}
        </div>
      </button>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">{item.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {item.pickup_notes || "Prepared for quick redistribution through the ZeroWasteX network."}
          </p>
        </div>

        <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-500">
              <Clock3 className="h-4 w-4" />
              Expiry
            </span>
            <span className={`font-semibold ${countdown.urgent ? "text-rose-600" : "text-slate-900"}`}>
              {countdown.label}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4" />
              Location
            </span>
            <div className="max-w-[60%] text-right">
              <div className="font-semibold text-slate-900">{locationLabel}</div>
              <div className="text-xs text-slate-500">{distanceLabel}</div>
            </div>
          </div>
        </div>

        {extraContent ? <div>{extraContent}</div> : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {primaryAction ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                Promise.resolve(primaryAction.onClick(item)).catch(() => {});
              }}
              disabled={primaryAction.loading}
              className="rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {primaryAction.loading ? primaryAction.loadingLabel || "Updating..." : primaryAction.label}
            </button>
          ) : null}

          {secondaryAction ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                Promise.resolve(secondaryAction.onClick(item)).catch(() => {});
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
            >
              <ExternalLink className="h-4 w-4" />
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

export default FoodCard;
