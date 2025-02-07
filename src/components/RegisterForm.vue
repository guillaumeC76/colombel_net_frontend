<template>
  <div class="formulaire">
    <h1>Inscription</h1>
    <form @submit.prevent="submitForm">
      <input
        type="text"
        v-model="username"
        placeholder="Nom d'utilisateur"
        minlength="1"
        maxlength="30"
        required
      />
      <p v-if="erreurCaracterePseudo" class="error">
        Le pseudo doit contenir entre 1 et 30 caractères.
      </p>
      <input
        type="email"
        maxlength="60"
        v-model="email"
        placeholder="Email"
        required
      />
      <p v-if="erreurCaractereEmail" class="error">
        L'email ne doit pas dépasser 60 caractères.
      </p>
      <input
        type="password"
        v-model="password"
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Créer un compte</button>
      <p>
        Vous avez déjà un compte ?
        <router-link to="/login">Connectez-vous ici !</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import apiClient from "@/services/axios.js";

export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      errorMessage: null,
      erreurCaracterePseudo: false,
      erreurCaractereEmail: false,
    };
  },

  methods: {
    async submitForm() {
      if (this.username < 1) {
        this.erreurCaracterePseudo = true;
      } else if (this.email > 60) {
        this.erreurCaractereEmail = true;
      } else {
        try {
          await apiClient.post("/auth/signup", {
            username: this.username,
            email: this.email,
            password: this.password,
          });

          this.errorMessage = null;
          this.username = "";
          this.email = "";
          this.password = "";
          this.$router.push("/login"); // Redirige après connexion
        } catch (error) {
          this.errorMessage =
            error.response?.data?.message ||
            "Une erreur s'est produite lors de l'inscription.";
          this.successMessage = null;
        }
      }
    },
  },
};
</script>
