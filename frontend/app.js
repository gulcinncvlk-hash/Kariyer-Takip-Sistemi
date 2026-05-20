// frontend/app.js

const API_URL = 'http://localhost:3000/api/applications';
const AUTH_URL = 'http://localhost:3000/api/auth';

// Sayfa yüklendiğinde başvuruları getir
// app.js dosyasındaki DOMContentLoaded kısmını şu şekilde güncelle:

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sayfa yüklendiğinde token var mı diye bak
    const token = sessionStorage.getItem('token');
    const authSection = document.getElementById('auth-section');
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardSection = document.getElementById('dashboard-section'); // YENİ: Paneli tanımladık

    if (token) {
        // Giriş yapılmışsa
        if (authSection) authSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block'; // YENİ: Tam 18. satıra paneli açma komutunu koyduk
        if (logoutBtn) logoutBtn.style.display = 'inline-block'; // Butonu görünür yap
        fetchApplications();
    }
});


// Form gönderildiğinde (Başvuru Ekleme - POST)
document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const newApp = {
        company_name: document.getElementById('companyName').value,
        position: document.getElementById('position').value,
        status: document.getElementById('status').value,
        application_date: document.getElementById('appDate').value
    };

    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify(newApp)
        });

        if (response.ok) {
            document.getElementById('applicationForm').reset();
            fetchApplications();
        } else {
            alert("Başvuru eklenemedi, giriş yapmış olduğunuzdan emin olun.");
        }
    } catch (error) {
        console.error('Kayıt eklenirken hata oluştu:', error);
    }
});

// Arka uçtan verileri GET metodu ile çekme
async function fetchApplications() {
    try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(API_URL, {
            headers: { 'Authorization': token }
        });
        
        if (response.status === 403) {
            console.log("Giriş yapmanız gerekiyor.");
            return;
        }

        const result = await response.json();
        
        document.getElementById('successRate').innerText = result.success_rate || "%0";
        
        const tbody = document.getElementById('applicationTableBody');
        tbody.innerHTML = '';

        if (result.data) {
            result.data.forEach(app => {
                const tr = document.createElement('tr');
                
                // YENİ EKLENEN KISIM: Duruma göre renk belirliyoruz
                let statusColor = "#f39c12"; // Varsayılan: Turuncu (Bekliyor)
                if (app.status === "Kabul") statusColor = "#28a745"; // Yeşil
                if (app.status === "Red") statusColor = "#dc3545"; // Kırmızı

                // Tablo satırını oluştururken statusColor değişkenini içeri aktarıyoruz
                tr.innerHTML = '<td>' + app.company_name + '</td>' +
               '<td>' + app.position + '</td>' +
               '<td style="color: ' + statusColor + ';"><strong>' + app.status + '</strong></td>' +
               '<td>' + app.application_date + '</td>' +
               '<td>' +
                   '<select onchange="updateStatus(' + app.id + ', this.value)">' +
                       '<option value="Bekliyor" ' + (app.status === 'Bekliyor' ? 'selected' : '') + '>Bekliyor</option>' +
                       '<option value="Kabul" ' + (app.status === 'Kabul' ? 'selected' : '') + '>Kabul</option>' +
                       '<option value="Red" ' + (app.status === 'Red' ? 'selected' : '') + '>Red</option>' +
                   '</select>' +
                   ' <button class="delete-btn" onclick="deleteApplication(' + app.id + ')">Sil</button>' +
               '</td>';
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Veriler çekilirken hata oluştu:', error);
    }
}

// Silme işlemi (DELETE)
async function deleteApplication(id) {
    if (confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(API_URL + '/' + id, { 
                method: 'DELETE',
                headers: { 'Authorization': token }
            });
            if (response.ok) {
                fetchApplications();
            }
        } catch (error) {
            console.error('Silme işlemi başarısız:', error);
        }
    }
}

// LOGIN ve REGISTER işlemleri
async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // + işaretleri ile URL'yi birleştiriyoruz, ters tırnak derdi kalmıyor!
    const res = await fetch(AUTH_URL + '/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
        sessionStorage.setItem('token', data.token);
        alert('Giriş başarılı!');
        updateUIAfterLogin(username);
        document.getElementById('logout-btn').style.display = 'inline-block';
        fetchApplications(); 
    } else {
        alert(data.error || 'Giriş başarısız!');
    }
}

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch(AUTH_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message || data.error);
}
function updateUIAfterLogin(username) {
    // Giriş formunu gizle
    const authSection = document.getElementById('auth-section');
    if (authSection) authSection.style.display = 'none';
    
    // Panel kutusunu (Dashboard) göster
    const dashboard = document.getElementById('dashboard-section');
    if (dashboard) dashboard.style.display = 'block'; 
    
    // Çıkış butonunu göster
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
}
// YENİLENMİŞ LOGOUT FONKSİYONU (Bunu eski logout'un yerine yapıştır)
function logout() {
    sessionStorage.removeItem('token');
    
    // Giriş formunu tekrar göster
    const authSection = document.getElementById('auth-section');
    if (authSection) authSection.style.display = 'block';
    
    // Panel kutusunu (Dashboard) tekrar gizle
    const dashboard = document.getElementById('dashboard-section');
    if (dashboard) dashboard.style.display = 'none';
    
    // Çıkış butonunu gizle
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    // Hoş geldin yazısını temizle (eğer varsa)
    const welcomeMsg = document.querySelector('h3[style="color: green;"]');
    if (welcomeMsg) welcomeMsg.remove();
}
async function updateStatus(id, newStatus) {
    const token = sessionStorage.getItem('token');
    
    try {
        const response = await fetch('http://localhost:3000/api/applications/' + id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json(); // Sunucudan gelen gerçek hatayı yakalayalım

        if (response.ok) {
            alert('Durum güncellendi!');
            fetchApplications();
        } else {
            // Hata mesajını konsola yazdır
            console.log("Sunucudan gelen hata:", data);
            alert('Hata: ' + (data.error || 'Güncellenemedi'));
        }
    } catch (err) {
        console.error("Fetch hatası:", err);
        alert('Sunucuya ulaşılamadı.');
    }
}
// Arama (Filtreleme) Fonksiyonu
function filterTable() {
    // Arama kutusundaki metni al
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    
    // Tabloyu ve satırları bul
    const tbody = document.getElementById("applicationTableBody");
    const tr = tbody.getElementsByTagName("tr");

    // Tüm satırları dön, aranan kelimeyle eşleşmeyenleri gizle
    for (let i = 0; i < tr.length; i++) {
        // 0. index 'Şirket' sütunudur
        const tdCompany = tr[i].getElementsByTagName("td")[0]; 
        
        if (tdCompany) {
            const companyName = tdCompany.textContent || tdCompany.innerText;
            // Eğer aranan harfler şirket adında varsa satırı göster, yoksa gizle
            if (companyName.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none"; // Eşleşmiyorsa satırı sakla
            }
        }       
    }
}// Tarihe Göre Sıralama Fonksiyonu
let dateSortAscending = false; // İlk tıklamada en yenileri üste alması için

function sortTableByDate() {
    const tbody = document.getElementById("applicationTableBody");
    // Tablodaki tüm satırları bir diziye (array) çeviriyoruz
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((rowA, rowB) => {
        // Tarih verisi 4. sütunda (index 3)
        const dateA = new Date(rowA.cells[3].innerText);
        const dateB = new Date(rowB.cells[3].innerText);

        if (dateSortAscending) {
            return dateA - dateB; // Eskiden yeniye
        } else {
            return dateB - dateA; // Yeniden eskiye (En yeniler üstte)
        }
    });

    // Sıralama yönünü bir sonraki tıklama için tersine çevir
    dateSortAscending = !dateSortAscending;

    // Sıralanmış satırları tabloya geri ekle (otomatik yer değiştirirler)
    rows.forEach(row => tbody.appendChild(row));
}