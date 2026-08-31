const formatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

export function Money({ value, tone }: { value: string; tone?: 'positive' | 'warning' | 'muted' }) {
  return <span className={tone ? `money money--${tone}` : 'money'}>{formatter.format(Number(value))}</span>;
}
