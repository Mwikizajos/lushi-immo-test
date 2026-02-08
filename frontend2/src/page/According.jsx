import React from 'react';
import './According.css';

function APropos() {
  return (
    <div className="about-container">
      {/* HEADER SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="subtitle">L'immobilier réinventé</span>
          <h1>Bâtir une relation de <span className="text-yellow">confiance</span> à Lubumbashi</h1>
        </div>
      </section>

      {/* NOTRE HISTOIRE & VISION */}
      <section className="about-main">
        <div className="about-grid">
          <div className="about-image-side">
            <img src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=800" alt="Bureau Lushi" />
            <div className="experience-badge">
              <span className="years">Lushi</span>
              <span className="exp-text">Immobilier</span>
            </div>
          </div>
          
          <div className="about-text-side">
            <h2 className="section-title-blue">Notre Vision</h2>
            <p>
              Fondée au cœur de la ville de cuivre, <strong>Lushi Immobilier</strong> est bien plus qu'une simple plateforme 
              de location. Nous sommes la réponse au besoin de transparence et de modernité dans le secteur 
              immobilier du Haut-Katanga.
            </p>
            <p>
              Notre mission est de digitaliser l'accès aux logements à Lubumbashi, permettant ainsi aux 
              Lushois et aux expatriés de trouver leur futur chez-soi en quelques clics, sans les 
              complications des intermédiaires traditionnels.
            </p>
            
            <div className="values-list">
              <div className="value-item">
                <span className="icon">✔</span>
                <div>
                  <h4>Transparence Totale</h4>
                  <p>Pas de frais cachés, les prix affichés sont les prix réels du marché.</p>
                </div>
              </div>
              <div className="value-item">
                <span className="icon">✔</span>
                <div>
                  <h4>Sécurité</h4>
                  <p>Tous les immeubles et appartements sont vérifiés par notre équipe.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLÉS (POUR LE BOSS) */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>500+</h3>
          <p>Logements Disponibles</p>
        </div>
        <div className="stat-card">
          <h3>24/7</h3>
          <p>Support Client</p>
        </div>
        <div className="stat-card">
          <h3>100%</h3>
          <p>Digitalisé</p>
        </div>
      </section>
    </div>
  );
}

export default APropos;