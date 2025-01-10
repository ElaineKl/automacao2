Cypress.Commands.add("editarProduto", (nome, valor, cores) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto");
    /*cy.get('[rev="988256"] > .title > a').click()*/ 
    cy.get('#produtonome').should('be.visible').clear().type(nome);
    cy.get('#produtovalor').should('be.visible').clear().type(valor);
    cy.get('#produtocores').should('be.visible').clear().type(cores);
    cy.contains('.btn.waves-effect.waves-light', 'Salvar').should('be.visible').and('not.be.disabled').click();
   });

