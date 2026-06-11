'use client';

import { useApp } from '@/context/AppContext';

export default function AdminDashboard() {
  const { lots, bids, users } = useApp();

  // Обчислення активних ставок (унікальні лоти, на які зробили ставки)
  const activeBidsCount = new Set(bids.map(b => b.lotId)).size;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111827' }}>Дашборд</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Всего лотов</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: '#111827' }}>{lots.length}</p>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Лотов со ставками</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: '#111827' }}>{activeBidsCount}</p>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Зарегистрированных пользователей</h3>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: '#111827' }}>{users.length}</p>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Добро пожаловать в Админ-панель (Тестовый режим)</h3>
        <p style={{ color: '#4b5563' }}>Здесь вы можете управлять аукционами, пользователями, категориями и настройками уведомлений.</p>
        <p style={{ color: '#059669', marginTop: '1rem', fontWeight: 500 }}>✓ Все данные сохраняются локально в вашем браузере, чтобы вы могли протестировать систему.</p>
      </div>
    </div>
  );
}
