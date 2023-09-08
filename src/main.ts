import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import './assets/main.css';

declare global {
  interface Window {
    CLIENT_API_BASE_URL: string;
    GOOGLE_API_KEY: string;
    GOOGLE_REQUEST_ADDRESS: string;
  }
}

window.CLIENT_API_BASE_URL = 'https://api.takemewith.pl/';
window.GOOGLE_API_KEY = 'AIzaSyBuAnkK8OiFeUqIHNDMXglOLN6OWJhxy74';
window.GOOGLE_REQUEST_ADDRESS = 'YOUR_GOOGLE_REQUEST_ADDRESS';

const app = createApp(App);

app.use(router);

app.mount('#app');
