-- Додавання колонки валюти для лотів з обмеженням значень (UAH, USD, EUR)
ALTER TABLE public.auctions 
ADD COLUMN currency text DEFAULT 'USD' CHECK (currency IN ('UAH', 'USD', 'EUR'));

-- Оновлення кешу схеми API
NOTIFY pgrst, 'reload schema';
