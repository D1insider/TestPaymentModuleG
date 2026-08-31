import { AlertCircle, LoaderCircle } from 'lucide-react';

export function Loading() {
  return <div className="state"><LoaderCircle className="spin" /><p>Загружаем актуальные данные…</p></div>;
}

export function ErrorView({ error, retry }: { error: Error; retry: () => void }) {
  return <div className="state state--error"><AlertCircle /><p>{error.message}</p><button onClick={retry}>Повторить</button></div>;
}
