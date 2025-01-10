Cypress.Commands.add("listaProduto", () => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto")
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
    cy.get(".collection-item").and(".waves-effect").contains("Adicionar produto").click()
   })