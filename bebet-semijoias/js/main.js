/* ================================================================= */
/* main.js - RENDERIZAÇÃO E EVENTOS GERAIS DO SITE                  */
/* ================================================================= */
/* Este arquivo é responsável por:                                   */
/*   - Renderizar o catálogo de produtos dinamicamente               */
/*   - Renderizar as categorias e botões de filtro                   */
/*   - Configurar eventos de interação (cliques, scroll, etc.)       */
/*   - Animações fade-in ao rolar a página                          */
/*   - Inicializar tudo quando o DOM estiver pronto                  */
/* ================================================================= */


/* ================================================================= */
/* ESTADO GLOBAL DA APLICAÇÃO                                        */
/* ================================================================= */

let categoriaAtiva = 'todos'; // Categoria atualmente selecionada no filtro


/* ================================================================= */
/* RENDERIZAÇÃO DO CATÁLOGO                                          */
/* ================================================================= */

/**
 * Renderiza todos os cards de produtos no catálogo
 * Filtra pela categoria ativa, se houver
 */
function renderizarProdutos() {
    const grid = document.getElementById('produtos-grid');
    const vazio = document.getElementById('produtos-vazio');
    if (!grid) return;

    // Filtra produtos pela categoria ativa
    const produtosFiltrados = categoriaAtiva === 'todos'
        ? PRODUTOS
        : PRODUTOS.filter(p => p.categoria === categoriaAtiva);

    // Se não há produtos, mostra mensagem
    if (produtosFiltrados.length === 0) {
        grid.innerHTML = '';
        if (vazio) vazio.style.display = 'block';
        return;
    }

    if (vazio) vazio.style.display = 'none';

    // Gera o HTML de cada card
    let html = '';
    produtosFiltrados.forEach(produto => {
        html += criarCardProduto(produto);
    });

    grid.innerHTML = html;

    // Re-aplica o efeito fade-in nos novos elementos
    setTimeout(aplicarFadeIn, 50);
}

/**
 * Cria o HTML de um card de produto
 * @param {object} produto - Objeto do produto
 * @returns {string} - HTML do card
 */
function criarCardProduto(produto) {
    // Categoria formatada (primeira letra maiúscula)
    const categoriaNome = produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1);

    // Badge de esgotado
    const badgeEsgotado = produto.estoque !== undefined && produto.estoque <= 0
        ? '<span class="produto-card__badge produto-card__badge--esgotado">Esgotado</span>'
        : `<span class="produto-card__badge">${sanitizar(categoriaNome)}</span>`;

    // Imagem com fallback para placeholder
    const imagemHtml = produto.imagem
        ? `<img src="${sanitizar(produto.imagem)}" alt="${sanitizar(produto.nome)}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-gem produto-card__placeholder\\'></i>'">`
        : '<i class="fas fa-gem produto-card__placeholder"></i>';

    // Preço (com opcional "preço antigo" riscado)
    const precoHtml = produto.precoAntigo
        ? `<span class="produto-card__preco-antigo">${formatarPreco(produto.precoAntigo)}</span>
           <span class="produto-card__preco">${formatarPreco(produto.preco)}</span>`
        : `<span class="produto-card__preco">${formatarPreco(produto.preco)}</span>`;

    // Botão desabilitado se esgotado
    const botaoDesabilitado = produto.estoque !== undefined && produto.estoque <= 0
        ? 'disabled'
        : '';

    return `
        <article class="produto-card fade-in" data-id="${produto.id}">
            <div class="produto-card__imagem">
                ${imagemHtml}
                ${badgeEsgotado}
                <button class="produto-card__favorito" aria-label="Favoritar" onclick="event.stopPropagation();">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="produto-card__info">
                <span class="produto-card__categoria">${sanitizar(categoriaNome)}</span>
                <h3 class="produto-card__nome">${sanitizar(produto.nome)}</h3>
                <p class="produto-card__descricao">${sanitizar(produto.descricao)}</p>
                <div class="produto-card__rodape">
                    <div>${precoHtml}</div>
                    <button class="btn-carrinho" ${botaoDesabilitado}
                            onclick="adicionarAoCarrinho(${produto.id})"
                            aria-label="Adicionar ${sanitizar(produto.nome)} ao carrinho">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}


/* ================================================================= */
/* RENDERIZAÇÃO DAS CATEGORIAS                                       */
/* ================================================================= */

/**
 * Renderiza os cards de categorias (com contador de produtos)
 */
function renderizarCategorias() {
    const grid = document.getElementById('categorias-grid');
    if (!grid) return;

    const categoriasComContagem = contarProdutosPorCategoria();

    let html = '';
    categoriasComContagem.forEach(cat => {
        if (cat.id === 'todos' || cat.quantidade > 0) {
            html += `
                <div class="categoria-card fade-in" onclick="filtrarPorCategoria('${cat.id}')">
                    <div class="categoria-card__icone">
                        <i class="fas ${cat.icone}"></i>
                    </div>
                    <h3 class="categoria-card__nome">${sanitizar(cat.nome)}</h3>
                    <span class="categoria-card__qtde">${cat.quantidade} ${cat.quantidade === 1 ? 'peça' : 'peças'}</span>
                </div>
            `;
        }
    });

    grid.innerHTML = html;
}

/**
 * Filtra produtos por uma categoria (acionado ao clicar num card de categoria)
 * @param {string} categoriaId - ID da categoria
 */
function filtrarPorCategoria(categoriaId) {
    categoriaAtiva = categoriaId;
    renderizarBotoesFiltro();
    renderizarProdutos();

    // Scroll suave até o catálogo
    const catalogo = document.getElementById('catalogo');
    if (catalogo) {
        catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


/* ================================================================= */
/* RENDERIZAÇÃO DOS BOTÕES DE FILTRO                                 */
/* ================================================================= */

/**
 * Renderiza os botões de filtro (Todos, Anéis, Colares, etc.)
 */
function renderizarBotoesFiltro() {
    const container = document.getElementById('filtros');
    if (!container) return;

    let html = '';
    CATEGORIAS.forEach(cat => {
        // Não mostra o filtro "Todos" no botão (apenas nas categorias)
        if (cat.id === 'todos') return;

        const ativo = categoriaAtiva === cat.id ? 'ativo' : '';
        html += `
            <button class="filtro-btn ${ativo}" onclick="selecionarFiltro('${cat.id}')">
                ${sanitizar(cat.nome)}
            </button>
        `;
    });

    // Botão "Todos" sempre presente
    const todosAtivo = categoriaAtiva === 'todos' ? 'ativo' : '';
    html = `
        <button class="filtro-btn ${todosAtivo}" onclick="selecionarFiltro('todos')">
            <i class="fas fa-th"></i> Todos
        </button>
    ` + html;

    container.innerHTML = html;
}

/**
 * Seleciona um filtro de categoria
 * @param {string} categoriaId - ID da categoria
 */
function selecionarFiltro(categoriaId) {
    categoriaAtiva = categoriaId;
    renderizarBotoesFiltro();
    renderizarProdutos();
}


/* ================================================================= */
/* ANIMAÇÕES DE SCROLL (FADE-IN)                                     */
/* ================================================================= */

/**
 * Aplica o efeito fade-in em elementos visíveis durante o scroll
 * Usa IntersectionObserver para performance
 */
function aplicarFadeIn() {
    const elementos = document.querySelectorAll('.fade-in:not(.visible)');

    // Se não há suporte a IntersectionObserver, mostra tudo
    if (!('IntersectionObserver' in window)) {
        elementos.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elementos.forEach(el => observer.observe(el));
}


/* ================================================================= */
/* CONFIGURAÇÃO DE EVENTOS                                           */
/* ================================================================= */

/**
 * Configura todos os event listeners da página
 */
function configurarEventos() {

    // ---- Botão do carrinho (abre o painel) ----
    const btnCarrinho = document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        btnCarrinho.addEventListener('click', abrirCarrinho);
    }

    // ---- Botão de fechar o carrinho ----
    const btnFechar = document.getElementById('carrinho-fechar');
    if (btnFechar) {
        btnFechar.addEventListener('click', fecharCarrinho);
    }

    // ---- Overlay (fecha o carrinho ao clicar fora) ----
    const overlay = document.getElementById('carrinho-overlay');
    if (overlay) {
        overlay.addEventListener('click', fecharCarrinho);
    }

    // ---- Botão "Finalizar Pedido" (WhatsApp) ----
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarPedidoWhatsApp);
    }

    // ---- Botão "Limpar Carrinho" ----
    const btnLimpar = document.getElementById('btn-limpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparCarrinho);
    }

    // ---- Menu mobile (hambúrguer) ----
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('aberto');
            // Troca o ícone do botão
            const icone = menuToggle.querySelector('i');
            if (nav.classList.contains('aberto')) {
                icone.classList.remove('fa-bars');
                icone.classList.add('fa-times');
            } else {
                icone.classList.remove('fa-times');
                icone.classList.add('fa-bars');
            }
        });

        // Fecha o menu ao clicar num link
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('aberto');
                const icone = menuToggle.querySelector('i');
                icone.classList.remove('fa-times');
                icone.classList.add('fa-bars');
            });
        });
    }

    // ---- Tecla ESC fecha o carrinho ----
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            fecharCarrinho();
        }
    });

    // ---- Botão flutuante do WhatsApp ----
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', (e) => {
            e.preventDefault();
            const mensagem = encodeURIComponent(
                `Olá! Gostaria de saber mais sobre as semijoias da ${CONFIG_LOJA.nomeLoja}.`
            );
            window.open(`https://wa.me/${CONFIG_LOJA.whatsappNumero}?text=${mensagem}`, '_blank');
        });
    }

    // ---- Header com efeito ao rolar ----
    let ultimaPosicao = 0;
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        const posicaoAtual = window.pageYOffset;

        if (header) {
            if (posicaoAtual > 100) {
                header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
            }
        }

        ultimaPosicao = posicaoAtual;
    });
}


/* ================================================================= */
/* INICIALIZAÇÃO (quando o DOM estiver pronto)                       */
/* ================================================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Renderiza todos os componentes dinâmicos
    renderizarCategorias();
    renderizarBotoesFiltro();
    renderizarProdutos();
    renderizarCarrinho();
    atualizarContadorCarrinho();

    // Configura os eventos da página
    configurarEventos();

    // Aplica animações iniciais
    aplicarFadeIn();

    // Log informativo (apenas em desenvolvimento)
    console.log('%c✨ Bebet Semijoias ✨', 'color: #d4af7a; font-size: 20px; font-weight: bold;');
    console.log(`%c${PRODUTOS.length} produtos carregados em ${CATEGORIAS.length - 1} categorias.`, 'color: #b76e79;');
});
