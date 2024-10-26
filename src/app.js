const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => res.json("Hello World"));

// Erro 404
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        status: 404
    });
});

module.exports = app;