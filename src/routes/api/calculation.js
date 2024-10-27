const express = require('express');
const firebaseAdmin = require('firebase-admin');
const router = express.Router();
require('../../firebase'); // Certifique-se que esta configuração inicializa o Firebase Admin SDK

router.post('/calculos', async (req, res) => {
    const { userId, origem, destino, consumo_combustivel, preco_combustivel, resultado } = req.body;

    if (!userId || !origem || !destino || !consumo_combustivel || !preco_combustivel || !resultado) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const db = firebaseAdmin.firestore();
        await db.collection('calculos').add({
            userId,
            origem,
            destino,
            consumo_combustivel,
            preco_combustivel,
            resultado,
            createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(201).json({ message: 'Cálculo salvo com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;