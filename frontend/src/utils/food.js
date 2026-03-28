export const toRadians = (value) => (value * Math.PI) / 180;

export function calculateDistanceInKm(source, target) {
  if (!source?.lat || !source?.lng || !target?.lat || !target?.lng) {
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
}

export function getFoodLocationLabel(food) {
  if (food?.location?.address) {
    return food.location.address;
  }

  if (food?.location?.lat && food?.location?.lng) {
    return `${Number(food.location.lat).toFixed(3)}, ${Number(food.location.lng).toFixed(3)}`;
  }

  return "Location unavailable";
}

export function buildMapsUrl(food) {
  if (!food?.location?.lat || !food?.location?.lng) {
    return "#";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${food.location.lat},${food.location.lng}`;
}

export function getCountdownState(expiryTime) {
  const target = new Date(expiryTime).getTime();

  if (Number.isNaN(target)) {
    return {
      expired: false,
      urgent: false,
      hoursLeft: null,
      label: expiryTime,
      millisecondsLeft: null,
    };
  }

  const diff = target - Date.now();

  if (diff <= 0) {
    return {
      expired: true,
      urgent: true,
      hoursLeft: 0,
      label: "Expired",
      millisecondsLeft: 0,
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    expired: false,
    urgent: diff < 2 * 60 * 60 * 1000,
    hoursLeft: diff / (1000 * 60 * 60),
    label: hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`,
    millisecondsLeft: diff,
  };
}

export function isUrgentFood(food) {
  return getCountdownState(food?.expiry_time).urgent;
}

export function getDistanceLabel(userLocation, food) {
  const distance = calculateDistanceInKm(userLocation, food?.location);

  if (distance === null) {
    return "Distance unavailable";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
}

export function sortByLatest(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.updated_at || left.created_at || 0).getTime();
    const rightTime = new Date(right.updated_at || right.created_at || 0).getTime();
    return rightTime - leftTime;
  });
}

export function isCompletedStatus(status) {
  return status === "picked" || status === "completed";
}

export function getStatusMeta(status) {
  if (status === "requested") {
    return { label: "Requested", className: "bg-amber-100 text-amber-700" };
  }

  if (status === "picked") {
    return { label: "Picked", className: "bg-sky-100 text-sky-700" };
  }

  if (status === "completed") {
    return { label: "Completed", className: "bg-slate-200 text-slate-700" };
  }

  if (status === "draft") {
    return { label: "Draft", className: "bg-violet-100 text-violet-700" };
  }

  return { label: "Available", className: "bg-emerald-100 text-emerald-700" };
}

export function getTypeMeta(type) {
  if (type === "non-veg") {
    return {
      label: "Non-Veg",
      markerClass: "marker-dot-nonveg",
      surfaceClass: "bg-rose-50 text-rose-700",
    };
  }

  return {
    label: "Veg",
    markerClass: "marker-dot-veg",
    surfaceClass: "bg-emerald-50 text-emerald-700",
  };
}
