import { createClient } from '@supabase/supabase-js';

// Ваши ключи
const SUPABASE_URL = 'https://fbabhnqutznukysleqqt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_sr3PYRr1OpcbXBSxcQgnmQ_f4uXjLoJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface LeadData {
  email: string;
  name: string;
  surname: string;
  phone: string;
  familyData: { spouse: number; children: number };
}

export const registerAndCheckStatus = async (data: LeadData): Promise<{ status: string }> => {
  try {
    const normalizedEmail = data.email.toLowerCase().trim();
    const fullName = `${data.name} ${data.surname}`.trim();

    // 1. Сохраняем лид
    const { error: upsertError } = await supabase
      .from('clients')
      .upsert({ 
        email: normalizedEmail,
        full_name: fullName,
        phone: data.phone,
        family_data: data.familyData,
        last_attempt_at: new Date().toISOString()
      }, { onConflict: 'email' });

    if (upsertError) console.error("Ошибка сохранения:", upsertError);

    // 2. Проверяем статус
    const { data: clientRecord, error: fetchError } = await supabase
      .from('clients')
      .select('p1_status, diagnosis_result')
      .eq('email', normalizedEmail)
      .single();

    if (fetchError || !clientRecord) return { status: 'NOT_FOUND' };

    // Логика
    if (clientRecord.p1_status === 'PURCHASED' && clientRecord.diagnosis_result === 'PENDING') {
      return { status: 'PENDING' };
    }
    if (clientRecord.diagnosis_result === 'NEGATIVE') {
      return { status: 'NEGATIVE' };
    }
    if (clientRecord.diagnosis_result === 'POSITIVE') {
      return { status: 'POSITIVE' };
    }
    if (clientRecord.p1_status === 'COMPLETED' && clientRecord.diagnosis_result === 'POSITIVE') {
      return { status: 'POSITIVE' };
    }

    return { status: 'NOT_FOUND' };

  } catch (e) {
    console.error("Critical error:", e);
    return { status: 'ERROR' };
  }
};