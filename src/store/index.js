import { createStore } from "vuex";
import apiClient from "@/services/axios.js"; // Instance Axios

const store = createStore({
  state: {
    token: localStorage.getItem("token") || null, // Charge le token s'il existe
    user: null, // Stocke les informations utilisateur (si nécessaire)
    scores: [], // Stocke les scores de l'utilisateur
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token); // Sauvegarde le token
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_SCORES(state, scores) {
      state.scores = scores; // Met à jour les scores
    },
    CLEAR_AUTH(state) {
      state.token = null;
      state.user = null;
      state.scores = [];
      localStorage.removeItem("token"); // Supprime le token
    },
  },

  actions: {
    async login({ commit }, { username, password }) {
      try {
        const response = await apiClient.post("/auth/login", {
          username,
          password,
        });
        const { token, user } = response.data;
        commit("SET_TOKEN", token); // Stocke le token
        commit("SET_USER", user); // Stocke l'utilisateur (si nécessaire)
        return true;
      } catch (error) {
        console.error(
          "Erreur lors de la connexion :",
          error.response?.data?.message
        );
        throw error;
      }
    },

    async fetchUser({ commit }) {
      try {
        const token = localStorage.getItem("token"); // Récupère le token depuis le localStorage
        if (!token) return;

        // Récupère les informations utilisateur en se basant sur le token
        const response = await apiClient.get("/auth/me");
        commit("SET_USER", response.data.user);
      } catch (error) {
        console.error(
          "Erreur lors du rechargement des informations utilisateur :",
          error
        );
        commit("CLEAR_AUTH"); // Nettoie les données si le token est invalide
      }
    },

    logout({ commit }) {
      commit("CLEAR_AUTH"); // Réinitialise les données d'authentification
    },

    async fetchScores({ commit }) {
      try {
        const response = await apiClient.get("/scores/user");
        commit("SET_SCORES", response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des scores :", error);
      }
    },

    async addScore({ dispatch }, {score, missedClicks}) {
      try {
        console.log(score, missedClicks)
        await apiClient.post("/scores/add", { value: score, missedClicks: missedClicks });
        dispatch("fetchScores"); // Recharge les scores après ajout
      } catch (error) {
        console.error("Erreur lors de l'ajout du score :", error);
      }
    },
  },

  getters: {
    isAuthenticated(state) {
      return !!state.token; // Vérifie si un token est présent
    },
    getUser(state) {
      return state.user; // Retourne les informations utilisateur
    },
    getScores(state) {
      return state.scores;
    },
  },
});

export default store;
