import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import pour la navigation

const GoogleLoginButton = () => {
  const navigate = useNavigate(); // 👈 Hook pour naviguer

  useEffect(() => {
    // Vérifie si le token est présent dans l'URL après redirection
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      console.log("JWT reçu :", token);
      // Stocke le token dans le localStorage
      localStorage.setItem("jwtToken", token);

      // Nettoyer l'URL après récupération
      window.history.replaceState({}, document.title, "/");

      // 👈 Redirection vers une autre page après connexion
      navigate("/dashboard"); // Remplace "/dashboard" par la page que tu veux
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    // Redirige vers le backend pour lancer Google OAuth
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
