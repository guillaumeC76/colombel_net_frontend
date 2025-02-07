<template>
  <div class="scoreboard_general">
    <h1>Classement Général</h1>
    <table>
      <thead>
        <tr>
          <th>Top 25</th>
          <th>Nom d'utilisateur</th>
          <th>Score</th>
          <th>Précision</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in leaderboard" :key="entry._id">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.user || "Inconnu" }}</td>
          <td>{{ entry.bestScore }}</td>
          <td>{{ getAccuracyAPI(entry) }}%</td>
          <td>{{ formatDate(entry.bestScoreDate) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import apiClient from "@/services/axios";

export default {
  name: "LeaderboardView",
  data() {
    return {
      leaderboard: [], // Stocke les données du classement
    };
  },
  methods: {
    async fetchLeaderboard() {
      try {
        const response = await apiClient.get("/scores/leaderboard");
        this.leaderboard = response.data; // Met à jour le tableau du classement
        console.log(this.leaderboard);
      } catch (error) {
        console.error("Erreur lors de la récupération du classement :", error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString();
    },

    getAccuracyAPI(score) {
      const totalClicks = score.bestScore + score.missedClicks;
      return totalClicks === 0
        ? "100.00"
        : ((score.bestScore / totalClicks) * 100).toFixed(2);
    },
  },
  mounted() {
    this.fetchLeaderboard(); // Charge les données dès le montage du composant
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
