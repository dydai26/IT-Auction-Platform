import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (payload.message && payload.message.text) {
      const text = payload.message.text.trim();
      const chatId = payload.message.chat.id;

      if (text.startsWith('/start ')) {
        const userId = text.replace('/start ', '').trim();
        
        if (userId.length > 0) {
          // Викликаємо SQL-функцію для оновлення профілю в обхід RLS
          const { error } = await supabase.rpc('link_telegram_account', {
            p_user_id: userId,
            p_chat_id: chatId.toString()
          });

          if (error) {
            console.error('Помилка при прив\'язці Telegram:', error);
          } else {
            // Відправляємо користувачу підтвердження
            const { data: settings } = await supabase.from('settings').select('telegram_bot_token').eq('id', 'global').single();
            if (settings && settings.telegram_bot_token) {
              await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: '✅ Ваш Telegram успешно подключен к аккаунту на сайте аукционов! Теперь вы будете получать мгновенные уведомления о ваших выигрышах.',
                  parse_mode: 'HTML'
                })
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Telegram Webhook Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
