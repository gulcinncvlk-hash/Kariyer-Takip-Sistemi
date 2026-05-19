// backend/tests/applicationLogic.test.js

const logic = require('../services/applicationLogic');

describe('Başarı Oranı Hesaplama (calculateSuccessRate) Testleri', () => {
    
    test('Tablo boşken başarı oranı 0 dönmelidir', () => {
        const rows = [];
        const result = logic.calculateSuccessRate(rows);
        expect(result).toBe(0);
    });

    test('Sadece Bekliyor veya Red varsa başarı oranı 0 dönmelidir', () => {
        const rows = [
            { status: 'Bekliyor' },
            { status: 'Red' }
        ];
        const result = logic.calculateSuccessRate(rows);
        expect(result).toBe(0);
    });

    test('Tüm başvurular Kabul ise başarı oranı 100 dönmelidir', () => {
        const rows = [
            { status: 'Kabul' },
            { status: 'Kabul' }
        ];
        const result = logic.calculateSuccessRate(rows);
        expect(result).toBe(100);
    });

    test('1 Kabul, 1 Bekliyor varsa başarı oranı 50 dönmelidir', () => {
        const rows = [
            { status: 'Kabul' },
            { status: 'Bekliyor' }
        ];
        const result = logic.calculateSuccessRate(rows);
        expect(result).toBe(50);
    });
});