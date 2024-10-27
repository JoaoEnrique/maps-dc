const express = require('express');
require('dotenv').config()

const router = express.Router(); 

router.get('/calculations', (req, res) => {
    res.render('calculations/index', { title: 'Maps DC - Meus calculos'});
})

router.get('/calculations/new', (req, res) => {
    res.render('calculations/register', { title: 'Maps DC - Novo calculo', API_KEY_MAPS: process.env.API_KEY_MAPS});
})

module.exports = router;