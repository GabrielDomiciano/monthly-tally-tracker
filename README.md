# Controle Financeiro - Sistema de Gestão de Contas Mensais

## 📊 Sobre o Projeto

Sistema completo para controle e análise de finanças pessoais, desenvolvido com tecnologias modernas para oferecer uma experiência intuitiva e eficiente no gerenciamento de contas mensais.

### ✨ Funcionalidades Principais

- **📈 Dashboard Interativo**: Visão geral das finanças com cards de resumo
- **💰 Gestão de Contas**: Cadastro, edição e controle de status de contas
- **🔄 Contas Fixas**: Configuração de contas recorrentes
- **📊 Gráficos e Relatórios**: Análise visual dos gastos e receitas
- **📅 Histórico Completo**: Acompanhamento de todas as transações
- **📱 Design Responsivo**: Interface adaptada para desktop e mobile

### 🎯 Benefícios

- **Controle Total**: Gerencie todas as suas contas em um só lugar
- **Análise Inteligente**: Gráficos e relatórios para entender seus gastos
- **Planejamento**: Visualize contas futuras para melhor planejamento
- **Simplicidade**: Interface intuitiva e fácil de usar
- **Simplicidade**: Interface intuitiva e fácil de usar

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Gráficos**: Recharts
- **Formulários**: React Hook Form + Zod
- **Ícones**: Lucide React

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos para Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>

# 2. Navegue para o diretório
cd monthly-tally-tracker

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

### Acessando o Sistema

1. Abra o navegador e acesse `http://localhost:5173`
2. Comece a gerenciar suas finanças!

## 📱 Como Usar

### 🏠 Dashboard
- **Visão Geral**: Cards com resumo financeiro do mês
- **Filtro por Mês**: Selecione diferentes períodos para análise
- **Ações Rápidas**: Acesso direto às principais funcionalidades
- **Status do Mês**: Controle de contas pagas e pendentes

### 💰 Gestão de Contas
- **Nova Conta**: Cadastre contas com valor, data e descrição
- **Edição**: Modifique informações de contas existentes
- **Status**: Marque contas como pagas ou pendentes
- **Exclusão**: Remova contas quando necessário

### 🔄 Contas Fixas
- **Configuração**: Defina contas que se repetem mensalmente
- **Geração Automática**: Crie contas mensais automaticamente
- **Personalização**: Configure valores e frequências

### 📊 Gráficos e Análises
- **Gráficos de Pizza**: Distribuição de gastos por categoria
- **Gráficos de Linha**: Evolução financeira ao longo do tempo
- **Filtros**: Análise por período específico
- **Exportação**: Visualize dados em diferentes formatos

### 📅 Histórico
- **Lista Completa**: Todas as contas cadastradas
- **Filtros Avançados**: Busca por período, status e categoria
- **Detalhes**: Informações completas de cada transação

## 🔧 Configuração do Ambiente

### Estrutura do Banco de Dados

O sistema utiliza as seguintes tabelas no Supabase:

- **contas**: Contas mensais dos usuários
- **contas_fixas**: Configurações de contas recorrentes
- **geracao_contas_mensais**: Histórico de geração automática

## 🎨 Design System

### Cores Principais
- **Primária**: Verde esmeralda (#10B981)
- **Background**: Cinza escuro para tema dark
- **Texto**: Branco para contraste

### Componentes
- **Cards**: Para exibição de informações
- **Botões**: Gradientes e estados hover
- **Formulários**: Validação em tempo real
- **Gráficos**: Visualizações interativas

## 📈 Funcionalidades Avançadas

### Filtro de Meses
- Visualize dados de meses passados
- Planeje contas futuras (próximos 3 meses)
- Comparação com meses anteriores

### Sistema de Loading
- Estados de carregamento em todas as operações
- Feedback visual para o usuário
- Tratamento de erros amigável

### Responsividade
- Interface adaptada para mobile
- Navegação otimizada para touch
- Layout flexível para diferentes telas

## 🔐 Segurança

### Dados e Validação
- **Validação**: Formulários com validação robusta
- **Dados Seguros**: Armazenamento seguro no Supabase
- **Backup**: Dados protegidos com backup automático

### 🚨 Boas Práticas
- ✅ Use apenas chaves **públicas** no frontend
- ✅ Configure RLS (Row Level Security) no Supabase
- ✅ Monitore logs de acesso regularmente

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev
```

### Build de Produção
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📝 Licença

Este projeto é desenvolvido para uso pessoal e educacional.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através do repositório.

---

**Desenvolvido com ❤️ usando React, TypeScript e Supabase**
