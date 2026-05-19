const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Frontend'den gönderilen 'Authorization' başlığındaki token'ı alıyoruz
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ error: "Giriş yapmanız gerekiyor (Token eksik)." });

    // Token'ı doğrula
    jwt.verify(token, 'gizli_anahtar', (err, decoded) => {
        if (err) return res.status(403).json({ error: "Geçersiz veya süresi dolmuş token." });
        
        // Token geçerliyse, kullanıcı ID'sini isteğe ekliyoruz ki diğer fonksiyonlar kullansın
        req.user = decoded; 
        next(); // Bir sonraki aşamaya geç (controller'a git)
    });
};

module.exports = verifyToken;
