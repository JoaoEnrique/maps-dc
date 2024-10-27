const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const views = require('./routes/views/routes');
const auth = require('./routes/api/auth');

const session = require('express-session');
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: true,
}));

// Configuração do handlebars
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "layouts") 

}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, "views"));

// Servindo arquivos estáticos
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.render('index', { title: 'Maps DC' }));
app.use(views);

// API
app.use(auth);

// Erro 404
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        status: 404
    });
});

module.exports = app;