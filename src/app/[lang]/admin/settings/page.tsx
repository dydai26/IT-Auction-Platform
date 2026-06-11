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

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>Настройки уведомлений</h1>
      
      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Email Settings */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Email Уведомления</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="emailEnabled"
                  checked={formData.emailEnabled}
                  onChange={handleChange}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span style={{ fontWeight: 500 }}>Включить</span>
              </label>
            </div>
            {formData.emailEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>SMTP Сервер</label>
                <input 
                  type="text" 
                  name="emailSmtp"
                  value={formData.emailSmtp}
                  onChange={handleChange}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', maxWidth: '400px' }}
                />
              </div>
            )}
          </div>

          {/* SMS Settings */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>SMS Уведомления</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="smsEnabled"
                  checked={formData.smsEnabled}
                  onChange={handleChange}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span style={{ fontWeight: 500 }}>Включить</span>
              </label>
            </div>
            {formData.smsEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>URL SMS шлюза</label>
                <input 
                  type="text" 
                  name="smsGateway"
                  value={formData.smsGateway}
                  onChange={handleChange}
                  style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', maxWidth: '400px' }}
                />
              </div>
            )}
          </div>

          {/* Telegram Settings */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Telegram Уведомления</h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="telegramEnabled"
                  checked={formData.telegramEnabled}
                  onChange={handleChange}
                  style={{ width: '1.25rem', height: '1.25rem' }}
                />
                <span style={{ fontWeight: 500 }}>Включить</span>
              </label>
            </div>
            {formData.telegramEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Токен бота</label>
                  <input 
                    type="password" 
                    name="telegramBotToken"
                    value={formData.telegramBotToken}
                    onChange={handleChange}
                    placeholder="123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', maxWidth: '400px' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>ID чата администратора</label>
                  <input 
                    type="text" 
                    name="telegramChatId"
                    value={formData.telegramChatId}
                    onChange={handleChange}
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', maxWidth: '400px' }}
                  />
                </div>
              </div>
            )}
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
