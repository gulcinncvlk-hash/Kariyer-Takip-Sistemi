// backend/controllers/applicationController.js

const db = require('../models/database');
const logic = require('../services/applicationLogic');

// CREATE: Yeni başvuru ekleme
const createApplication = (req, res) => {
     const { company_name, position, status, application_date } = req.body;
    const userId = req.user.id; // Token'dan gelen kullanıcıyı al
    // YENİ EKLENEN KISIM: Backend Doğrulaması (Validation)
    if (!company_name || !position || !status || !application_date) {
        return res.status(400).json({ error: "Lütfen tüm alanları eksiksiz doldurun!" });
    }

    // Sorguya user_id'yi ekliyoruz
    db.run('INSERT INTO applications (company_name, position, status, application_date, user_id) VALUES (?, ?, ?, ?, ?)', 
    [company_name, position, status, application_date, userId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, company_name, position, status, application_date, user_id: userId });
    });
};

// READ: Tüm başvuruları getirme
const getApplications = (req, res) => { // req.user, login olduktan sonra middleware'in eklediği kullanıcı bilgisidir
    const userId = req.user.id; 

    // SORGUMUZU DEĞİŞTİRİYORUZ: Artık herkesi değil, sadece o kullanıcıyı getir!
    db.all('SELECT * FROM applications WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const successRate = logic.calculateSuccessRate(rows);
        res.status(200).json({ success_rate: "%" + successRate, data: rows });
    });
};

// DELETE: Başvuru silme
const deleteApplication = (req, res) => {
    const { id } = req.params;
    
    // DÜZELTME: SQL sorgusu ters tırnak (`) içine alındı
    const query = 'DELETE FROM applications WHERE id = ?';
    
    db.run(query, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Başvuru başarıyla silindi." });
    });
};
// UPDATE: Başvuru güncelleme
// UPDATE: Başvuru durumu güncelleme (Sadece status)
const updateApplication = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Şirket adı, pozisyon vs. göndermiyoruz, SADECE status'ü güncelliyoruz.
    const query = 'UPDATE applications SET status = ? WHERE id = ? AND user_id = ?';

    db.run(query, [status, id, userId], function(err) {
        if (err) {
            console.error("SQL Hatası:", err);
            return res.status(500).json({ error: "Güncelleme başarısız." });
        }
        res.status(200).json({ message: "Güncelleme başarılı." });
    });
};


module.exports = {
    createApplication,
    getApplications,
    deleteApplication,
    updateApplication
};