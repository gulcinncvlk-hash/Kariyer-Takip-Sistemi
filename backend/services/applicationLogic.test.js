const logic = require('./applicationLogic');

describe('İş Mantığı Testleri', () => {
    test('validateStatus geçerli durumları doğru tespit etmeli', () => {
        expect(logic.validateStatus('Kabul')).toBe(true);
        expect(logic.validateStatus('Bekliyor')).toBe(true);
        expect(logic.validateStatus('Red')).toBe(true);
    });

    test('validateStatus geçersiz bir durum geldiğinde false dönmeli', () => {
        expect(logic.validateStatus('Bilinmiyor')).toBe(false);
    });

    test('calculateSuccessRate başvurular arasındaki "Kabul" oranını doğru hesaplamalı', () => {
        const mockApplications = [{ status: 'Kabul' }, { status: 'Bekliyor' }];
        expect(logic.calculateSuccessRate(mockApplications)).toBe(50);
    });

    test('calculateSuccessRate veritabanı boş ise 0 dönmeli', () => {
        expect(logic.calculateSuccessRate([])).toBe(0);
    });
});