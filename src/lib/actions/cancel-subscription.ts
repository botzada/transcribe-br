"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function cancelSubscription(userId: string) {
  try {
    const now = new Date();

    // Atualizar assinatura para cancelada
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "inactive",
        plan: "free",
        type: "monthly",
        renew_at: null,
        credits_remaining: 30, // Créditos do plano free
        updated_at: now.toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Erro ao cancelar assinatura:", error);
      return {
        success: false,
        error: "Erro ao cancelar assinatura",
      };
    }

    return {
      success: true,
      message: "Assinatura cancelada com sucesso",
    };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return {
      success: false,
      error: "Erro interno ao cancelar assinatura",
    };
  }
}
