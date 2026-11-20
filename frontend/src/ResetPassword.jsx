
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { supabase } from "./supabase-client";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Password updated successfully
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError("Password changed, but signing out failed. Please sign in again.");
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
            Reset Password
          </h1>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Create a new password for your account.
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
              Password Updated!
            </h2>

            <p className="text-zinc-400 text-sm mb-7">
              Your password has been changed successfully.
              You can now sign in with your new password.
            </p>

            <button
              onClick={() => navigate("/auth", { replace: true })}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
            >
              Continue to Sign In
            </button>

          </div>

        ) : (

          /* Reset Password Form */
          <form onSubmit={handleSubmit}>

            {/* New Password */}
            <label className="block text-sm text-zinc-300 mb-2">
              New Password
            </label>

            <div className="relative mb-5">

              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full bg-[#111111] border border-zinc-700 text-white placeholder-zinc-600 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-orange-500 transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>

            </div>

            {/* Confirm Password */}
            <label className="block text-sm text-zinc-300 mb-2">
              Confirm New Password
            </label>

            <div className="relative mb-5">

              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full bg-[#111111] border border-zinc-700 text-white placeholder-zinc-600 rounded-xl py-3 pl-12 pr-12 outline-none focus:border-orange-500 transition"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>

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
              {loading ? "Updating Password..." : "Update Password"}
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
