import { createClient } from '@supabase/supabase-js';

// --- НАСТРОЙКИ SUPABASE ---
const SUPABASE_URL = 'https://fbabhnqutznukysleqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sr3PYRr1OpcbXBSxcQgnmQ_f4uXjLoJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const PaymentService = {
  // --- ОСНОВНАЯ ЛОГИКА ОПЛАТЫ (ОБНОВЛЕННАЯ) ---
  
  /**
   * 1. Обновляет статус клиента в таблице 'clients' (чтобы пустило дальше).
   * 2. Создает запись в архиве 'orders' (чтобы сохранилась история денег).
   */
  processStripePayment: async (email: string, amount: number, orderDetails: any) => {
    console.log(`[Stripe] Старт оплаты: ${email}, ${amount} EUR`);

    // Имитация задержки
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!email) return true;
    const cleanEmail = email.toLowerCase().trim();

    // ОПЕРАЦИЯ 1: Обновляем карточку клиента (Текущий статус)
    // В поле payment_amount пишем ПОСЛЕДНЮЮ сумму (для справки)
    const { error: clientError } = await supabase
      .from('clients')
      .update({ 
        p1_status: 'PURCHASED',
        last_attempt_at: new Date().toISOString(),
        payment_amount: amount 
      })
      .eq('email', cleanEmail);

    if (clientError) console.error('[Clients] Ошибка обновления статуса:', clientError);

    // ОПЕРАЦИЯ 2: Сохраняем чек в историю продаж (Новая таблица)
    // Здесь мы сохраняем деньги навсегда.
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        client_email: cleanEmail,
        amount: amount,
        package_name: orderDetails.package || 'Unknown Package',
        order_details: orderDetails // Полный JSON чек
      });

    if (orderError) {
      console.error('[Orders] Ошибка сохранения в историю:', orderError);
    } else {
      console.log('[Orders] Чек успешно сохранен в архиве.');
    }

    return true;
  },

  // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
  saveOrderSnapshot: (data: any) => {
    localStorage.setItem('pending_order_snapshot', JSON.stringify(data));
  },

  getOrderSnapshot: () => {
    try {
      const data = localStorage.getItem('pending_order_snapshot');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  clearOrderSnapshot: () => {
    localStorage.removeItem('pending_order_snapshot');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerName');
  }
};