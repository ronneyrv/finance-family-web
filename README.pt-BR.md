# Finance Family Web

## Plataforma de Gestão Financeira Pessoal e Familiar

Aplicação web frontend do Finance Family, uma plataforma full-stack desenvolvida para gerenciamento financeiro pessoal e familiar por meio de uma interface intuitiva, responsiva e orientada a dados.

A aplicação consome a Finance Family API e oferece fluxos para gerenciamento financeiro, dashboards analíticos, cartões de crédito e faturas, transações recorrentes, transferências internas e componentes de interface reutilizáveis.

> Este repositório contém o frontend da plataforma Finance Family. A API backend é mantida separadamente em [`finance-family-api`](https://github.com/ronneyrv/finance-family-api).

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232A)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

English: [`README.md`](README.md)

---

## Links do Projeto

- [API Backend](https://github.com/ronneyrv/finance-family-api)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Testes](#testes)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Deploy](#deploy)

---

## Visão Geral

O Finance Family Web fornece a experiência de usuário da plataforma para gerenciamento de finanças pessoais e familiares.

A aplicação é organizada por funcionalidades de negócio, evitando uma estrutura baseada em páginas monolíticas. Cada feature pode concentrar sua integração com a API, modelos de domínio e componentes específicos.

O frontend se comunica com a Finance Family API por meio de um cliente HTTP centralizado e utiliza providers, contexts e rotas protegidas para controlar autenticação e comportamentos globais da aplicação.

---

## Funcionalidades

### Autenticação e Usuários

- Cadastro de usuários
- Autenticação
- Gerenciamento de sessão baseada em JWT
- Rotas protegidas e rotas públicas
- Persistência de sessão
- Contexto do usuário atual
- Perfil do usuário
- Alteração de senha
- Avatar do usuário
- Tratamento de eventos de sessão

### Contas Financeiras

- Gerenciamento de contas financeiras
- Criação e edição de contas
- Visualização de saldo atual
- Seleção de conta financeira em transações
- Controle de visibilidade dos valores financeiros

### Transações

- Gerenciamento de receitas e despesas
- Criação e edição de transações
- Seleção do tipo de transação
- Seleção do método de pagamento
- Seleção de conta financeira
- Seleção de cartão de crédito
- Seleção de parcelas
- Categorização de transações
- Listagem e filtros de transações

### Cartões de Crédito

- Gerenciamento de cartões de crédito
- Criação e edição de cartões
- Integração de compras no cartão
- Gerenciamento de parcelas
- Fluxos de faturas de cartão
- Visualização das parcelas das faturas

### Faturas

- Filtros de fatura
- Resumo da fatura
- Listagem de parcelas
- Pagamento de fatura
- Gerenciamento de compras pendentes do cartão
- Seleção de categoria da compra

### Transações Recorrentes

- Criação de transações recorrentes
- Gerenciamento de transações recorrentes
- Listagem de transações recorrentes

### Transferências Internas

- Transferências entre contas financeiras
- Formulário e validação de transferências
- Integração com a API de transferências do backend

### Categorias

- Integração com categorias
- Seleção de categorias e subcategorias
- Gerenciamento de categorias de compras

### Dashboard Financeiro

O dashboard consolida informações financeiras em visualizações analíticas interativas, incluindo:

- Cards de resumo financeiro
- Indicadores de saúde financeira
- Gráfico de saúde financeira
- Análise de comprometimento da renda
- Distribuição por categoria
- Despesas por categoria
- Receitas por categoria
- Despesas mensais por categoria
- Receitas mensais por categoria
- Projeção mensal
- Resultado mensal
- Resumo de faturas de cartão
- Tendência anual de despesas com cartões de crédito

O dashboard utiliza Recharts para transformar os dados financeiros recebidos da API em gráficos interativos e indicadores visuais.

---

## Experiência Responsiva

A aplicação foi projetada para oferecer uma experiência consistente em desktop e dispositivos móveis.

A interface responsiva inclui:

- Sidebar para navegação em desktop
- Navegação mobile
- Layouts de páginas responsivos
- Componentes reutilizáveis e adaptáveis
- Visualizações de dashboard responsivas
- Formulários e dialogs adaptados para telas menores

A arquitetura de layout separa navegação, estrutura das páginas, componentes das features e componentes de UI reutilizáveis.

---

## Arquitetura

O frontend segue uma arquitetura orientada a funcionalidades.

```text
src/
├── app/
│   ├── providers/
│   └── router/
│
├── components/
│   ├── auth/
│   ├── layout/
│   └── ui/
│
├── features/
│   ├── auth/
│   ├── categories/
│   ├── credit-cards/
│   ├── dashboard/
│   ├── financial-accounts/
│   ├── invoices/
│   ├── purchases/
│   ├── recurring-transactions/
│   ├── transactions/
│   ├── transfers/
│   └── users/
│
├── lib/
│   ├── api/
│   ├── formatters/
│   ├── parsers/
│   └── utils/
│
├── pages/
│
└── test/
```

### Estrutura por Feature

As funcionalidades são organizadas de acordo com suas responsabilidades de domínio.

Uma feature pode conter:

```text
feature/
├── api/
├── components/
└── model/
```

Essa organização mantém integração com a API, modelos de domínio e componentes específicos próximos da funcionalidade à qual pertencem.

### Camada de Aplicação

A camada `app` concentra providers e roteamento globais.

Entre eles:

- provider de autenticação
- provider de notificações
- provider de visibilidade de saldo
- router da aplicação

### Componentes Compartilhados

Os componentes reutilizáveis de UI ficam centralizados em:

```text
src/components/ui
```

A biblioteca interna inclui:

- botões
- cards
- dialogs
- alertas
- toasts
- estados de carregamento
- estados vazios
- campos de formulário
- entradas monetárias
- cabeçalhos de página
- action buttons
- text buttons
- controles de visibilidade de saldo

Essa organização reduz duplicação e mantém comportamentos consistentes em diferentes fluxos da aplicação.

---

## Integração com a API

O frontend se comunica com a Finance Family API por meio do Axios e de um cliente HTTP centralizado.

A camada de integração fornece:

- configuração HTTP centralizada
- configuração da URL base da API
- modelos tipados de requisição e resposta
- gerenciamento de autenticação e sessão
- tratamento de erros da API
- módulos de API organizados por feature

A integração está organizada por domínio:

```text
src/features/
├── auth/api/
├── categories/api/
├── credit-cards/api/
├── dashboard/api/
├── financial-accounts/api/
├── invoices/api/
├── purchases/api/
├── recurring-transactions/api/
├── transactions/api/
├── transfers/api/
└── users/api/
```

Isso mantém as responsabilidades de integração do frontend alinhadas ao domínio do backend.

---

## Estado e Providers da Aplicação

Comportamentos e estados de aplicação compartilhados são tratados por meio de React providers e contexts.

Os providers atuais incluem:

- autenticação
- usuário atual
- notificações
- visibilidade de saldo

Por exemplo, o controle de visibilidade permite ocultar ou exibir valores financeiros em diferentes partes da aplicação sem duplicar o gerenciamento de estado em cada página.

---

## Roteamento e Autenticação

O roteamento é realizado com React Router.

A aplicação separa:

```text
Rotas Públicas
      │
      ├── Login
      └── Cadastro

Rotas Protegidas
      │
      ├── Dashboard
      ├── Transações
      ├── Contas Financeiras
      ├── Cartões de Crédito
      ├── Faturas
      ├── Transações Recorrentes
      └── Perfil
```

Os principais componentes relacionados às rotas de autenticação incluem:

- `ProtectedRoute`
- `PublicOnlyRoute`
- `AuthProvider`

Essa estrutura impede que usuários não autenticados acessem áreas protegidas, mantendo as páginas de autenticação disponíveis para usuários que ainda não iniciaram uma sessão.

---

## Visualização Financeira

O dashboard utiliza Recharts para visualização dos dados financeiros.

Os gráficos apresentam diferentes perspectivas analíticas:

```text
Saúde Financeira
       │
       ├── Saúde Financeira
       ├── Comprometimento da Renda
       ├── Projeção Mensal
       ├── Resultado Mensal
       ├── Despesas por Categoria
       ├── Receitas por Categoria
       ├── Distribuição por Categoria
       └── Tendências de Cartões de Crédito
```

O dashboard separa obtenção dos dados, modelos financeiros, componentes de visualização e utilitários de formatação.

Isso permite que os gráficos evoluam individualmente sem acoplar todo o dashboard a uma única implementação de visualização.

---

## Validação e Tratamento de Erros

O frontend centraliza o processamento de erros da API e disponibiliza mensagens amigáveis para a interface.

A aplicação possui componentes e utilitários reutilizáveis para:

- validação de formulários
- tratamento de erros da API
- estados de carregamento
- estados vazios
- dialogs de confirmação
- alertas
- notificações toast
- parsing e formatação de valores monetários
- formatação de datas

Isso proporciona feedback consistente nos diferentes fluxos financeiros.

---

## Stack Tecnológica

### Core

- React 19
- TypeScript 6
- Vite 8
- React Router 7

### Interface

- Tailwind CSS 4
- Lucide React
- Recharts

### API

- Axios

### Testes

- Vitest
- React Testing Library
- Testing Library Jest DOM
- JSDOM
- V8 Coverage

### Qualidade de Código

- ESLint
- Prettier
- TypeScript Compiler

### Deploy

- Vercel

---

## Configuração de Ambiente

A URL base da API é configurada por meio da variável de ambiente do Vite:

```text
VITE_API_BASE_URL
```

O projeto fornece um arquivo de exemplo:

```bash
cp .env.example .env
```

Exemplo:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Nunca faça commit de secrets locais ou credenciais específicas de ambientes.

---

## Requisitos

Para executar o projeto localmente, instale:

- Node.js 22+
- npm 10+

O projeto utiliza npm e mantém um `package-lock.json` versionado para proporcionar instalações reprodutíveis.

---

## Desenvolvimento Local

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor de desenvolvimento do Vite exibirá no terminal a URL local da aplicação.

Gere o build da aplicação:

```bash
npm run build
```

Execute uma prévia do build de produção:

```bash
npm run preview
```

---

## Testes

O projeto utiliza Vitest e React Testing Library para testes do frontend.

Execute os testes de forma interativa:

```bash
npm run test
```

Execute toda a suíte uma única vez:

```bash
npm run test:run
```

Execute os testes com cobertura:

```bash
npm run test:coverage
```

No momento desta documentação, a suíte possui:

```text
18 arquivos de teste
100 testes
100 passando
```

Os testes cobrem componentes de UI compartilhados, providers da aplicação, seletores de formulários financeiros, utilitários de API, parsers e formatadores.

---

## Qualidade de Código

Execute o ESLint:

```bash
npm run lint
```

Formate o projeto:

```bash
npm run format
```

Verifique a formatação sem modificar os arquivos:

```bash
npm run format:check
```

O build de produção também executa a compilação do TypeScript antes que o Vite gere o bundle final da aplicação.

---

## Deploy

A aplicação é distribuída como uma Single Page Application utilizando Vite.

O deploy de produção é realizado com Vercel.

O projeto possui uma configuração `vercel.json` que redireciona as rotas da aplicação para `index.html`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Isso permite que o React Router trate corretamente a navegação client-side após acesso direto ou atualização do navegador em rotas da aplicação.

---

## Fluxo de Desenvolvimento

O desenvolvimento frontend segue um fluxo Git orientado a funcionalidades:

```text
Issue
  ↓
Feature Branch
  ↓
Implementação
  ↓
Testes
  ↓
Formatação / Lint
  ↓
Validação do Build
  ↓
Conventional Commit
  ↓
Pull Request
  ↓
Review
  ↓
Merge
```

O projeto evolui continuamente por meio de branches isoladas, pull requests, testes e melhorias incrementais.

---

## Evolução do Projeto

O Finance Family Web evoluiu de uma aplicação React inicial para uma interface de gestão financeira orientada a funcionalidades e integrada a um backend preparado para produção.

Entre os principais marcos do frontend estão:

- autenticação e rotas protegidas
- gerenciamento de contas financeiras
- gerenciamento de transações
- gerenciamento de cartões de crédito
- gerenciamento de faturas
- fluxos de compras parceladas
- transações recorrentes
- transferências internas entre contas
- layouts responsivos para desktop e mobile
- biblioteca de componentes de UI reutilizáveis
- dashboards financeiros
- visualização de saúde financeira
- análise de comprometimento da renda
- resultados financeiros acumulados
- tendências anuais de despesas com cartões
- gerenciamento de categorias de compras
- testes automatizados
- deploy na Vercel

O projeto continua evoluindo em conjunto com a Finance Family API.

---

## Repositório Relacionado

### Finance Family API

A API backend é mantida separadamente:

[Finance Family API](https://github.com/ronneyrv/finance-family-api)

O backend é desenvolvido com Java, Spring Boot, Spring Security, PostgreSQL, Flyway, Docker, Testcontainers, GitHub Actions e automação de deploy em produção.

---

## Status do Projeto

O Finance Family Web é um projeto de portfólio em evolução contínua, focado em demonstrar desenvolvimento frontend moderno e práticas de engenharia orientadas a ambientes de produção.

O projeto busca demonstrar não apenas implementação de interfaces, mas também:

- arquitetura orientada a features
- TypeScript
- integração com APIs
- autenticação
- design responsivo
- componentes reutilizáveis
- visualização de dados financeiros
- testes automatizados
- ferramentas de qualidade de código
- deploy
- integração com um backend orientado a produção

---

## Autor

**Ronney Rocha**

Full Stack Developer com foco em Java, Spring Boot, React, TypeScript e práticas de engenharia de software.

---

## Licença

Este projeto é mantido como um projeto pessoal de portfólio.