# Finance Family Web

## Personal & Household Finance Management Platform

Frontend web application for Finance Family, a full-stack platform designed to manage personal and household finances through an intuitive and responsive interface.

The application consumes the Finance Family REST API and provides financial management workflows, analytical dashboards, credit card and invoice management, recurring transactions, internal transfers, and reusable UI components.

> This repository contains the frontend of the Finance Family platform. The backend API is maintained separately in [`finance-family-api`](https://github.com/ronneyrv/finance-family-api).

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=20232A)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)

Português: [`README.pt-BR.md`](README.pt-BR.md)

---

## Project Links

- [Backend API](https://github.com/ronneyrv/finance-family-api)
- [Architecture](#architecture)
- [Features](#features)
- [Testing](#testing)
- [Local Development](#local-development)
- [Deployment](#deployment)

---

## Overview

Finance Family Web provides the user-facing experience for managing personal and household finances.

The application is organized around financial features rather than a monolithic page structure. Each feature contains its API integration, domain types, and UI components where appropriate.

The frontend communicates with the Finance Family API through a centralized HTTP client and uses protected routes and authentication providers to control access to authenticated resources.

---

## Features

### Authentication & User Management

- User registration
- User authentication
- JWT-based session management
- Protected and public-only routes
- Session persistence
- Current user context
- User profile
- Password change
- User avatar
- Session event handling

### Financial Accounts

- Financial account management
- Account creation and editing
- Current balance visualization
- Financial account selection in transactions
- Balance visibility control

### Transactions

- Income and expense management
- Transaction creation and editing
- Transaction type selection
- Payment method selection
- Financial account selection
- Credit card transaction selection
- Installment selection
- Transaction categorization
- Transaction listing and filtering

### Credit Cards

- Credit card management
- Credit card creation and editing
- Credit card purchase integration
- Installment management
- Credit card invoice workflows
- Invoice installment visualization

### Invoices

- Invoice filtering
- Invoice summary
- Invoice installment listing
- Invoice payment
- Pending credit card purchase management
- Purchase category selection

### Recurring Transactions

- Recurring transaction creation
- Recurring transaction management
- Recurring transaction listing

### Internal Transfers

- Transfer between financial accounts
- Transfer form and validation
- Integration with the backend transfer API

### Categories

- Category data integration
- Category and subcategory selection
- Purchase category management

### Financial Dashboard

The dashboard consolidates financial information into interactive analytical views, including:

- Financial summary cards
- Financial health indicators
- Financial health chart
- Income commitment analysis
- Category distribution
- Category expenses
- Category incomes
- Monthly category expenses
- Monthly category incomes
- Monthly projection
- Monthly result
- Credit card invoice summary
- Annual credit card expense trend

The dashboard uses Recharts to transform financial data from the API into interactive charts and visual indicators.

---

## Responsive User Experience

The application is designed for desktop and mobile experiences.

The responsive interface includes:

- Desktop sidebar navigation
- Mobile navigation
- Responsive page layouts
- Reusable responsive components
- Adaptive dashboard visualizations
- Mobile-friendly forms and dialogs

The layout architecture separates application navigation, page structure, feature components, and reusable UI primitives.

---

## Architecture

The frontend follows a feature-oriented architecture.

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

### Feature Structure

Features are organized around their domain responsibilities.

A typical feature can contain:

```text
feature/
├── api/
├── components/
└── model/
```

This keeps API communication, domain types, and feature-specific UI close to the feature they belong to.

### Application Layer

The `app` layer contains application-wide providers and routing.

It includes:

- authentication provider
- notification provider
- balance visibility provider
- application router

### Shared Components

Reusable UI primitives are centralized under:

```text
src/components/ui
```

The shared component library includes:

- buttons
- cards
- dialogs
- alerts
- toasts
- loading states
- empty states
- form fields
- money inputs
- page headers
- action buttons
- text buttons
- balance visibility controls

This reduces duplication and provides consistent behavior across the application.

---

## API Integration

The frontend communicates with the Finance Family API through Axios and a centralized API client.

The integration layer provides:

- centralized HTTP configuration
- API base URL configuration
- typed request and response models
- authentication/session handling
- API error parsing
- reusable API feature modules

The API integration is organized by feature:

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

This keeps frontend API responsibilities aligned with the backend domain.

---

## State & Application Providers

Application-wide state and behavior are handled through React providers and contexts.

Current providers include:

- authentication
- current user
- notifications
- balance visibility

For example, balance visibility allows financial values to be hidden or displayed across the application without duplicating state management in individual pages.

---

## Routing & Authentication

Routing is handled by React Router.

The application separates:

```text
Public Routes
      │
      ├── Login
      └── Register

Protected Routes
      │
      ├── Dashboard
      ├── Transactions
      ├── Financial Accounts
      ├── Credit Cards
      ├── Invoices
      ├── Recurring Transactions
      └── Profile
```

Authentication-related route components include:

- `ProtectedRoute`
- `PublicOnlyRoute`
- `AuthProvider`

This prevents unauthenticated users from accessing protected application areas while keeping authentication pages available to users who are not logged in.

---

## Financial Visualization

The dashboard uses Recharts for financial data visualization.

Charts cover different analytical perspectives, including:

```text
Financial Health
       │
       ├── Financial Health
       ├── Income Commitment
       ├── Monthly Projection
       ├── Monthly Result
       ├── Category Expenses
       ├── Category Incomes
       ├── Category Distribution
       └── Credit Card Trends
```

The dashboard separates data retrieval, financial models, visualization components, and formatting utilities.

This allows individual charts to evolve without coupling the entire dashboard to a single visualization implementation.

---

## Validation & Error Handling

The frontend centralizes API error processing and exposes user-friendly messages to the UI.

The application includes reusable components and utilities for:

- form validation
- API error handling
- loading states
- empty states
- confirmation dialogs
- alerts
- toast notifications
- currency parsing and formatting
- date formatting

This provides consistent feedback across different financial workflows.

---

## Technology Stack

### Core

- React 19
- TypeScript 6
- Vite 8
- React Router 7

### UI

- Tailwind CSS 4
- Lucide React
- Recharts

### API

- Axios

### Testing

- Vitest
- React Testing Library
- Testing Library Jest DOM
- JSDOM
- V8 coverage

### Code Quality

- ESLint
- Prettier
- TypeScript compiler

### Deployment

- Vercel

---

## Environment Configuration

The API base URL is configured through a Vite environment variable:

```text
VITE_API_BASE_URL
```

An example environment file is provided:

```bash
cp .env.example .env
```

Example:

```text
VITE_API_BASE_URL=http://localhost:8080
```

Never commit local secrets or environment-specific credentials.

---

## Requirements

To run the project locally, install:

- Node.js 22+
- npm 10+

The project uses npm and includes a committed `package-lock.json` for reproducible dependency installation.

---

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the local application URL in the terminal.

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Testing

The project uses Vitest and React Testing Library for frontend testing.

Run tests interactively:

```bash
npm run test
```

Run the complete test suite once:

```bash
npm run test:run
```

Run tests with coverage:

```bash
npm run test:coverage
```

At the time of this documentation update, the test suite contains:

```text
18 test files
100 tests
100 passing
```

The test suite covers shared UI components, application providers, financial form selectors, API utilities, parsers, and formatters.

---

## Code Quality

Run ESLint:

```bash
npm run lint
```

Format the project:

```bash
npm run format
```

Check formatting without modifying files:

```bash
npm run format:check
```

The production build also runs TypeScript compilation before Vite generates the final application bundle.

---

## Deployment

The application is deployed as a Vite single-page application.

Production deployment is integrated with Vercel.

The project includes a `vercel.json` configuration that rewrites application routes to `index.html`:

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

This allows React Router to handle client-side navigation correctly after direct access or browser refresh on application routes.

---

## Project Workflow

Frontend development follows a feature-oriented Git workflow:

```text
Issue
  ↓
Feature Branch
  ↓
Implementation
  ↓
Tests
  ↓
Formatting / Lint
  ↓
Build Validation
  ↓
Conventional Commit
  ↓
Pull Request
  ↓
Review
  ↓
Merge
```

The project is continuously evolved through isolated feature branches, pull requests, testing, and incremental improvements.

---

## Project Evolution

Finance Family Web has evolved from a basic React application into a feature-oriented financial management interface integrated with a production-oriented backend.

Major frontend milestones include:

- authentication and protected routing
- financial account management
- transaction management
- credit card management
- credit card invoices
- installment purchase workflows
- recurring transactions
- internal account transfers
- responsive desktop and mobile layouts
- reusable UI component library
- financial dashboards
- financial health visualization
- income commitment analysis
- cumulative financial results
- annual credit card expense trends
- purchase category management
- automated frontend testing
- Vercel deployment

The project continues to evolve alongside the Finance Family API.

---

## Related Repository

### Finance Family API

The backend API is maintained separately:

[Finance Family API](https://github.com/ronneyrv/finance-family-api)

The backend is built with Java, Spring Boot, Spring Security, PostgreSQL, Flyway, Docker, Testcontainers, GitHub Actions, and production deployment automation.

---

## Project Status

Finance Family Web is an actively evolving portfolio project focused on demonstrating modern frontend development and production-oriented engineering practices.

The project is designed to showcase not only UI implementation, but also:

- feature-oriented architecture
- TypeScript
- API integration
- authentication
- responsive design
- reusable component design
- financial data visualization
- automated testing
- code quality tooling
- deployment
- integration with a production-oriented backend

---

## Author

**Ronney Rocha**

Full Stack Developer focused on Java, Spring Boot, React, TypeScript, and software engineering practices.

---

## License

This project is maintained as a personal portfolio project.
