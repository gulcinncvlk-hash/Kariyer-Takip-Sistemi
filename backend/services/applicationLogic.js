// backend/services/applicationLogic.js

/**
 * Gelen başvuru durumunun geçerli olup olmadığını kontrol eder.
 * İş mantığı kuralı: Sadece belirli durumlar kabul edilebilir.
 */
const validateStatus = (status) => {
    const validStatuses = ['Bekliyor', 'Kabul', 'Red'];
    return validStatuses.includes(status);
};

/**
 * Tüm başvurular arasındaki 'Kabul' oranını yüzde olarak hesaplar.
 * İleride bu fonksiyon için Unit Test (Birim Testi) yazılacaktır.
 */
const calculateSuccessRate = (applications) => {
    if (!applications || applications.length === 0) return 0;
    
    const acceptedCount = applications.filter(app => app.status === 'Kabul').length;
    const rate = (acceptedCount / applications.length) * 100;
    
    return parseFloat(rate.toFixed(2));
};

module.exports = {
    validateStatus,
    calculateSuccessRate
};