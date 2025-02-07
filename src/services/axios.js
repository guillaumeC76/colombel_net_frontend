import axios from "axios";
const API_URL = process.env.VUE_APP_API_URL;
//console.log(API_URL);

const apiClient = axios.create({
  baseURL: API_URL, // Base URL pour toutes les requêtes
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pour ajouter le token JWT à chaque requête
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Récupère le token stocké
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Ajoute le token dans l'en-tête
  }
  return config;
});

export default apiClient;
