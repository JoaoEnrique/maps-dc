const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// rotas view
const authView = require('./routes/views/auth');
const calculationView = require('./routes/views/calculation');

// rotas api
const auth = require('./routes/api/auth');
const calculation = require('./routes/api/calculation');

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
    partialsDir: path.join(__dirname, "views", "layouts"),
    helpers: {
        equals: (a, b) => a === b,
    },

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

// VIEW
app.use(authView);
app.use(calculationView);

// API
app.use(auth);
app.use(calculation);

// Erro 404
app.use((req, res, next) => {
    res.render('errors/404', { title: 'Maps DC - Página não encontrada' })
}); 

module.exports = app;