import { it } from "mocha";

let valorToken
let url = "http://165.227.93.41/lojinha/v2/"


let produtoId
let componenteId

const { faker } = require("@faker-js/faker");

describe('Testes E2E de API da Lojinha', () => {
    before('Obter token do usuário', () => {
        cy.obterTokenApi().then((response) => {
            expect(response.status).to.eq(200)
            valorToken = response.body.data.token 
            expect(response.body).to.have.property("message", "Sucesso ao realizar o login")
            expect(response.body).to.have.property("error", "")
        })
    })
    it('Adicionar um novo usuário', () => {
        const usuarioNome = faker.name.fullName();
        const usuarioLogin = faker.internet.userName();
        const usuarioSenha = faker.internet.password();

        cy.adicionarUsuarioApi(usuarioNome, usuarioLogin, usuarioSenha);   
    })
    it('Tentar obter token do usuário sem informar o Login (erro 401)', () => {
        let usuarioLogin = ""
        let usuarioSenha = "elaine2024"
        cy.obterTokenApi(usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
    it('Tentar obter token do usuário sem informar a Senha (erro 401)', () => {
        let usuarioLogin = "elaine2024"
        let usuarioSenha = ""
        cy.obterTokenApi(usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
    it('Tentar obter token do usuário sem informar o Login e Senha (erro 401)', () => {
        let usuarioLogin = ""
        let usuarioSenha = ""
        cy.obterTokenApi(usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
    it('Tentar obter token do usuário informando credenciais incorretas de Login e Senha (erro 401)', () => {
        let usuarioLogin = "123456abcdef"
        let usuarioSenha = "abcdef123456"
        cy.obterTokenApi(usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(401)
        })
    })
    it('Tentar adicionar um novo usuário sem informar o nome (erro 400)', () => {
        const usuarioNome = "";
        const usuarioLogin = faker.internet.userName();
        const usuarioSenha = faker.internet.password();
        
        cy.adicionarUsuarioApi(usuarioNome, usuarioLogin, usuarioSenha).then((response) => {
           expect(response.status).to.eq(400)
        }); 
    });
    it('Tentar adicionar um novo usuário sem informar o login (erro 400)', () => {  //Erro
        const usuarioNome = faker.name.fullName();
        const usuarioLogin = "";
        const usuarioSenha = faker.internet.password();

        
        cy.adicionarUsuarioApi(usuarioNome, usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(400);
        });
    });
    it('Tentar adicionar um novo usuário sem informar a senha (erro 400)', () => {
        const usuarioNome = faker.name.fullName();
        const usuarioLogin = faker.internet.userName();
        const usuarioSenha = "";

        cy.adicionarUsuarioApi(usuarioNome, usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(400);
        });          
    });
    it('Tentar adicionar um novo usuário com credenciais já cadastradas (erro 409)', () => { //Erro
        const usuarioNome = "elaine2024";
        const usuarioLogin = "elaine2024";
        const usuarioSenha = "elaine2024";

        cy.adicionarUsuarioApi(usuarioNome, usuarioLogin, usuarioSenha).then((response) => {
            expect(response.status).to.eq(409);
        });  
    });
    it('Adicionar um produto', () => {
        let produtoNome = 'Produto Teste Automatizado';
        let produtoValor = 5000;
        let produtoCor = 'Branco';
        cy.adicionarProdutoApi(valorToken, produtoNome, produtoValor, produtoCor).then((response) => {
            produtoId = response.body.data.produtoId
            componenteId = response.body.data.componentes[0].componenteId
            expect(response.status).to.eq(201)
            expect(response.body.data).to.have.property("produtoId", produtoId).that.is. a("number")
            expect(response.body.data).to.have.property("produtoNome", "Produto Teste Automatizado").that.is.a("string")
            expect(response.body.data).to.have.property("produtoValor", 5000).that.is.a("number")
            expect(response.body.data).to.have.property("produtoCores").that.deep.equal(["Branco"]).that.is.an("Array")
            expect(response.body.data).to.have.property("produtoUrlMock", "").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteId", componenteId).that.is.a("number")
            expect(response.body.data.componentes[0]).to.have.property("componenteNome", "Componente do teste automatizado").that.is.a("string")
            expect(response.body.data.componentes[0]).to.have.property("componenteQuantidade", 3).that.is.a("number")
            expect(response.body).to.have.property("message", "Produto adicionado com sucesso").that.is.a("string")
            expect(response.body).to.have.property("error", "").that.is.a("string")
        })               
    });
    it('Tentar adicionar um produto sem nome (erro 400)', () => {
        let produtoNome = '';
        let produtoValor = 5000;
        let produtoCor = 'Branco';
        cy.adicionarProdutoApi(valorToken, produtoNome, produtoValor, produtoCor).then((response) => {
            expect(response.status).to.eq(400)  
        });
    });
    it('Tentar adicionar um produto com o token incorreto (erro 401)', () => {  //Erro
        const valorTokenIncorreto = 999999;
        let produtoNome = 'Produto Teste Automatizado';
        let produtoValor = 5000;
        let produtoCor = 'Branco';
        cy.adicionarProdutoApi(valorTokenIncorreto, produtoNome, produtoValor, produtoCor).then((response) => {
            expect(response.status).to.eq(401)
        }); 
    });
    it('Tentar adicionar um produto sem valor (erro 422)', () => {   //Erro
        let produtoNome = 'Produto Teste Automatizado';
        let produtoValor = "";
        let produtoCor = 'Branco';
        cy.adicionarProdutoApi(valorToken, produtoNome, produtoValor, produtoCor).then((response) => {
            expect(response.status).to.eq(422)
        }); 
    });
    it('Tentar adicionar um produto com valor negativo (erro 422)', () => {   //Erro
        let produtoNome = 'Produto Teste Automatizado';
        let produtoValor = -200;
        let produtoCor = 'Branco';
        cy.adicionarProdutoApi(valorToken, produtoNome, produtoValor, produtoCor).then((response) => {
            expect(response.status).to.eq(422)
        }); 
    });
    it('Tentar adicionar um produto sem cor (erro 400)', () => {
        let produtoNome = 'Produto Teste Automatizado';
        let produtoValor = 5000;
        let produtoCor = '';
        cy.adicionarProdutoApi(valorToken, produtoNome, produtoValor, produtoCor).then((response) => {
            expect(response.status).to.eq(400)
        });
    });
    it('Buscar os produtos do usuário', () => {
        cy.buscaProdutosUsuarioApi(valorToken).then((response) => {
            expect(response.status).to.eq(200);

            expect(response.body.data).to.be.an("Array");

        response.body.data.forEach((produto) => {   
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
            expect(response.body).to.have.property("message", "Listagem de produtos realizada com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
            }); 
        }); 
    });
    it('Buscar os produtos do usuário com o token incorreto (erro 401)', () => { //Erro
        const valorTokenIncorreto = 999999;
        cy.buscaProdutosUsuarioApi(valorTokenIncorreto).then((response) => {
            expect(response.status).to.eq(401);
        }); 
    });
    it('Buscar um dos produtos do usuário', () => {
        cy.buscaPorUmProdutoUsuarioApi(valorToken, produtoId).then((response) => {
            expect(response.status).to.eq(200);
        }); 
    });
    it('Buscar um dos produtos do usuário com o token incorreto (erro 401)', () => { //Retorna no cypress como 500
        const valorTokenIncorreto = 999999;
        cy.buscaPorUmProdutoUsuarioApi(valorTokenIncorreto, produtoId).then((response) => {
            expect(response.status).to.eq(401);
        }); ; 
    });
    it('Buscar um dos produtos do usuário e informar um produtoID incorreto (erro 404)', () => { //Erro
        const produtoIdIncorreto = 9999999;
        cy.buscaPorUmProdutoUsuarioApi(valorToken, produtoIdIncorreto).then((response) => {
           expect(response.status).to.eq(404)
        }); 
    });
    it('Alterar informações de um produto', () => {
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = 5000;
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade);
    });
    it('Tentar alterar informações de um produto com produtoId incorreto (erro 404)', () => {  //Erro
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = 5000;
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        const produtoIdIncorreto = 999999;
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoIdIncorreto, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(404)
         });  
    });
    it('Ao alterar informações de um produto, não informar o nome (erro 400)', () => {
        let produtoNome = '';
        let produtoValor = 5000;
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(400) 
        }); 
    });
    it('Ao alterar informações de um produto, não informar o valor (erro 422)', () => {  
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = '';
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(422) 
        }); 
    });
    it('Ao alterar informações de um produto, informar um valor negativo (erro 422)', () => {  
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = -200;
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(422) 
        }); 
    });
    it('Ao alterar informações de um produto, não informar a cor (erro 400)', () => {
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = 5000;
        let produtoCores = '';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(400) 
        }); 
    });
    it('Ao alterar informações de um produto, não informar o nome do componente (erro 400)', () => {
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = 5000;
        let produtoCores = 'Branco';
        let componenteNome = '';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(400) 
        }); 
    });
    it('Ao alterar informações de um produto, não informar a quantidade do componente (erro 422)', () => {
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = 5000;
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '';
        cy.alterarInformacoesDeProdutoApi(valorToken, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(422) 
        });  
    });
    it('Alterar informações de um produto com o token incorreto (erro 401)', () => { //Erro
        const valorTokenIncorreto = 999999;
        let produtoNome = 'Teste automatizado corrigido';
        let produtoValor = 5000;
        let produtoCores = 'Branco';
        let componenteNome = 'Componente Corrigido';
        let componenteQuantidade = '6';
        cy.alterarInformacoesDeProdutoApi(valorTokenIncorreto, produtoId, produtoNome, produtoValor, produtoCores, componenteNome, componenteQuantidade).then((response) => {
            expect(response.status).to.eq(400) 
        }); 
    });
    it('Adicionar um novo componente ao produto', () => {
        let componenteNome = "Novo componente do teste automatizado";
        let componenteQuantidade = 1; 
        cy.adicionarComponenteApi(valorToken, produtoId, componenteNome, componenteQuantidade); 
        }) 
    });
    it('Tentar adicionar um novo componente ao produto com o token incorreto (erro 401)', () => {
        const valorTokenIncorreto = 999999;
        let componenteNome = "Novo componente do teste automatizado";
        let componenteQuantidade = 1; 
        cy.adicionarComponenteApi(valorTokenIncorreto, produtoId, componenteNome, componenteQuantidade).then((response) => {
            produtoId = response.body.data.produtoId
            componenteId = response.body.data.componenteId
            expect(response.status).to.eq(401)
        });   
    });
    it('Tentar adicionar um novo componente ao produto sem informar o nome (erro 400)', () => {
        let componenteNome = "";
        let componenteQuantidade = 1;
        cy.adicionarComponenteApi(valorToken, produtoId, componenteNome, componenteQuantidade).then((response) => {
           expect(response.status).to.eq(400)
        }) 
    });
    it('Tentar adicionar um novo componente ao produto sem informar a quantidade (erro 422)', () => {
        let componenteNome = "Novo componente do teste automatizado";
        let componenteQuantidade = "";
        cy.adicionarComponenteApi(valorToken, produtoId, componenteNome, componenteQuantidade).then((response) => {
           expect(response.status).to.eq(422)
        }) 
    });
    it('Tentar adicionar um novo componente ao produto com quantidade negativa (erro 422)', () => {
        let componenteNome = "Novo componente do teste automatizado";
        let componenteQuantidade = -2;
        cy.adicionarComponenteApi(valorToken, produtoId, componenteNome, componenteQuantidade).then((response) => {
           expect(response.status).to.eq(422)
        }) 
    });
    it('Tentar adicionar um novo componente a um produtoId incorreto (erro 404)', () => {
        const produtoIdIncorreto = 99999;
        let componenteNome = "Novo componente do teste automatizado";
        let componenteQuantidade = 2;
        cy.adicionarComponenteApi(valorToken, produtoIdIncorreto, componenteNome, componenteQuantidade).then((response) => {
           expect(response.status).to.eq(404)
        }) 
    });
    it('Buscar dados dos componentes de um produto', () => {     
        cy.buscarDadosDosComponentesDeProdutoApi(valorToken, produtoId).then((response) => {
           expect(response.status).to.eq(200);
      
            const componentes = response.body.data.componentes;
        if (componentes && componentes.length > 0) {
            componentes.forEach((componente) => {
                expect(componente).to.have.property("componenteId").that.is.a("number");
                expect(componente).to.have.property("componenteNome").that.is.a("string");
                expect(componente).to.have.property("componenteQuantidade").that.is.a("number");
            });
        }
            expect(response.body).to.have.property("message", "Listagem de componentes de produto realizada com sucesso").that.is.a("string");
            expect(response.body).to.have.property("error", "").that.is.a("string");
        })
    });
    it('Tentar buscar dados dos componentes de um produtoId incorreto (erro 401)', () => {     
        const produtoIdIncorreto = 999999;
        cy.buscarDadosDosComponentesDeProdutoApi(valorToken, produtoIdIncorreto).then((response) => {
           expect(response.status).to.eq(401);
        })
    });
    it('Tentar buscar dados dos componentes de um produto com o token incorreto (erro 401)', () => {     
        const valorTokenIncorreto = 999999;
        cy.buscarDadosDosComponentesDeProdutoApi(valorTokenIncorreto, produtoId).then((response) => {
           expect(response.status).to.eq(401);
        });
    });
    it('Buscar um componente de produto', () => {        
        cy.buscaComponenteDeUmProdutoApi(valorToken, produtoId, componenteId).then((response) => {
            expect(response.status).to.eq(200);
        })
    });
    it('Tentar buscar um componente de produto com o token incorreto (erro 401)', () => {      
        const valorTokenIncorreto = 999999;
        cy.buscaComponenteDeUmProdutoApi(valorTokenIncorreto, produtoId, componenteId).then((response) => {
           expect(response.status).to.eq(401);    
        })
    });
    it('Tentar buscar um componente de um produtoId incorreto (erro 404)', () => {     
        const produtoIdIncorreto = 99999;
        cy.buscaComponenteDeUmProdutoApi(valorToken, produtoIdIncorreto, componenteId).then((response) => {
           expect(response.status).to.eq(404);
        })
    });
    it('Tentar buscar um componente de um produto com componenteId incorreto (erro 404)', () => {     
        const componenteIdIncorreto = 99999;
        cy.buscaComponenteDeUmProdutoApi(valorToken, produtoId, componenteIdIncorreto).then((response) => {
           expect(response.status).to.eq(404);
        })
    });
    it('Alterar informações de um componente de produto', () => {     
        let componenteNome = "Teste de alteração de componente";
        let componenteQuantidade = 8
        cy.alterarComponenteDeProdutoApi(valorToken, produtoId, componenteId, componenteNome, componenteQuantidade);
    });
    it('Remover um componente do produto', () => {     
        cy.removerComponenteProdutoApiapi(valorToken, produtoId, componenteId);
    });
    it('Remover um produto', () => {
       cy.removerProdutoApiapi(valorToken, produtoId);
    });
    it('Tentar remover um produto informando um produtoId incorreto (erro 401)', () => {
        const produtoIdIncorreto = 999999;
        cy.removerProdutoApiapiapi(valorToken, produtoIdIncorreto).then((response) => {
            expect(response.status).to.eq(401);
         })
    });
    it('Tentar remover um produto com o token incorreto (erro 401)', () => {
        const valorTokenIncorreto = 999999;
        cy.removerProdutoApi(valorTokenIncorreto, produtoId).then((response) => {
         expect(response.status).to.eq(401)
         })
    });
    it('Limpar todos os dados do usuário', () => {     // É possível usar o 'after' também, neste caso, mas nem sempre é bom usar (outras pessoas podem estar utilizando)
        cy.limparDadosUsuarioApi(valorToken); 
    })
    it('Limpar todos os dados do usuário com o token incorreto (erro 401)', () => {     
        const valorTokenIncorreto = 999999;
        cy.limparDadosUsuarioApi(valorTokenIncorreto).then((response) => {
            expect(response.status).to.eq(401)            
        })
    })