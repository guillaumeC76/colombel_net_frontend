<template>
  <div class="formulaire_compte">
    <h1>Mon Compte</h1>
    <h2>Modifier mes informations</h2>
    <form @submit.prevent="updateProfile">
      <div>
        <label for="username">Modifier votre nom d'utilisateur</label>
        <input
          type="text"
          id="username"
          v-model="username"
          minlength="1"
          maxlength="30"
          placeholder="Nouveau nom d'utilisateur"
        />
      </div>
      <div>
        <label for="email">Modifier votre email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          maxlength="60"
          placeholder="Nouvel email"
        />
      </div>
      <div>
        <label for="password">Nouveau mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Nouveau mot de passe"
        />
      </div>
      <div>
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirmer le nouveau mot de passe"
        />
      </div>
      <button type="submit">Mettre à jour</button>
    </form>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import apiClient from "@/services/axios";
import { mapGetters } from "vuex";

export default {
  name: "UserProfile",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      successMessage: null,
      errorMessage: null,
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
  },

  watch: {
    // Observe les changements dans le getter getUser
    getUser: {
      immediate: true, // Exécute immédiatement au montage
      handler(newUser) {
        if (newUser) {
          this.username = newUser.username || "";
          this.email = newUser.email || "";
        }
      },
    },
  },

  methods: {
    async updateProfile() {
      // Validation locale des champs
      if (this.password && this.password !== this.confirmPassword) {
        this.errorMessage = "Les mots de passe ne correspondent pas.";
        return;
      }

      try {
        const response = await apiClient.put("/auth/update", {
          username: this.username,
          email: this.email,
          password: this.password || undefined, // N'envoie pas le champ si vide
          confirmPassword: this.confirmPassword || undefined, // Idem
        });

        // Mise à jour réussie
        this.successMessage =
          response.data.message || "Profil mis à jour avec succès.";
        this.errorMessage = null;

        // Mettez à jour localement l'utilisateur connecté dans le store Vuex
        this.$store.commit("SET_USER", response.data.user);

        // Nettoie les champs mot de passe
        this.password = "";
        this.confirmPassword = "";
      } catch (error) {
        // Gestion des erreurs
        this.successMessage = null;
        this.errorMessage =
          error.response?.data?.message ||
          "Erreur lors de la mise à jour. Veuillez réessayer.";
      }
    },
  },
};
</script>
