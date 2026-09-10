import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import heroImg from "../assets/slideImage.png";
import logoWhite from "../assets/aina_paradiseblack.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      if (data.user.role !== "admin") {
        toast.error("Admin access only");
        setLoading(false);
        return;
      }
      localStorage.setItem("admin_token", data.token);
      toast.success("Welcome back!");
      setTimeout(() => navigate("/"), 600);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left: Hero Panel ── */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        {/* Background image */}
        <img
          src={heroImg}
          alt="Aina Paradise"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a]/85 via-[#1a1a2e]/70 to-[#0d0d1a]/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <div>
            <img
              src={logoWhite}
              alt="Aina Paradise"
              className="h-20 object-contain"
            />
          </div>

          {/* Center text */}
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase px-3 py-1 rounded-full border border-[#e4a43e]/40 text-[#ecc06e] mb-6">
              Admin Portal
            </span>
            <h1 className="text-5xl font-bold text-white leading-tight mb-4">
              Manage Your
              <br />
              <span style={{ color: "#e4a43e" }}>Paradise</span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              Full control over rooms, bookings, guests, and locations — all
              from one elegant dashboard.
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Aina Paradise · All rights reserved
          </p>
        </div>
      </div>

      {/* ── Right: Login Form ── */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <p className="text-3xl font-bold text-gray-900">Aina Paradise</p>
            <p
              className="text-xs tracking-widest uppercase mt-1 font-medium"
              style={{ color: "#d4882a" }}
            >
              Admin Portal
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded border border-gray-200 p-8">
            {/* Header */}
            <div className="mb-8">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "#0f2e28" }}
              >
                <Lock size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Welcome back
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Sign in to your admin account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                  />
                  <input
                    type={showPw ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all bg-gray-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all mt-1"
                style={{ background: "#0f2e28" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
