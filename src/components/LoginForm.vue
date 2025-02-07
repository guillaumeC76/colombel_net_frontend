<template>
  <div class="formulaire">
    <h1>Connexion</h1>
    <form @submit.prevent="submitForm">
      <input
        type="text"
        id="username"
        v-model="username"
        placeholder="Nom d'utilisateur"
        required
      />
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Se connecter</button>
      <h4>
        Vous n'avez pas de compte ?
        <router-link to="/register">Inscrivez-vous ici !</router-link>
      </h4>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginForm",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: null,
    };
  },
  methods: {
    ...mapActions(["login"]),
    async submitForm() {
      try {
        await this.login({ username: this.username, password: this.password });
        this.$router.push("/game"); // Redirige après connexion
      } catch (error) {
        this.errorMessage = "Connexion échouée. Vérifiez vos identifiants.";
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 0.9em;
}
</style>
