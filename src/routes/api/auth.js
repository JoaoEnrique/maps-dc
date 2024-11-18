const express = require('express');
const firebaseAdmin = require('firebase-admin');
const router = express.Router();
require('../../firebase');
const authMiddleware = require('../../middlewares/auth')

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

// Login de Usuário com Google
router.post('/verify-token', async (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    // Se o token não for fornecido, responde com erro 401
    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    try {
        // Verifica o token com o Firebase Admin SDK
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
    } catch (error) {
        // Se o token for inválido ou houver erro na verificação, retorna erro 401
        return res.status(401).json({ error: error.message });
    }
});

router.put('/update', authMiddleware, async (req, res) => {
    const { email, password } = req.body; // Obtenha os dados do corpo da requisição
    const uid = req.user.uid; // Supondo que você já tenha o uid do usuário autenticado

    if (!email && !password) {
        return res.status(400).json({ error: 'Pelo menos um dos campos (email ou senha) é obrigatório.' });
    }

    try {
        const updates = {};
        if (email) {
            updates.email = email;
        }
        if (password) {
            updates.password = password;
        }

        await firebaseAdmin.auth().updateUser(uid, {
            email, password
        });

        return res.status(200).json({ message: 'Conta atualizada com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;
