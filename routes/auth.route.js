const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const router = express.Router();

router.get('/register', (req, res) => {
    return res.status(201).send('registration endpoint');
});

router.post('/register', register);
router.post('/login', login);

module.exports = router;