const url = "http://165.227.93.41/lojinha/v2/"

Cypress.Commands.add("obterTokenApi", () => {
    cy.api({
        method: "POST",
        url:`${url}login`,
        body: {
            usuarioLogin: "elaine2024",
            usuarioSenha: "elaine2024"
        }
    })
})

Cypress.Commands.add("adicionarUsuarioApi", (usuarioNome, usuarioLogin, usuarioSenha) => {
    const body = {
        usuarioNome: usuarioNome,
        usuarioLogin: usuarioLogin,
        usuarioSenha: usuarioSenha
    }
    cy.api({
        method: "POST",
        url: `${url}usuarios`,
        body: body
    }).then((response) => {
        if (!usuarioNome || !usuarioLogin || !usuarioSenha) {
            expect(response.status).to.eq(400);
        } else if (response.status === 409) {
            // Se a resposta for 409, espera-se que seja um conflito de dados duplicados
            expect(response.status).to.eq(409);
        }  else {
        expect(response.status).to.eq(201)
        expect(response.body.data).to.have.property("usuarioId").that.is.a("number")
        expect(response.body.data).to.have.property("usuarioLogin").that.is. a("string")
        expect(response.body.data).to.have.property("usuarioNome").that.is.a("string")
        expect(response.body).to.have.property("message", "Usuário adicionado com sucesso")
        expect(response.body).to.have.property("error", "")
        }
    })   
})
Cypress.Commands.add("limparDadosUsuarioApi", (valorToken) => {
    cy.api({
        method: "DELETE",
        url: `${url}dados`,
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