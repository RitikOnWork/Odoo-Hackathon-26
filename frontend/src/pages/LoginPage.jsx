import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiLock, FiMail, FiTruck, FiArrowRight } from 'react-icons/fi';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_34%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#eff6ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/75 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(30,41,59,0.95))]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
              <div className="rounded-full bg-cyan-400/20 p-2 text-cyan-300">
                <FiTruck />
              </div>
              <span className="text-sm font-semibold tracking-[0.2em] text-slate-100">TRANSITOPS</span>
            </div>

            <h1 className="mt-8 text-4xl font-semibold leading-tight">Move your fleet with clarity and confidence.</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              Monitor vehicles, dispatch trips, and keep operations running smoothly from one premium command center.
            </p>
          </div>

          <div className="relative z-10 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Trusted by modern fleet teams</p>
            <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">24/7 visibility</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">Live performance</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">Enterprise-ready</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white/70 p-6 sm:p-8 lg:w-[54%] lg:p-12">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/80 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">Welcome back</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Sign in to TransitOps</h2>
              <p className="mt-2 text-sm text-slate-500">Access your operations dashboard and fleet intelligence.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">Email</label>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email ? <p className="mt-2 text-sm text-rose-500">{errors.email}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                <div className="relative">
                  <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-12 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password ? <p className="mt-2 text-sm text-rose-500">{errors.password}</p> : null}
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((value) => !value)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Remember me
                </label>
                <a href="#" className="font-medium text-sky-600 transition hover:text-sky-700">Forgot password?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-80"
              >
                {loading ? 'Signing in...' : 'Login'}
                {!loading ? <FiArrowRight /> : null}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
