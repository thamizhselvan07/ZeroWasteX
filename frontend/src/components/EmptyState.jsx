import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] border border-white/70 bg-white/70 px-6 py-14 text-center shadow-xl shadow-slate-200/60 backdrop-blur"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}
