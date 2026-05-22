const express = require('express');
require('dotenv').config();

const app = express();
const router = require('./routes/router');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine','ejs');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

async function start() {
  await mongoose.connect(process.env.CONNECTIONSTRING, {
    serverSelectionTimeoutMS: 10000
  });

  console.log('Mongo conectado');

  app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo-do-cardapio',
    store: new MongoStore({
      client: mongoose.connection.getClient()
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  }));

  app.use(flash());
  app.use(require('./middlewares/localsMiddleware'));
  app.use(router);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.log('Erro ao iniciar servidor:', err.message);
});


