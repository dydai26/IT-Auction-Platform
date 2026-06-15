-- Функція для підключення Telegram ID до профілю користувача
CREATE OR REPLACE FUNCTION public.link_telegram_account(p_user_id UUID, p_chat_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET telegram_chat_id = p_chat_id
  WHERE id = p_user_id;
END;
$$;
