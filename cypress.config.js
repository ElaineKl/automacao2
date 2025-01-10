const { defineConfig } = require("cypress");
 
module.exports = defineConfig({
  screenshotOnRunFailure: true, // Captura automática em falhas
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports', // Diretório para salvar os relatórios
    overwrite: false,            // Não sobrescrever relatórios existentes
    html: true,                  // Gerar relatório em HTML
    json: true,                   // Gerar relatório em JSON
    embeddedScreenshots: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
 
 

 