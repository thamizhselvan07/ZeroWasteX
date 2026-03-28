import { motion } from "framer-motion";
import { ArrowLeft, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";

import api, { getApiErrorMessage } from "../api";

function Signup({ onBack, onSwitch, onSuccess }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "volunteer" });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/signup", formData);
      onSuccess(response.data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "Unable to create account. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_32%),linear-gradient(140deg,#022c22_0%,#0f172a_48%,#042f2e_100%)]" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-2xl">
        <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-100/80">
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-emerald-50/75">Join donors and volunteers redistributing food in real time.</p>

        {errorMessage ? (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <span>{errorMessage}</span>
            <button type="button" onClick={() => setErrorMessage("")} className="ml-2 text-rose-100/60 hover:text-rose-100">
              x
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-emerald-50/80">Name</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <UserRound className="h-4 w-4 text-emerald-100/80" />
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent outline-none placeholder:text-slate-300/50" placeholder="Your name" required />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-emerald-50/80">Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <Mail className="h-4 w-4 text-emerald-100/80" />
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent outline-none placeholder:text-slate-300/50" placeholder="you@example.com" required />
            </div>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-emerald-50/80">Role</span>
            <select name="role" value={formData.role} onChange={handleChange} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none">
              <option value="volunteer" className="text-slate-900">Volunteer</option>
              <option value="donor" className="text-slate-900">Donor</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-emerald-50/80">Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
              <LockKeyhole className="h-4 w-4 text-emerald-100/80" />
              <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-transparent outline-none placeholder:text-slate-300/50" placeholder="Create a secure password" required />
            </div>
          </label>

          <button type="submit" disabled={loading} className="w-full rounded-full bg-gradient-to-r from-teal-400 via-sky-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:scale-[1.01] disabled:opacity-70">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-emerald-50/75">
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} className="font-semibold text-white underline underline-offset-4">
            Login
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
