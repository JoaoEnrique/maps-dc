const express = require('express');
require('dotenv').config()

const router = express.Router(); 

router.get('/login', (req, res) => {
    const { token } = req.cookies;
    const errorMessage = req.session.errorMessage;
    const successMessage = req.session.successMessage;
    req.session.errorMessage = null; // Limpa a mensagem após exibi-la
    req.session.successMessage = null; // Limpa a mensagem após exibi-la

    if (token) {
        res.status(301).redirect('/');
    } else {
        res.render('login', { title: 'Maps DC - Login', errorMessage, successMessage });
    }
})

router.get('/register', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        res.status(301).redirect('/');
    } else {
        res.render('register', { title: 'Maps DC - Criar Conta' });
    }
})

module.exports = router;