import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "./sideBar.css";

export default function Sidebar({ isOpen, closeSidebar, dark }) {
  const navigate = useNavigate();

  // Effet pour ajouter/enlever le flou sur le body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    // Nettoyage quand le composant est démonté
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Découvrir", path: "/discover" },
    { label: "Galerie", path: "/gallery" },
    { label: "À propos", path: "/about" }
  ];

  const theme = dark ? "dark" : "light";

  if (!isOpen) return null;

  return (
    <>
      <div className="sidebar-overlay" onClick={closeSidebar} />

      <aside className={`sidebar ${theme}`}>
        <div className="sidebar-grad-top" />
        <div className="sidebar-nav">
          <p className={`sidebar-section-label ${theme}`}>Menu</p>
          {navLinks.map((item, i) => (
            <a
              key={item.label}
              href={item.path}
              className={`sidebar-link ${theme} anim-fade-up-${Math.min(i + 1, 5)}`}
              onClick={(e) => {
                e.preventDefault();
                closeSidebar();
                navigate(item.path);
              }}
            >
              <span className="sidebar-link-dot" />
              {item.label}
            </a>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className={`sidebar-footer-card ${theme}`}>
            <p className={`sidebar-footer-title ${theme}`}>✦ Thème {dark ? "sombre" : "clair"}</p>
            <p className={`sidebar-footer-sub ${theme}`}>Icône lune / soleil en haut à droite</p>
          </div>
        </div>
      </aside>
    </>
  );
}