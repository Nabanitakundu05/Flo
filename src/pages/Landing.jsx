import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Sun, Moon } from 'lucide-react';

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Visual clarity',
    desc: 'Charts that make your financial story instantly readable — by month, by category, by habit.',
  },
  {
    icon: Zap,
    title: 'Zero friction',
    desc: 'Add income or expenses in under 10 seconds. Flo stays out of your way and lets you live your life.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    desc: 'Your data lives in your account. We use industry-standard security. No ads. No tracking. Ever.',
  },
];

function AbstractSVG() {
  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
      {/* Background arcs */}
      <circle cx="200" cy="200" r="160" stroke="#1f1f2e" strokeWidth="1" />
      <circle cx="200" cy="200" r="110" stroke="#1f1f2e" strokeWidth="0.5" strokeDasharray="4 8" />

      {/* Income arc */}
      <path
        d="M 200 40 A 160 160 0 0 1 340 200"
        stroke="#4ade80"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Expense arc */}
      <path
        d="M 340 200 A 160 160 0 0 1 60 260"
        stroke="#f87171"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Bar chart group */}
      <rect x="80" y="270" width="18" height="60" rx="3" fill="#4ade80" opacity="0.5" />
      <rect x="104" y="250" width="18" height="80" rx="3" fill="#4ade80" opacity="0.7" />
      <rect x="128" y="240" width="18" height="90" rx="3" fill="#4ade80" opacity="0.9" />
      <rect x="152" y="255" width="18" height="75" rx="3" fill="#f87171" opacity="0.5" />
      <rect x="176" y="245" width="18" height="85" rx="3" fill="#f87171" opacity="0.7" />

      {/* trend line */}
      <polyline
        points="89,270 113,250 137,235 161,252 185,242 230,220 270,210 310,215"
        stroke="#6366f1"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Dots on line */}
      {[[89,270],[113,250],[137,235],[161,252],[185,242],[230,220],[270,210],[310,215]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#6366f1" opacity="0.8" />
      ))}

      {/* Floating data labels */}
      <rect x="250" y="140" width="80" height="32" rx="8" fill="#16161c" stroke="#1f1f2e" />
      <text x="260" y="160" fill="#4ade80" fontSize="11" fontFamily="DM Mono">+₹42,000</text>

      <rect x="118" y="180" width="72" height="32" rx="8" fill="#16161c" stroke="#1f1f2e" />
      <text x="128" y="200" fill="#f87171" fontSize="11" fontFamily="DM Mono">-₹18,500</text>
    </svg>
  );
}

export function Landing() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true });
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col page-enter">
      {/* Nav */}
      <nav className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flo-logo.svg" alt="" aria-hidden="true" className="w-7 h-7 rounded-full" />
            <span className="font-syne text-xl font-bold text-warm-100 tracking-tight">Flo</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl border border-border-subtle flex items-center justify-center text-warm-400 hover:text-warm-200 hover:border-border-muted transition-all duration-150 btn-press"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
            </button>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-dm-sans text-warm-300 border border-border-subtle rounded-xl hover:border-border-muted hover:text-warm-100 transition-colors duration-150 btn-press"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-dm-sans text-white bg-accent-indigo hover:bg-accent-indigo-dim rounded-xl transition-colors duration-150 btn-press"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="flex flex-col gap-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <img src="/flo-logo.svg" alt="Flo" className="w-10 h-10 rounded-full" />
                </div>
                <h1 className="font-syne text-6xl lg:text-7xl font-bold text-warm-100 leading-[1.05] tracking-tight">
                  Flo
                </h1>
                <p className="font-syne text-2xl lg:text-3xl font-medium text-warm-300 mt-3 leading-snug text-balance">
                  Your money, finally clear.
                </p>
                <p className="font-dm-sans text-warm-400 mt-5 text-base leading-relaxed max-w-md">
                  Track income and expenses, visualize where your money goes, and build better habits — all in one focused, beautiful interface.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-accent-indigo hover:bg-accent-indigo-dim text-white font-dm-sans font-medium rounded-xl transition-colors duration-150 btn-press group"
                >
                  Get Started Free
                  <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3.5 border border-border-subtle text-warm-300 font-dm-sans rounded-xl hover:border-border-muted hover:text-warm-100 transition-colors duration-150 btn-press"
                >
                  Already have an account? Sign in
                </Link>
              </div>

              <p className="font-dm-sans text-xs text-warm-500">No credit card • Free forever • Setup in 2 minutes</p>
            </div>

            {/* Right — abstract SVG */}
            <div className="hidden lg:flex justify-center items-center">
              <AbstractSVG />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-border-subtle">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-bg-surface border border-border-subtle rounded-2xl p-6 hover:border-border-muted transition-colors duration-200">
                  <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
                    <Icon size={18} strokeWidth={1.5} className="text-accent-indigo" />
                  </div>
                  <h2 className="font-syne font-semibold text-warm-100 text-base mb-2">{title}</h2>
                  <p className="font-dm-sans text-warm-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/flo-logo.svg" alt="" aria-hidden="true" className="w-5 h-5 rounded-full opacity-60" />
            <span className="font-syne font-bold text-warm-500 text-sm">Flo</span>
          </div>
          <p className="font-dm-sans text-xs text-warm-600">© {new Date().getFullYear()} Flo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
