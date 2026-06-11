import React from 'react';
import Link from 'next/link';

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }> | { lang: string };
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', backgroundColor: '#f9fafb' }}>
      <aside style={{ width: '250px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '2rem', color: '#111827', paddingLeft: '1rem' }}>
          Админ-панель
        </h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href={`/${lang}/admin`} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Дашборд
          </Link>
          <Link href={`/${lang}/admin/lots`} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Управление лотами
          </Link>
          <Link href={`/${lang}/admin/categories`} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Категории
          </Link>
          <Link href={`/${lang}/admin/users`} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Пользователи
          </Link>
          <Link href={`/${lang}/admin/settings`} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Настройки
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <Link 
            href={`/${lang}`} 
            style={{ 
              display: 'block', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#854d0e', 
              backgroundColor: '#fef08a', 
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            ← Вернуться на сайт
          </Link>
        </div>
      </aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
