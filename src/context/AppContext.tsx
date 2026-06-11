'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

// --- Типи даних ---
export interface Lot {
  id: string;
  title_ru: string;
  title_en: string;
  title_zh: string;
  description_ru: string;
  description_en: string;
  description_zh: string;
  category_ru: string;
  category_en: string;
  category_zh: string;
  brand: string;
  startPrice: number;
  currentPrice: number;
  currency: 'UAH' | 'USD' | 'EUR';
  endTime: string;
  createdAt: string;
  image: string;
  winnerId?: string | null;
}

export interface Bid {
  id: string;
  lotId: string;
  anonName: string;
  amount: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  telegramChatId?: string | null;
  phone?: string | null;
}

export interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  name_zh: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  emailSmtp: string;
  smsEnabled: boolean;
  smsGateway: string;
  telegramEnabled: boolean;
  telegramBotToken: string;
  telegramChatId: string;
}

// --- Структура контексту ---
interface AppContextType {
  lots: Lot[];
  addLot: (lot: Omit<Lot, 'id' | 'createdAt' | 'currentPrice'>) => Promise<void>;
  updateLot: (id: string, lot: Partial<Lot>) => Promise<void>;
  deleteLot: (id: string) => Promise<void>;
  
  categories: Category[];
  addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  bids: Bid[];
  getBidsForLot: (lotId: string) => Bid[];
  placeBid: (lotId: string, amount: number) => Promise<{ success: boolean; error?: string }>;

  users: User[];
  deleteUser: (id: string) => Promise<void>;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;

  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => Promise<void>;
}

const defaultSettings: NotificationSettings = {
  emailEnabled: false,
  emailSmtp: 'smtp.example.com',
  smsEnabled: false,
  smsGateway: 'https://api.sms-provider.com',
  telegramEnabled: false,
  telegramBotToken: '',
  telegramChatId: ''
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [lots, setLots] = useState<Lot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // --- Fetching Data from Supabase ---
  const fetchLots = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setLots(data.map((item: any) => ({
        id: item.id,
        title_ru: item.title_ru,
        title_en: item.title_en,
        title_zh: item.title_zh,
        description_ru: item.description_ru || '',
        description_en: item.description_en || '',
        description_zh: item.description_zh || '',
        category_ru: item.category_ru,
        category_en: item.category_en,
        category_zh: item.category_zh,
        brand: item.brand || '',
        startPrice: Number(item.start_price),
        currentPrice: Number(item.current_price),
        currency: item.currency || 'USD',
        endTime: item.end_time,
        createdAt: item.created_at,
        image: item.image || '',
        winnerId: item.winner_id || null
      })));
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data && data.length > 0) {
      setCategories(data.map((c: any) => ({
        id: c.id,
        name_ru: c.name_ru,
        name_en: c.name_en,
        name_zh: c.name_zh
      })));
    } else {
      const defaults = [
        { name_ru: 'Антиквариат', name_en: 'Antiques', name_zh: '古董' },
        { name_ru: 'Искусство', name_en: 'Art', name_zh: '艺术' },
        { name_ru: 'Автомобили', name_en: 'Cars', name_zh: '汽车' },
        { name_ru: 'Ноутбуки', name_en: 'Laptops', name_zh: '笔记本电脑' },
        { name_ru: 'Телефоны', name_en: 'Phones', name_zh: '手机' },
        { name_ru: 'Мебель', name_en: 'Furniture', name_zh: '家具' },
        { name_ru: 'Электроника', name_en: 'Electronics', name_zh: '电子产品' }
      ];
      const { data: inserted } = await supabase.from('categories').insert(defaults).select();
      if (inserted) {
        setCategories(inserted.map((c: any) => ({
          id: c.id,
          name_ru: c.name_ru,
          name_en: c.name_en,
          name_zh: c.name_zh
        })));
      }
    }
  };

  const fetchBids = async () => {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        id,
        auction_id,
        amount,
        created_at,
        profiles (
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      setBids(data.map((b: any) => ({
        id: b.id,
        lotId: b.auction_id,
        anonName: b.profiles?.full_name || 'Анонім',
        amount: Number(b.amount),
        createdAt: b.created_at
      })));
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setUsers(data.map((u: any) => ({
        id: u.id,
        email: u.email || 'Приховано',
        name: u.full_name || 'Anonymous',
        role: u.role || 'user',
        createdAt: u.created_at,
        telegramChatId: u.telegram_chat_id || null,
        phone: u.phone || null
      })));
    }
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (data) {
      setSettings({
        emailEnabled: data.email_enabled,
        emailSmtp: data.email_smtp || '',
        smsEnabled: data.sms_enabled,
        smsGateway: data.sms_gateway || '',
        telegramEnabled: data.telegram_enabled,
        telegramBotToken: data.telegram_bot_token || '',
        telegramChatId: data.telegram_chat_id || ''
      });
    } else {
      await supabase.from('settings').insert({ id: 'global', ...defaultSettings });
      setSettings(defaultSettings);
    }
  };

  const fetchUserProfile = async (authUser: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (data) {
      setCurrentUser({
        id: data.id,
        email: authUser.email || data.email || '',
        name: data.full_name || authUser.user_metadata?.full_name || 'Користувач',
        role: data.role || 'user',
        createdAt: data.created_at,
        telegramChatId: data.telegram_chat_id || null,
        phone: data.phone || null
      });
    } else {
      setCurrentUser({
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Користувач',
        role: authUser.user_metadata?.role || 'user',
        createdAt: new Date().toISOString(),
        telegramChatId: authUser.user_metadata?.telegram_chat_id || null,
        phone: authUser.user_metadata?.phone || null
      });
    }
  };

  // Initial load and auth subscription
  useEffect(() => {
    fetchLots();
    fetchCategories();
    fetchBids();
    fetchSettings();

    const checkAuth = async () => {
      // Check if test_admin cookie is set
      const isTestAdmin = document.cookie.split('; ').find(row => row.startsWith('test_admin=true'));
      if (isTestAdmin) {
        setCurrentUser({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'dydai26@gmail.com',
          name: 'Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
          telegramChatId: null,
          phone: null
        });
        fetchUsers();
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        fetchUserProfile(session.user);
        if (session.user.user_metadata?.role === 'admin') {
          fetchUsers();
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isTestAdmin = document.cookie.split('; ').find(row => row.startsWith('test_admin=true'));
      if (isTestAdmin) {
        setCurrentUser({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'dydai26@gmail.com',
          name: 'Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
          telegramChatId: null,
          phone: null
        });
        return;
      }

      if (session?.user) {
        fetchUserProfile(session.user);
        if (session.user.user_metadata?.role === 'admin') {
          fetchUsers();
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers();
    }
  }, [currentUser]);

  // --- Lots Actions ---
  const addLot = async (lotData: Omit<Lot, 'id' | 'createdAt' | 'currentPrice'>) => {
    const { error } = await supabase
      .from('auctions')
      .insert({
        title_ru: lotData.title_ru,
        title_en: lotData.title_en,
        title_zh: lotData.title_zh,
        description_ru: lotData.description_ru,
        description_en: lotData.description_en,
        description_zh: lotData.description_zh,
        category_ru: lotData.category_ru,
        category_en: lotData.category_en,
        category_zh: lotData.category_zh,
        brand: lotData.brand,
        image: lotData.image,
        start_price: lotData.startPrice,
        current_price: lotData.startPrice,
        currency: lotData.currency,
        end_time: lotData.endTime,
        creator_id: currentUser?.id && currentUser.id !== '00000000-0000-0000-0000-000000000000' ? currentUser.id : null
      });

    if (error) {
      console.error('Error adding lot:', error);
      throw error;
    }
    await fetchLots();
  };

  const updateLot = async (id: string, updatedData: Partial<Lot>) => {
    const dbPayload: any = {};
    if (updatedData.title_ru !== undefined) dbPayload.title_ru = updatedData.title_ru;
    if (updatedData.title_en !== undefined) dbPayload.title_en = updatedData.title_en;
    if (updatedData.title_zh !== undefined) dbPayload.title_zh = updatedData.title_zh;
    if (updatedData.description_ru !== undefined) dbPayload.description_ru = updatedData.description_ru;
    if (updatedData.description_en !== undefined) dbPayload.description_en = updatedData.description_en;
    if (updatedData.description_zh !== undefined) dbPayload.description_zh = updatedData.description_zh;
    if (updatedData.category_ru !== undefined) dbPayload.category_ru = updatedData.category_ru;
    if (updatedData.category_en !== undefined) dbPayload.category_en = updatedData.category_en;
    if (updatedData.category_zh !== undefined) dbPayload.category_zh = updatedData.category_zh;
    if (updatedData.brand !== undefined) dbPayload.brand = updatedData.brand;
    if (updatedData.image !== undefined) dbPayload.image = updatedData.image;
    if (updatedData.startPrice !== undefined) dbPayload.start_price = updatedData.startPrice;
    if (updatedData.currentPrice !== undefined) dbPayload.current_price = updatedData.currentPrice;
    if (updatedData.currency !== undefined) dbPayload.currency = updatedData.currency;
    if (updatedData.endTime !== undefined) dbPayload.end_time = updatedData.endTime;

    const { error } = await supabase
      .from('auctions')
      .update(dbPayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating lot:', error);
      throw error;
    }
    await fetchLots();
  };

  const deleteLot = async (id: string) => {
    const { error } = await supabase
      .from('auctions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lot:', error);
      throw error;
    }
    await fetchLots();
  };

  // --- Categories Actions ---
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const { error } = await supabase
      .from('categories')
      .insert({
        name_ru: cat.name_ru,
        name_en: cat.name_en,
        name_zh: cat.name_zh
      });

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
    await fetchCategories();
  };

  // --- Settings Actions ---
  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const dbPayload: any = {};
    if (newSettings.emailEnabled !== undefined) dbPayload.email_enabled = newSettings.emailEnabled;
    if (newSettings.emailSmtp !== undefined) dbPayload.email_smtp = newSettings.emailSmtp;
    if (newSettings.smsEnabled !== undefined) dbPayload.sms_enabled = newSettings.smsEnabled;
    if (newSettings.smsGateway !== undefined) dbPayload.sms_gateway = newSettings.smsGateway;
    if (newSettings.telegramEnabled !== undefined) dbPayload.telegram_enabled = newSettings.telegramEnabled;
    if (newSettings.telegramBotToken !== undefined) dbPayload.telegram_bot_token = newSettings.telegramBotToken;
    if (newSettings.telegramChatId !== undefined) dbPayload.telegram_chat_id = newSettings.telegramChatId;

    const { error } = await supabase
      .from('settings')
      .update(dbPayload)
      .eq('id', 'global');

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
    await fetchSettings();
  };

  // --- Bids Actions ---
  const getBidsForLot = (lotId: string) => {
    return bids.filter(b => b.lotId === lotId).sort((a, b) => b.amount - a.amount);
  };

  const placeBid = async (lotId: string, amount: number) => {
    if (!currentUser) {
      return { success: false, error: 'auth_required' };
    }

    const lot = lots.find(l => l.id === lotId);
    if (!lot) return { success: false, error: 'lot_not_found' };

    if (amount <= lot.currentPrice) {
      return { success: false, error: 'invalid_amount' };
    }

    const { error } = await supabase
      .from('bids')
      .insert({
        auction_id: lotId,
        user_id: currentUser.id,
        amount
      });

    if (error) {
      console.error('Error placing bid:', error);
      return { success: false, error: error.message };
    }

    await fetchLots();
    await fetchBids();
    return { success: true };
  };

  // --- Users Actions ---
  const deleteUser = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
    await fetchUsers();
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase sign out error:', error);
    } finally {
      document.cookie = "test_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      setCurrentUser(null);
    }
  };

  return (
    <AppContext.Provider value={{
      lots, addLot, updateLot, deleteLot,
      categories, addCategory, deleteCategory,
      bids, getBidsForLot, placeBid,
      users, deleteUser, currentUser, login, logout,
      settings, updateSettings
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
