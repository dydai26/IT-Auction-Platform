'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory } = useApp();
  const [nameRu, setNameRu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameZh, setNameZh] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameRu.trim() || !nameEn.trim() || !nameZh.trim()) {
      setError('Заполните название категории на всех трех языках!');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await addCategory({
        name_ru: nameRu.trim(),
        name_en: nameEn.trim(),
        name_zh: nameZh.trim()
      });
      setNameRu('');
      setNameEn('');
      setNameZh('');
    } catch (err: any) {
      setError(err.message || 'Ошибка добавления категории');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, nameRu: string) => {
    if (!confirm(`Вы уверены, что хотите удалить категорию "${nameRu}"?`)) return;
    setError('');
    try {
      await deleteCategory(id);
    } catch (err: any) {
      setError(err.message || 'Ошибка удаления категории');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>Управление категориями</h1>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 500 }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Добавить новую категорию</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>Русский</label>
              <input
                type="text"
                value={nameRu}
                onChange={(e) => setNameRu(e.target.value)}
                placeholder="Антиквариат"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>English</label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Antiques"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>Chinese</label>
              <input
                type="text"
                value={nameZh}
                onChange={(e) => setNameZh(e.target.value)}
                placeholder="古董"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: '#111827', 
              color: '#fff', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              fontWeight: 600, 
              border: 'none', 
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            {loading ? 'Добавление...' : 'Добавить'}
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Русский (RU)</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>English (EN)</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Chinese (ZH)</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>{cat.name_ru}</td>
                <td style={{ padding: '1rem' }}>{cat.name_en}</td>
                <td style={{ padding: '1rem' }}>{cat.name_zh}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleDelete(cat.id, cat.name_ru)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 500 }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Категории не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
