# 💎 Bebet Semijoias — Site de E-commerce

Site completo de e-commerce para a marca **Bebet Semijoias**, com catálogo, carrinho de compras e finalização de pedido via WhatsApp. Design elegante, responsivo (mobile-first) e fácil de manter.

---

## ✨ Funcionalidades

- 📱 **100% responsivo** (mobile-first)
- 🛍️ **Catálogo de produtos** com filtros por categoria
- 🛒 **Carrinho lateral** com persistência no `localStorage` (não perde ao recarregar)
- 💬 **Finalização de pedido via WhatsApp** com mensagem formatada automaticamente
- 🎨 **Design sofisticado** — paleta dourado/rosé gold + tons neutros
- ✨ **Animações suaves** (hover, fade-in ao rolar)
- 🔒 **Seguro** — sem coleta de dados sensíveis, sanitização contra XSS, validação de quantidade

---

## 📁 Estrutura de Arquivos

```
bebet-semijoias/
├── index.html              # Página principal (HTML semântico)
├── README.md               # Este arquivo
├── css/
│   ├── style.css           # Estilos globais (header, seções, footer)
│   └── components.css      # Componentes (cards, modal do carrinho, toasts)
├── js/
│   ├── produtos.js         # ⭐ DADOS DOS PRODUTOS (edite aqui!)
│   ├── carrinho.js         # Lógica do carrinho + WhatsApp
│   └── main.js             # Renderização e eventos
└── img/
    └── produtos/           # Imagens dos produtos (800x800px recomendado)
```

---

## 🚀 Como Usar

### 1. Visualizar o site localmente

Como o site usa apenas HTML, CSS e JavaScript puro (sem build tools), basta abrir o arquivo `index.html` no navegador:

- **Duas formas simples:**
  - Clique duas vezes no arquivo `index.html`
  - Ou, no terminal: `python -m http.server 8000` e acesse `http://localhost:8000`

> 💡 **Recomendação:** use um servidor local (como a opção do Python acima) para evitar problemas com CORS ao carregar imagens.

### 2. Configurar o número do WhatsApp

Abra o arquivo **`js/produtos.js`** e edite a constante `CONFIG_LOJA.whatsappNumero`:

```javascript
const CONFIG_LOJA = {
    // Formato: 55 (Brasil) + DDD + número (sem espaços ou traços)
    whatsappNumero: '5511999999999',  // ← ALTERE AQUI
    
    whatsappMensagem: 'Olá! Gostaria de fazer o seguinte pedido na Bebet Semijoias:',
    nomeLoja: 'Bebet Semijoias',
};
```

---

## ➕ Como Adicionar Novos Produtos

**Você só precisa editar o arquivo `js/produtos.js`.** Não é necessário alterar HTML.

### Passo 1: Adicione a imagem do produto

Coloque a imagem na pasta `/img/produtos/` com um nome descritivo:

```
img/produtos/
├── anel-solitario.jpg
├── colar-coracao.jpg
└── meu-novo-produto.jpg    ← nova imagem aqui
```

> **Tamanho recomendado:** 800x800px, formato JPG ou PNG, fundo neutro.

### Passo 2: Adicione o produto no array `PRODUTOS`

Abra `js/produtos.js` e adicione um novo objeto no final do array `PRODUTOS`:

```javascript
{
    id: 16,                                       // ID único (número)
    nome: "Anel Ouro com Pérola",                // Nome exibido
    categoria: "aneis",                          // ver CATEGORIAS abaixo
    preco: 159.90,                               // Preço atual em reais
    precoAntigo: 199.90,                         // Opcional: preço riscado
    imagem: "img/produtos/anel-perola.jpg",      // Caminho da imagem
    descricao: "Anel delicado com pérola natural e banho de ouro 18k.",
    estoque: 10,                                 // Opcional: quantidade disponível
    destaque: true,                              // Opcional: marca como destaque
    material: "Banho de ouro 18k + pérola"       // Opcional: descrição do material
}
```

### Passo 3 (opcional): Adicione uma nova categoria

Se o produto pertence a uma **categoria nova**, adicione-a no array `CATEGORIAS`:

```javascript
const CATEGORIAS = [
    { id: 'todos',     nome: 'Todos',     icone: 'fa-gem'        },
    { id: 'aneis',     nome: 'Anéis',     icone: 'fa-circle'     },
    { id: 'tornozeleiras', nome: 'Tornozeleiras', icone: 'fa-ring' },  // ← NOVA
    // ...
];
```

> 🎨 **Ícones:** use ícones do [Font Awesome 6 (grátis)](https://fontawesome.com/icons).

### Campos disponíveis para um produto

| Campo          | Tipo      | Obrigatório | Descrição                                       |
|----------------|-----------|-------------|-------------------------------------------------|
| `id`           | número    | ✅ Sim       | Identificador único                             |
| `nome`         | string    | ✅ Sim       | Nome do produto                                 |
| `categoria`    | string    | ✅ Sim       | ID da categoria (deve estar em `CATEGORIAS`)     |
| `preco`        | número    | ✅ Sim       | Preço em reais (ex: `89.90`)                    |
| `imagem`       | string    | ✅ Sim       | Caminho da imagem (ex: `img/produtos/x.jpg`)    |
| `descricao`    | string    | ✅ Sim       | Descrição curta (até 100 caracteres)            |
| `precoAntigo`  | número    | ❌ Opcional  | Exibe preço riscado (promoção)                  |
| `estoque`      | número    | ❌ Opcional  | Quantidade em estoque (0 = esgotado)            |
| `destaque`     | boolean   | ❌ Opcional  | Marca o produto como destaque                   |
| `material`     | string    | ❌ Opcional  | Material da peça (informativo)                  |

---

## 🎨 Personalização Visual

### Cores

Edite as variáveis CSS no topo do arquivo `css/style.css`:

```css
:root {
    --cor-dourado:        #d4af7a;   /* Dourado principal */
    --cor-rose-gold:      #b76e79;   /* Rosé gold */
    --cor-off-white:      #faf7f2;   /* Fundo */
    --cor-preto:          #1a1a1a;   /* Texto */
    /* ... */
}
```

### Fontes

O site usa **Playfair Display** (títulos) + **Poppins** (corpo), carregadas do Google Fonts. Para alterar, edite:

- O link no `<head>` do `index.html`
- As variáveis `--fonte-titulo` e `--fonte-corpo` no `style.css`

---

## 🔒 Segurança

O site foi desenvolvido com boas práticas de segurança:

- ✅ **Sem coleta de dados sensíveis** (nenhum formulário de cartão/senha)
- ✅ **Sanitização contra XSS** em todos os inputs dinâmicos
- ✅ **Validação de quantidade** (apenas números positivos)
- ✅ **HTTPS-ready** (recursos externos via CDN com SRI-friendly)
- ✅ **localStorage** isolado por origem (chave: `bebet_carrinho`)

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** semântico
- **CSS3** com variáveis customizadas e grid/flexbox
- **JavaScript ES6+** puro (sem dependências)
- **Google Fonts** (Playfair Display + Poppins)
- **Font Awesome 6** (ícones)

Nenhuma biblioteca ou framework externo foi necessário — o site é **leve, rápido e fácil de manter**.

---

## 📞 Contato / Suporte

Para dúvidas sobre o código, abra uma issue ou entre em contato pelo email: `contato@bebetsemijoias.com`.

---

## 📝 Licença

Este projeto foi criado para a **Bebet Semijoias**. Todos os direitos reservados.

---

✨ *Feito com carinho e brilho* ✨
