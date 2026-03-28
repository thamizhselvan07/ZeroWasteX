import { motion } from "framer-motion";
import {
  BarChart3,
  Compass,
  LogOut,
  MapPinned,
  PackageCheck,
  PackagePlus,
  UserRound,
} from "lucide-react";

const navItems = [
  { path: "/discover", label: "Discover", icon: Compass },
  { path: "/pickup", label: "Pickup", icon: MapPinned },
  { path: "/my-requests", label: "My Requests", icon: PackageCheck },
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/profile", label: "Profile", icon: UserRound },
];

function Navbar({ pathname, currentUser, onNavigate, onLogout }) {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 rounded-full border border-white/20 bg-white/10 shadow-glow backdrop-blur-2xl animate-float">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-3">
        <button type="button" onClick={() => onNavigate("/discover")} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 text-white shadow-glow">
            <MapPinned className="h-5 w-5" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-base font-bold tracking-tight text-white hover:text-brand-200 transition">ZeroWasteX</div>
          </div>
        </button>

        <nav className="flex flex-wrap gap-1 md:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium transition ${
                  active ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/20 shadow-glow"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/80 shadow-sm lg:flex">
            {currentUser?.name}
          </div>
          <button
            type="button"
            onClick={() => onNavigate("/add-food")}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 px-4 py-2 md:px-5 md:py-2.5 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1 hover:scale-105"
          >
            <PackagePlus className="h-4 w-4" />
            <span className="hidden md:inline">Donate Food</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 transition hover:bg-rose-500 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
