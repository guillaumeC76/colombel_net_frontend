import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

import Home from "../views/HomeView.vue";
import Game from "../views/GameView.vue";
import Leaderboard from "../views/LeaderBoardView.vue";
import UserProfile from "../components/UserProfile.vue";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/game", name: "Game", component: Game },
  { path: "/classement", name: "Leaderboard", component: Leaderboard },
  { path: "/login", name: "LoginForm", component: LoginForm },
  { path: "/register", name: "RegisterForm", component: RegisterForm },
  {
    path: "/profile",
    name: "Profile",
    component: UserProfile,
    meta: { requiresAuth: true }, // Indique que cette route nécessite une authentification
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navigation
router.beforeEach((to, from, next) => {
  // Vérifie si la route nécessite une authentification
  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    // Redirige l'utilisateur vers la page de connexion s'il n'est pas connecté
    next({ name: "LoginForm" });
  } else {
    next(); // Continue vers la route demandée
  }
});

export default router;
