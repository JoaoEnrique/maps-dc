const express = require('express');
const firebaseAdmin = require('firebase-admin');
const router = express.Router();
require('../../firebase'); // Certifique-se que esta configuração inicializa o Firebase Admin SDK

// Login de Usuário com Google
router.post('/signup', async (req, res) => {
    const { email, password } = req.body; // Obtenha os dados do corpo da requisição
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        await firebaseAdmin.auth().createUser({
            email: email,
            password: password,
        });

        return res.status(201).json({ message: 'Conta criada com sucesso!', email, password });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
