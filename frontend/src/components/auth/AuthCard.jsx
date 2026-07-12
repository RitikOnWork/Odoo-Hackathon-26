import { FiTruck } from 'react-icons/fi';

const AuthCard = ({ accentText, title, subtitle, children }) => {
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
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">24/7 visibility</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">Live performance</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1">Enterprise-ready</span>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white/70 p-6 sm:p-8 lg:w-[54%] lg:p-12">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200/80 bg-white/80 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">{accentText}</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
