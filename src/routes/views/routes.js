const express = require('express');

const router = express.Router(); 

router.get('/login', (req, res) => {
    const { token } = req.cookies;

    if (token) {
        res.status(301).redirect('/');
    } else {
        res.render('login', { title: 'Login' });
    }
})


module.exports = router;