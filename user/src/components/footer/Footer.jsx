import React from 'react';
import './footer.css';
import '@fontsource/roboto';
import '@fontsource/saira-stencil-one';
import { FaFacebookF,  FaWhatsapp, FaTiktok} from 'react-icons/fa';


export default function Footer() {


    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <h1 className="logoName">K-MyStore</h1>
                    <p>Contactez-nous via nos réseaux sociaux</p>
                    <div className="footer-socials">
                        <a href="https://www.facebook.com/profile.php?id=61572360761611" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className="social-icon" />
                        </a>
                        <a href="https://wa.me/237693800251" target="_blank" rel="noopener noreferrer">
    <FaWhatsapp />
  </a>
  <a href="https://www.tiktok.com/@mrlandry184?_t=ZM-8xe2toNJQU2&_r=1" target="_blank" rel="noopener noreferrer">
    <FaTiktok />
  </a>
                    </div>


                </div>

                <div className="footer-section">
                    <h2>Company</h2>
                    <ul>
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/about"> À propos de nous</a></li>
                        <li><a href="/privacy">Politique de confidentialité</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h2>Contactez-nous</h2>
                    <ul>
                        <li><a href="tel:+237693800251">+237 693 800 251</a></li>
                        <li><a href="mailto:yvanlandry4000@gmail.com">yvanlandry4000@gmail.com</a></li>
                    </ul>
                </div>

            </div>

            <hr />

            <p className="footer-copyright">
                &copy; 2024 K-MyStore.com — All Rights Reserved.
            </p>
        </footer>
    );
}
