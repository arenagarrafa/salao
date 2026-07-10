/* ================================================================
   ARENA GARRAFA — CARDÁPIO SALÃO
   Lógica do painel (JavaScript puro — sem bibliotecas, 100% offline)

   Os dados vêm de menu.js (variável global `menu`). Este arquivo
   apenas: exibe uma categoria por página, troca automaticamente em
   loop infinito, ajusta a escala para a TV e trata os atalhos.

   Para o dia a dia, edite APENAS o menu.js. Se quiser mudar o tempo
   padrão das páginas ou a duração da transição, use o bloco CONFIG.
   ================================================================ */


/* ----------------------------------------------------------------
   CONFIGURAÇÃO (ajustável)
   ---------------------------------------------------------------- */
const CONFIG = {
  /* Tempo padrão que cada página fica na tela, em milissegundos.
     Usado quando a categoria não define seu próprio "tempo" no menu.js.
     1000 ms = 1 segundo. */
  tempoPadrao: 12000,

  /* Tempo (ms) entre as trocas das frases do letreiro do rodapé. */
  tempoLetreiro: 7000
};


/* ----------------------------------------------------------------
   ESTADO INTERNO
   ---------------------------------------------------------------- */
const estado = {
  indice: 0,
  pausado: false,
  timer: null,
  fraseIndice: 0,
  timerLetreiro: null
};


/* ----------------------------------------------------------------
   REFERÊNCIAS DO DOM
   ---------------------------------------------------------------- */
const dom = {
  palco:           document.getElementById("palco"),
  banner:          document.getElementById("banner"),
  bannerFallback:  document.getElementById("banner-fallback"),
  pagina:          document.getElementById("pagina"),
  categoriaTitulo: document.getElementById("categoria-titulo"),
  categoriaItens:  document.getElementById("categoria-itens"),
  letreiro:        document.getElementById("letreiro"),
  letreiroFrase:   document.getElementById("letreiro-frase"),
  indicadorPausa:  document.getElementById("indicador-pausa")
};


/* ----------------------------------------------------------------
   ESCALA AUTOMÁTICA PARA A TV
   O layout é fixo em 1920x1080; aqui aplicamos um zoom para
   preencher a resolução real do navegador, sem barras de rolagem.
   ---------------------------------------------------------------- */
function ajustarEscala() {
  const escala = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  const sobraX = (window.innerWidth - 1920 * escala) / 2;
  const sobraY = (window.innerHeight - 1080 * escala) / 2;
  dom.palco.style.transform = `translate(${sobraX}px, ${sobraY}px) scale(${escala})`;
}


/* ----------------------------------------------------------------
   BANNER — usa assets/banner.jpg; se faltar, mostra a marca em texto
   ---------------------------------------------------------------- */
function configurarBanner() {
  const usarFallback = () => {
    dom.banner.hidden = true;
    dom.bannerFallback.hidden = false;
  };
  dom.banner.addEventListener("error", usarFallback);
  if (dom.banner.complete && dom.banner.naturalWidth === 0) {
    usarFallback();
  }
}


/* ----------------------------------------------------------------
   RENDERIZAÇÃO DA CATEGORIA (uma página)
   ---------------------------------------------------------------- */
function criarLinhaDeItem(item) {
  const linha = document.createElement("div");
  linha.className = "item";
  linha.innerHTML = `
    <span class="item__nome">${item.nome}</span>
    <span class="item__lider"></span>
    <span class="item__preco">${item.preco}</span>
  `;
  return linha;
}

/* Decide 1 ou 2 colunas conforme a quantidade de itens, para manter
   o texto grande (legível de longe) mesmo em categorias cheias. */
function calcularColunas(itens) {
  return itens.length > 6 ? "duas-colunas" : "";
}

/* Divide os itens em duas metades equilibradas, lidas de cima para
   baixo em cada coluna (sem zigue-zague). */
function dividirEmColunas(itens) {
  const meio = Math.ceil(itens.length / 2);
  return [itens.slice(0, meio), itens.slice(meio)];
}

function renderizarItens(itens) {
  const duasColunas = itens.length > 6;
  dom.categoriaItens.className = `itens ${calcularColunas(itens)}`;
  dom.categoriaItens.innerHTML = "";

  const colunas = duasColunas ? dividirEmColunas(itens) : [itens];
  colunas.forEach((itensDaColuna) => {
    const colunaEl = document.createElement("div");
    colunaEl.className = "coluna";
    itensDaColuna.forEach((item) => colunaEl.appendChild(criarLinhaDeItem(item)));
    dom.categoriaItens.appendChild(colunaEl);
  });

  ajustarParaCaber();
}

/* Reduz a escala dos itens (variável CSS --fit) até que tudo caiba:
   nem a lista ultrapassa a altura, nem algum nome fica cortado na
   largura. Assim a lista pode crescer e ter nomes longos sem quebrar. */
function ajustarParaCaber() {
  const alvo = dom.categoriaItens;

  const transborda = () => {
    if (alvo.scrollHeight > alvo.clientHeight + 1) return true;      // altura
    const nomes = alvo.querySelectorAll(".item__nome");
    for (const nome of nomes) {
      if (nome.scrollWidth > nome.clientWidth + 1) return true;      // largura (nome cortado)
    }
    return false;
  };

  let fit = 1;
  alvo.style.setProperty("--fit", "1");
  while (fit > 0.5 && transborda()) {
    fit -= 0.05;
    alvo.style.setProperty("--fit", fit.toFixed(2));
  }
}

function renderizarCategoria(categoria) {
  dom.categoriaTitulo.textContent = categoria.categoria;
  renderizarItens(categoria.itens);
  reiniciarAnimacao();
}

/* Reinicia a animação de entrada (fade + slide) a cada troca. */
function reiniciarAnimacao() {
  dom.pagina.classList.remove("entrando");
  void dom.pagina.offsetWidth;      // força reflow
  dom.pagina.classList.add("entrando");
}


/* ----------------------------------------------------------------
   ROTAÇÃO AUTOMÁTICA (loop infinito — nunca para)
   ---------------------------------------------------------------- */
function trocarPagina(passo = 1) {
  const total = menu.length;
  estado.indice = (estado.indice + passo + total) % total;
  renderizarCategoria(menu[estado.indice]);
  agendarProxima();
}

function agendarProxima() {
  clearTimeout(estado.timer);
  if (estado.pausado) return;
  const tempo = menu[estado.indice].tempo || CONFIG.tempoPadrao;
  estado.timer = setTimeout(() => trocarPagina(1), tempo);
}


/* ----------------------------------------------------------------
   LETREIRO DO RODAPÉ (frases que se alternam)
   As frases vêm de menu.js (variável global `frases`).
   ---------------------------------------------------------------- */
function iniciarLetreiro() {
  /* Sem frases definidas: esconde o rodapé e não faz nada. */
  if (typeof frases === "undefined" || !frases.length) {
    dom.letreiro.hidden = true;
    return;
  }
  estado.fraseIndice = 0;
  dom.letreiroFrase.textContent = frases[0];
  dom.letreiroFrase.classList.add("visivel");
  reiniciarTimerLetreiro();
}

function trocarFrase() {
  /* Apaga a frase, troca o texto e mostra a próxima (efeito fade). */
  dom.letreiroFrase.classList.remove("visivel");
  setTimeout(() => {
    estado.fraseIndice = (estado.fraseIndice + 1) % frases.length;
    dom.letreiroFrase.textContent = frases[estado.fraseIndice];
    dom.letreiroFrase.classList.add("visivel");
  }, 500);
}

function reiniciarTimerLetreiro() {
  clearInterval(estado.timerLetreiro);
  estado.timerLetreiro = setInterval(trocarFrase, CONFIG.tempoLetreiro);
}


/* ----------------------------------------------------------------
   PAUSA / RETOMADA (atalho: Espaço)
   ---------------------------------------------------------------- */
function alternarPausa() {
  estado.pausado = !estado.pausado;
  dom.indicadorPausa.hidden = !estado.pausado;
  if (estado.pausado) {
    clearTimeout(estado.timer);
    clearInterval(estado.timerLetreiro);
  } else {
    agendarProxima();
    reiniciarTimerLetreiro();
  }
}


/* ----------------------------------------------------------------
   TELA CHEIA (atalho: F)
   ---------------------------------------------------------------- */
function alternarTelaCheia() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}


/* ----------------------------------------------------------------
   ATALHOS DE TECLADO
   → próxima  ← anterior  Espaço = pausar  F = tela cheia
   ---------------------------------------------------------------- */
function configurarAtalhos() {
  document.addEventListener("keydown", (evento) => {
    switch (evento.key) {
      case "ArrowRight": trocarPagina(1);  break;
      case "ArrowLeft":  trocarPagina(-1); break;
      case " ":          evento.preventDefault(); alternarPausa(); break;
      case "f":
      case "F":          alternarTelaCheia(); break;
    }
  });
}


/* ----------------------------------------------------------------
   INICIALIZAÇÃO
   ---------------------------------------------------------------- */
function iniciar() {
  configurarBanner();
  ajustarEscala();
  window.addEventListener("resize", ajustarEscala);
  configurarAtalhos();

  estado.indice = 0;
  renderizarCategoria(menu[0]);
  agendarProxima();

  iniciarLetreiro();
}

document.addEventListener("DOMContentLoaded", iniciar);
