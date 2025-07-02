

import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { startBanRuleTimer } from './services/banRuleService'; 
import './assets/test.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css'; 
const app = createApp(App);

app.use(PrimeVue);

startBanRuleTimer();

app.mount('#app');
