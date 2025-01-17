const url = "http://165.227.93.41/lojinha/v2/"

Cypress.Commands.add("adicionarComponenteApi", (valorToken, produtoId, componenteNome, componenteQuantidade) => {
    cy.api({
        method: "POST",
        url: `${url}produtos/${produtoId}/componentes`,
        headers: {
            token: valorToken
        },
        body: {
            componenteNome: "Novo componente do teste automatizado",
            componenteQuantidade: 1 
        }
    }).then((response) => {
        if (response.status === 201) {
            expect(response.status).to.eq(201);
            produtoId = response.body.data.produtoId
            componenteId = response.body.data.componenteId
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data).to.have.property("componenteNome", "Novo componente do teste automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("componenteQuantidade", 1).that.is.a("number")
            expect(response.body).to.have.property("message", "Componente de produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
       } else if (response.status === 400) {
            expect(response.status).to.eq(400);
       } else if (response.status === 401) {
            expect(response.status).to.eq(401);
       } else if (response.status === 404) {
            expect(response.status).to.eq(404);
       } else if (response.status === 422) {
            expect(response.status).to.eq(422);
       }
    })
})
Cypress.Commands.add("buscarDadosDosComponentesDeProdutoApi", (valorToken, produtoId) => {
    cy.api({
        method: "GET",
        url: `${url}produtos/${produtoId}/componentes`, 
        headers: {
            token: valorToken
        },
    })
})
Cypress.Commands.add("buscarUmComponenteDeProdutoApi", (valorToken, produtoId, componenteId) => {
    cy.api({
        method: "GET",
        url: `${url}produtos/${produtoId}/componentes/${componenteId}`, 
        headers: {
            token: valorToken
        },
    }).then((response) => {
       if(response.status === 200) {
    
          const componentes = response.body.data.componentes;
          if (componentes && componentes.length > 0) {
              componentes.forEach((componente) => {
              expect(componente).to.have.property("componenteId").that.is.a("number");
              expect(componente).to.have.property("componenteNome").that.is.a("string");
              expect(componente).to.have.property("componenteQuantidade").that.is.a("number");
             });
        }
        expect(response.body).to.have.property("message", "Detalhando dados do componente de produto").that.is.a("string");
        expect(response.body).to.have.property("error", "").that.is.a("string");
        } else if (response.status === 401) {
            expect(response.status).to.eq(401);
        } else if (response.status === 404); {
            expect(response.status).to.eq(401);
        }
    })  
});
Cypress.Commands.add("alterarComponenteDeProdutoApi", (valorToken, produtoId, componenteId) => {
    cy.api({
        method: "PUT",
        url: `${url}produtos/${produtoId}/componentes/${componenteId}`, 
        headers: {
            token: valorToken
        },
        body: {
            componenteNome: "Teste de alteração de componente",
            componenteQuantidade: 8
        }
    }).then((response) => {
        produtoId = response.body.data.produtoId;
        componenteId = response.body.data.componenteId;

            expect(response.status).to.eq(200);
                
            expect(response.body.data).to.have.property("componenteId").that.is.a("number");
            xpect(response.body.data).to.have.property("componenteNome", "Teste de alteração de componente").that.is.a("string");
            expect(response.body.data).to.have.property("componenteQuantidade", 8).that.is.a("number");
            
            expect(response.body).to.have.property("message", "Componente de produto alterado com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");  // Está correto, conforme swagger, mas no postman não está aparecendo o 'error'
    })
})
Cypress.Commands.add("removerComponenteProdutoApi", (valorToken, produtoId, componenteId) =>{
    cy.api({
        method: "DELETE",
        url: `${url}produtos/${produtoId}/componentes/${componenteId}`, 
        headers: {
            token: valorToken
        },
        
    }).then((response) => {
        expect(response.status).to.eq(204);
    })
})