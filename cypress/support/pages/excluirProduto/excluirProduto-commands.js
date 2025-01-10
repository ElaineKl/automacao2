Cypress.Commands.add("excluirProduto", (produtoNome) => {
    cy.url().should('eq', "http://165.227.93.41/lojinha-web/v2/produto");
    cy.contains(produtoNome).parents().find('.secondary-content').eq(0).should('be.visible').click()
});



