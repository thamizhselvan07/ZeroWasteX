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
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-2xl">
      <div className="section-shell flex flex-col gap-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button type="button" onClick={() => onNavigate("/discover")} className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 via-sky-500 to-green-500 text-white shadow-lg shadow-teal-500/25">
              <MapPinned className="h-6 w-6" />
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold tracking-tight text-slate-950">ZeroWasteX</div>
              <div className="text-sm text-slate-500">Industry-ready food redistribution workflow</div>
            </div>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm md:flex">
              {currentUser?.name} | {currentUser?.email}
            </div>
            <button
              type="button"
              onClick={() => onNavigate("/add-food")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition hover:scale-[1.02]"
            >
              <PackagePlus className="h-4 w-4" />
              Donate Food
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? "text-slate-950" : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-100 via-sky-50 to-green-100"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
