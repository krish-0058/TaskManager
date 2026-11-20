
import { useEffect, useState } from 'react';
import {
  Check,
  LockKeyhole,
  Mail,
  User,
  ArrowRight,
} from 'lucide-react';
import { supabase } from './supabase-client';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(error)
      }
    };

    signOut();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignup && !name.trim()) {
      setError('Name is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
            emailRedirectTo: `${window.location.origin}/email-verified`,
          },
        });

        if (error) {
          setError(error.message);
          return;
        }

        setEmailSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        navigate('/tasks');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#141414] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#191919] border border-zinc-800 rounded-xl p-8 text-center">

          <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-orange-500/10 flex items-center justify-center">
            <Mail className="w-7 h-7 text-orange-400" />
          </div>

          <h1 className="text-2xl font-bold mb-3">
            Check your email
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed mb-2">
            We've sent a confirmation link to:
          </p>

          <p className="text-orange-400 font-medium mb-5">
            {email}
          </p>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Please open your email and click the confirmation link to verify your account.
            After verification, you'll be redirected to the login page.
          </p>

          <button
            onClick={() => {
              setEmailSent(false);
              setIsSignup(false);
            }}
            className="w-full mt-7 bg-[#292929] hover:bg-[#353535] border border-zinc-700 py-3 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Back to Sign In
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-zinc-100 flex items-center justify-center p-4 font-sans">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-[#242424] border border-zinc-700/70 flex items-center justify-center">
            <Check className="w-6 h-6 text-zinc-100" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome <span className="text-orange-500">Users</span>
          </h1>

          <p className="text-zinc-500 text-sm mt-2">
            {isSignup
              ? 'Create your account and start organizing your tasks.'
              : 'Sign in to continue managing your tasks.'}
          </p>

        </div>

        {/* Form Card */}
        <div className="bg-[#191919] border border-zinc-800/80 rounded-xl p-6 sm:p-8 shadow-xl">

          {/* Tabs */}
          <div className="grid grid-cols-2 bg-[#141414] border border-zinc-800 rounded-lg p-1 mb-7">

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsSignup(false);
                setError('');
              }}
              className={`py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                !isSignup
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setIsSignup(true);
                setError('');
              }}
              className={`py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isSignup
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Sign Up
            </button>

          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            {isSignup && (
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="w-full bg-[#1e1e1e] border border-zinc-700/70 rounded-md pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs text-zinc-400 mb-2 block">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#1e1e1e] border border-zinc-700/70 rounded-md pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-zinc-400 mb-2 block">
                Password
              </label>

              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#1e1e1e] border border-zinc-700/70 rounded-md pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-950/40 border border-red-800/60 text-red-300 text-xs py-2.5 px-3 rounded-md text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md text-sm transition-all mt-2 cursor-pointer"
            >
              {loading ? (
                isSignup ? 'Creating account...' : 'Signing in...'
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-zinc-800 text-center">

            {!isSignup && (
              <div className="flex justify-center items-center gap-1.5 mb-5 text-xs text-zinc-500">
                <span>Forgot your password?</span>

                <Link
                  to="/forgot-password"
                  className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
                >
                  Reset Password
                </Link>
              </div>
            )}

            <p className="text-sm text-zinc-500">
              {isSignup
                ? 'Already have an account?'
                : "Don't have an account?"}

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="text-zinc-200 hover:text-white font-medium ml-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

           

          </div>

        </div>

        

        <p className="text-center text-xs text-zinc-600 mt-7">
          Task Manager · Keep things organized.
        </p>

      </div>
    </div>
  );
}
