function Hero({ onFindFood, onDonateFood }) {
  return (
    <section className="section-shell pt-8 sm:pt-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-hero-gradient px-6 py-10 shadow-glow sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="absolute -right-16 top-10 hidden h-72 w-72 rounded-full bg-brand-200/40 blur-3xl md:block" />
        <div className="absolute bottom-0 left-1/3 hidden h-56 w-56 rounded-full bg-emerald-100/70 blur-3xl md:block" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm font-medium text-brand-700">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
              Live redistribution network for food rescue
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Redistribute Food. Reduce Waste. Feed Communities.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Real-time platform connecting surplus food with people in need. FoodBridge helps
              campuses, restaurants, volunteers, and community partners move excess food before it
              expires.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onFindFood}
                className="rounded-full bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
              >
                Find Food
              </button>
              <button
                type="button"
                onClick={onDonateFood}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-800 transition hover:border-brand-200 hover:text-brand-700"
              >
                Donate Food
              </button>
            </div>
          </div>

          <div className="card-surface relative overflow-hidden p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[2rem] bg-brand-500/10" />
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-500">Today&apos;s rescue flow</div>
                  <div className="text-2xl font-semibold text-slate-950">6 active pickups</div>
                </div>
                <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 12h6l2-7 4 14 2-7h4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Grocer donated produce", value: "120 meals", color: "bg-brand-600" },
                  { label: "Volunteer dispatched", value: "8 mins ago", color: "bg-amber-500" },
                  { label: "Shelter fulfilled", value: "3 locations", color: "bg-sky-500" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                    <span className={`h-11 w-11 rounded-2xl ${item.color}`} />
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{item.label}</div>
                      <div className="text-sm text-slate-500">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-slate-900 p-5 text-white">
                <div className="text-sm uppercase tracking-[0.25em] text-slate-400">Mission</div>
                <div className="mt-2 text-lg font-medium">
                  Bridge the gap between food waste and food access with instant logistics.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
