'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export default function UsersPage() {
  const { users, deleteUser } = useApp();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>Зарегистрированные пользователи</h1>
      
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Имя</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Роль</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Дата регистрации</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{user.id}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{user.name}</td>
                <td style={{ padding: '1rem' }}>{user.email}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    backgroundColor: user.role === 'admin' ? '#fef08a' : '#f3f4f6',
                    color: user.role === 'admin' ? '#854d0e' : '#374151'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                          deleteUser(user.id);
                        }
                      }}
                      style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '6px', padding: '0.375rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Удалить
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Пользователи не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
