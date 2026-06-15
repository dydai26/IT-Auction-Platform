'use client';

import React, { useState } from 'react';
import { useApp, NotificationSettings } from '@/context/AppContext';

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [formData, setFormData] = useState<NotificationSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
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
        setFormData(prev => ({ ...prev, bannerImage: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const [activeTab, setActiveTab] = useState<'ru' | 'en' | 'zh'>('ru');

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>Настройки системы</h1>
      
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Banner Settings */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Главный баннер</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Изображение баннера</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                />
                {formData.bannerImage && (
                  <div style={{ marginTop: '0.5rem', height: '150px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', position: 'relative' }}>
                    <img src={formData.bannerImage} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              {/* Language Tabs */}
              <div style={{ display: 'flex', background: '#f9fafb', borderRadius: '8px', padding: '0.25rem', width: 'fit-content' }}>
                <button 
                  type="button"
                  onClick={() => setActiveTab('ru')}
                  style={{ padding: '0.5rem 1rem', background: activeTab === 'ru' ? '#fff' : 'none', border: 'none', borderRadius: '6px', fontWeight: activeTab === 'ru' ? 600 : 500, cursor: 'pointer', boxShadow: activeTab === 'ru' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >RU</button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('en')}
                  style={{ padding: '0.5rem 1rem', background: activeTab === 'en' ? '#fff' : 'none', border: 'none', borderRadius: '6px', fontWeight: activeTab === 'en' ? 600 : 500, cursor: 'pointer', boxShadow: activeTab === 'en' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >EN</button>
                <button 
                  type="button"
                  onClick={() => setActiveTab('zh')}
                  style={{ padding: '0.5rem 1rem', background: activeTab === 'zh' ? '#fff' : 'none', border: 'none', borderRadius: '6px', fontWeight: activeTab === 'zh' ? 600 : 500, cursor: 'pointer', boxShadow: activeTab === 'zh' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
                >ZH</button>
              </div>

              {activeTab === 'ru' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Заголовок (RU)</label>
                    <input type="text" name="bannerTitleRu" value={formData.bannerTitleRu || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Подзаголовок (RU)</label>
                    <input type="text" name="bannerSubtitleRu" value={formData.bannerSubtitleRu || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                </div>
              )}
              {activeTab === 'en' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Заголовок (EN)</label>
                    <input type="text" name="bannerTitleEn" value={formData.bannerTitleEn || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Подзаголовок (EN)</label>
                    <input type="text" name="bannerSubtitleEn" value={formData.bannerSubtitleEn || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                </div>
              )}
              {activeTab === 'zh' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Заголовок (ZH)</label>
                    <input type="text" name="bannerTitleZh" value={formData.bannerTitleZh || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Подзаголовок (ZH)</label>
                    <input type="text" name="bannerSubtitleZh" value={formData.bannerSubtitleZh || ''} onChange={handleChange} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
          


        </div>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button type="submit" style={{ backgroundColor: '#111827', color: '#fff', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Сохранить настройки
          </button>
          {saved && <span style={{ color: '#059669', fontWeight: 500 }}>✓ Настройки успешно сохранены!</span>}
        </div>
      </form>
    </div>
  );
}
