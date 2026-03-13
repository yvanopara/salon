import React from "react";

export default function Home({ dark }) {
  return (
    <div className={`home-wrapper ${dark ? "dark" : "light"}`}>
      <h1>Bienvenue sur Home</h1>
      <p>Le dark mode fonctionne ici !</p>
    </div>
  );
}