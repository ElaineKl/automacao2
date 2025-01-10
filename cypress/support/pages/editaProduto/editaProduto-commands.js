/*Cypress.Commands.add("editarProduto", (nome, valor, cores) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto");
    cy.get('[rev="988256"] > .title > a').click()
    cy.get('#produtonome').should('be.visible').clear().type(nome);
    cy.get('#produtovalor').should('be.visible').clear().type(valor);
    cy.get('#produtocores').should('be.visible').clear().type(cores);
    cy.contains('.btn.waves-effect.waves-light', 'Salvar').should('be.visible').and('not.be.disabled').click();

   });*/

   Cypress.Commands.add("excluirComponente", (nomeComponente) => {
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto");

    // Localiza o produto desejado (ajuste o nome conforme necessário)
    cy.contains('Produto Teste').click(); // Substitua 'Produto Teste' pelo nome do produto desejado

    // Acessa a tela de edição do produto
    cy.contains('Editar').click(); // Ajuste conforme necessário para chegar à tela de edição do produto

    // Encontra o componente pelo nome e localiza o botão de exclusão
    cy.contains(nomeComponente).parents().find('.secondary-content').eq(0).should('be.visible').click()

    // Verifica se o componente foi removido
    cy.contains(nomeComponente).should('not.exist');
    cy.get('.toast').should('be.visible').and('contain.text', 'Componente removido com sucesso');
});

