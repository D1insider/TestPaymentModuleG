export function parseRublesToKopecks(value: string): number {
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

export function kopecksToRubles(value: number): string {
  return (value / 100).toFixed(2);
}
