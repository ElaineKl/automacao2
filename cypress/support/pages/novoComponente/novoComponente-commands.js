Cypress.Commands.add("criarComponente", (nomeComponente, quantidadeComponente) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto");
    cy.contains('Produto Teste').click();  
    cy.contains('Editar').click(); 
    cy.get(':nth-child(2) > .waves-effect').click()
    cy.get('#componentenomeadicionar').should('be.visible').type(nomeComponente);
    cy.get('#componentequantidadeadicionar').should('be.visible').type(quantidadeComponente);
    cy.get('a.modal-close').contains('Salvar Componente').click();
});

