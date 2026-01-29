/**
 * Entry point for the Admin Panel demo
 *
 * This file initializes the Vue app in demo mode with static data.
 * For production use, remove the enableDemoMode() call to use real API endpoints.
 */

import { createApp } from 'vue';
import AdminPanel from './admin/AdminPanel.vue';
import api from './src/api.js';

// Enable demo mode - uses static TSV files instead of live API
api.enableDemoMode('data/');

// Create and mount the Vue app
const app = createApp(AdminPanel);
app.mount('#app');
