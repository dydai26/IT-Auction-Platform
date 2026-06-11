-- 1. Додавання колонки winner_id в таблицю auctions для фіксації переможця
ALTER TABLE public.auctions 
ADD COLUMN winner_id uuid REFERENCES public.profiles(id);

-- 2. Додавання колонки telegram_chat_id в таблицю profiles для зберігання Telegram ID користувача
ALTER TABLE public.profiles 
ADD COLUMN telegram_chat_id text;

-- Перевантаження кешу схеми API
NOTIFY pgrst, 'reload schema';
