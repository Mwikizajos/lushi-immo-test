import axios from 'axios';

// L'adresse de ton backend sur Render (récupérée de ta capture d'écran)
const RENDER_URL = 'https://lushi-backend.onrender.com';

// 1. Configuration Axios
const api = axios.create({
    baseURL: `${RENDER_URL}/api`, 
});

// 2. Configuration Fetch (apiFetch)
export const apiFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");

  // On ajoute l'URL de Render devant /api
  return fetch(`${RENDER_URL}/api${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

export default api;