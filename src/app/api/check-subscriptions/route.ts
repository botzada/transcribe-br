import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usar variáveis de ambiente diretamente (Route Handlers não suportam "use server")
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configuração de créditos por plano
const CREDITS_CONFIG = {
  free: 30,
  premium_monthly: 300,
  premium_annual: 1000,
  business_monthly: 1000,
  business_annual: 3000,
};

export async function GET(request: Request) {
  try {
    // Verificar autorização (Vercel Cron envia header especial)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Buscar todas as assinaturas ativas
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .in("plan", ["free", "premium", "business"])
      .eq("status", "active");

    if (subError) {
      console.error("Erro ao buscar assinaturas:", subError);
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    const results = {
      checked: 0,
      renewed: 0,
      downgraded: 0,
      errors: [] as string[],
    };

    // Processar cada assinatura
    for (const subscription of subscriptions || []) {
      results.checked++;

      const renewAt = new Date(subscription.renew_at);

      // Verificar se a data de renovação já passou
      if (renewAt > now) {
        continue; // Ainda não é hora de renovar
      }

      // Buscar pagamento aprovado do mês atual
      const { data: payments, error: payError } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("user_id", subscription.user_id)
        .eq("status", "approved")
        .gte("created_at", startOfMonth.toISOString())
        .lte("created_at", endOfMonth.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (payError) {
        results.errors.push(
          `Erro ao verificar pagamentos do usuário ${subscription.user_id}: ${payError.message}`
        );
        continue;
      }

      const hasPayment = payments && payments.length > 0;

      if (hasPayment) {
        // Pagamento OK - renovar assinatura
        const planKey = `${subscription.plan}_${subscription.type}` as keyof typeof CREDITS_CONFIG;
        const creditsToAdd = CREDITS_CONFIG[planKey] || CREDITS_CONFIG.free;

        // Atualizar assinatura
        const { error: updateError } = await supabaseAdmin
          .from("subscriptions")
          .update({
            renew_at: new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              renewAt.getDate()
            ).toISOString(),
            credits_remaining: subscription.credits_remaining + creditsToAdd,
            updated_at: now.toISOString(),
          })
          .eq("id", subscription.id);

        if (updateError) {
          results.errors.push(
            `Erro ao renovar assinatura ${subscription.id}: ${updateError.message}`
          );
        } else {
          results.renewed++;
        }
      } else {
        // Sem pagamento - rebaixar para free
        const { error: downgradeError } = await supabaseAdmin
          .from("subscriptions")
          .update({
            plan: "free",
            status: "inactive",
            type: "monthly",
            credits_remaining: CREDITS_CONFIG.free,
            renew_at: null,
            updated_at: now.toISOString(),
          })
          .eq("id", subscription.id);

        if (downgradeError) {
          results.errors.push(
            `Erro ao rebaixar assinatura ${subscription.id}: ${downgradeError.message}`
          );
        } else {
          results.downgraded++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      results,
    });
  } catch (error) {
    console.error("Erro no cron de verificação:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
