import http from 'k6/http';
import { group, check } from 'k6';

function gerarNomeAleatorio() {
  const nomes = ["Carlos", "Ana", "Roberto", "Elaine", "José", "Maria"];
  return nomes[Math.floor(Math.random() * nomes.length)];
}

function gerarLoginAleatorio() {
  return 'user' + Math.floor(Math.random() * 10000); 
}

function gerarSenhaAleatoria() {
  return Math.random().toString(36).slice(-8); 
}


let valorToken; 
let produtoId;
let componenteId

//Workload: 
export const options = {
  /*thresholds: {
    http_req_failed: ['rate<0.01'],   //Http errors devem ser abaixo de 1% (Se 1% do meu teste falhar, ele para)
    http_req_duration: ['p(95)<200'] //95% das requisições devem ser abaixo de 200
  },
  scenarios: {
    cenario1: {
      executor: 'constant-arrival-rate',
      duration: '5s',
      preAllocatedVUs: 50,
      rate: 50,
      timeUnit: '1s'
    }
  },*/
  vus: 3, //Usuários virtuais simultâneos para smoke-tests é até +-5 (recomendação do k6)
  duration: '2s', //Duração para smoke-tests é de alguns segundos a poucos minutos (recomendação k6)
};

//Casos de testes:
export default function() {
  const url = "http://165.227.93.41/lojinha/v2/"

  group('Obter token de usuário', () => {
  const respostaToken = http.post(`${url}login`, JSON.stringify({
    usuarioLogin: 'elaine2024',
    usuarioSenha: 'elaine2024'
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  check(respostaToken, {
    'Status code é igual a 200': r => r.status === 200
  });

  if (respostaToken.status === 200) {
    valorToken = respostaToken.json('data.token');
  }
})

  group('Login com usuário válido', () => {  
    if (valorToken) {
    const respostaLogin = http.post(`${url}login`, JSON.stringify({
     usuarioLogin: 'elaine2024',
     usuarioSenha: 'elaine2024'
    }), {
     headers: {
       'Content-Type': 'application/json',
       'token': valorToken
     }
    });
    check(respostaLogin, {
     'Status code é igual a 200': r => r.status === 200
    })
    } 
  })

  group('Adicionar um novo usuário', () => {
  const usuarioNome = gerarNomeAleatorio();
  const usuarioLogin = gerarLoginAleatorio();
  const usuarioSenha = gerarSenhaAleatoria();

  const adicionarNovoUsuario = http.post(`${url}usuarios`, JSON.stringify({
    usuarioNome: usuarioNome,
    usuarioLogin: usuarioLogin,
    usuarioSenha: usuarioSenha
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  check(adicionarNovoUsuario, {
    'Status code é igual a 201': r => r.status === 201,
  })
  })

  group('Cadastrar um novo produto', () => {
    const respostaCriarProduto = http.post(`${url}produtos`, JSON.stringify({
      produtoNome: 'Teste de performance',
      produtoValor: 2000,
      produtoCores: ['Preto', 'Vermelho'],
      produtoUrlMock: "",
      componentes: [
      {
        componenteNome: "string",
        componenteQuantidade: 1
      }
      ]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(respostaCriarProduto, {
      'Status code é 201': r => r.status === 201
    })
    if (respostaCriarProduto.status === 201) {
      produtoId = respostaCriarProduto.json('data.produtoId');
    }
  })

  group('Buscar os produtos do usuário', () => { 
   if (valorToken) {
    const buscarProdutos = http.get(`${url}produtos`, {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
  check(buscarProdutos, {
    'Status code é igual a 200': r => r.status === 200
    })
  } 
  })

  group('Buscar um dos produtos do usuário', () => { 
    if (valorToken) {
     const buscarUmProduto = http.get(`${url}produtos/${produtoId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': valorToken
        }
      })
      check(buscarUmProduto, {
        'Status code é igual a 200': r => r.status === 200
      })
    }
  })

  group('Alterar informações de um produto', () => {
    if(produtoId) {
    const alterarProduto = http.put(`${url}produtos/${produtoId}`, JSON.stringify({
      produtoNome: 'Teste de performance 2',
      produtoValor: 3000,
      produtoCores: ['Preto', 'Branco'],
      produtoUrlMock: "",
      componentes: [
      {
        componenteNome: "Teste 2",
        componenteQuantidade: 3
      }
      ]
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken
      }
    })
    check(alterarProduto, {
      'Status code é 200': r => r.status === 200
    })
  }
  })

  group('Cadastrar um novo componente ao produto', () => {
    if (produtoId && valorToken) {
      const respostaCriarComponente = http.post(`${url}produtos/${produtoId}/componentes`, JSON.stringify({
        componenteNome: "Componente teste de performance",
        componenteQuantidade: 2
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken,
      }
    })
    check(respostaCriarComponente, {
      'Status code é 201': r => r.status === 201
    })
    if (respostaCriarComponente.status === 201) {
      componenteId = respostaCriarComponente.json('data.componenteId');
    }
    }
  })

  group('Buscar dados dos componentes de um produto', () => {
    if (produtoId && valorToken) {
      const buscarComponente = http.get(`${url}produtos/${produtoId}/componentes`, {
        headers: {
          'Content-Type': 'application/json',
          'token': valorToken,
        }
      })
      check(buscarComponente, {
        'Status code é 200': r => r.status === 200,
      })
    }
  })

  group('Buscar um componente de produto', () => {
    if (produtoId && valorToken && componenteId) {
      const buscarUmComponente = http.get(`${url}produtos/${produtoId}/componentes/${componenteId}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': valorToken,
        }
      })
      check(buscarUmComponente, {
        'Status code é 200': r => r.status === 200,
      })
    }
  })

  group('Alterar informações de um componente de produto', () => {
    if (produtoId && valorToken && componenteId) {
      const alterarComponente = http.put(`${url}produtos/${produtoId}/componentes/${componenteId}`, JSON.stringify({
        componenteNome: "Componente teste de performance 3",
        componenteQuantidade: 4
    }), {
      headers: {
        'Content-Type': 'application/json',
        'token': valorToken,
      }
    })
    check(alterarComponente, {
      'Status code é 200': r => r.status === 200
    })
    }
  })

  group('Remover um componente', () => { 
    if (valorToken) {
     const removerComponente = http.del(`${url}produtos/${produtoId}/componentes/${componenteId}`, null, {
        headers: {
          'Content-Type': 'application/json',
          'token': valorToken
        }
      })
      check(removerComponente, {
        'Status code é igual a 204': r => r.status === 204
      })
    }
  })
  group('Remover um produto', () => { 
    if (valorToken) {
     const removerProduto = http.del(`${url}produtos/${produtoId}`, null, {
        headers: {
          'Content-Type': 'application/json',
          'token': valorToken
        }
      })
      check(removerProduto, {
        'Status code é igual a 204': r => r.status === 204
      })
    }
  })

  group('Remover dados do usuário', () => {                //Colocar como teardown
    const deletarDados = http.del(`${url}dados`, null, {
     headers: {
       'Content-Type': 'application/json',
       'token': valorToken
      }
      });
      check(deletarDados, {
      'Status code é igual a 204': r => r.status === 204,
      }) 
  })
}