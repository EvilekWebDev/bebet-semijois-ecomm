/* ================================================================= */
/* produtos.js - BANCO DE DADOS DE PRODUTOS DA BEBET SEMIJOIAS      */
/* ================================================================= */
/* COMO ADICIONAR UM NOVO PRODUTO:                                   */
/*                                                                  */
/* 1. Adicione a imagem do produto na pasta: /img/produtos/         */
/*    (formato recomendado: 800x800px, JPG ou PNG, fundo neutro)    */
/*                                                                  */
/* 2. Copie o modelo abaixo e adicione ao array "PRODUTOS":         */
/*                                                                  */
/*    {                                                             */
/*        id: 16,                              // ID único          */
/*        nome: "Nome do Produto",             // Nome exibido      */
/*        categoria: "aneis",                  // ver CATEGORIAS     */
/*        preco: 89.90,                        // Preço em reais    */
/*        precoAntigo: 119.90,                 // Opcional: preço   */
/*        imagem: "img/produtos/seu-arquivo.jpg",  // Caminho img    */
/*        descricao: "Descrição curta do produto (max 100 chars)",  */
/*        estoque: 10,                         // Opcional          */
/*        destaque: true,                      // Opcional: bool    */
/*        material: "Banho de ouro 18k"        // Opcional          */
/*    }                                                             */
/*                                                                  */
/* 3. Se criou uma nova CATEGORIA, adicione o objeto em             */
/*    CATEGORIAS (mais abaixo).                                     */
/*                                                                  */
/* ================================================================= */


/* ================================================================= */
/* CONFIGURAÇÃO DA LOJA                                              */
/* ================================================================= */

const CONFIG_LOJA = {
    // Número do WhatsApp para onde os pedidos serão enviados
    // Formato: código do país + DDD + número (sem espaços ou traços)
    whatsappNumero: '5574981005498',

    // Texto introdutório da mensagem do WhatsApp
    whatsappMensagem: 'Olá! Gostaria de fazer o seguinte pedido na Bebet Semijoias:',

    // Nome da loja (usado em alguns lugares)
    nomeLoja: 'Bebet Semijoias',
};


/* ================================================================= */
/* CATEGORIAS DISPONÍVEIS                                            */
/* ================================================================= */
/* Ícones do Font Awesome correspondentes a cada categoria          */

const CATEGORIAS = [
    { id: 'todos',     nome: 'Todos',     icone: 'fa-gem'        },
    { id: 'aneis',     nome: 'Anéis',     icone: 'fa-circle'     },
    { id: 'colares',   nome: 'Colares',   icone: 'fa-link'       },
    { id: 'brincos',   nome: 'Brincos',   icone: 'fa-dot-circle' },
    { id: 'pulseiras', nome: 'Pulseiras', icone: 'fa-circle-notch' },
    { id: 'conjuntos', nome: 'Conjuntos', icone: 'fa-gifts'      },
];


/* ================================================================= */
/* LISTA DE PRODUTOS                                                 */
/* ================================================================= */
/* Esta é a "base de dados" principal. Edite aqui para adicionar,    */
/* remover ou alterar produtos. NÃO É NECESSÁRIO ALTERAR O HTML.    */

const PRODUTOS = [
    {
        id: 1,
        nome: "Anel Solitário Dourado",
        categoria: "aneis",
        preco: 89.90,
        precoAntigo: 119.90,
        imagem: "img/produtos/anel-solitario.jpg",
        descricao: "Anel solitário clássico com banho de ouro 18k e pedra de zircônia. Sofisticação para o dia a dia.",
        estoque: 15,
        destaque: true,
        material: "Banho de ouro 18k"
    },
    {
        id: 2,
        nome: "Colar Coração Rosé",
        categoria: "colares",
        preco: 129.90,
        imagem: "img/produtos/colar-coracao.jpg",
        descricao: "Colar delicado com pingente de coração em rosé gold. Corrente fina de 45cm com extensor.",
        estoque: 8,
        destaque: true,
        material: "Banho de rosé gold"
    },
    {
        id: 3,
        nome: "Brinco Argola Média",
        categoria: "brincos",
        preco: 69.90,
        imagem: "img/produtos/brinco-argola.jpg",
        descricao: "Brinco argola média com banho de ouro 18k. Peça atemporal e elegante para todas as ocasiões.",
        estoque: 20,
        material: "Banho de ouro 18k"
    },
    {
        id: 4,
        nome: "Pulseira Veneziana",
        categoria: "pulseiras",
        preco: 79.90,
        imagem: "img/produtos/pulseira-veneziana.jpg",
        descricao: "Pulseira veneziana delicada com fecho de mosquetão. Banho de ouro 18k, antialérgica.",
        estoque: 12,
        material: "Banho de ouro 18k"
    },
    {
        id: 5,
        nome: "Anel Trio Cravejado",
        categoria: "aneis",
        preco: 149.90,
        precoAntigo: 189.90,
        imagem: "img/produtos/anel-trio.jpg",
        descricao: "Conjunto de três anéis com microzircônias. Design moderno que pode ser usado junto ou separado.",
        estoque: 5,
        destaque: true,
        material: "Banho de ouro 18k + zircônia"
    },
    {
        id: 6,
        nome: "Colar Gargantilha",
        categoria: "colares",
        preco: 99.90,
        imagem: "img/produtos/colar-gargantilha.jpg",
        descricao: "Gargantilha choker com pingente de bolinha. Corrente ajustável, super feminina e charmosa.",
        estoque: 10,
        material: "Banho de ouro 18k"
    },
    {
        id: 7,
        nome: "Brinco Gota Cristal",
        categoria: "brincos",
        preco: 89.90,
        imagem: "img/produtos/brinco-gota.jpg",
        descricao: "Brinco pendente em formato de gota com cristal lapidado. Perfeito para ocasiões especiais.",
        estoque: 7,
        destaque: true,
        material: "Banho de rosé gold + cristal"
    },
    {
        id: 8,
        nome: "Pulseira Elos Cubanos",
        categoria: "pulseiras",
        preco: 119.90,
        imagem: "img/produtos/pulseira-elos.jpg",
        descricao: "Pulseira de elos cubanos com acabamento polido. Peça statement que valoriza qualquer look.",
        estoque: 6,
        material: "Banho de ouro 18k"
    },
    {
        id: 9,
        nome: "Conjunto Noiva Elegance",
        categoria: "conjuntos",
        preco: 299.90,
        precoAntigo: 399.90,
        imagem: "img/produtos/conjunto-noiva.jpg",
        descricao: "Conjunto completo com colar, brincos e pulseira. Ideal para noivas e madrinhas.",
        estoque: 3,
        destaque: true,
        material: "Banho de ouro 18k + perolas"
    },
    {
        id: 10,
        nome: "Anel Meia Aliança",
        categoria: "aneis",
        preco: 109.90,
        imagem: "img/produtos/anel-meia-alianca.jpg",
        descricao: "Meia aliança cravejada com microzircônias. Sofisticação e brilho em uma única peça.",
        estoque: 9,
        material: "Banho de ouro 18k + zircônia"
    },
    {
        id: 11,
        nome: "Colar Pingente Lua",
        categoria: "colares",
        preco: 119.90,
        imagem: "img/produtos/colar-lua.jpg",
        descricao: "Colar com pingente de lua e estrelas. Corrente delicada de 50cm com pingente em rosé gold.",
        estoque: 11,
        material: "Banho de rosé gold"
    },
    {
        id: 12,
        nome: "Brinco Ear Cuff Dourado",
        categoria: "brincos",
        preco: 79.90,
        imagem: "img/produtos/brinco-earcuff.jpg",
        descricao: "Brinco ear cuff moderno, sem necessidade de furo. Design contemporâneo e cheio de estilo.",
        estoque: 8,
        material: "Banho de ouro 18k"
    },
    {
        id: 13,
        nome: "Conjunto Delicado Rosé",
        categoria: "conjuntos",
        preco: 229.90,
        imagem: "img/produtos/conjunto-rose.jpg",
        descricao: "Conjunto de colar e brincos em rosé gold. Peças delicadas para um visual romântico e feminino.",
        estoque: 4,
        material: "Banho de rosé gold"
    },
    {
        id: 14,
        nome: "Anel Coração Vazado",
        categoria: "aneis",
        preco: 99.90,
        imagem: "img/produtos/anel-coracao.jpg",
        descricao: "Anel com detalhe de coração vazado. Romântico e delicado, perfeito para presentear.",
        estoque: 14,
        material: "Banho de ouro 18k"
    },
    {
        id: 15,
        nome: "Pulseira Corrente Dourada",
        categoria: "pulseiras",
        preco: 89.90,
        imagem: "img/produtos/pulseira-corrente.jpg",
        descricao: "Pulseira corrente fina com elos trabalhados. Banho de ouro 18k, antialérgica e resistente.",
        estoque: 13,
        material: "Banho de ouro 18k"
    }
];


/* ================================================================= */
/* FUNÇÕES AUXILIARES                                                */
/* ================================================================= */

/**
 * Formata um número para o formato de moeda brasileira (R$)
 * @param {number} valor - Valor numérico
 * @returns {string} - Valor formatado (ex: "R$ 89,90")
 */
function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

/**
 * Sanitiza uma string para evitar XSS (Cross-Site Scripting)
 * Remove tags HTML e caracteres perigosos
 * @param {string} texto - Texto a ser sanitizado
 * @returns {string} - Texto seguro
 */
function sanitizar(texto) {
    if (typeof texto !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

/**
 * Valida e converte um valor para número positivo inteiro
 * @param {any} valor - Valor a ser validado
 * @param {number} min - Valor mínimo permitido (padrão: 1)
 * @param {number} max - Valor máximo permitido (padrão: 99)
 * @returns {number} - Número validado
 */
function validarQuantidade(valor, min = 1, max = 99) {
    // Converte para número
    const num = parseInt(valor, 10);
    // Verifica se é um número válido
    if (isNaN(num) || num < min) return min;
    if (num > max) return max;
    return num;
}

/**
 * Encontra um produto pelo seu ID
 * @param {number} id - ID do produto
 * @returns {object|null} - Objeto do produto ou null se não encontrado
 */
function encontrarProduto(id) {
    return PRODUTOS.find(p => p.id === id) || null;
}

/**
 * Retorna a lista de categorias que têm produtos
 * @returns {array} - Array com categorias e quantidade
 */
function contarProdutosPorCategoria() {
    return CATEGORIAS.map(cat => {
        if (cat.id === 'todos') {
            return { ...cat, quantidade: PRODUTOS.length };
        }
        return {
            ...cat,
            quantidade: PRODUTOS.filter(p => p.categoria === cat.id).length
        };
    });
}
