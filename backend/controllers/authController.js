const db = require('../models/database');
const jwt = require('jsonwebtoken'); // terminale 'npm install jsonwebtoken' yazmalısın

const register = (req, res) => {
    const { username, password } = req.body;

    // 1. BACKEND DOĞRULAMA (VALIDATION) ADIMI
    if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre zorunludur." });
    }
    
    // Kullanıcı adı sadece harf/rakam içermeli ve en az 3 karakter olmalı
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (username.length < 3 || !usernameRegex.test(username)) {
        return res.status(400).json({ error: "Kullanıcı adı en az 3 karakter olmalı ve sadece harf/rakam içermelidir." });
    }

    // Şifre en az 6 karakter olmalı
    if (password.length < 6) {
        return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır." });
    }

    // 2. VERİTABANI İŞLEMİ VE HTTP DURUM KODLARI
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function(err) {
        if (err) {
            // Veritabanında aynı isimde kullanıcı varsa HTTP 400 döner
            return res.status(400).json({ error: "Bu kullanıcı adı zaten alınmış." });
        }
        // Başarılı kayıt için HTTP 201 Created döner
        res.status(201).json({ message: "Kayıt başarılı." });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    // 1. BACKEND DOĞRULAMA (VALIDATION) ADIMI
    if (!username || !password) {
        return res.status(400).json({ error: "Kullanıcı adı ve şifre zorunludur." });
    }

    // 2. VERİTABANI KONTROLÜ
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Sunucu hatası oluştu." });
        }
        if (!user) {
            // Kullanıcı bulunamazsa HTTP 401 Unauthorized döner
            return res.status(401).json({ error: "Hatalı giriş. Kullanıcı adı veya şifre yanlış." });
        }
        
        // Başarılı girişte HTTP 200 OK (varsayılan) ile token döner
        const token = jwt.sign({ id: user.id }, 'gizli_anahtar', { expiresIn: '1h' });
        res.json({ token });
    });
};

module.exports = { register, login };