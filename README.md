# Stock Manager - Gestão de Estoque e Orçamentos

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

O **Stock Manager** é uma aplicação web desenvolvida para automatizar o controle de inventário e a emissão de orçamentos complexos.

> **💡 Contexto do Projeto:** > Este sistema não é apenas um projeto de estudo, mas sim uma solução nascida de uma **iniciativa proativa** para resolver um gargalo real do setor logístico e comercial de uma empresa moveleira. O foco foi entregar um MVP (Produto Mínimo Viável) funcional rapidamente, substituindo planilhas manuais por um sistema web centralizado e responsivo.

## 🎨 Demonstração

## 🚀 Funcionalidades Principais

### 📦 Gestão de Inventário

- **CRUD Completo:** Adição, edição e remoção de itens do estoque de forma intuitiva.
- **Sincronização Real-time:** Dados geridos e armazenados com Supabase.
- **Controle de Acesso:** Autenticação e permissões diferenciadas (Visão de Administrador vs. Visão de Vendedor).

### 📝 Sistema de Orçamentos

- **Catálogo Integrado:** Adição de itens ao orçamento consumindo diretamente a base do catálogo.
- **Regras de Negócio Dinâmicas:** Ajuste de preços automatizado baseado no vendedor logado e aplicação de regras de desconto e frete.
- **Exportação Profissional:** Geração de documentos PDF estruturados e com layout customizado utilizando `jsPDF` e `jspdf-autotable`.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js, Vite.
- **Backend as a Service:** Supabase (PostgreSQL + Autenticação).
- **Bibliotecas:** jsPDF, jsPDF-AutoTable, React Icons.
- **Estilização:** CSS3 (Foco em design responsivo / Mobile First).

## 🚀 Próximos Passos e Evolução (Débito Técnico)

Como este projeto nasceu com o foco de entregar valor e resolver um problema de negócios no menor tempo possível, a arquitetura inicial priorizou a funcionalidade. Para as próximas iterações (Refatoração), os objetivos são:

- **Separação de Responsabilidades:** Extrair as regras de negócio e integrações com o Supabase de dentro dos componentes de UI, migrando para _Custom Hooks_ (ex: `useBudget`, `useSupabase`).
- **Componentização:** Fragmentar componentes extensos (como o `Budget.jsx`) em micro-componentes menores (Tabelas, Formulários, Resumos) para facilitar testes e manutenção.
- **Gerenciamento de Estado Global:** Avaliar a implementação de Context API ou Zustand para evitar _prop drilling_ nas novas features.

## 🔧 Instalação e Execução Local

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/stock-manager.git
   ```

2. **Acesse a pasta do projeto:**

   ```bash
   cd stock-manager
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Configuração de Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto com as chaves do Supabase:

   ```env
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

5. **Execute a aplicação:**
   ```bash
   npm run dev
   ```

---

Desenvolvido por **[Seu Nome]** - [Conecte-se comigo no LinkedIn](https://linkedin.com/in/seu-usuario)
