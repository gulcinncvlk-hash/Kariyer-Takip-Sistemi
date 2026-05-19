const express = require('express');
const cors = require('cors');
const db = require('./database');
const applicationRoutes = require('./routes/applicationRoutes'); // Yönlendirme dosyasını bağlıyoruz
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// İŞTE EKSİK OLAN VE 404 HATASINI ÇÖZECEK SATIR:
app.use('/api/applications', applicationRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        mesaj: "Kariyer Takip Sistemi API'si başarıyla çalışıyor!",
        durum: "Aktif"
    });
});

app.listen(PORT, () => {
    console.log('Sunucu http://localhost:${PORT} adresinde çalışmaya başladı.');
});