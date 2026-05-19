# Kariyer ve Mülakat Takip Sistemi

## Proje Hakkında
Bu proje, Sistem Analizi ve Tasarımı dersi kapsamında geliştirilmiş tam yığın (full-stack) bir web uygulamasıdır. Öğrenci iş ve staj başvurularının takip edilmesi, mülakat süreçlerinin yönetilmesi ve başarı oranlarının analiz edilmesi amacıyla tasarlanmıştır.

## Kullanılan Teknolojiler
* *Frontend:* Vanilla Javascript, HTML5, CSS3 (SPA mimarisi)
* *Backend:* Node.js, Express.js
* *Veritabanı:* SQLite3
* *Test:* Jest
* *API Dokümantasyon:* Swagger UI

## Sistem Kurulumu ve Çalıştırılması
Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin:

1. Proje dosyalarını bilgisayarınıza indirin ve klasör dizininde bir terminal açın.
2. Gerekli bağımlılıkları yüklemek için şu komutu çalıştırın:
   ```bash
   npm install
3. Sunucuyu (Backend) ayağa kaldırmak için şu komutu çalıştırın: 
  node backend/server.js
4. Sunucu http://localhost:3000 adresinde çalışmaya başlayacaktır. Veritabanı (kariyertakip.db) otomatik olarak oluşturulacaktır.
5. Frontend arayüzünü görmek için  frontend/index.html  dosyasını tarayıcınızda açın (veya Live Server ile başlatın).



## API Kullanımı ve Swagger
​Sistem tam CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemlerini destekleyen RESTful uç noktalara sahiptir. API endpoint'lerini keşfetmek ve test etmek için sunucu çalışırken şu adrese gidin:

​Swagger UI:
 http://localhost:3000/api-docs

## ​Birim Testleri (Unit Tests)
​İş mantığı (business logic) ayrı bir katmanda (services/applicationLogic.js) yazılmış olup Jest ile test edilmiştir. Testleri çalıştırmak için terminalde şu komutu girin:Swagger UI: http://localhost:3000/api-docs

## Birim Testleri (Unit Tests)
​İş mantığı (business logic) ayrı bir katmanda (services/applicationLogic.js) yazılmış olup Jest ile test edilmiştir. Testleri çalıştırmak için terminalde şu komutu girin: 
   ```bash
   npm test
