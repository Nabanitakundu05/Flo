import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { AlertCircle, Sun, Moon } from 'lucide-react';

function getPasswordStrength(password) {
  if (!password) return null;
  if (password.length < 6) return 'weak';
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasNumber, hasSpecial, password.length >= 10].filter(Boolean).length;
  if (score <= 1) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

const STRENGTH_STYLES = {
  weak: { bar: 'bg-expense w-1/3', text: 'text-expense', label: 'Weak' },
  fair: { bar: 'bg-amber-400 w-2/3', text: 'text-amber-400', label: 'Fair' },
  strong: { bar: 'bg-income w-full', text: 'text-income', label: 'Strong' },
};

function FloatInput({ id, label, type, value, onChange, error, autoComplete }) {
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
          autoComplete={autoComplete}
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

export function Register() {
  const { session, signUp } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) navigate('/dashboard', { replace: true });
  }, [session, navigate]);

  function set(field) {
    return (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    const { error } = await signUp(form.email, form.password, form.name);
    if (error) {
      setErrors({ general: error.message });
    } else {
      navigate('/dashboard', { replace: true });
    }
    setLoading(false);
  }

  const strength = getPasswordStrength(form.password);
  const strengthStyle = strength ? STRENGTH_STYLES[strength] : null;

  return (
    <div className="min-h-screen bg-bg-base grid grid-cols-1 lg:grid-cols-2 page-enter">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-2">
          <img src="/flo-logo.svg" alt="" aria-hidden="true" className="w-8 h-8 rounded-full" />
          <span className="font-syne text-2xl font-bold text-warm-100 tracking-tight">Flo</span>
        </div>
        <div>
          <p className="font-syne text-3xl font-medium text-warm-200 leading-snug mb-6 text-balance">
            Know where every rupee goes. Then decide where the next one should.
          </p>
          <div className="flex flex-col gap-3">
            {['No credit card required', 'Free forever on one device', 'Set up in under 2 minutes'].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-income" />
                <span className="font-dm-sans text-sm text-warm-400">{f}</span>
              </div>
            ))}
          </div>
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
            <h1 className="font-syne text-2xl font-bold text-warm-100">Create account</h1>
            <p className="font-dm-sans text-warm-400 text-sm mt-1">Start tracking in minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {errors.general && (
              <div className="flex items-center gap-2 px-4 py-3 bg-expense/10 border border-expense/20 rounded-xl">
                <AlertCircle size={14} strokeWidth={1.5} className="text-expense flex-shrink-0" />
                <p className="text-sm text-expense font-dm-sans">{errors.general}</p>
              </div>
            )}

            <FloatInput id="reg-name" label="Full name" type="text" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            <FloatInput id="reg-email" label="Email address" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />

            <div className="flex flex-col gap-1.5">
              <FloatInput id="reg-password" label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
              {form.password && strengthStyle && (
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthStyle.bar}`} />
                  </div>
                  <span className={`text-xs font-dm-sans ${strengthStyle.text}`}>{strengthStyle.label}</span>
                </div>
              )}
            </div>

            <FloatInput id="reg-confirm" label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-accent-indigo hover:bg-accent-indigo-dim text-white font-dm-sans font-medium rounded-xl transition-colors duration-150 btn-press disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center font-dm-sans text-sm text-warm-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-indigo hover:text-warm-100 transition-colors duration-150 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
