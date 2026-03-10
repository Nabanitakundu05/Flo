import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { AlertCircle, Sun, Moon } from 'lucide-react';

function FloatInput({ id, label, type, value, onChange, error }) {
  const hasValue = value !== '';
  return (
    <div className="flex flex-col gap-1">
      <div className={`float-label-group ${hasValue ? 'has-value' : ''}`}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder=" "
          autoComplete={type === 'password' ? 'current-password' : 'email'}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <div className="flex items-center gap-1.5">
          <AlertCircle size={12} strokeWidth={1.5} className="text-expense flex-shrink-0" />
          <p className="text-xs text-expense font-dm-sans">{error}</p>
        </div>
      )}
    </div>
  );
}

export function Login() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true });
  }, [session, navigate]);

  function validate() {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setLoading(true);
    setErrors({});
    const { error } = await signIn(email, password);
    if (error) {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } else {
      navigate('/dashboard', { replace: true });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg-base grid grid-cols-1 lg:grid-cols-2 page-enter">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-2">
          <img src="/flo-logo.svg" alt="" aria-hidden="true" className="w-8 h-8 rounded-full" />
          <span className="font-syne text-2xl font-bold text-warm-100 tracking-tight">Flo</span>
        </div>
        <div>
          <blockquote className="font-syne text-3xl font-medium text-warm-200 leading-snug text-balance mb-6">
            "The best investment you can make is in yourself. Flo makes it easy to start."
          </blockquote>
          <p className="font-dm-sans text-warm-500 text-sm">Take control of every rupee.</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-8 h-0.5 bg-accent-indigo rounded-full" />
          <p className="font-dm-sans text-xs text-warm-600">© {new Date().getFullYear()} Flo</p>
        </div>
      </div>

      {/* Right form */}
        <div className="flex items-center justify-center p-6 lg:p-12 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl border border-border-subtle flex items-center justify-center text-warm-400 hover:text-warm-200 hover:border-border-muted transition-all duration-150 btn-press"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
        </button>
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="flex items-center gap-2 lg:hidden mb-6">
              <img src="/flo-logo.svg" alt="" aria-hidden="true" className="w-7 h-7 rounded-full" />
              <span className="font-syne text-2xl font-bold text-warm-100 tracking-tight">Flo</span>
            </div>
            <h1 className="font-syne text-2xl font-bold text-warm-100">Welcome back</h1>
            <p className="font-dm-sans text-warm-400 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {errors.general && (
              <div className="flex items-center gap-2 px-4 py-3 bg-expense/10 border border-expense/20 rounded-xl">
                <AlertCircle size={14} strokeWidth={1.5} className="text-expense flex-shrink-0" />
                <p className="text-sm text-expense font-dm-sans">{errors.general}</p>
              </div>
            )}

            <FloatInput
              id="login-email"
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div>
              <FloatInput
                id="login-password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <button
                type="button"
                className="mt-1.5 text-xs text-warm-400 hover:text-warm-200 font-dm-sans transition-colors duration-150 text-left"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-accent-indigo hover:bg-accent-indigo-dim text-white font-dm-sans font-medium rounded-xl transition-colors duration-150 btn-press disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center font-dm-sans text-sm text-warm-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-indigo hover:text-warm-100 transition-colors duration-150 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
