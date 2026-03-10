import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/Navbar';
import { Toast } from '../components/Toast';

const avatarColors = [
  'bg-indigo-600', 'bg-violet-600', 'bg-teal-600',
  'bg-rose-600', 'bg-amber-600', 'bg-sky-600',
];

function SectionCard({ title, children }) {
  return (
    <div className="bg-bg-surface border border-border-subtle rounded-2xl">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="font-syne font-semibold text-warm-100 text-base">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function FloatInput({ id, label, value, onChange, type = 'text', disabled }) {
  const hasValue = value !== '';
  return (
    <div className={`float-label-group ${hasValue ? 'has-value' : ''}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        disabled={disabled}
        className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-bg-base page-enter">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="skeleton w-20 h-20 rounded-full" />
            <div className="skeleton h-5 w-32 rounded-full" />
            <div className="skeleton h-3.5 w-40 rounded-full" />
            <div className="skeleton h-3 w-28 rounded-full" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
          </div>
        </div>
      </main>
    </div>
  );
}

export function Profile() {
  const { user } = useAuth();
  const { profile, transactionCount, loading, updateName, updatePassword, deleteAccount } = useProfile();
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const [deleteInput, setDeleteInput] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile]);

  if (loading) return <ProfileSkeleton />;

  const displayName = profile?.full_name || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();
  const colorIdx = initial.charCodeAt(0) % avatarColors.length;
  const avatarBg = avatarColors[colorIdx];

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '—';

  async function handleSaveName(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingName(true);
    const { error } = await updateName(name.trim());
    if (error) addToast('Failed to update name.', 'error');
    else addToast('Name updated successfully.', 'success');
    setSavingName(false);
  }

  function setPw(field) {
    return (e) => setPasswords((p) => ({ ...p, [field]: e.target.value }));
  }

  async function handleSavePassword(e) {
    e.preventDefault();
    const errs = {};
    if (!passwords.newPw) errs.newPw = 'New password is required';
    else if (passwords.newPw.length < 6) errs.newPw = 'Must be at least 6 characters';
    if (!passwords.confirm) errs.confirm = 'Please confirm';
    else if (passwords.newPw !== passwords.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }

    setSavingPw(true);
    setPwErrors({});
    const { error } = await updatePassword(passwords.newPw);
    if (error) addToast(error.message, 'error');
    else {
      addToast('Password updated.', 'success');
      setPasswords({ current: '', newPw: '', confirm: '' });
    }
    setSavingPw(false);
  }

  async function handleDeleteAccount() {
    if (deleteInput !== 'DELETE') return;
    setDeleting(true);
    await deleteAccount();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-bg-base page-enter">
      <Navbar />
      <Toast toasts={toasts} onRemove={removeToast} />

      <main className="max-w-5xl mx-auto px-6 pt-10 pb-24">
        <h1 className="font-syne text-2xl font-bold text-warm-100 mb-8">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Left panel */}
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <div className={`w-20 h-20 rounded-full ${avatarBg} flex items-center justify-center`}>
              <span className="font-syne font-bold text-3xl text-white">{initial}</span>
            </div>
            <div>
              <p className="font-syne font-semibold text-warm-100 text-lg">{displayName}</p>
              <p className="font-dm-sans text-warm-400 text-sm mt-0.5">{user?.email}</p>
            </div>
            <div className="w-full pt-2 border-t border-border-subtle flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-dm-sans">
                <span className="text-warm-500">Member since</span>
                <span className="text-warm-300">{memberSince}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-dm-sans">
                <span className="text-warm-500">Transactions</span>
                <span className="font-dm-mono text-warm-300">{transactionCount}</span>
              </div>
            </div>
          </div>

          {/* Right panels */}
          <div className="flex flex-col gap-4">
            {/* Personal info */}
            <SectionCard title="Personal Info">
              <form onSubmit={handleSaveName} className="flex flex-col gap-4">
                <div className={`float-label-group has-value`}>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                  />
                  <label htmlFor="profile-name">Full name</label>
                </div>
                <div className={`float-label-group has-value`}>
                  <input
                    id="profile-email"
                    type="email"
                    value={user?.email || ''}
                    disabled
                    placeholder=" "
                    className="opacity-50 cursor-not-allowed"
                  />
                  <label htmlFor="profile-email">Email address</label>
                </div>
                <p className="font-dm-sans text-xs text-warm-500 -mt-2">Email cannot be changed here.</p>
                <button
                  type="submit"
                  disabled={savingName}
                  className="self-start px-5 py-2.5 bg-accent-indigo hover:bg-accent-indigo-dim text-white text-sm font-dm-sans rounded-xl btn-press transition-colors duration-150 disabled:opacity-60"
                >
                  {savingName ? 'Saving…' : 'Save Changes'}
                </button>
              </form>
            </SectionCard>

            {/* Security */}
            <SectionCard title="Security">
              <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className={`float-label-group ${passwords.newPw ? 'has-value' : ''}`}>
                    <input id="new-pw" type="password" value={passwords.newPw} onChange={setPw('newPw')} placeholder=" " autoComplete="new-password" />
                    <label htmlFor="new-pw">New password</label>
                  </div>
                  {pwErrors.newPw && <p className="text-xs text-expense font-dm-sans flex items-center gap-1"><AlertCircle size={11} strokeWidth={1.5} />{pwErrors.newPw}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <div className={`float-label-group ${passwords.confirm ? 'has-value' : ''}`}>
                    <input id="pw-confirm" type="password" value={passwords.confirm} onChange={setPw('confirm')} placeholder=" " autoComplete="new-password" />
                    <label htmlFor="pw-confirm">Confirm new password</label>
                  </div>
                  {pwErrors.confirm && <p className="text-xs text-expense font-dm-sans flex items-center gap-1"><AlertCircle size={11} strokeWidth={1.5} />{pwErrors.confirm}</p>}
                </div>
                <button
                  type="submit"
                  disabled={savingPw}
                  className="self-start px-5 py-2.5 bg-accent-indigo hover:bg-accent-indigo-dim text-white text-sm font-dm-sans rounded-xl btn-press transition-colors duration-150 disabled:opacity-60"
                >
                  {savingPw ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </SectionCard>

            {/* Danger zone */}
            <div className="bg-bg-surface border border-expense/20 rounded-2xl">
              <div className="px-6 py-4 border-b border-expense/20">
                <h3 className="font-syne font-semibold text-expense/80 text-base">Danger Zone</h3>
              </div>
              <div className="p-6">
                {!showDelete ? (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-dm-sans text-sm text-warm-200 font-medium">Delete Account</p>
                      <p className="font-dm-sans text-xs text-warm-500 mt-0.5">Permanently delete your account and all associated data.</p>
                    </div>
                    <button
                      onClick={() => setShowDelete(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-expense border border-expense/30 rounded-xl hover:bg-expense/10 transition-colors duration-150 btn-press font-dm-sans flex-shrink-0"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                      Delete Account
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 animate-fade-up">
                    <p className="font-dm-sans text-sm text-warm-300">
                      This action is <strong>irreversible</strong>. All transactions and your profile will be permanently deleted.
                    </p>
                    <p className="font-dm-sans text-xs text-warm-400">Type <code className="bg-bg-elevated px-1.5 py-0.5 rounded text-expense font-dm-mono">DELETE</code> to confirm:</p>
                    <input
                      type="text"
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      placeholder="Type DELETE"
                      className="bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-warm-100 font-dm-mono outline-none focus:border-expense transition-colors duration-200"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => { setShowDelete(false); setDeleteInput(''); }}
                        className="flex-1 py-2.5 rounded-xl border border-border-subtle text-warm-400 text-sm font-dm-sans hover:text-warm-200 transition-colors duration-150 btn-press"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleteInput !== 'DELETE' || deleting}
                        className="flex-1 py-2.5 rounded-xl bg-expense/20 border border-expense/30 text-expense text-sm font-dm-sans hover:bg-expense/30 transition-colors duration-150 btn-press disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {deleting ? 'Deleting…' : 'Confirm Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
