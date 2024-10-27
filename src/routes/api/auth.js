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
        const userRecord = await firebaseAdmin.auth().createUser({
            email: email,
            password: password,
        });

        return res.status(201).json({ message: 'Conta criada com sucesso!', email, password });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Obtenha os dados do corpo da requisição
    if (!email || !password) {
        req.session.errorMessage = 'Email e senha são obrigatórios.';
        return res.redirect('login');
    }   

    try {
        const userCredential = firebase.auth().signInWithEmailAndPassword(email, password);
        req.session.user = userCredential.user;
        req.session.successMessage = "Login realizado com sucesso!";
       return res.redirect('/');
    } catch (error) {
        req.session.errorMessage = error.message;
        return res.redirect('login');
    }
});

module.exports = router;
