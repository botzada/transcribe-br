"use server";

import { getSupabaseAdmin } from './supabase-server';

export async function getCredits(userId: string) {
  const supabase = await getSupabaseAdmin();
  const { data, error } = await supabase
    .from('credits')
    .select('amount')
    .eq('user_id', userId)
    .single();

  if (error) return 0;
  return data?.amount ?? 0;
}

export async function setCredits(userId: string, amount: number) {
  const supabase = await getSupabaseAdmin();
  await supabase
    .from('credits')
    .upsert({ user_id: userId, amount });
}

export async function addCredits(userId: string, amount: number) {
  const current = await getCredits(userId);
  await setCredits(userId, current + amount);
}

export async function deductCredits(userId: string, amount: number) {
  const current = await getCredits(userId);
  if (current < amount) return false;
  await setCredits(userId, current - amount);
  return true;
}
