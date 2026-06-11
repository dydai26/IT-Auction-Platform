import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Перевірка секретного токена вебхука для захисту нашого API-роуту
    const secretHeader = request.headers.get('x-webhook-secret');
    const systemSecret = process.env.WEBHOOK_SECRET;
    
    // Якщо секрет налаштовано в оточенні, перевіряємо його обов'язково
    if (systemSecret && secretHeader !== systemSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    
    // Supabase Webhook передає деталі зміненого рядка у payload.record
    const auction = payload.record;
    const oldAuction = payload.old_record;

    // Обробляємо подію тільки якщо статус змінився на 'ended'
    if (!auction || auction.status !== 'ended' || (oldAuction && oldAuction.status === 'ended')) {
      return NextResponse.json({ message: 'No action needed: Auction status not transitioned to ended' });
    }

    // 2. Отримання профілю переможця
    let winnerProfile = null;
    if (auction.winner_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name, telegram_chat_id, phone')
        .eq('id', auction.winner_id)
        .single();
      winnerProfile = profile;
    }

    // 3. Завантаження глобальних налаштувань сповіщень
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 500 });
    }

    const results: any = { email: 'skipped', telegramWinner: 'skipped', telegramAdmin: 'skipped', sms: 'skipped' };

    // Форматування валютного знаку лоту
    const formatPrice = (amount: number, currency: string) => {
      const formattedAmount = amount.toLocaleString('ru-RU');
      switch (currency) {
        case 'UAH': return `${formattedAmount} грн`;
        case 'EUR': return `€${formattedAmount}`;
        case 'USD': default: return `$${formattedAmount}`;
      }
    };
    const finalPriceStr = formatPrice(auction.current_price, auction.currency || 'USD');

    // 4. Надсилання Email через Resend
    if (settings.email_enabled && winnerProfile?.email) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        try {
          const emailSubject = `🎉 Поздравляем! Вы выиграли лот "${auction.title_ru}"`;
          const emailHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #111827; border-bottom: 2px solid #d4af37; padding-bottom: 10px; font-weight: 700;">Аукцион завершен!</h2>
              <p style="font-size: 16px; color: #374151;">Здравствуйте, <b>${winnerProfile.full_name || 'Победитель'}</b>!</p>
              <p style="font-size: 16px; color: #374151;">Вы успешно выиграли в аукционе на лот:</p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37; margin: 20px 0;">
                <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">${auction.title_ru}</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; color: #047857; font-weight: 700;">Победная ставка: ${finalPriceStr}</p>
              </div>
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">Спасибо за участие в наших IT Аукционах!</p>
            </div>
          `;
          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Auctions <noreply@resend.dev>',
            to: winnerProfile.email,
            subject: emailSubject,
            html: emailHtml,
          });
          results.email = 'sent';
        } catch (emailErr) {
          console.error('Email sending error:', emailErr);
          results.email = `error: ${String(emailErr)}`;
        }
      } else {
        console.warn('RESEND_API_KEY is missing. Email notification skipped.');
        results.email = 'missing key';
      }
    }

    // 5. Надсилання повідомлень в Telegram
    if (settings.telegram_enabled && settings.telegram_bot_token) {
      // 5.1 Особисте повідомлення Переможцю
      if (winnerProfile?.telegram_chat_id) {
        try {
          const winnerMsg = `🎉 <b>Поздравляем, ${winnerProfile.full_name || 'Победитель'}!</b>\n\nВы выиграли аукцион на лот: <b>${auction.title_ru}</b>\n💰 Ваша победная ставка: <b>${finalPriceStr}</b>\n\nСпасибо за участие!`;
          const response = await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: winnerProfile.telegram_chat_id,
              text: winnerMsg,
              parse_mode: 'HTML'
            })
          });
          if (response.ok) {
            results.telegramWinner = 'sent';
          } else {
            results.telegramWinner = `failed status: ${response.status}`;
          }
        } catch (tgErr) {
          console.error('Telegram winner sending error:', tgErr);
          results.telegramWinner = `error: ${String(tgErr)}`;
        }
      }

      // 5.2 Сповіщення для Адміністратора в робочий чат
      if (settings.telegram_chat_id) {
        try {
          const adminMsg = `📢 <b>Аукцион успешно завершен!</b>\n\n📦 <b>Лот:</b> ${auction.title_ru}\n👤 <b>Победитель:</b> ${winnerProfile?.full_name || 'Аноним'} (${winnerProfile?.email || 'без email'})\n💰 <b>Финальная ставка:</b> ${finalPriceStr}`;
          const response = await fetch(`https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: settings.telegram_chat_id,
              text: adminMsg,
              parse_mode: 'HTML'
            })
          });
          if (response.ok) {
            results.telegramAdmin = 'sent';
          } else {
            results.telegramAdmin = `failed status: ${response.status}`;
          }
        } catch (tgErr) {
          console.error('Telegram admin sending error:', tgErr);
          results.telegramAdmin = `error: ${String(tgErr)}`;
        }
      }
    }

    // 6. Надсилання SMS переможцю (динамічна інтеграція за gateway параметром)
    if (settings.sms_enabled && settings.sms_gateway && winnerProfile?.phone) {
      try {
        const smsText = `Вы выиграли лот "${auction.title_ru}"! Победная ставка: ${finalPriceStr}.`;
        const gatewayUrl = settings.sms_gateway
          .replace('{phone}', encodeURIComponent(winnerProfile.phone))
          .replace('{text}', encodeURIComponent(smsText));

        const response = await fetch(gatewayUrl);
        if (response.ok) {
          results.sms = 'sent';
        } else {
          results.sms = `failed status: ${response.status}`;
        }
      } catch (smsErr) {
        console.error('SMS sending error:', smsErr);
        results.sms = `error: ${String(smsErr)}`;
      }
    }

    return NextResponse.json({ success: true, results });

  } catch (err: any) {
    console.error('Global Webhook Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
