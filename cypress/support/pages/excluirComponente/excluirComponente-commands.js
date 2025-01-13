Cypress.Commands.add("excluirComponente", (nomeComponente) => {
    cy.get(':nth-child(1) > .secondary-content > .material-icons').click()
});
