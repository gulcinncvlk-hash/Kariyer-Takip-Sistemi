const API_URL = 'http://localhost:3000/api/applications';
const AUTH_URL = 'http://localhost:3000/api/auth';

// --- DOĞRULAMA (VALIDATION) YARDIMCI FONKSİYONLARI ---
function showValidationError(inputId, message) {
    clearValidationError(inputId); 
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-error';
    errorDiv.style.color = '#dc3545'; 
    errorDiv.style.fontSize = '13px';
    errorDiv.style.marginTop = '4px';
    errorDiv.style.fontWeight = 'bold';
    errorDiv.innerText = message;
    
    inputElement.style.border = '2px solid #dc3545';
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

function clearValidationError(inputId) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) return;

    inputElement.style.border = ''; 
    const nextElement = inputElement.nextSibling;
    if (nextElement && nextElement.className === 'validation-error') {
        nextElement.remove();
    }
}

function clearAllValidations() {
    ['username', 'password', 'companyName', 'position'].forEach(id => {
        clearValidationError(id);
    });
}
// ------------------------------------------------------

// --- YENİ: İSTATİSTİK KARTLARINI GÜNCELLEYEN FONKSİYON ---
function updateDashboardStats(data) {
    if (!data) return;
    const total = data.length;
    const pending = data.filter(app => app.status === 'Bekliyor').length;
    const accepted = data.filter(app => app.status === 'Kabul').length;
    const rejected = data.filter(app => app.status === 'Red').length;

    const totalEl = document.getElementById('stat-total');
    const pendingEl = document.getElementById('stat-pending');
    const acceptedEl = document.getElementById('stat-accepted');
  const rejectedEl = document.getElementById('stat-red');

    if (totalEl) totalEl.innerText = total;
    if (pendingEl) pendingEl.innerText = pending;
    if (acceptedEl) acceptedEl.innerText = accepted;
    if (rejectedEl) rejectedEl.innerText = rejected; // YENİ: Sayıyı karta yazar

}
// ------------------------------------------------------

// Sayfa yüklendiğinde başvuruları getir
document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('token');
    const authSection = document.getElementById('auth-section');
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardSection = document.getElementById('dashboard-section'); 

    if (token) {
        if (authSection) authSection.style.display = 'none';
        if (dashboardSection) dashboardSection.style.display = 'block'; 
        if (logoutBtn) logoutBtn.style.display = 'inline-block'; 
        fetchApplications();
    }
});

// Form gönderildiğinde (Başvuru Ekleme - POST)
document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    clearAllValidations(); // Eski hataları temizle

    const companyName = document.getElementById('companyName').value.trim();
    const position = document.getElementById('position').value.trim();
    const status = document.getElementById('status').value;
    const appDate = document.getElementById('appDate').value;

    let isValid = true;

    // Başvuru Formu Doğrulamaları
    if (companyName.length < 2) {
        showValidationError('companyName', 'Şirket / Kurum Adı en az 2 karakter olmalıdır.');
        isValid = false;
    }
    if (position.length < 2) {
        showValidationError('position', 'Pozisyon adı en az 2 karakter olmalıdır.');
        isValid = false;
    }

    if (!isValid) return; // Hata varsa işlemi durdur

    const newApp = {
        company_name: companyName,
        position: position,
        status: status,
        application_date: appDate
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
        
        if (response.status === 403 || response.status === 401) {
            console.log("Giriş yapmanız gerekiyor.");
            return;
        }

        const result = await response.json();
        
        document.getElementById('successRate').innerText = result.success_rate || "%0";
        
        // YENİ: İstatistikleri güncelle
        if (result.data) {
            updateDashboardStats(result.data);
        }
        
        const tbody = document.getElementById('applicationTableBody');
        tbody.innerHTML = '';

        if (result.data) {
            result.data.forEach(app => {
                const tr = document.createElement('tr');
                
                let statusColor = "#f39c12"; 
                if (app.status === "Kabul") statusColor = "#28a745"; 
                if (app.status === "Red") statusColor = "#dc3545"; 

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
    clearAllValidations();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    let isValid = true;

    // Login Doğrulamaları
    if (username.length < 3) {
        showValidationError('username', 'Kullanıcı adı boş olamaz.');
        isValid = false;
    }
    if (password.length === 0) {
        showValidationError('password', 'Şifre boş bırakılamaz.');
        isValid = false;
    }

    if (!isValid) return;

    const res = await fetch(AUTH_URL + '/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
        sessionStorage.setItem('token', data.token);
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        updateUIAfterLogin(username);
        fetchApplications(); 
    } else {
        alert(data.error || 'Giriş başarısız!');
    }
}

async function register() {
    clearAllValidations();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    let isValid = true;

    // Kayıt Doğrulamaları
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (username.length < 3 || !usernameRegex.test(username)) {
        showValidationError('username', 'En az 3 karakter olmalı ve sadece harf/rakam içermelidir (boşluk yasaktır).');
        isValid = false;
    }
    if (password.length < 6) {
        showValidationError('password', 'Şifre en az 6 karakter olmalıdır.');
        isValid = false;
    }

    if (!isValid) return;

    const res = await fetch(AUTH_URL + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (res.ok) {
        alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        alert(data.error || 'Kayıt olurken bir hata oluştu.');
    }
}

function updateUIAfterLogin(username) {
    const authSection = document.getElementById('auth-section');
    if (authSection) authSection.style.display = 'none';
    
    const dashboard = document.getElementById('dashboard-section');
    if (dashboard) dashboard.style.display = 'block'; 
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
}

function logout() {
    sessionStorage.removeItem('token');
    
    const authSection = document.getElementById('auth-section');
    if (authSection) authSection.style.display = 'block';
    
    const dashboard = document.getElementById('dashboard-section');
    if (dashboard) dashboard.style.display = 'none';
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    const welcomeMsg = document.querySelector('h3[style="color: green;"]');
    if (welcomeMsg) welcomeMsg.remove();
}

async function updateStatus(id, newStatus) {
    const token = sessionStorage.getItem('token');
    
    try {
        const response = await fetch(API_URL + '/' + id, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json(); 

        if (response.ok) {
            fetchApplications(); // Durum güncellenince alert kaldırdım, tabloyu sessizce yenileyecek
        } else {
            console.log("Sunucudan gelen hata:", data);
            alert('Hata: ' + (data.error || 'Güncellenemedi'));
        }
    } catch (err) {
        console.error("Fetch hatası:", err);
        alert('Sunucuya ulaşılamadı.');
    }
}

function filterTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const tbody = document.getElementById("applicationTableBody");
    const tr = tbody.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const tdCompany = tr[i].getElementsByTagName("td")[0]; 
        if (tdCompany) {
            const companyName = tdCompany.textContent || tdCompany.innerText;
            if (companyName.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none"; 
            }
        }       
    }
}

let dateSortAscending = false; 

function sortTableByDate() {
    const tbody = document.getElementById("applicationTableBody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((rowA, rowB) => {
        const dateA = new Date(rowA.cells[3].innerText);
        const dateB = new Date(rowB.cells[3].innerText);

        if (dateSortAscending) {
            return dateA - dateB; 
        } else {
            return dateB - dateA; 
        }
    });

    dateSortAscending = !dateSortAscending;
    rows.forEach(row => tbody.appendChild(row));
}