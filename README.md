# Arena Management System

Sistema de gerenciamento para lan houses e arenas gaming desenvolvido com React e Node.js.

## 🚀 Tecnologias

### Frontend
- React.js
- Redux para gerenciamento de estado
- Socket.IO para comunicação em tempo real
- Tailwind CSS para estilização
- Material UI Icons
- Axios para requisições HTTP
- dayjs para manipulação de datas

### Backend
- Node.js
- Express
- Socket.IO
- PostgreSQL
- Prisma ORM
- JWT para autenticação

## 🎮 Funcionalidades Principais

### Gerenciamento de Máquinas
- Monitoramento em tempo real do status das máquinas (PC, PS5, XBOX)
- Controle de tempo de uso
- Sistema de parada automática
- Indicadores visuais de status (conectado/desconectado)
- Suporte a diferentes tipos de equipamentos

### Gestão de Clientes
- Cadastro completo de clientes
- Sistema de créditos/horas
- Histórico de uso
- Perfil com avatar
- Edição de informações

### Controle Financeiro
- Registro de transações
- Múltiplos métodos de pagamento (PIX, Crédito, Dinheiro)
- Relatórios financeiros
- Controle de vendas de produtos

### Sistema de Produtos
- Cadastro de produtos
- Controle de estoque
- Sistema de vendas
- Carrinho de compras

## 🔧 Arquitetura

### WebSocket
- Comunicação em tempo real entre máquinas e servidor
- Eventos para:
  - Status de máquina
  - Tempo decorrido
  - Parada de máquina
  - Notificações

### Redux
- Gerenciamento de estado para:
  - Máquinas ativas
  - Cliente selecionado
  - Carrinho de compras
  - Status de autenticação

### Componentes Principais
- CardMachine: Gerencia máquinas individuais
- ModClientConsumo: Sistema de vendas
- Financial: Controle financeiro
- ClienteLinhaTd: Gestão de clientes

## 🎨 Design System

### Cores
- Primária: `#3C4557` (Azul escuro)
- Secundária: `#1f5948` (Verde)
- Accent: `#00cccc` (Ciano)
- Status:
  - Online: `rgb(23, 250, 137)`
  - Offline: `rgba(248, 85, 85, 0.822)`

### UI/UX
- Design responsivo
- Feedback visual em tempo real
- Animações suaves
- Modais interativos
- Sistema de loading states

## 🔐 Segurança

- Autenticação JWT
- Validação de sessões
- Proteção de rotas
- Confirmação de ações críticas
- Sanitização de inputs

## 🚦 Status Codes

- `RUNNING`: Máquina em uso
- `CONECTED`: Máquina disponível
- `DISCONNECTED`: Máquina offline

## 📦 Estrutura de Dados

### Machine

typescript
{
id: string
nano_id: string
position: number
type: "PC" | "PS5" | "XBOX"
status: "RUNNING" | "CONECTED"
client_id?: string
connection: "CONECTED" | "DISCONNECTED"
}


### Transaction

typescript
{
id: string
value: number
method: "PIX" | "CREDITO" | "DINHEIRO"
status: string
client_id: string
created_at: Date
}


## 🔄 Fluxos Principais

1. **Início de Sessão**
   - Seleção de máquina
   - Definição de tempo
   - Confirmação de pagamento
   - Início de cronômetro

2. **Venda de Produtos**
   - Seleção de itens
   - Carrinho de compras
   - Escolha de pagamento
   - Atualização de estoque

3. **Parada de Máquina**
   - Verificação de tempo
   - Notificação via WebSocket
   - Atualização de status
   - Registro de sessão

## 📝 Logs e Monitoramento

- Console logs para debugging
- Registro de transações
- Histórico de sessões
- Monitoramento de conexões WebSocket

## 🛠 Desenvolvimento

### Pré-requisitos
- Node.js 14+
- PostgreSQL
- NPM ou Yarn

### Instalação

bash
Clone o repositório
git clone [url-do-repositorio]
Instale as dependências
npm install ou yarn 
Configure as variáveis de ambiente
cp .env.example .env
Inicie o servidor de desenvolvimento
npm run dev


```

Este README fornece uma visão técnica completa do sistema, útil para desenvolvedores que precisam entender ou trabalhar no projeto.



## 🎯 Features Avançadas

### Sistema de Créditos
- Adição de créditos em horas/minutos
- Conversão automática de tempo
- Histórico de recargas
- Notificação de saldo baixo

### Gestão Multi-local
- Suporte a múltiplas unidades
- Controle por administrador
- Relatórios por unidade
- Sincronização em tempo real

### Relatórios
- Faturamento diário/mensal
- Uso de máquinas
- Produtos mais vendidos
- Clientes frequentes

## 🔍 Validações

### Cliente
- CPF válido
- Email único
- Telefone formatado
- Saldo suficiente

### Máquinas
- Tipo válido
- Status consistente
- Conexão ativa
- ID único

## 📱 Responsividade

### Breakpoints


👨‍💻 Desenvolvido por

DanielMctavish

Feito com 💜 para a comunidade gaming!