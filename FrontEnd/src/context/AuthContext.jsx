import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../supabase/supabase.config"
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  async function handleSignInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.log("Error durante el inicio con Google:", error.message);
    }
  }

  async function signInWithFacebook() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.log("Error durante el inicio con Facebook:", error.message);
    }
  }

async function handleSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error);
    } else {
      setUser(null);
      navigate("/login", { replace: true });
    }
  } catch (error) {
    console.error("Error during sign out:", error.message);
  }
}


  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(session);
        if (session == null) {
          setUser(null);
          navigate("/login", { replace: true });
        } else {
          setUser(session.user);
          navigate("/", { replace: true });
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, handleSignInWithGoogle, signInWithFacebook, handleSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
