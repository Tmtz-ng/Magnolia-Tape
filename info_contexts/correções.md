# Magnolia Tape — Guia de Correções Técnicas

Este documento descreve **todas as mudanças necessárias** no projeto Magnolia Tape, com foco em **performance (Lighthouse), acessibilidade, boas práticas e manutenção**. O objetivo é orientar qualquer dev que entre no projeto a entender **o que mudar, onde e por quê**, separado por **HTML, CSS e JavaScript**.

---

## 🎯 Objetivo Geral

* Elevar **Performance Mobile (Lighthouse)** de ~87 para **92–95+**
* Melhorar **Acessibilidade** (93 → 95+)
* Reduzir custo de renderização em mobile
* Padronizar boas práticas de front-end (nível produção)

---

# 1️⃣ HTML — Estrutura, SEO e Acessibilidade

## 1.1 Ausência de `<main>`

**Problema:**
O HTML não possui a tag `<main>`, apenas `<section>`.

**Impacto:**

* Lighthouse Accessibility perde pontos
* Leitores de tela não identificam o conteúdo principal

**Correção:**
Envolver o conteúdo principal em uma única tag `<main>`.

**Por quê fazer:**
`<main>` é uma landmark semântica essencial para acessibilidade e SEO.

---

## 1.2 Imagens sem `width` e `height`

**Problema:**
As tags `<img>` não possuem dimensões explícitas.

**Impacto:**

* Lighthouse Performance (Layout Shift potencial)
* Browser não consegue reservar espaço antecipadamente

**Correção:**
Adicionar `width` e `height` em todas as imagens.

**Por quê fazer:**
Evita recalculo de layout e melhora LCP, principalmente no mobile.

---

## 1.3 Falta de `loading="lazy"` em imagens fora da dobra

**Problema:**
Imagens de artes e conteúdo secundário carregam imediatamente.

**Impacto:**

* LCP maior no mobile
* Uso desnecessário de banda

**Correção:**
Usar `loading="lazy"` em todas as imagens fora da hero.

**Por quê fazer:**
Carregamento progressivo melhora performance real e Lighthouse.

---

## 1.4 Links externos sem `rel="noopener noreferrer"`

**Problema:**
Links com `target="_blank"` não usam `rel` adequado.

**Impacto:**

* Lighthouse Best Practices
* Risco de segurança (`window.opener`)

**Correção:**
Adicionar `rel="noopener noreferrer"`.

**Por quê fazer:**
Boa prática de segurança e padrão web moderno.

---

## 1.5 Elementos clicáveis sem semântica

**Problema:**
`.team-member` é clicável mas não é botão nem link.

**Impacto:**

* Não acessível via teclado
* Screen readers não entendem interação

**Correção:**
Adicionar `role="button"`, `tabindex="0"` e `aria-expanded`.

**Por quê fazer:**
Acessibilidade interativa é requisito básico para Lighthouse e UX.

---

# 2️⃣ CSS — Performance, Manutenção e UX

## 2.1 Uso excessivo de `will-change`

**Problema:**
`will-change` aplicado em todas as `.section`.

**Impacto:**

* Consumo excessivo de GPU
* Mobile sofre mais

**Correção:**
Remover `will-change` do CSS base.

**Por quê fazer:**
`will-change` deve ser usado apenas temporariamente, não globalmente.

---

## 2.2 `overflow-x: hidden` no body

**Problema:**
Uso global pode mascarar bugs de layout.

**Impacto:**

* Dificulta debug
* Pode quebrar scroll interno

**Correção:**
Trocar por `overflow-x: clip` ou aplicar apenas onde necessário.

**Por quê fazer:**
Evita esconder problemas estruturais do layout.

---

## 2.3 Header fixo sem compensação de scroll

**Problema:**
Âncoras (`#id`) ficam escondidas atrás do header.

**Correção:**
Adicionar `scroll-margin-top` nas sections.

**Por quê fazer:**
Melhora navegação por âncoras e UX.

---

## 2.4 Imagens de pessoas como `background-image`

**Problema:**
Fotos dos membros são background CSS.

**Impacto:**

* Sem `alt`
* Sem lazy loading
* SEO inexistente

**Correção (ideal):**
Trocar para `<img>` no HTML.

**Por quê fazer:**
Imagens reais são mais acessíveis, otimizáveis e indexáveis.

---

## 2.5 Uso excessivo de `opacity` em textos

**Problema:**
Textos com `opacity < 0.7`.

**Impacto:**

* Contraste insuficiente
* Lighthouse Accessibility perde pontos

**Correção:**
Usar cores sólidas ou opacidade mínima.

**Por quê fazer:**
Contraste é critério direto de acessibilidade.

---

# 3️⃣ JavaScript — Performance e Acessibilidade

## 3.1 Parallax em todas as sections no scroll

**Problema:**
Todas as `.section` são recalculadas a cada scroll.

**Impacto:**

* Main thread sobrecarregada
* Lighthouse acusa tarefas longas

**Correção:**
Limitar animações às sections próximas da viewport ou usar `IntersectionObserver`.

**Por quê fazer:**
Scroll contínuo com `getBoundingClientRect()` é caro em mobile.

---

## 3.2 Uso excessivo de `getBoundingClientRect()`

**Problema:**
Chamado dentro de loop em scroll.

**Impacto:**

* Força reflow
* Custo alto em dispositivos fracos

**Correção:**
Substituir por `IntersectionObserver`.

**Por quê fazer:**
Observer é otimizado pelo browser e mais eficiente.

---

## 3.3 Manipulação de estilos inline no scroll

**Problema:**
Uso direto de `element.style`.

**Impacto:**

* CSS perde controle
* Otimização limitada

**Correção:**
Trocar por classes CSS.

**Por quê fazer:**
Separação de responsabilidades e melhor renderização.

---

## 3.4 Interações sem suporte a teclado

**Problema:**
Clique apenas com mouse/touch.

**Correção:**
Adicionar suporte a `keydown` (Enter / Space).

**Por quê fazer:**
Acessibilidade obrigatória para usuários de teclado.

---

## 3.5 Carousel sem respeitar `prefers-reduced-motion`

**Problema:**
Autoplay sempre ativo.

**Correção:**
Desativar autoplay se `prefers-reduced-motion` estiver ativo.

**Por quê fazer:**
Boa prática moderna de acessibilidade.

---

# 4️⃣ Resultado Esperado

Após aplicar todas as correções:

* 🚀 Performance Mobile: **92–95+**
* ♿ Accessibility: **95+**
* 🧠 Código mais limpo e sustentável
* 📱 Melhor UX em dispositivos móveis

---

## Status do Projeto

O projeto **já está bem estruturado**. As mudanças acima não corrigem erros graves, mas fazem a transição de:

> "site bom" → **produto pronto para produção**

---

Fim do documento.
