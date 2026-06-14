-- 1. Додаємо таблиці до публікації для забезпечення Realtime-оновлень (WebSockets)
-- 1. Додаємо таблиці до публікації для забезпечення Realtime-оновлень (WebSockets)
-- Якщо виникне помилка "relation is already in publication" - це нормально, просто проігноруйте її
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

-- 2. Налаштування pg_cron для автоматичного закриття аукціонів

-- Спочатку переконаємося, що розширення pg_cron увімкнене
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Видаляємо попереднє завдання, якщо воно існувало
SELECT cron.unschedule('close-auctions-every-minute');

-- Створюємо нове завдання: перевіряти кожну хвилину
SELECT cron.schedule(
  'close-auctions-every-minute',
  '* * * * *',
  'SELECT public.close_expired_auctions();'
);
