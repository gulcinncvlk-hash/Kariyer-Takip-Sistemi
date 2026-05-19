const express = require('express');
const cors = require('cors');
const db = require('./models/database');
// server.js dosyasının en başına şu satırı ekle:
const authenticateToken = require('./middlewares/authMiddleware'); // Dosya yolunu kontrol et, doğru klasörde olduğundan emin ol!
const applicationRoutes = require('./routes/applicationRoutes'); // Yönlendirme dosyasını bağlıyoruz
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const authRoutes = require('./routes/authRoutes');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// İŞTE EKSİK OLAN VE 404 HATASINI ÇÖZECEK SATIR:
app.use('/api/applications', applicationRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes); // app.use('/api/applications', ...) satırının altına ekle

app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        mesaj: "Kariyer Takip Sistemi API'si başarıyla çalışıyor!",
        durum: "Aktif"
    });
    
});
app.put('/api/applications/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Sadece status'ü güncelle, diğerlerine DOKUNMA
    const sql = 'UPDATE applications SET status = ? WHERE id = ? AND user_id = ?';
    
    db.run(sql, [status, id, userId], function(err) {
        if (err) {
            console.error("SQL Hatası:", err);
            return res.status(500).json({ error: "Güncelleme sırasında veritabanı hatası!" });
        }
        res.json({ message: 'Başvuru başarıyla güncellendi' });
    });
});
// Kodunun en altına bunu ekle:
app.listen(PORT, () => {
    console.log('Sunucu http://localhost:${PORT} adresinde çalışmaya başladı.');
});