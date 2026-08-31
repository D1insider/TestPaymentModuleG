import { BarChart3, CreditCard, ShieldCheck } from 'lucide-react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { OrderPage } from './pages/OrderPage';
import { OrdersPage } from './pages/OrdersPage';
import { ReportPage } from './pages/ReportPage';

export default function App() {
  return (
    <div className="app-shell">
      <header>
        <div className="nav-inner">
          <NavLink to="/" className="brand"><span><CreditCard /></span><div>Платёжный <b>реестр</b></div></NavLink>
          <nav aria-label="Основная навигация">
            <NavLink to="/" end><CreditCard size={17} /> Заказы</NavLink>
            <NavLink to="/report"><BarChart3 size={17} /> Отчёт</NavLink>
          </nav>
          <div className="secure"><ShieldCheck size={16} /> Тестовый контур</div>
        </div>
      </header>
      <main><Routes><Route path="/" element={<OrdersPage />} /><Route path="/orders/:id" element={<OrderPage />} /><Route path="/report" element={<ReportPage />} /></Routes></main>
      <footer>Демонстрационный модуль · суммы хранятся и рассчитываются в копейках</footer>
    </div>
  );
}
