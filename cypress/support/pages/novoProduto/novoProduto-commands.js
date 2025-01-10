Cypress.Commands.add("criarProduto", (nome, valor, cores) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto/novo")
    cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto/novo')
    cy.get('#produtonome').should('be.visible').type(nome)
    cy.get('#produtovalor').should('be.visible').type(valor)
    cy.get('#produtocores').should('be.visible').type(cores)
    cy.get('#btn-salvar').should('be.visible').and('have.css', 'background-color', 'rgb(38, 166, 154)').click()
})

    