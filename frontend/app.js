// frontend/app.js

const API_URL = 'http://localhost:3000/api/applications';

// Sayfa yüklendiğinde başvuruları getir
document.addEventListener('DOMContentLoaded', fetchApplications);

// Form gönderildiğinde sayfa yenilenmesini durdur ve API'ye POST isteği at
document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Hocanın kuralı: Tam sayfa yenileme engellendi

    const newApp = {
        company_name: document.getElementById('companyName').value,
        position: document.getElementById('position').value,
        status: document.getElementById('status').value,
        application_date: document.getElementById('appDate').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newApp)
        });

        if (response.ok) {
            document.getElementById('applicationForm').reset(); // Formu temizle
            fetchApplications(); // Tabloyu anında güncelle (Asenkron)
        }
    } catch (error) {
        console.error('Kayıt eklenirken hata oluştu:', error);
    }
});

// Arka uçtan (Backend) verileri GET metodu ile çekme
async function fetchApplications() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        // İş mantığı katmanımızdan gelen başarı oranını ekrana yazdır
        document.getElementById('successRate').innerText = result.success_rate;
        
        const tbody = document.getElementById('applicationTableBody');
        tbody.innerHTML = ''; // Tabloyu temizle

        // Gelen verileri döngüyle tabloya satır olarak ekle
        result.data.forEach(app => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${app.company_name}</td>
                <td>${app.position}</td>
                <td><strong>${app.status}</strong></td>
                <td>${app.application_date}</td>
                <td>
                    <button class="delete-btn" onclick="deleteApplication(${app.id})">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Veriler çekilirken hata oluştu:', error);
    }
}

// Silme işlemi (DELETE)
async function deleteApplication(id) {
    if (confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) {
        try {
            const response = await fetch('${API_URL}/${id}', { method: 'DELETE' });
            if (response.ok) {
                fetchApplications(); // Tabloyu asenkron olarak tekrar güncelle
            }
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
        }
    }
}