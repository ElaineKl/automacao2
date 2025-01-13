const { faker } = require("@faker-js/faker");

const usuario = Cypress.env('username')
const senha = Cypress.env('password')

describe('Fluxo E2E', () => {
   beforeEach(() => {
      cy.login(usuario, senha)
      cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/produto')
   });
   it('Criar um produto com sucesso', () => {
      cy.criarProduto("Notebook", "7000", "preto")
      cy.get(".toast").contains("Produto adicionado com sucesso")
      cy.pageAccessibility()
      cy.screenshot()
   });
   it('Excluir um produto', () => {      
      const nomeProduto = 'Produto Teste Excluir';
      const valorProduto = '100';
      const corProduto = 'Azul';
        
        cy.criarProduto(nomeProduto, valorProduto, corProduto);
        cy.get('.toast').should('be.visible').and('contain.text', 'Produto adicionado com sucesso')
        cy.visit('http://165.227.93.41/lojinha-web/v2/produto')

        cy.excluirProduto(nomeProduto); 
        cy.contains(nomeProduto).should('not.exist'); 
        cy.get('.toast').should('be.visible').and('contain.text', 'Produto removido com sucesso')
  });      
   it('Criar um produto com valor fora do limite superior', () => {
      cy.criarProduto("Iphone", "700001", "branco")
      cy.get(".toast").contains("O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00")
      cy.pageAccessibility()
      cy.screenshot()
   });
   it('Criar um produto com valor fora do limite inferior', () => {
      cy.criarProduto("Iphone", "0", "branco")
      cy.get(".toast").contains("O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00")
      cy.pageAccessibility()
      cy.screenshot()
   });
   it('Criar um produto com valor no limite inferior', () => {
      cy.criarProduto("Iphone 4", "000001", "vermelho")
      cy.get(".toast").contains("Produto adicionado com sucesso")
      cy.pageAccessibility()
      cy.screenshot()
   });
   it('Criar um produto com valor no limite superior', () => {
      cy.criarProduto("Iphone 4", "700000", "vermelho")
      cy.get(".toast").contains("Produto adicionado com sucesso")
      cy.pageAccessibility()
      cy.screenshot()
   });
   it('Criar um produto sem valor', () => {
      cy.criarProduto("Iphone 5", "null", "preto")
      cy.get(".toast").contains("O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00")
      cy.pageAccessibility()
      cy.screenshot()
   });
   it('Editar nome, valor e cor de um produto', ()  => {    
      cy.editarProduto("Iphone 16", "55000", "branco")
      cy.get(".toast").should('be.visible').and('contain.text', 'Produto alterado com sucesso')
      cy.screenshot()
   });
   it('Editar o valor de um produto para o limite superior', ()  => {    
      cy.editarProduto("Iphone 16", "700000", "branco")
      cy.get(".toast").should('be.visible').and('contain.text', 'Produto alterado com sucesso')
      cy.screenshot()
   });
   it('Editar o valor de um produto para o limite inferior', ()  => {    
      cy.editarProduto("Iphone 16", "001", "branco")
      cy.get(".toast").should('be.visible').and('contain.text', 'Produto alterado com sucesso')
      cy.screenshot()
   });
   it('Editar o valor de um produto para fora do limite inferior', ()  => {    
      cy.editarProduto("Iphone 16", "0", "branco")
      cy.get(".toast").should('be.visible').and('contain.text', 'O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00')
      cy.screenshot()
   });
   it('Editar o valor de um produto para fora do limite superior', ()  => {    
      cy.editarProduto("Iphone 16", "700001", "branco")
      cy.get(".toast").should('be.visible').and('contain.text', 'O valor do produto deve estar entre R$ 0,01 e R$ 7.000,00')
      cy.screenshot()
   });
   it('Adicionar um componente com sucesso', () => { 
      const nomeProduto = 'Produto Teste com Componente';
      const valorProduto = '500';
      const corProduto = 'Azul';
        
        cy.criarProduto(nomeProduto, valorProduto, corProduto);
        cy.get('.toast').should('be.visible').and('contain.text', 'Produto adicionado com sucesso')
        cy.criarComponente("cabo", "1")
        cy.get(".toast").should('be.visible').and('contain.text', 'Componente de produto adicionado com sucesso')
   });
   it('Adicionar um componente sem quantidade', () => { 
      cy.criarComponente("Cabo", "null")
      cy.get(".toast").should('be.visible').and('contain.text', 'A quantidade mínima para o componente não deve ser inferior a 1')
      cy.screenshot()
   });
   it('Adicionar um componente com string no campo quantidade', () => { 
      cy.criarComponente("Cabo", "dois")
      cy.get(".toast").should('be.visible').and('contain.text', 'A quantidade mínima para o componente não deve ser inferior a 1')
      cy.screenshot()
   });
   it.only('Excluir um componente', () => {     
         const nomeProduto = 'Produto Teste com Componente para Exluir';
         const valorProduto = '500';
         const corProduto = 'Azul';
           
           cy.criarProduto(nomeProduto, valorProduto, corProduto);
           cy.get('.toast').should('be.visible').and('contain.text', 'Produto adicionado com sucesso')
           cy.get(':nth-child(2) > .waves-effect').click()
           cy.criarComponente("cabo", "1")
           cy.get(".toast").should('be.visible').and('contain.text', 'Componente de produto adicionado com sucesso')
                     
           cy.excluirComponente("Cabo")
           cy.contains("Cabo").should('not.exist')
           
           cy.get(".toast").should('be.visible').and('contain.text', 'Componente de produto removido com sucesso')
           cy.screenshot();
   });                                         
});

describe('Login inválido', () => {
   it('Login com credenciais inválidas', () => {
      cy.login(faker.person.firstName(), faker.internet.password())
      cy.url().should('eq', 'http://165.227.93.41/lojinha-web/v2/?error=Falha%20ao%20fazer%20o%20login')
      cy.pageAccessibility()
      cy.screenshot()
   });
});