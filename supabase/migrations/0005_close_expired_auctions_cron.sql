-- 1. Створення функції для автоматичного вибору переможця та закриття лоту
CREATE OR REPLACE FUNCTION public.close_expired_auctions()
RETURNS void AS $$
DECLARE
  r_auction RECORD;
  v_winner_id uuid;
BEGIN
  -- Цикл по всіх активних лотах, час завершення яких минув
  FOR r_auction IN 
    SELECT id 
    FROM public.auctions 
    WHERE status = 'active' AND end_time <= now()
  LOOP
    -- Знаходимо user_id автора найбільшої ставки для цього лоту
    SELECT user_id 
    INTO v_winner_id
    FROM public.bids 
    WHERE auction_id = r_auction.id 
    ORDER BY amount DESC, created_at ASC 
    LIMIT 1;

    -- Оновлюємо статус лоту на 'ended' та записуємо переможця (якщо ставок не було, запишеться NULL)
    UPDATE public.auctions 
    SET status = 'ended', winner_id = v_winner_id 
    WHERE id = r_auction.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Ввімкнення розширення pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Безпечне планування задачі (видаляємо стару задачу, якщо вона існувала, для уникнення конфліктів)
SELECT cron.unschedule('close-auctions-every-minute') 
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'close-auctions-every-minute'
);

-- Планування виконання функції щохвилини
SELECT cron.schedule(
  'close-auctions-every-minute',
  '* * * * *',
  'SELECT public.close_expired_auctions()'
);
