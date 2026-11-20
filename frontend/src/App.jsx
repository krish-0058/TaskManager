import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Tasks from './Tasks';
import { useEffect, useState } from 'react';
import { supabase } from './supabase-client';
import EmailVerified from './EmailVerified';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {data: { subscription }} = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return
      } else {
        setSession(data.session);
      }

      setLoading(false);
    };

    fetchSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  


  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-zinc-400 text-3xl">
        Loading...
      </div>
    );
  }

  

  return (
    <BrowserRouter>
      <Routes>
         <Route
          path="/email-verified"
          element={<EmailVerified/>}
        />
        
        <Route
          path="/auth"
          element={session ? <Navigate to="/tasks" replace /> : <Auth />}
        />

        <Route
          path="/tasks"
          element={session ? <Tasks /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/forgot-password"
          element={
            session
              ? <Navigate to="/tasks" replace />
              : <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="*"
          element={<Navigate to={session ? "/tasks" : "/auth"} replace />}
        />
        
       
      </Routes>
    </BrowserRouter>
  );
}