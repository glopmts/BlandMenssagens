# 📱 App de Mensagens

Bem-vindo ao **App de Mensagens**, um aplicativo desenvolvido com **Expo**, **TypeScript**, **Firebase**, **Clerk**, **PostgreSQL** e **Node.js** para oferecer uma experiência moderna e segura de troca de mensagens.

## 🚀 Tecnologias Utilizadas

- **Expo**: Framework para desenvolvimento de apps React Native.
- **TypeScript**: Linguagem para tipagem estática em JavaScript.
- **Firebase**: Utilizado para notificações push e armazenamento de arquivos (como mensagens de áudio).
- **Clerk**: Gerenciamento de autenticação e usuários.
- **PostgreSQL**: Banco de dados relacional para armazenar as mensagens.
- **Node.js + Express**: Backend para processamento de mensagens e integração com o banco de dados.

## 📦 Configuração e Instalação

### 1️⃣ Clonar o repositório
```bash
  git clone https://github.com/seu-usuario/seu-repositorio.git
  cd seu-repositorio
```

### 2️⃣ Instalar dependências
```bash
  npm install
```

### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo **.env** na raiz do projeto e adicione as seguintes configurações:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_CLERK_FRONTEND_API=...
EXPO_PUBLIC_POSTGRES_URL=...
EXPO_PUBLIC_SERVER_URL=http://localhost:3000
```

### 4️⃣ Iniciar o backend
Antes de rodar o app, certifique-se de que o backend está rodando:
```bash
  cd backend
  npm install
  npm run dev
```

### 5️⃣ Rodar o app
```bash
  npx expo start
```

## 🔑 Autenticação com Clerk
O **Clerk** é responsável pelo gerenciamento de autenticação. O usuário pode se registrar usando e-mail e senha ou login social.

## 📡 Envio de Mensagens
- As mensagens são armazenadas no **PostgreSQL**.
- As mensagens de áudio são salvas no **Firebase Storage**.
- As notificações push são gerenciadas pelo **Firebase Cloud Messaging (FCM)**.

## 📌 Funcionalidades
✅ Autenticação de usuários via **Clerk**  
✅ Envio e recebimento de mensagens em tempo real  
✅ Suporte a envio de mensagens de **texto** e **áudio**  
✅ Notificações push com **Firebase Cloud Messaging**  
✅ Interface responsiva para Android e iOS  

## 🤝 Contribuição
Fique à vontade para abrir issues e pull requests. Toda contribuição é bem-vinda!

## 📜 Licença
Este projeto está sob a licença **MIT**.

---

💡 Desenvolvido com ❤️ usando **Expo, Node.js e PostgreSQL**.

