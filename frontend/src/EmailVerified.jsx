import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase-client";

function EmailVerified() {
    const navigate = useNavigate();
    const [verified, setVerified] = useState(false);


  useEffect(() => {
    const finishVerification = async () => {

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user?.email_confirmed_at) {
        navigate("/auth", { replace: true });
        return;
      } 

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        return;
      }

      setVerified(true);
    };

    finishVerification();
  }, []);



   if (!verified) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-zinc-400 text-3xl">
        Verifying email...
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1c1c1c] border border-[#333] rounded-2xl p-8 text-center shadow-xl">

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/10 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Email Verified!
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          Your email was successfully verified.
          You can now sign in to your account.
        </p>

        <button
          onClick={() => navigate("/auth", { replace: true })}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-md text-sm transition-all mt-2 cursor-pointer"
        >
          Continue to Sign In
        </button>

      </div>
    </div>
  );
}

export default EmailVerified;