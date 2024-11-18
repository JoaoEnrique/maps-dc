const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Armazena os dados do usuário na requisição
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token de autenticação inválido.' });
    }
};
