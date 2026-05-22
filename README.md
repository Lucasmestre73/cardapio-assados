# Assados com Carinho

Sistema de cardapio online dinamico com Node.js, Express, EJS, MongoDB, Mongoose, sessoes de administrador, upload de imagens e senhas criptografadas com bcrypt.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz do projeto:

```env
CONNECTIONSTRING=mongodb+srv://usuario:senha@cluster.mongodb.net/assados-com-carinho
SESSION_SECRET=uma-chave-secreta
PORT=3000
```

3. Inicie o servidor:

```bash
npm start
```

4. Acesse:

- Cardapio publico: `http://localhost:3000`
- Criar primeiro administrador: `http://localhost:3000/admin/setup`
- Login administrativo: `http://localhost:3000/admin/login`

## Fluxo

- Cadastre o primeiro administrador em `/admin/setup`.
- Entre no painel em `/admin/login`.
- Cadastre pratos base em `/admin/pratos`.
- Monte o cardapio do dia em `/admin/cardapio`, selecionando pratos ja cadastrados.
- O cardapio publico em `/` mostra somente os itens adicionados ao dia atual.
