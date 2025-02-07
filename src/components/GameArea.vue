<template>
  <div class="game">
    <div
      class="game_area"
      ref="gameArea"
      @mousemove="trackMouse()"
      @click="handleMissClick"
    >
      <div
        class="circle"
        :style="{
          top: `${y}px`,
          left: `${x}px`,
          width: `${size}px`,
          height: `${size}px`,
        }"
        @click="handleClick"
      ></div>
    </div>

    <div class="score_et_timer">
      <div class="score_affichage">
        <div class="affichage">
          <p>Score</p>
          <p class="data_affichage">{{ score }}</p>
        </div>

        <div class="affichage">
          <p>Timer</p>
          <p class="data_affichage">{{ timer }} s</p>
        </div>

         <div class="affichage">
          <p>Précision</p>
          <p class="data_affichage">{{ getAccuracy() }}%</p>
        </div>
      </div>

      <div class="ligne"></div>

      <div class="scoreboard">
        <p>Mes derniers scores :</p>
        <table>
          <thead>
            <tr>
              <th>Top 10</th>
              <th>Score</th>
              <th>Précision</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(score, index) in scores" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ score.value }}</td>
              <td>{{ getAccuracyAPI(score) }}%</td>
              <td>{{ formatDate(score.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="isAuthenticatedScore" v-if="!isAuthenticated">
        <p>Veuillez vous connecter pour afficher le score.</p>
        <router-link to="/login">Se connecter</router-link>
      </div>

      <button @click="retryGame()">Rédémarrer la partie</button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    const chrono = Number(process.env.VUE_APP_CHRONO)

    return {
      x: 0,
      y: 0,
      size: 50,
      score: 0,
      timer: chrono, // Temps initial
      initialTimer: chrono,
      intervalId: null,
      timerStarted: false,
      lastClickTime: 0,
      mouseMoved: false,
      clicksMissed: 0,
    };
  },

  computed: {
    ...mapGetters(["getScores"]),
    scores() {
      return this.getScores;
      
    },
    ...mapGetters(["isAuthenticated"]),
  },

  setup() {
    const gameArea = ref(null); // Référence à la zone de jeu
    return { gameArea };
  },

  methods: {
    ...mapActions(["addScore"]),
    ...mapActions(["fetchScores"]),

    trackMouse() {
      this.mouseMoved = true; // Détecte si la souris a bougé
    },

    randomPosition() {
      const maxWidth = this.gameArea.clientWidth - this.size;
      const maxHeight = this.gameArea.clientHeight - this.size;

      // Générer des positions aléatoires
      this.size = Math.floor(Math.random() * (50 - 15 + 1)) + 15; // Taille aléatoire entre 15 et 50px
      this.x = Math.random() * maxWidth;
      this.y = Math.random() * maxHeight;
    },

    handleClick() {
      const now = Date.now();
      const timeSinceLastClick = now - this.lastClickTime;

      // Vérification anti-bot
      if (timeSinceLastClick < 400 || !this.mouseMoved) {
        alert(`Interdit de tricher !!!`);
        return; // Bloque les clics trop rapides
      }

      this.lastClickTime = now;
      this.mouseMoved = false; // Réinitialise la détection de mouvement

      if (this.timer > 0) {
        this.score++;
        this.randomPosition(); // Génère une nouvelle position

        if (!this.timerStarted) {
          this.timerStarted = true;
          this.startGame();
        }
      } else {
        alert(`Temps écoulé ! Il faut redémarrer la partie`);
      }
    },

    handleMissClick(event) {
      if (!event.target.classList.contains("circle")) {
        this.clicksMissed++;
      }
    },

    startGame() {
      this.intervalId = setInterval(() => {
        this.timer--;
        if (this.timer <= 0) {
          clearInterval(this.intervalId);
          alert(
            `Temps écoulé ! Votre score est de : ${this.score} et votre précision de : ${this.getAccuracy()}%`
          );
          this.addScore({ score: this.score, missedClicks: this.clicksMissed }); // Enregistre le score via Vuex
        }
      }, 1000);
    },

    retryGame() {
      clearInterval(this.intervalId); // Arrête le chrono avant de redémarrer
      this.timer = this.initialTimer;
      this.timerStarted = false;
      this.score = 0;
      this.clicksMissed = 0;
      this.randomPosition();
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    getAccuracy() {
      const totalClicks = this.score + this.clicksMissed;
      return totalClicks === 0 ? 100 : ((this.score / totalClicks) * 100).toFixed(2);
    },

    getAccuracyAPI(score) {
      const totalClicks = score.value + score.missedClicks;
      return totalClicks === 0 ? "100.00" : ((score.value / totalClicks) * 100).toFixed(2);
    }
  },

  mounted() {
    this.randomPosition(); // Appelé après le montage
    this.fetchScores(); // Charge les scores dès le montage
  },
};
</script>
