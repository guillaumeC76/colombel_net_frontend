import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/css/style.scss';
import './assets/css/reset.css';

const app = createApp(App);

app.use(router);
app.use(store);

// Recharge les informations utilisateur si un token est présent
store.dispatch("fetchUser");

app.mount('#app');
