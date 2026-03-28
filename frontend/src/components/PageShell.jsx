import { motion } from "framer-motion";

export default function PageShell({ eyebrow, title, description, action, children }) {
  return (
    <div className="section-shell py-8 sm:py-10">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mb-8 overflow-hidden rounded-[2rem] border border-white/20 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.28),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.24),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(17,94,89,0.95)_52%,rgba(22,101,52,0.92)_100%)] px-6 py-8 text-white shadow-2xl shadow-emerald-950/20 sm:px-8 sm:py-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-100/80">
              {eyebrow}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50/85 sm:text-base">
              {description}
            </p>
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      </motion.section>
      {children}
    </div>
  );
}
