import { kopecksToRubles, parseRublesToKopecks } from '../src/common/money';

describe('money helpers', () => {
  it('converts rubles without floating-point arithmetic', () => {
    expect(parseRublesToKopecks('123.45')).toBe(12345);
    expect(parseRublesToKopecks('1.2')).toBe(120);
    expect(kopecksToRubles(12345)).toBe('123.45');
  });

  it('rejects zero and excessive precision', () => {
    expect(() => parseRublesToKopecks('0')).toThrow();
    expect(() => parseRublesToKopecks('10.001')).toThrow();
  });
});
