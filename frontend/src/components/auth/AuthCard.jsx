import { useContext } from 'react';
import { FiTruck } from 'react-icons/fi';
import { AppContext } from '../../context/AppContext';

const AuthCard = ({ accentText, title, subtitle, children }) => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_34%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_45%,_#eff6ff_100%)] px-4 py-6 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)]">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/75 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/75">
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
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">24/7 visibility</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">Live performance</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">Enterprise-ready</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white/70 p-6 sm:p-8 lg:w-[54%] lg:p-12 dark:bg-slate-950/70">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/80 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8 dark:border-slate-800/80 dark:bg-slate-900/80">
            <div className="mb-8 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">{accentText}</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
