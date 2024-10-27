const express = require('express');
const firebaseAdmin = require('firebase-admin');
const router = express.Router();
require('../../firebase'); 

// Rota para listar cálculos do usuário logado
router.get('/calculation', async (req, res) => {
    const userId = req.query.userId; // Supondo que você tenha o userId no req após autenticação

    if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    try {
        const db = firebaseAdmin.firestore();
        const calculationsSnapshot = await db.collection('calculations').where('userId', '==', userId).get();
        
        if (calculationsSnapshot.empty) {
            return res.status(400).json({ error: 'Nenhum cálculo encontrado.' });
        }

        const calculations = [];
        calculationsSnapshot.forEach(doc => {
            calculations.push({ id: doc.id, ...doc.data() }); // Inclui o ID do documento
        });

        return res.status(200).json(calculations);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});


router.post('/calculation', async (req, res) => {
    const { userId, origem, destino, consumo_combustivel, preco_combustivel, locomocao } = req.body;

    if (!userId || !origem || !destino || !consumo_combustivel || !preco_combustivel || !locomocao) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const db = firebaseAdmin.firestore();
        const docRef = await db.collection('calculations').add({
            userId,
            origem,
            destino,
            consumo_combustivel,
            preco_combustivel,
            locomocao,
            createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(201).json({ message: 'Cálculo salvo com sucesso!', calculationId: docRef.id });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/calculation/:id', async (req, res) => {
    const calculationId = req.params.id;

    try {
        const db = firebaseAdmin.firestore();
        await db.collection('calculations').doc(calculationId).delete();
        return res.status(200).json({ message: 'Cálculo excluído com sucesso!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;