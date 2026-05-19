// backend/controllers/applicationController.js

const db = require('../database');
const logic = require('../services/applicationLogic');

// CREATE: Yeni başvuru ekleme
const createApplication = (req, res) => {
    const { company_name, position, status, application_date } = req.body;
    
    // İş mantığı kontrolü (Validation)
    const appStatus = status || 'Bekliyor';
    if (!logic.validateStatus(appStatus)) {
        return res.status(400).json({ error: "Geçersiz başvuru durumu." });
    }

    // DÜZELTME: SQL sorgusu ters tırnak (`) içine alındı
    const query = 'INSERT INTO applications (company_name, position, status, application_date) VALUES (?, ?, ?, ?)';
    db.run(query, [company_name, position, appStatus, application_date], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, company_name, position, status: appStatus, application_date });
    });
};

// READ: Tüm başvuruları getirme
const getApplications = (req, res) => {
    // DÜZELTME: SQL sorgusu ters tırnak (`) içine alındı
    const query = 'SELECT * FROM applications';
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // İş mantığı fonksiyonumuzu kullanarak başarı oranını hesaplıyoruz
        const successRate = logic.calculateSuccessRate(rows);
        
        // DÜZELTME: % işareti ve değişken kullanımı ters tırnak (`) içine alındı
        res.status(200).json({
            success_rate: "%" + successRate,
            data: rows
        });
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
const updateApplication = (req, res) => {
    const { id } = req.params;
    const { company_name, position, status, application_date } = req.body;
    
    // İş mantığı kontrolü
    const appStatus = status || 'Bekliyor';
    if (!logic.validateStatus(appStatus)) {
        return res.status(400).json({ error: "Geçersiz başvuru durumu." });
    }

    const query = 'UPDATE applications SET company_name = ?, position = ?, status = ?, application_date = ? WHERE id = ?';
    
    db.run(query, [company_name, position, appStatus, application_date, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Başvuru başarıyla güncellendi." });
    });
};

module.exports = {
    createApplication,
    getApplications,
    deleteApplication,
    updateApplication
};