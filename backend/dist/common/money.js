"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRublesToKopecks = parseRublesToKopecks;
exports.kopecksToRubles = kopecksToRubles;
function parseRublesToKopecks(value) {
    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
        throw new Error('Сумма должна быть положительным числом с точностью до копеек');
    }
    const [rubles, kopecks = ''] = value.split('.');
    const result = Number(rubles) * 100 + Number(kopecks.padEnd(2, '0'));
    if (!Number.isSafeInteger(result) || result <= 0) {
        throw new Error('Сумма должна быть больше нуля и находиться в допустимом диапазоне');
    }
    return result;
}
function kopecksToRubles(value) {
    return (value / 100).toFixed(2);
}
//# sourceMappingURL=money.js.map