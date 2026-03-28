import { motion } from "framer-motion";
import L from "leaflet";
import { Navigation, PackageCheck } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";

import { buildMapsUrl, getFoodLocationLabel, getStatusMeta, getTypeMeta } from "../utils/food";

const defaultCenter = [13.0827, 80.2707];
const isValidCoordinate = (value) => typeof value === "number" && Number.isFinite(value);
const getFoodCoordinates = (food) => {
  const latitude = Number(food?.latitude ?? food?.location?.lat);
  const longitude = Number(food?.longitude ?? food?.location?.lng);

  if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
    return null;
  }

  return [latitude, longitude];
};

const markerHtml = (food, selected) => {
  const typeMeta = getTypeMeta(food.type);
  const statusMeta = getStatusMeta(food.status);

  return `<div class="marker-shell ${selected ? "marker-shell-selected" : ""} ${food.status === "requested" ? "marker-shell-requested" : ""} ${food.status === "picked" || food.status === "completed" ? "marker-shell-picked" : ""}">
    <div class="marker-dot ${typeMeta.markerClass} ${selected ? "marker-dot-selected" : ""}"></div>
    <span class="marker-status">${statusMeta.label.slice(0, 1)}</span>
  </div>`;
};

const createMarkerIcon = (food, selected) =>
  L.divIcon({
    className: "custom-marker",
    html: markerHtml(food, selected),
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });

const userIcon = L.divIcon({
  className: "custom-marker",
  html: '<div class="marker-shell marker-shell-user"><div class="marker-dot marker-dot-user"></div></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

function MapFocus({ userLocation, selectedFood }) {
  const map = useMap();

  useEffect(() => {
    const selectedCoordinates = getFoodCoordinates(selectedFood);
    if (selectedCoordinates) {
      map.flyTo(selectedCoordinates, 13, { duration: 0.9 });
      return;
    }

    if (userLocation?.lat && userLocation?.lng) {
      map.flyTo([userLocation.lat, userLocation.lng], 11, { duration: 0.9 });
    }
  }, [map, selectedFood, userLocation]);

  return null;
}

function MapView({ foods, userLocation, selectedFoodId, onSelectFood, onRequestFood, requestLoadingId }) {
  const center =
    userLocation?.lat && userLocation?.lng ? [userLocation.lat, userLocation.lng] : defaultCenter;
  const visibleFoods = foods.filter((food) => food.status !== "completed").filter((food) => getFoodCoordinates(food));
  const selectedFood = visibleFoods.find((food) => food.id === selectedFoodId) || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-xl shadow-slate-200/70"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Live rescue map</h3>
          <p className="mt-1 text-sm text-slate-500">
            Veg and non-veg markers are color-coded and update instantly when status changes.
          </p>
        </div>
        <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
          {visibleFoods.length} markers
        </div>
      </div>

      <div className="h-[28rem] w-full">
        <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFocus selectedFood={selectedFood} userLocation={userLocation} />

          {userLocation?.lat && userLocation?.lng ? (
            <Marker icon={userIcon} position={[userLocation.lat, userLocation.lng]}>
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold text-slate-950">Your current location</div>
                  <div className="text-sm text-slate-600">Used for nearby pickup discovery.</div>
                </div>
              </Popup>
            </Marker>
          ) : null}

          {visibleFoods.map((food) => {
            const selected = selectedFoodId === food.id;
            const statusMeta = getStatusMeta(food.status);
            const typeMeta = getTypeMeta(food.type);
            const coordinates = getFoodCoordinates(food);

            return (
              <Marker
                key={food.id}
                icon={createMarkerIcon(food, selected)}
                position={coordinates}
                eventHandlers={{
                  click: () => onSelectFood?.(food.id),
                }}
              >
                <Popup>
                  <div className="min-w-[220px] space-y-3">
                    <div>
                      <div className="font-semibold text-slate-950">{food.name}</div>
                      <div className="text-sm text-slate-500">{food.quantity}</div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${typeMeta.surfaceClass}`}>
                        {typeMeta.label}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
                        {statusMeta.label}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600">{getFoodLocationLabel(food)}</div>
                    <div className="grid gap-2">
                      {food.status === "available" && onRequestFood ? (
                        <button
                          type="button"
                          disabled={requestLoadingId === food.id}
                          onClick={() => onRequestFood(food.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                        >
                          <PackageCheck className="h-3.5 w-3.5" />
                          {requestLoadingId === food.id ? "Requesting..." : "Request Pickup"}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => window.open(buildMapsUrl(food), "_blank", "noopener,noreferrer")}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Open in Maps
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </motion.div>
  );
}

export default MapView;
