import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Colonne 1 : Logo et Description */ }
        <div className="footer-column" >
          <h2 className="footer-logo">Artemis<span> Project</span></h2>
          <p className="footer-desc">
            L'agence immobilière de référence à Lubumbashi. Nous vous accompagnons 
            dans la recherche de votre confort au cœur de la ville de cuivre.
          </p>
        </div>

        {/* Colonne 2 : Liens Rapides */ }
        <div className="footer-column">
          <h3>Liens Rapides</h3>
          <ul>
            <li><Link to="/Accueil">Accueil</Link></li>
            <li><Link to="/Appartements">Appartements</Link></li>
            <li><Link to="/immeubles">Immeubles</Link></li>
            <li><Link to="/According">À propos</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Contact */}
        <div className="footer-column">
          <h3>Contactez-nous</h3>
          <p>📍 Av. Kabalo Lubumbashi, RDC</p>
          <p>📞 +243 975 477 341</p>
          <p>📧 artemisprojectdrc@gmail.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear() Lushi Immobilier. Tous droits réservés. </p>
      </div>
    </footer>
  );
};


export default Footer;
