-- 1. Додавання колонки phone в таблицю profiles, якщо вона не існує
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;

-- 2. Оновлення функції handle_new_user для копіювання телефону при реєстрації
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role, telegram_chat_id, phone)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user'),
    NULL,
    COALESCE(new.raw_user_meta_data->>'phone', new.phone)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Перенесення вже існуючих номерів телефонів з auth.users в public.profiles
UPDATE public.profiles p
SET phone = u.phone
FROM auth.users u
WHERE p.id = u.id AND p.phone IS NULL;

-- 4. Перевантаження кешу схеми API
NOTIFY pgrst, 'reload schema';
