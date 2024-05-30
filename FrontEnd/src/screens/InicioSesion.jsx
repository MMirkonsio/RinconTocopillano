import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar2 from "../components/Navbar2";
import { UserAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import supabase from "../supabase/supabase.config"
import AnimatedGradientText from "../components/magicui/animated-shiny-text";
import { cn } from "../components/magicui/lib/utils";

const InicioSesion = () => {
  const { handleSignInWithGoogle, signInWithFacebook, setUser } = UserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const handleInicioSesion = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorText("Credenciales inválidas. Verifica tu email y contraseña.");
        return;
      }

      if (data.user) {
        setUser(data.user);
        navigate("/inicio");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorText(
        "Ha ocurrido un error. Por favor, intenta nuevamente más tarde."
      );
    }
  };

  const handleSignInWithGoogleClick = async () => {
    try {
      await handleSignInWithGoogle();
    } catch (error) {
      setErrorText(
        "Error al iniciar sesión con Google. Por favor, intenta nuevamente."
      );
    }
  };

  const handleSignInWithFacebookClick = async () => {
    try {
      await signInWithFacebook();
    } catch (error) {
      setErrorText(
        "Error al iniciar sesión con Facebook. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[100dvh] bg-gray-100 dark:bg-rincon">
      <Navbar2 />
      <div className="w-full max-w-[500px] p-4 bg-gray-100 lg:border lg:border-gray-300 rounded-lg sm:p-6 md:p-8 dark:bg-rincon dark:border-gray-700">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleInicioSesion();
          }}
          className="mt-8 dark:text-gray-100 text-rincon"
        >
          <AnimatedGradientText>
            <span
              className={cn(
                `text-5xl text-center mb-6 inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              Bienvenido al Rincon Tocopillano!
            </span>
          </AnimatedGradientText>

          <button
            onClick={handleSignInWithGoogleClick}
            className="flex mb-3 gap-2 items-center justify-center font-semibold rounded-lg text-gray-100 bg-rincon hover:bg-rinconHover dark:hover:bg-gray-200 dark:text-rincon dark:bg-gray-100 w-full p-3"
          >
            <FcGoogle style={{ fontSize: "1.5rem" }} />
            Iniciar con Google
          </button>
          <button
            onClick={handleSignInWithFacebookClick}
            className="flex gap-2 items-center justify-center font-semibold rounded-lg text-gray-100 bg-rincon hover:bg-rinconHover dark:hover:bg-gray-200 dark:text-rincon dark:bg-gray-100 w-full p-3"
          >
            <FaFacebook style={{ fontSize: "1.5rem" }} />
            Iniciar con Facebook
          </button>
        </form>
      </div>
    </div>
  );
};

export default InicioSesion;
