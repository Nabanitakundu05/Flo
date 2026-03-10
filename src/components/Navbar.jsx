import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

export function Navbar() {
  const { profile, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const displayName = profile?.full_name || user?.email || 'U';
  const initial = displayName.charAt(0).toUpperCase();

  const avatarColors = [
    'bg-indigo-600', 'bg-violet-600', 'bg-teal-600',
    'bg-rose-600', 'bg-amber-600', 'bg-sky-600',
  ];
  const colorIndex = initial.charCodeAt(0) % avatarColors.length;
  const avatarBg = avatarColors[colorIndex];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border-subtle bg-bg-base/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 hover:opacity-85 transition-opacity duration-150"
        >
          <img src="/flo-logo.svg" alt="" aria-hidden="true" className="w-7 h-7 rounded-full" />
          <span className="font-syne text-xl font-bold text-warm-100 tracking-tight">Flo</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-xl border border-border-subtle flex items-center justify-center text-warm-400 hover:text-warm-200 hover:border-border-muted transition-all duration-150 btn-press"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={15} strokeWidth={1.5} />
            ) : (
              <Moon size={15} strokeWidth={1.5} />
            )}
          </button>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((p) => !p)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-bg-hover transition-colors duration-150"
            >
              <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center flex-shrink-0`}>
                <span className="font-syne font-bold text-sm text-white">{initial}</span>
              </div>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                className={`text-warm-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-bg-elevated border border-border-subtle rounded-xl overflow-hidden shadow-xl z-50">
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-xs text-warm-400 font-dm-sans truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-warm-200 hover:bg-bg-hover hover:text-warm-100 transition-colors duration-150"
                  >
                    <User size={15} strokeWidth={1.5} />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-warm-200 hover:bg-bg-hover hover:text-expense transition-colors duration-150"
                  >
                    <LogOut size={15} strokeWidth={1.5} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
