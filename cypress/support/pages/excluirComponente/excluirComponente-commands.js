Cypress.Commands.add("excluirComponente", (nomeComponente) => {
    cy.url().should('eq', "http://165.227.93.41/lojinha-web/v2/produto");
    cy.contains('.material-icons', 'delete').should('be.visible').click()
});



   /* // Localiza o produto desejado (ajuste o nome conforme necessário)
    cy.contains(produtoNome).click(); // Substitua 'Produto Teste' pelo nome do produto desejado

    // Acessa a tela de edição do produto
    cy.contains('Editar').click(); // Ajuste conforme necessário para chegar à tela de edição do produto

    // Encontra o componente pelo nome e localiza o botão de exclusão
    cy.contains(nomeComponente).parents().find('.secondary-content').eq(0).should('be.visible').click()

    // Verifica se o componente foi removido
    cy.contains(nomeComponente).should('not.exist');
    cy.get('.toast').should('be.visible').and('contain.text', 'Componente removido com sucesso');
});

/*Cypress.Commands.add("excluirComponente", (componenteNome) => {
    cy.url().should('eq', "http://165.227.93.41/lojinha-web/v2/produto");
    cy.visit("http://165.227.93.41/lojinha-web/v2/produto/editar/988256") 
    cy.contains('.material-icons', 'delete').should('be.visible').click()
});*/ 