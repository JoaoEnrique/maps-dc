const express = require('express');
require('dotenv').config()
require('../../firebase'); 
const firebaseAdmin = require('firebase-admin');

const router = express.Router(); 

router.get('/calculations', (req, res) => {
    res.render('calculations/index', { title: 'Maps DC - Meus calculos'});
})

router.get('/calculations/new', (req, res) => {
    res.render('calculations/register', { 
        title: 'Maps DC - Novo calculo', 
        API_KEY_MAPS: process.env.API_KEY_MAPS,
        API_KEY_OPEN_WEATHER: process.env.API_KEY_OPEN_WEATHER,
        isEdit: false,

        // valores padrão
        calculation: {
            consumo_combustivel: 5,
            preco_combustivel: 5,
        },
    });
})

router.get('/calculations/edit/:id', async (req, res) => {
    const calculationId = req.params.id;

    try {
        const db = firebaseAdmin.firestore();
        const calculationDoc = await db.collection('calculations').doc(calculationId).get();

        if (!calculationDoc.exists) {
            return res.render('errors/404');
        }

        const calculationData = calculationDoc.data();
        res.render('calculations/register', {
            title: 'Maps DC - Editar Cálculo',
            API_KEY_MAPS: process.env.API_KEY_MAPS,
            calculation: {
                id: calculationId,
                origem: calculationData.origem,
                destino: calculationData.destino,
                consumo_combustivel: calculationData.consumo_combustivel,
                preco_combustivel: calculationData.preco_combustivel,
                locomocao: calculationData.locomocao,
            },
            isEdit: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});


module.exports = router;