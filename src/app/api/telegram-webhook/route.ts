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

      if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const userId = parts.length > 1 ? parts[1].trim() : '';
        
        if (userId.length > 10) {
          // Викликаємо SQL-функцію для оновлення профілю
          const { error } = await supabase.rpc('link_telegram_account', {
            p_user_id: userId,
            p_chat_id: chatId.toString()
          });

          if (error) {
            console.error('Помилка при прив\'язці Telegram:', error);
            // Можна відправити повідомлення про помилку
          } else {
            // Відправляємо користувачу підтвердження
            const { data: settings } = await supabase.from('settings').select('telegram_bot_token').eq('id', 'global').single();
            if (settings && settings.telegram_bot_token) {
              await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: chatId,
                  text: '✅ Your Telegram has been successfully linked to your auction site account! You will now receive instant notifications about your winnings.',
                  parse_mode: 'HTML'
                })
              });
            }
          }
        } else {
          // Якщо користувач відправив просто /start без ID
          const { data: settings } = await supabase.from('settings').select('telegram_bot_token').eq('id', 'global').single();
          if (settings && settings.telegram_bot_token) {
            await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: '❌ <b>Account linkage failed!</b>\n\nYou must click the "Connect Telegram" button directly on the website to link your account.',
                parse_mode: 'HTML'
              })
            });
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
