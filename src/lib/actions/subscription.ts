"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { SubscriptionStatusData, PlanType } from "@/lib/types/subscription";

// Configuração dos planos
const PLAN_VALUES = {
  free: 0,
  premium: 29.90,
  business: 99.90
};

const PLAN_CREDITS = {
  free: 10,
  premium: 100,
  business: 500
};

/**
 * 1. Função de Status da Assinatura
 * Retorna todas as informações sobre a assinatura do usuário
 */
export async function getSubscriptionStatus(
  userId: string
): Promise<SubscriptionStatusData | null> {
  try {
    // Buscar assinatura do usuário
    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (subError) {
      console.error("Erro ao buscar assinatura:", subError);
      return null;
    }

    // Buscar créditos do usuário
    const { data: credits, error: creditsError } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (creditsError) {
      console.error("Erro ao buscar créditos:", creditsError);
      return null;
    }

    // Montar resposta
    const statusData: SubscriptionStatusData = {
      planoAtual: subscription.plan as PlanType,
      valor: PLAN_VALUES[subscription.plan as PlanType],
      proximaCobranca: subscription.next_billing_date,
      status: subscription.status,
      creditosTotais: credits.total_credits,
      creditosUsados: credits.used_credits,
      creditosDisponiveis: credits.available_credits,
    };

    return statusData;
  } catch (error) {
    console.error("Erro ao obter status da assinatura:", error);
    return null;
  }
}

/**
 * 2. Função para Cancelar Plano
 * Cancela a assinatura mas mantém acesso até o fim do ciclo
 */
export async function cancelSubscription(
  userId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Buscar assinatura atual
    const { data: subscription, error: fetchError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !subscription) {
      return {
        success: false,
        message: "Assinatura não encontrada",
      };
    }

    // Verificar se já está cancelada
    if (subscription.status === "cancelado") {
      return {
        success: false,
        message: "Assinatura já está cancelada",
      };
    }

    // Atualizar status para cancelado
    const { error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({
        status: "cancelado",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Erro ao cancelar assinatura:", updateError);
      return {
        success: false,
        message: "Erro ao cancelar assinatura",
      };
    }

    return {
      success: true,
      message: "Assinatura cancelada com sucesso. Você terá acesso até o fim do período atual.",
    };
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    return {
      success: false,
      message: "Erro ao processar cancelamento",
    };
  }
}

/**
 * 3. Verificação Automática de Renovação
 * Função para ser executada via cron job (diariamente)
 */
export async function checkSubscriptionRenewal(): Promise<{
  success: boolean;
  renewed: number;
  expired: number;
}> {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Buscar assinaturas ativas que vencem hoje
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .in("plan", ["premium", "business"])
      .eq("status", "ativo")
      .lte("next_billing_date", today);

    if (subError) {
      console.error("Erro ao buscar assinaturas:", subError);
      return { success: false, renewed: 0, expired: 0 };
    }

    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, renewed: 0, expired: 0 };
    }

    let renewedCount = 0;
    let expiredCount = 0;

    // Processar cada assinatura
    for (const subscription of subscriptions) {
      // Verificar se existe pagamento para renovação
      const { data: payment, error: paymentError } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("user_id", subscription.user_id)
        .eq("subscription_id", subscription.id)
        .gte("payment_date", today)
        .single();

      if (payment && !paymentError) {
        // RENOVAR: Pagamento encontrado
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        // Atualizar assinatura
        await supabaseAdmin
          .from("subscriptions")
          .update({
            next_billing_date: nextBillingDate.toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
          })
          .eq("id", subscription.id);

        // Renovar créditos
        const planCredits = PLAN_CREDITS[subscription.plan as PlanType];
        await supabaseAdmin
          .from("credits")
          .update({
            total_credits: planCredits,
            used_credits: 0,
            available_credits: planCredits,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", subscription.user_id);

        renewedCount++;
      } else {
        // EXPIRAR: Pagamento não encontrado
        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "expirado",
            plan: "free",
            next_billing_date: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", subscription.id);

        // Atualizar créditos para plano free
        await supabaseAdmin
          .from("credits")
          .update({
            total_credits: PLAN_CREDITS.free,
            available_credits: PLAN_CREDITS.free,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", subscription.user_id);

        expiredCount++;
      }
    }

    return {
      success: true,
      renewed: renewedCount,
      expired: expiredCount,
    };
  } catch (error) {
    console.error("Erro ao verificar renovações:", error);
    return { success: false, renewed: 0, expired: 0 };
  }
}
