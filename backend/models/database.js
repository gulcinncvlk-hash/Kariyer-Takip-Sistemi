const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Veritabanı dosyası backend klasörünün içinde oluşturulacak
const dbPath = path.resolve(__dirname, 'kariyertakip.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlanıldı.');
    }
});

// Tabloları oluşturma
db.serialize(() => {
   db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // 2. Önce tabloyu oluştur, user_id'yi de burada tanımla
    db.run(`CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        position TEXT NOT NULL,
        status TEXT DEFAULT 'Bekliyor',
        application_date TEXT NOT NULL,
        user_id INTEGER
    )`);

    // 3. İlişkili varlık
    db.run(`CREATE TABLE IF NOT EXISTS stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER,
        stage_name TEXT NOT NULL,
        stage_date TEXT NOT NULL,
        score TEXT,
        FOREIGN KEY(application_id) REFERENCES applications(id) ON DELETE CASCADE
    )`);

    console.log('Veritabanı tabloları hazır.');});

module.exports = db;