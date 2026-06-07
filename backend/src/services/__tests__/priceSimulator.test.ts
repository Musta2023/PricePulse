import { calculateNewPrice } from '../priceSimulator.service';

describe('Price Simulator Logic', () => {
    test('should calculate a new price within ±5% range', () => {
        const initialPrice = 100;
        const newPrice = calculateNewPrice(initialPrice);
        
        // Max variation is 5% up (105) or 5% down (95)
        expect(newPrice).toBeGreaterThanOrEqual(95);
        expect(newPrice).toBeLessThanOrEqual(105);
    });

    test('should always return a number rounded to 2 decimal places', () => {
        const initialPrice = 99.99;
        const newPrice = calculateNewPrice(initialPrice);
        
        const decimalPlaces = newPrice.toString().split('.')[1]?.length || 0;
        expect(decimalPlaces).toBeLessThanOrEqual(2);
    });

    test('should handle edge case price of 0', () => {
        const newPrice = calculateNewPrice(0);
        expect(newPrice).toBe(0);
    });
});
