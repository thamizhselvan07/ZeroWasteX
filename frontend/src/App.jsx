import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import { useAppContext } from "./context/AppContext";
import AddFoodPage from "./pages/AddFoodPage";
import DashboardPage from "./pages/DashboardPage";
import DiscoverPage from "./pages/DiscoverPage";
import LandingPage from "./pages/LandingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import Login from "./pages/Login";
import MyRequestsPage from "./pages/MyRequestsPage";
import PickupPage from "./pages/PickupPage";
import ProfilePage from "./pages/ProfilePage";
import Signup from "./pages/Signup";

const appRoutes = {
  discover: "/discover",
  pickup: "/pickup",
  myRequests: "/my-requests",
  dashboard: "/dashboard",
  leaderboard: "/leaderboard",
  profile: "/profile",
  addFood: "/add-food",
};

const publicRoutes = ["/", "/login", "/signup"];
const privateRoutes = Object.values(appRoutes);

function getRouteFromPath(pathname) {
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return pathname;
  }

  if (privateRoutes.includes(pathname)) {
    return pathname;
  }

  return null;
}

function App() {
  const { auth, bootLoading, completeAuth, logout } = useAppContext();
  const [pathname, setPathname] = useState(() => getRouteFromPath(window.location.pathname) || "/");

  useEffect(() => {
    const onPopState = () => {
      setPathname(getRouteFromPath(window.location.pathname) || "/");
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextPath, replace = false) => {
    const path = getRouteFromPath(nextPath) || nextPath;

    if (replace) {
      window.history.replaceState({}, "", path);
    } else {
      window.history.pushState({}, "", path);
    }

    setPathname(path);
  };

  useEffect(() => {
    if (bootLoading) {
      return;
    }

    if (!auth && privateRoutes.includes(pathname)) {
      navigate("/login", true);
      return;
    }

    if (auth && publicRoutes.includes(pathname)) {
      navigate(appRoutes.dashboard, true);
    }
  }, [auth, bootLoading, pathname]);

  if (bootLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-teal-300" />
          <p className="mt-4 text-sm font-medium text-slate-300">Loading ZeroWasteX...</p>
        </div>
      </div>
    );
  }

  let content = null;

  if (!auth) {
    if (pathname === "/login") {
      content = (
        <Login
          onBack={() => navigate("/")}
          onSwitch={() => navigate("/signup")}
          onSuccess={(payload) => {
            completeAuth(payload);
            navigate(appRoutes.dashboard, true);
          }}
        />
      );
    } else if (pathname === "/signup") {
      content = (
        <Signup
          onBack={() => navigate("/")}
          onSwitch={() => navigate("/login")}
          onSuccess={(payload) => {
            completeAuth(payload);
            navigate(appRoutes.dashboard, true);
          }}
        />
      );
    } else {
      content = <LandingPage onGetStarted={() => navigate("/signup")} onLogin={() => navigate("/login")} />;
    }
  } else {
    const activePath = getRouteFromPath(pathname) || appRoutes.dashboard;

    if (activePath === appRoutes.discover) {
      content = <DiscoverPage navigate={navigate} />;
    } else if (activePath === appRoutes.pickup) {
      content = <PickupPage navigate={navigate} />;
    } else if (activePath === appRoutes.myRequests) {
      content = <MyRequestsPage navigate={navigate} />;
    } else if (activePath === appRoutes.profile) {
      content = (
        <ProfilePage
          onLogout={() => {
            logout();
            navigate("/login", true);
          }}
        />
      );
    } else if (activePath === appRoutes.addFood) {
      content = <AddFoodPage navigate={navigate} />;
    } else if (activePath === appRoutes.leaderboard) {
      content = <LeaderboardPage />;
    } else {
      content = <DashboardPage navigate={navigate} />;
    }

    content = (
      <div className="min-h-screen bg-slate-50">
        <Navbar
          currentUser={auth.user}
          pathname={activePath}
          onLogout={() => {
            logout();
            navigate("/login", true);
          }}
          onNavigate={navigate}
        />
        <AnimatePresence mode="wait">
          <motion.main
            key={activePath}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {content}
          </motion.main>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2800,
          style: {
            borderRadius: "18px",
            background: "rgba(15, 23, 42, 0.92)",
            color: "#ffffff",
            boxShadow: "0 20px 45px rgba(15, 23, 42, 0.26)",
            backdropFilter: "blur(18px)",
          },
        }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
