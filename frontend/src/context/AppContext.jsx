import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import api, {
  clearStoredAuth,
  getApiErrorMessage,
  getStoredAuth,
  persistAuth,
} from "../api";
import { isCompletedStatus, sortByLatest } from "../utils/food";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [bootLoading, setBootLoading] = useState(Boolean(getStoredAuth()?.token));
  const [foods, setFoods] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [userHistory, setUserHistory] = useState([]);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingState, setLoadingState] = useState({
    foods: false,
    requests: false,
    activities: false,
    history: false,
    addFood: false,
    requestFood: null,
    markPicked: null,
  });

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

  useEffect(() => {
    const bootstrapAuth = async () => {
      const stored = getStoredAuth();

      if (!stored?.token) {
        setBootLoading(false);
        return;
      }

      try {
        const [meResponse, foodsResponse, requestsResponse, activityResponse, historyResponse] = await Promise.all([
          api.get("/me"),
          api.get("/foods/all"),
          api.get("/api/my-requests"),
          api.get("/activity-feed"),
          api.get("/user-history"),
        ]);

        const nextAuth = { token: stored.token, user: meResponse.data.user };
        persistAuth(nextAuth);
        setAuth(nextAuth);
        setFoods(sortByLatest(foodsResponse.data.foods || []));
        setMyRequests(sortByLatest(requestsResponse.data.foods || []));
        setActivityFeed(activityResponse.data.activities || []);
        setUserHistory(historyResponse.data.history || []);
      } catch (error) {
        clearStoredAuth();
        setAuth(null);
        toast.error(getApiErrorMessage(error, "Your session expired. Please login again."));
      } finally {
        setBootLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  useEffect(() => {
    if (!auth?.token) {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const [foodsResponse, requestsResponse, activityResponse, historyResponse] = await Promise.all([
          api.get("/foods/all"),
          api.get("/api/my-requests"),
          api.get("/activity-feed"),
          api.get("/user-history"),
        ]);

        setFoods(sortByLatest(foodsResponse.data.foods || []));
        setMyRequests(sortByLatest(requestsResponse.data.foods || []));
        setActivityFeed(activityResponse.data.activities || []);
        setUserHistory(historyResponse.data.history || []);
      } catch {
        // Silent refresh keeps the UI stable.
      }
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [auth?.token]);

  const refreshFoods = useCallback(async () => {
    setLoadingState((current) => ({ ...current, foods: true }));

    try {
      const response = await api.get("/foods/all");
      const nextFoods = sortByLatest(response.data.foods || []);
      setFoods(nextFoods);
      return nextFoods;
    } finally {
      setLoadingState((current) => ({ ...current, foods: false }));
    }
  }, []);

  const refreshMyRequests = useCallback(async () => {
    setLoadingState((current) => ({ ...current, requests: true }));

    try {
      const response = await api.get("/api/my-requests");
      const nextFoods = sortByLatest(response.data.foods || []);
      setMyRequests(nextFoods);
      return nextFoods;
    } finally {
      setLoadingState((current) => ({ ...current, requests: false }));
    }
  }, []);

  const refreshActivityFeed = useCallback(async () => {
    setLoadingState((current) => ({ ...current, activities: true }));

    try {
      const response = await api.get("/activity-feed");
      const nextActivities = response.data.activities || [];
      setActivityFeed(nextActivities);
      return nextActivities;
    } finally {
      setLoadingState((current) => ({ ...current, activities: false }));
    }
  }, []);

  const refreshUserHistory = useCallback(async () => {
    setLoadingState((current) => ({ ...current, history: true }));

    try {
      const response = await api.get("/user-history");
      const nextHistory = response.data.history || [];
      setUserHistory(nextHistory);
      return nextHistory;
    } finally {
      setLoadingState((current) => ({ ...current, history: false }));
    }
  }, []);

  const syncOperationalData = useCallback(async () => {
    await Promise.all([refreshFoods(), refreshMyRequests(), refreshActivityFeed(), refreshUserHistory()]);
  }, [refreshActivityFeed, refreshFoods, refreshMyRequests, refreshUserHistory]);

  useEffect(() => {
    if (!auth?.token || bootLoading) {
      return;
    }

    syncOperationalData().catch(() => {
      // Initial authenticated sync should not break the shell.
    });
  }, [auth?.token, bootLoading, syncOperationalData]);

  useEffect(() => {
    console.log("All foods:", foods);
  }, [foods]);

  useEffect(() => {
    console.log("My requests:", myRequests);
  }, [myRequests]);

  const completeAuth = (payload) => {
    const nextAuth = { token: payload.token, user: payload.user };
    persistAuth(nextAuth);
    setAuth(nextAuth);
  };

  const logout = () => {
    clearStoredAuth();
    setAuth(null);
    setFoods([]);
    setMyRequests([]);
    setActivityFeed([]);
    setUserHistory([]);
    setSelectedFoodId(null);
    toast.success("Logged out");
  };

  const addFood = async (payload) => {
    setLoadingState((current) => ({ ...current, addFood: true }));

    try {
      const response = await api.post("/add-food", payload);
      toast.success(payload.status === "draft" ? "Draft saved" : "Food listing published");
      await syncOperationalData();
      return response.data.food;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to add this food listing."));
    } finally {
      setLoadingState((current) => ({ ...current, addFood: false }));
    }
  };

  const requestFood = async (foodId) => {
    setLoadingState((current) => ({ ...current, requestFood: foodId }));

    try {
      const response = await api.patch(`/api/foods/${foodId}/request`);
      toast.success("Pickup requested");
      await syncOperationalData();
      return response.data.food;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to request this pickup."));
    } finally {
      setLoadingState((current) => ({ ...current, requestFood: null }));
    }
  };

  const markPicked = async (foodId) => {
    setLoadingState((current) => ({ ...current, markPicked: foodId }));

    try {
      const response = await api.post("/mark-picked", { id: foodId });
      toast.success("Marked as picked");
      await syncOperationalData();
      return response.data.food;
    } catch (error) {
      throw new Error(getApiErrorMessage(error, "Unable to mark this pickup as completed."));
    } finally {
      setLoadingState((current) => ({ ...current, markPicked: null }));
    }
  };

  const stats = useMemo(() => {
    const drafts = foods.filter((food) => food.status === "draft");
    const available = foods.filter((food) => food.status === "available");
    const requested = foods.filter((food) => food.status === "requested");
    const completed = foods.filter((food) => isCompletedStatus(food.status));
    const myRequested = myRequests.filter((food) => food.status === "requested");
    const myCompleted = myRequests.filter((food) => isCompletedStatus(food.status));
    const myDonations = foods.filter((food) => food.donor_id === auth?.user?.id || food.donor?.user_id === auth?.user?.id);

    return {
      draftCount: drafts.length,
      availableCount: available.length,
      requestedCount: requested.length,
      pickedCount: completed.length,
      completedCount: completed.length,
      myActiveRequests: myRequested.length,
      myCompletedPickups: myCompleted.length,
      myDonationCount: myDonations.length,
      totalNetworkItems: foods.length,
    };
  }, [auth?.user?.id, foods, myRequests]);

  const value = {
    auth,
    bootLoading,
    foods,
    myRequests,
    activityFeed,
    userHistory,
    selectedFoodId,
    setSelectedFoodId,
    userLocation,
    loadingState,
    stats,
    completeAuth,
    logout,
    addFood,
    requestFood,
    markPicked,
    refreshFoods,
    refreshMyRequests,
    refreshActivityFeed,
    refreshUserHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return value;
}
