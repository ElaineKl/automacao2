const url = "http://165.227.93.41/lojinha/v2/"

Cypress.Commands.add("adicionarProdutoApi", (valorToken, produtoNome, produtoValor, produtoCor) => {
    cy.api({
        method: "POST",
        url: `${url}produtos`,
        headers: {
            token: valorToken
        },
        body: {
            produtoNome: produtoNome,
            produtoValor: produtoValor,
            produtoCores: [
                produtoCor
            ],
            produtoUrlMock: "",
            componentes: [

                {
                    componenteNome: "Componente do teste automatizado",
                    componenteQuantidade: 3

                }
            ]
        }
    })   
});
Cypress.Commands.add("buscaProdutosUsuarioApi", (valorToken) => {
    cy.api({
        method: "GET",
        url: `${url}produtos`,
        headers: {
            token: valorToken
        },
    })    
})
Cypress.Commands.add("buscaPorUmProdutoUsuarioApi", (valorToken, produtoId) => {
    cy.api({
        method: "GET",
        url: `${url}produtos/${produtoId}`, 
        headers: {
            token: valorToken
        },
    }).then((response) => {
        if (response.status === 200) { 

        expect(response.body.data).to.be.an("Object");

        const produto = response.body.data;
        expect(produto).to.have.property("produtoId").that.is.a("number");
        expect(produto).to.have.property("produtoNome").that.is.a("string");
        expect(produto).to.have.property("produtoValor").that.is.a("number");
        expect(produto).to.have.property("produtoCores").that.is.an("Array");
        expect(produto).to.have.property("produtoUrlMock", "").that.is.a("string");

        if (produto.componentes && produto.componentes.length > 0) {
            produto.componentes.forEach((componente) => {
                expect(componente).to.have.property("componenteId").that.is.a("number");
                expect(componente).to.have.property("componenteNome").that.is.a("string");
                expect(componente).to.have.property("componenteQuantidade").that.is.a("number");
            });
        }
        expect(response.body).to.have.property("message", "Detalhando dados do produto").that.is.a("string");
        expect(response.body).to.have.property("error", "").that.is.a("string");
        
        } else if (response.status === 404) {
        expect(response.status).to.eq(404);
        }    
    })
});
Cypress.Commands.add("alterarInformacoesDeProdutoApi", (valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade) => {
    cy.api({
        method: "PUT",
        url: `${url}produtos/${produtoId}`,
        headers: {
            token: valorToken
        },
        body: {
            produtoNome: "Teste automatizado corrigido",
            produtoValor: 6000,
            produtoCores: [
              "Prata"
            ],
            produtoUrlMock: "",
            componentes: [
                {
                    componenteNome: "Componente corrigido",
                    componenteQuantidade: 6
                }
            ]
        }
    }).then((response) => {
        produtoId = response.body.data.produtoId;
        const componenteId = response.body.data.componentes[0].componenteId;

        expect(response.status).to.eq(200);

        expect(response.body.data).to.have.property("produtoId").that.is.a("number");
        expect(response.body.data).to.have.property("produtoNome", "Teste automatizado corrigido").that.is.a("string");
        expect(response.body.data).to.have.property("produtoValor", 6000).that.is.a("number");
        if (Array.isArray(response.body.data.produtoCores)) {
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Prata"]).that.is.an("Array");
        }
        expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string");
        expect(response.body.data.componentes[0]).to.have.property("componenteId").that.is.a("number");
        expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente corrigido").that.is.a("string");
        expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 6).that.is.a("number");

        expect(response.body).to.have.property("message", "Produto alterado com sucesso").that.is.a("string");
        expect(response.body).to.have.property("error", "").that.is.a("string");
    });
})
Cypress.Commands.add("removerProdutoApi", (valorToken, produtoId) => {
    cy.api({
        method: "DELETE",
        url: `${url}produtos/${produtoId}`,
        headers: {
            token: valorToken
    }
    }).then((response) => {
        if (response.status === 204) {
            expect(response.status).to.eq(204);

        } else if (response.status === 401) {
        expect(response.status).to.eq(401);
        }
    })
})