
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

// Define a fake artist account
const FAKE_ARTIST = {
  id: "fake-artist-id",
  email: "artist@247.art",
  role: "artist",
  user_metadata: {
    username: "Artist"
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      // Check if we're using a demo session from localStorage
      const demoSession = localStorage.getItem('demoSession');
      if (demoSession === 'active') {
        setUser(FAKE_ARTIST as unknown as User);
        setIsLoading(false);
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching session:", error.message);
      }

      if (session) {
        setSession(session);
        setUser(session.user);
      }

      setIsLoading(false);
    }

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Skip state update if we're in demo mode
      if (localStorage.getItem('demoSession') === 'active') return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Add a function to handle fake login
  const handleFakeLogin = (username: string, password: string): boolean => {
    if (username === "Artist" && password === "247") {
      localStorage.setItem('demoSession', 'active');
      setUser(FAKE_ARTIST as unknown as User);
      return true;
    }
    return false;
  };

  // Add a function to handle fake logout
  const handleFakeLogout = () => {
    if (localStorage.getItem('demoSession') === 'active') {
      localStorage.removeItem('demoSession');
      setUser(null);
      return true;
    }
    return false;
  };

  return { 
    user, 
    session, 
    isLoading, 
    handleFakeLogin, 
    handleFakeLogout 
  };
}
