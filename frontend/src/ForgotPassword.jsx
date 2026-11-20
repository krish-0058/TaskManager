
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, LockKeyhole, CheckCircle2 } from "lucide-react";
import { supabase } from "./supabase-client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md bg-[#1a1a1a] border border-zinc-800 rounded-2xl p-7 sm:p-9 shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">

          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">
            <LockKeyhole size={30} className="text-orange-500" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Forgot Password?
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed">
            No worries! Enter your registered email address
            and we'll send you a password reset link.
          </p>

        </div>

        {success ? (

          /* Success Message */
          <div className="text-center">

            <CheckCircle2
              size={48}
              className="text-green-500 mx-auto mb-4"
            />

            <h2 className="text-white text-lg font-semibold mb-2">
              Check Your Email
            </h2>

            <p className="text-zinc-400 text-sm leading-relaxed mb-7">
              If an account exists with this email, you'll
              receive a password reset link shortly.
            </p>

            <Link
              to="/auth"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Back to Sign In
            </Link>

          </div>

        ) : (

          /* Email Form */
          <form onSubmit={handleSubmit}>

            <label className="block text-sm text-zinc-300 mb-2">
              Email Address
            </label>

            <div className="relative mb-5">

              <Mail
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-[#111111] border border-zinc-700 text-white placeholder-zinc-600 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-orange-500 transition"
              />

            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 text-zinc-400 hover:text-orange-500 text-sm mt-6 transition"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>

          </form>

        )}

      </div>
    </div>
  );
}
