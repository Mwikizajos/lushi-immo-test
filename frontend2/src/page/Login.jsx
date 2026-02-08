import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://lushi-backend.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // On stocke l'admin
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        // Redirection vers le dashboard
        navigate("/dashboard");
        // On force un rafraîchissement pour que la Navbar mette à jour les liens
        window.location.reload(); 
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
           <h2>Artemis<span> Project</span></h2>
           <p className="subtitle">Administration</p>
        </div>

        {error && <div className="error-message">{error} </div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Professionnel</label>
            <input 
              type="email" 
              placeholder="votre adresse mail professionel ici " 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-submit">
            Se connecter au Dashboard
          </button>
        </form>
        <p className="help-text">Mot de passe oublié ? Contactez le support technique.</p>
      </div>
    </div>
  );
}

export default Login;