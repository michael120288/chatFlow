const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://host.docker.internal:5000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 15000,
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log('[cy.task]', message);
          return null;
        },
        generateToken() {
          return Math.random().toString(36).substring(2, 15);
        },
        getTimestamp() {
          return new Date().toISOString();
        }
      });
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx}',
    supportFile: 'cypress/support/component.js',
    video: false,
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 10000
  }
});
