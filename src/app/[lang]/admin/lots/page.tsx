'use client';

import React, { useState } from 'react';
import { useApp, Lot, Category } from '@/context/AppContext';

export default function AdminLots() {
  const { lots, addLot, updateLot, deleteLot, categories, getBidsForLot } = useApp();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title_ru: '',
    title_en: '',
    title_zh: '',
    description_ru: '',
    description_en: '',
    description_zh: '',
    category_ru: '',
    category_en: '',
    category_zh: '',
    brand: '',
    image: '',
    startPrice: 0,
    currency: 'USD',
    endTime: ''
  });

  const [viewBidsLotId, setViewBidsLotId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ru' | 'en' | 'zh'>('ru');

  const formatPrice = (amount: number, currency: string) => {
    const formattedAmount = amount.toLocaleString();
    switch (currency) {
      case 'UAH':
        return `${formattedAmount} грн`;
      case 'EUR':
        return `€${formattedAmount}`;
      case 'USD':
      default:
        return `$${formattedAmount}`;
    }
  };

  const formatLocalDate = (dateInput: string | Date) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getEndDateVal = () => {
    if (!formData.endTime) return '';
    return formData.endTime.split('T')[0] || '';
  };

  const getEndTimeVal = () => {
    if (!formData.endTime) return '';
    const parts = formData.endTime.split('T');
    if (parts.length < 2) return '';
    return parts[1].slice(0, 5) || '';
  };

  const handleDateTimeChange = (dateVal: string, timeVal: string) => {
    if (!dateVal) {
      setFormData(prev => ({ ...prev, endTime: '' }));
      return;
    }
    const time = timeVal || '12:00';
    setFormData(prev => ({ ...prev, endTime: `${dateVal}T${time}` }));
  };

  const handleOpenForm = (lot?: Lot) => {
    if (lot) {
      setEditingId(lot.id);
      setFormData({
        title_ru: lot.title_ru,
        title_en: lot.title_en,
        title_zh: lot.title_zh,
        description_ru: lot.description_ru || '',
        description_en: lot.description_en || '',
        description_zh: lot.description_zh || '',
        category_ru: lot.category_ru,
        category_en: lot.category_en,
        category_zh: lot.category_zh,
        brand: lot.brand || '',
        image: lot.image || '',
        startPrice: lot.startPrice,
        currency: lot.currency || 'USD',
        endTime: formatLocalDate(lot.endTime)
      });
    } else {
      const defaultCat = categories[0] || { name_ru: '', name_en: '', name_zh: '' };
      setEditingId(null);
      setFormData({
        title_ru: '',
        title_en: '',
        title_zh: '',
        description_ru: '',
        description_en: '',
        description_zh: '',
        category_ru: defaultCat.name_ru,
        category_en: defaultCat.name_en,
        category_zh: defaultCat.name_zh,
        brand: '',
        image: '',
        startPrice: 0,
        currency: 'USD',
        endTime: ''
      });
    }
    setIsFormOpen(true);
  };

  const handleCategorySelect = (catId: string) => {
    const selected = categories.find(c => c.id === catId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        category_ru: selected.name_ru,
        category_en: selected.name_en,
        category_zh: selected.name_zh
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setFormData(prev => ({ ...prev, image: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title_ru || !formData.title_en || !formData.title_zh || !formData.category_ru || !formData.endTime) {
      alert('Заполните обязательные поля на всех языках!');
      return;
    }
    
    const lotPayload = {
      title_ru: formData.title_ru,
      title_en: formData.title_en,
      title_zh: formData.title_zh,
      description_ru: formData.description_ru,
      description_en: formData.description_en,
      description_zh: formData.description_zh,
      category_ru: formData.category_ru,
      category_en: formData.category_en,
      category_zh: formData.category_zh,
      brand: formData.brand,
      image: formData.image,
      startPrice: Number(formData.startPrice),
      currency: formData.currency as 'USD' | 'UAH' | 'EUR',
      endTime: new Date(formData.endTime).toISOString()
    };

    try {
      if (editingId) {
        await updateLot(editingId, lotPayload);
      } else {
        await addLot(lotPayload);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      alert(err.message || 'Ошибка сохранения лота');
    }
  };

  const handleViewBids = (lotId: string) => {
    setViewBidsLotId(lotId);
  };

  const currentSelectedCategory = categories.find(c => c.name_ru === formData.category_ru);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>Управление лотами</h1>
        <button 
          onClick={() => handleOpenForm()}
          style={{ backgroundColor: '#111827', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
        >
          + Добавить лот
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Фото</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Название (RU / EN / ZH)</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Категория (RU)</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Цена</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Время завершения</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.1s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#e5e7eb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {lot.image ? (
                      <img src={lot.image} alt={lot.title_ru} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                    ) : (
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>No img</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{lot.title_ru}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>EN: {lot.title_en} | ZH: {lot.title_zh}</div>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>{lot.category_ru}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: '#047857' }}>
                  {formatPrice(lot.currentPrice, lot.currency)}
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  {new Date(lot.endTime).toLocaleString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleViewBids(lot.id)}
                      style={{ backgroundColor: '#f3f4f6', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
                    >
                      Bids ({getBidsForLot(lot.id).length})
                    </button>
                    <button 
                      onClick={() => handleOpenForm(lot)}
                      style={{ backgroundColor: '#eff6ff', color: '#2563eb', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить этот лот?')) {
                          deleteLot(lot.id);
                        }
                      }}
                      style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {lots.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                  <p style={{ fontWeight: 600, margin: 0 }}>Лоты не найдены</p>
                  <p style={{ fontSize: '0.875rem' }}>Создайте свой первый лот, чтобы он появился в каталоге.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT FORM MODAL */}
      {isFormOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '800px', maxHeight: '95vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                {editingId ? 'Редактировать лот' : 'Создать новый лот'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#9ca3af', cursor: 'pointer', padding: '0.25rem' }}>&times;</button>
            </div>

            {/* Language Tabs */}
            <div style={{ display: 'flex', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '0.5rem 2rem 0' }}>
              <button 
                onClick={() => setActiveTab('ru')}
                style={{
                  padding: '0.75rem 1.25rem', background: 'none', border: 'none',
                  borderBottom: activeTab === 'ru' ? '2px solid #111827' : '2px solid transparent',
                  fontWeight: activeTab === 'ru' ? 700 : 500, color: activeTab === 'ru' ? '#111827' : '#6b7280', cursor: 'pointer'
                }}
              >
                Русский (RU)
              </button>
              <button 
                onClick={() => setActiveTab('en')}
                style={{
                  padding: '0.75rem 1.25rem', background: 'none', border: 'none',
                  borderBottom: activeTab === 'en' ? '2px solid #111827' : '2px solid transparent',
                  fontWeight: activeTab === 'en' ? 700 : 500, color: activeTab === 'en' ? '#111827' : '#6b7280', cursor: 'pointer'
                }}
              >
                English (EN)
              </button>
              <button 
                onClick={() => setActiveTab('zh')}
                style={{
                  padding: '0.75rem 1.25rem', background: 'none', border: 'none',
                  borderBottom: activeTab === 'zh' ? '2px solid #111827' : '2px solid transparent',
                  fontWeight: activeTab === 'zh' ? 700 : 500, color: activeTab === 'zh' ? '#111827' : '#6b7280', cursor: 'pointer'
                }}
              >
                Chinese (ZH)
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: '2rem' }}>
              <form id="lot-form" onSubmit={handleSave}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  
                  {/* Left Column (Multilingual Title/Description based on activeTab) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: 0, borderBottom: '2px solid #fde047', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>
                      Информация ({activeTab.toUpperCase()})
                    </h3>
                    
                    {activeTab === 'ru' && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Название лота (RU) *</label>
                          <input 
                            type="text" 
                            value={formData.title_ru} 
                            onChange={(e) => setFormData({...formData, title_ru: e.target.value})}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                            required
                            placeholder="Напр. Ноутбук ThinkPad X1 Carbon"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Описание (RU)</label>
                          <textarea 
                            value={formData.description_ru} 
                            onChange={(e) => setFormData({...formData, description_ru: e.target.value})}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', minHeight: '120px', boxSizing: 'border-box' }}
                            placeholder="Описание на русском..."
                          />
                        </div>
                      </>
                    )}

                    {activeTab === 'en' && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Title (EN) *</label>
                          <input 
                            type="text" 
                            value={formData.title_en} 
                            onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                            required
                            placeholder="e.g. ThinkPad X1 Carbon Laptop"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Description (EN)</label>
                          <textarea 
                            value={formData.description_en} 
                            onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', minHeight: '120px', boxSizing: 'border-box' }}
                            placeholder="Description in English..."
                          />
                        </div>
                      </>
                    )}

                    {activeTab === 'zh' && (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Title (ZH) *</label>
                          <input 
                            type="text" 
                            value={formData.title_zh} 
                            onChange={(e) => setFormData({...formData, title_zh: e.target.value})}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                            required
                            placeholder="例如：ThinkPad X1 碳纤维笔记本"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Description (ZH)</label>
                          <textarea 
                            value={formData.description_zh} 
                            onChange={(e) => setFormData({...formData, description_zh: e.target.value})}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', minHeight: '120px', boxSizing: 'border-box' }}
                            placeholder="Chinese description..."
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Column (Category select, Brand, Price, Image) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', margin: 0, borderBottom: '2px solid #fde047', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>
                      Параметры и Медиа
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Категория *</label>
                        <select 
                          value={currentSelectedCategory?.id || ''} 
                          onChange={(e) => handleCategorySelect(e.target.value)}
                          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box', height: '46px' }}
                          required
                        >
                          <option value="">Выберите...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name_ru} / {cat.name_en}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Бренд</label>
                        <input 
                          type="text" 
                          value={formData.brand} 
                          onChange={(e) => setFormData({...formData, brand: e.target.value})}
                          style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                          placeholder="Напр. Apple"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Изображение лота</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ padding: '0.65rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px', backgroundColor: '#fff', cursor: 'pointer' }}
                      />
                      {/* Image Preview Box */}
                      <div style={{ marginTop: '0.5rem', height: '100px', backgroundColor: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Превью</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Стартовая цена *</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="number" 
                          min="0"
                          value={formData.startPrice} 
                          onChange={(e) => setFormData({...formData, startPrice: Number(e.target.value)})}
                          style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                          required
                        />
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({...formData, currency: e.target.value})}
                          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px', backgroundColor: '#fff', fontWeight: 600 }}
                          required
                        >
                          <option value="USD">USD ($)</option>
                          <option value="UAH">UAH (грн)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Время завершения *</label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input 
                          type="date" 
                          value={getEndDateVal()} 
                          onChange={(e) => handleDateTimeChange(e.target.value, getEndTimeVal())}
                          style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                          required
                        />
                        <input 
                          type="time" 
                          value={getEndTimeVal()} 
                          onChange={(e) => handleDateTimeChange(getEndDateVal(), e.target.value)}
                          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', height: '46px' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </form>
            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f9fafb', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#374151', cursor: 'pointer', fontWeight: 600 }}
              >
                Отмена
              </button>
              <button 
                type="submit"
                form="lot-form"
                style={{ backgroundColor: '#111827', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                {editingId ? 'Сохранить изменения' : 'Создать лот'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VIEW BIDS MODAL */}
      {viewBidsLotId && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>История ставок</h2>
              <button onClick={() => setViewBidsLotId(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#9ca3af', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {getBidsForLot(viewBidsLotId).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7280' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>😴</div>
                  <p>Пока нет ставок. Будьте первым!</p>
                </div>
              ) : (
                getBidsForLot(viewBidsLotId).map((bid, i) => {
                  const activeLot = lots.find(l => l.id === viewBidsLotId);
                  return (
                    <div key={bid.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: i === 0 ? '#fffbeb' : '#f9fafb', borderRadius: '12px', border: `1px solid ${i === 0 ? '#fde047' : '#e5e7eb'}` }}>
                      <div>
                        <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 0.25rem 0' }}>
                          {bid.anonName} 
                          {i === 0 && <span style={{ display: 'inline-block', backgroundColor: '#fef08a', color: '#854d0e', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, marginLeft: '0.75rem', textTransform: 'uppercase' }}>Лидер</span>}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: 0 }}>{new Date(bid.createdAt).toLocaleString()}</p>
                      </div>
                      <p style={{ fontWeight: 800, fontSize: '1.25rem', color: i === 0 ? '#b45309' : '#111827', margin: 0, alignSelf: 'center' }}>
                        {formatPrice(bid.amount, activeLot?.currency || 'USD')}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
