import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Default Vite port
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.ts',
  },
});