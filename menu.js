/* ============================================================
   ARENA GARRAFA — CARDÁPIO SALÃO
   FONTE DE DADOS (edite APENAS este arquivo no dia a dia)
   ============================================================
   Aqui você:
     - troca preços
     - troca nomes de produtos
     - adiciona / remove itens
     - adiciona / remove categorias (cada categoria = uma página)
     - ajusta o tempo (em milissegundos) que cada página fica na tela

   Estrutura de cada categoria:
     {
       categoria: "Nome exibido no título da página",
       tempo: 12000,           // (opcional) tempo desta página em ms
       itens: [
         { nome: "Produto", preco: "R$ 00,00" },
         ...
       ]
     }

   Dica: 1000 ms = 1 segundo. Se "tempo" não for informado, usa o
   valor padrão definido em script.js (CONFIG.tempoPadrao).
   Não é preciso mexer em index.html, style.css ou script.js.
   ============================================================ */

const menu = [

  {
    categoria: "Cervejas 600 ml",
    tempo: 14000,
    itens: [
      { nome: "Skol 600 ml", preco: "R$ 10,00" },
      { nome: "Antarctica 600 ml", preco: "R$ 10,00" },
      { nome: "Brahma Chopp 600 ml", preco: "R$ 10,00" },
      { nome: "Brahma Duplo Malte 600 ml", preco: "R$ 11,00" },
      { nome: "Budweiser 600 ml", preco: "R$ 11,00" },
      { nome: "Império 600 ml", preco: "R$ 12,00" },
      { nome: "Antarctica Original 600 ml", preco: "R$ 12,00" },
      { nome: "Stella Artois 600 ml", preco: "R$ 12,00" },
      { nome: "Stella Artois Gold 600 ml", preco: "R$ 14,00" },
      { nome: "Heineken 600 ml", preco: "R$ 15,00" }
    ]
  },

  {
    categoria: "Cervejas no Balde — 600 ml (3 un)",
    tempo: 11000,
    itens: [
      { nome: "Stella Artois 600 ml — Balde (3 un)", preco: "R$ 40,00" },
      { nome: "Budweiser 600 ml — Balde (3 un)", preco: "R$ 38,00" },
      { nome: "Império 600 ml — Balde (3 un)", preco: "R$ 38,00" }
    ]
  },

  {
    categoria: "Bebidas sem Álcool",
    tempo: 13000,
    itens: [
      { nome: "Refrigerante lata", preco: "R$ 6,00" },
      { nome: "Refrigerante 1 L", preco: "R$ 10,00" },
      { nome: "Água com gás", preco: "R$ 5,00" },
      { nome: "Água sem gás", preco: "R$ 5,00" },
      { nome: "Cajuína", preco: "R$ 10,00" },
      { nome: "Coco da praia", preco: "R$ 7,00" },
      { nome: "Red Bull 250 ml", preco: "R$ 12,00" },
      { nome: "Monster 473 ml", preco: "R$ 15,00" }
    ]
  },

  {
    categoria: "Bebidas com Álcool",
    tempo: 9000,
    itens: [
      { nome: "Ice", preco: "R$ 10,00" }
    ]
  },

  {
    categoria: "Tira-Gosto",
    tempo: 14000,
    itens: [
      { nome: "Batata Frita", preco: "R$ 20,00" },
      { nome: "Ovos de Codorna (8 un)", preco: "R$ 10,00" },
      { nome: "Calabresa", preco: "R$ 20,00" },
      { nome: "Calabresa com Fritas", preco: "R$ 30,00" },
      { nome: "Filé com Fritas", preco: "R$ 40,00" },
      { nome: "Filé 300 g", preco: "R$ 45,00" },
      { nome: "Asinhas de frango", preco: "R$ 20,00" },
      { nome: "Pastelzinho (8 un) queijo/carne", preco: "R$ 15,00" }
    ]
  }

];


/* ============================================================
   LETREIRO DO RODAPÉ
   ============================================================
   Frases que se alternam no rodapé, uma de cada vez.
   Adicione, remova ou edite as frases abaixo à vontade.
   (O tempo de troca fica em script.js -> CONFIG.tempoLetreiro)
   ============================================================ */
const frases = [
  "O melhor espaço para suas confraternizações e eventos",
  "O ponto de encontro de amigos e família",
  "Reúna a galera e venha torcer com a gente",
  "Comemore seu aniversário aqui na Arena Garrafa",
  "Cervejas sempre geladas e o melhor da rodada",
  "Seu evento com toda a estrutura da Arena Garrafa"
];
