/* ================================================================= */
/* carrinho.js - LÓGICA DO CARRINHO DE COMPRAS                       */
/* ================================================================= */
/* Este arquivo gerencia:                                            */
/*   - Estado do carrinho (array de itens)                           */
/*   - Persistência no localStorage (não perde ao recarregar)        */
/*   - Adicionar, remover, alterar quantidade de produtos            */
/*   - Cálculo automático de totais                                  */
/*   - Geração de mensagem formatada para WhatsApp                   */
/* ================================================================= */


/* ================================================================= */
/* CONFIGURAÇÃO DO CARRINHO                                          */
/* ================================================================= */

const CARRINHO_CONFIG = {
    // Chave usada no localStorage para salvar o carrinho
    storageKey: 'bebet_carrinho',

    // Tempo (em ms) para mostrar notificações toast
    toastDuration: 3000,
};


/* ================================================================= */
/* ESTADO DO CARRINHO                                                */
/* ================================================================= */

// Array de itens no carrinho. Cada item tem o formato:
// { id: number, nome: string, preco: number, imagem: string, quantidade: number }
let carrinhoItens = [];


/* ================================================================= */
/* FUNÇÕES DE PERSISTÊNCIA                                           */
/* ================================================================= */

/**
 * Carrega o carrinho salvo no localStorage ao iniciar a página
 */
function carregarCarrinho() {
    try {
        const salvo = localStorage.getItem(CARRINHO_CONFIG.storageKey);
        if (salvo) {
            const parsed = JSON.parse(salvo);
            // Valida se é um array antes de atribuir
            if (Array.isArray(parsed)) {
                carrinhoItens = parsed;
            }
        }
    } catch (erro) {
        // Se houver erro ao ler (JSON corrompido), limpa o carrinho
        console.warn('Erro ao carregar carrinho:', erro);
        carrinhoItens = [];
        salvarCarrinho();
    }
}

/**
 * Salva o carrinho atual no localStorage
 */
function salvarCarrinho() {
    try {
        localStorage.setItem(
            CARRINHO_CONFIG.storageKey,
            JSON.stringify(carrinhoItens)
        );
    } catch (erro) {
        console.warn('Erro ao salvar carrinho:', erro);
    }
}


/* ================================================================= */
/* FUNÇÕES DE MANIPULAÇÃO DO CARRINHO                                */
/* ================================================================= */

/**
 * Adiciona um produto ao carrinho (ou incrementa sua quantidade)
 * @param {number} produtoId - ID do produto a adicionar
 * @param {number} quantidade - Quantidade a adicionar (padrão: 1)
 */
function adicionarAoCarrinho(produtoId, quantidade = 1) {
    // Busca o produto no "banco de dados"
    const produto = encontrarProduto(produtoId);
    if (!produto) {
        mostrarToast('Produto não encontrado.', 'erro');
        return;
    }

    // Verifica estoque (se definido)
    if (produto.estoque !== undefined && produto.estoque <= 0) {
        mostrarToast('Produto esgotado!', 'erro');
        return;
    }

    // Valida a quantidade
    const qtd = validarQuantidade(quantidade);

    // Verifica se o produto já está no carrinho
    const itemExistente = carrinhoItens.find(item => item.id === produtoId);

    if (itemExistente) {
        // Incrementa a quantidade
        const novaQtd = itemExistente.quantidade + qtd;

        // Verifica estoque
        if (produto.estoque !== undefined && novaQtd > produto.estoque) {
            mostrarToast(`Apenas ${produto.estoque} unidade(s) disponível(eis).`, 'erro');
            return;
        }

        itemExistente.quantidade = novaQtd;
    } else {
        // Adiciona novo item ao carrinho
        carrinhoItens.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: qtd,
        });
    }

    // Persiste no localStorage e atualiza a interface
    salvarCarrinho();
    renderizarCarrinho();
    atualizarContadorCarrinho();

    // Feedback visual
    mostrarToast(`${produto.nome} adicionado ao carrinho!`, 'sucesso');
}

/**
 * Remove completamente um item do carrinho
 * @param {number} produtoId - ID do produto a remover
 */
function removerDoCarrinho(produtoId) {
    const item = carrinhoItens.find(i => i.id === produtoId);
    if (!item) return;

    // Confirmação simples
    if (!confirm(`Remover "${item.nome}" do carrinho?`)) return;

    carrinhoItens = carrinhoItens.filter(item => item.id !== produtoId);
    salvarCarrinho();
    renderizarCarrinho();
    atualizarContadorCarrinho();
    mostrarToast('Item removido do carrinho.', 'info');
}

/**
 * Altera a quantidade de um item no carrinho
 * @param {number} produtoId - ID do produto
 * @param {number} novaQuantidade - Nova quantidade desejada
 */
function alterarQuantidade(produtoId, novaQuantidade) {
    const item = carrinhoItens.find(i => i.id === produtoId);
    if (!item) return;

    const qtd = validarQuantidade(novaQuantidade);

    // Se a quantidade for 0, remove o item
    if (qtd <= 0) {
        removerDoCarrinho(produtoId);
        return;
    }

    // Verifica estoque
    const produto = encontrarProduto(produtoId);
    if (produto && produto.estoque !== undefined && qtd > produto.estoque) {
        mostrarToast(`Apenas ${produto.estoque} unidade(s) disponível(eis).`, 'erro');
        return;
    }

    item.quantidade = qtd;
    salvarCarrinho();
    renderizarCarrinho();
    atualizarContadorCarrinho();
}

/**
 * Incrementa a quantidade de um item em 1
 */
function incrementarQuantidade(produtoId) {
    const item = carrinhoItens.find(i => i.id === produtoId);
    if (item) {
        alterarQuantidade(produtoId, item.quantidade + 1);
    }
}

/**
 * Decrementa a quantidade de um item em 1
 */
function decrementarQuantidade(produtoId) {
    const item = carrinhoItens.find(i => i.id === produtoId);
    if (item) {
        alterarQuantidade(produtoId, item.quantidade - 1);
    }
}

/**
 * Limpa todos os itens do carrinho
 */
function limparCarrinho() {
    if (carrinhoItens.length === 0) return;
    if (!confirm('Deseja realmente limpar todo o carrinho?')) return;

    carrinhoItens = [];
    salvarCarrinho();
    renderizarCarrinho();
    atualizarContadorCarrinho();
    mostrarToast('Carrinho limpo.', 'info');
}


/* ================================================================= */
/* FUNÇÕES DE CÁLCULO                                                */
/* ================================================================= */

/**
 * Calcula o total do carrinho (soma de todos os subtotais)
 * @returns {number} - Valor total em reais
 */
function calcularTotal() {
    return carrinhoItens.reduce((total, item) => {
        return total + (item.preco * item.quantidade);
    }, 0);
}

/**
 * Calcula o total de itens (somatório das quantidades)
 * @returns {number} - Quantidade total de itens
 */
function contarItens() {
    return carrinhoItens.reduce((total, item) => total + item.quantidade, 0);
}


/* ================================================================= */
/* INTEGRAÇÃO COM WHATSAPP                                           */
/* ================================================================= */

/**
 * Gera a mensagem formatada para enviar via WhatsApp
 * @returns {string} - Mensagem completa
 */
function gerarMensagemWhatsApp() {
    if (carrinhoItens.length === 0) {
        return '';
    }

    // Começa com a saudação
    let mensagem = `*${sanitizar(CONFIG_LOJA.whatsappMensagem)}*\n\n`;

    // Adiciona a lista de produtos
    mensagem += '*📋 Itens do Pedido:*\n';
    mensagem += '─────────────────────\n';

    carrinhoItens.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `*${index + 1}. ${sanitizar(item.nome)}*\n`;
        mensagem += `   Qtd: ${item.quantidade}x ${formatarPreco(item.preco)}\n`;
        mensagem += `   Subtotal: *${formatarPreco(subtotal)}*\n\n`;
    });

    // Adiciona o total
    mensagem += '─────────────────────\n';
    mensagem += `*💰 TOTAL DO PEDIDO: ${formatarPreco(calcularTotal())}*\n\n`;

    // Adiciona informações finais
    mensagem += 'Aguardo a confirmação e os dados para pagamento/entrega. 😊\n';
    mensagem += `*${sanitizar(CONFIG_LOJA.nomeLoja)}* ✨`;

    return mensagem;
}

/**
 * Abre o WhatsApp Web/App com a mensagem do pedido
 */
function finalizarPedidoWhatsApp() {
    if (carrinhoItens.length === 0) {
        mostrarToast('Seu carrinho está vazio!', 'erro');
        return;
    }

    const mensagem = gerarMensagemWhatsApp();
    const numero = CONFIG_LOJA.whatsappNumero;

    // Validação básica do número
    if (!numero || numero === '5511999999999') {
        mostrarToast('Configure o número do WhatsApp em js/produtos.js', 'erro');
        console.warn('⚠️ Número do WhatsApp não configurado!');
    }

    // Codifica a mensagem para URL (encodeURIComponent)
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    // Abre em nova aba
    window.open(url, '_blank');

    // Feedback visual
    mostrarToast('Abrindo WhatsApp...', 'sucesso');
}


/* ================================================================= */
/* ATUALIZAÇÃO DA INTERFACE                                          */
/* ================================================================= */

/**
 * Atualiza o contador de itens no ícone do carrinho (header)
 */
function atualizarContadorCarrinho() {
    const contador = document.getElementById('carrinho-contador');
    if (!contador) return;

    const total = contarItens();
    contador.textContent = total;

    // Adiciona/remove classe para mostrar/esconder
    if (total === 0) {
        contador.classList.add('vazio');
    } else {
        contador.classList.remove('vazio');
    }
}

/**
 * Renderiza o conteúdo do carrinho (painel lateral)
 * Esta função é chamada sempre que o carrinho é alterado
 */
function renderizarCarrinho() {
    const corpo = document.getElementById('carrinho-corpo');
    const totalEl = document.getElementById('carrinho-total');
    if (!corpo || !totalEl) return;

    // Atualiza o valor total
    totalEl.textContent = formatarPreco(calcularTotal());

    // Se o carrinho está vazio, mostra mensagem
    if (carrinhoItens.length === 0) {
        corpo.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-bag"></i>
                <p>Seu carrinho está vazio</p>
                <small>Adicione produtos do nosso catálogo!</small>
            </div>
        `;
        return;
    }

    // Renderiza cada item do carrinho
    let html = '';
    carrinhoItens.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        const imagemHtml = item.imagem
            ? `<img src="${sanitizar(item.imagem)}" alt="${sanitizar(item.nome)}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-gem\\'></i>'">`
            : `<i class="fas fa-gem"></i>`;

        html += `
            <div class="carrinho-item" data-id="${item.id}">
                <div class="carrinho-item__imagem">
                    ${imagemHtml}
                </div>
                <div class="carrinho-item__info">
                    <h4 class="carrinho-item__nome">${sanitizar(item.nome)}</h4>
                    <div class="carrinho-item__preco">${formatarPreco(item.preco)}</div>
                    <div class="carrinho-item__quantidade">
                        <button class="qtd-btn" onclick="decrementarQuantidade(${item.id})" aria-label="Diminuir quantidade">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="qtd-valor">${item.quantidade}</span>
                        <button class="qtd-btn" onclick="incrementarQuantidade(${item.id})" aria-label="Aumentar quantidade">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="carrinho-item__acoes">
                    <span class="carrinho-item__subtotal">${formatarPreco(subtotal)}</span>
                    <button class="carrinho-item__remover" onclick="removerDoCarrinho(${item.id})" aria-label="Remover item">
                        <i class="fas fa-trash-alt"></i> Remover
                    </button>
                </div>
            </div>
        `;
    });

    corpo.innerHTML = html;
}


/* ================================================================= */
/* CONTROLE DO PAINEL DO CARRINHO                                   */
/* ================================================================= */

/**
 * Abre o painel lateral do carrinho
 */
function abrirCarrinho() {
    const carrinho = document.getElementById('carrinho');
    const overlay = document.getElementById('carrinho-overlay');
    if (carrinho) carrinho.classList.add('aberto');
    if (overlay) overlay.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o painel lateral do carrinho
 */
function fecharCarrinho() {
    const carrinho = document.getElementById('carrinho');
    const overlay = document.getElementById('carrinho-overlay');
    if (carrinho) carrinho.classList.remove('aberto');
    if (overlay) overlay.classList.remove('ativo');
    document.body.style.overflow = '';
}


/* ================================================================= */
/* SISTEMA DE NOTIFICAÇÕES (TOAST)                                   */
/* ================================================================= */

/**
 * Exibe uma notificação toast no canto da tela
 * @param {string} mensagem - Texto da notificação
 * @param {string} tipo - 'sucesso', 'erro' ou 'info'
 */
function mostrarToast(mensagem, tipo = 'info') {
    // Remove toast anterior se existir
    const toastAnterior = document.querySelector('.toast');
    if (toastAnterior) {
        toastAnterior.remove();
    }

    // Cria novo toast
    const toast = document.createElement('div');
    toast.className = `toast toast--${tipo}`;

    // Ícone baseado no tipo
    let icone = 'fa-info-circle';
    if (tipo === 'sucesso') icone = 'fa-check-circle';
    if (tipo === 'erro') icone = 'fa-exclamation-circle';

    toast.innerHTML = `
        <i class="fas ${icone}"></i>
        <span>${sanitizar(mensagem)}</span>
    `;

    document.body.appendChild(toast);

    // Mostra com animação (pequeno delay para o CSS)
    setTimeout(() => toast.classList.add('mostrar'), 10);

    // Remove após o tempo configurado
    setTimeout(() => {
        toast.classList.remove('mostrar');
        setTimeout(() => toast.remove(), 300);
    }, CARRINHO_CONFIG.toastDuration);
}


/* ================================================================= */
/* INICIALIZAÇÃO                                                     */
/* ================================================================= */

// Carrega o carrinho salvo assim que o script é executado
carregarCarrinho();
