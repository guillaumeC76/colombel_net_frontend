<template>
  <div id="app">
    <header>
      <div class="link">
        <div class="logo">
          <img src="@/assets/img/logo_colombel.png" alt="" />
        </div>
        <router-link to="/">Accueill</router-link>
        <router-link to="/game">Jouer</router-link>
        <router-link to="/classement">Classement</router-link>
        <div class="circle"></div>
      </div>

      <div class="login_menu">
        <template v-if="!isAuthenticated">
          <router-link to="/login">Inscription / Connexion</router-link>
        </template>

        <template v-else>
          <router-link to="/profile">Mon compte</router-link>
          <button @click="deconnexion()">Déconnexion</button>
        </template>
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    ...mapActions(["logout"]),
    deconnexion() {
      this.logout();
      this.$router.push("/"); // Redirige après connexion
    },
  },
};
</script>
