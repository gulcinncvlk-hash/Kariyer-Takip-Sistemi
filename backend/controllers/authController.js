const db = require('../models/database');
const jwt = require('jsonwebtoken'); // terminale 'npm install jsonwebtoken' yazmalısın

const register = (req, res) => {
    const { username, password } = req.body;
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
        if (err) return res.status(400).json({ error: "Kullanıcı adı alınmış." });
        res.status(201).json({ message: "Kayıt başarılı." });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (!user) return res.status(401).json({ error: "Hatalı giriş." });
        const token = jwt.sign({ id: user.id }, 'gizli_anahtar', { expiresIn: '1h' });
        res.json({ token });
    });
};

module.exports = { register, login };