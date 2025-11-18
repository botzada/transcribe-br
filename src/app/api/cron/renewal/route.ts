import { NextResponse } from "next/server";
import { checkSubscriptionRenewal } from "@/lib/actions/subscription";

/**
 * API Route para Cron Job de Renovação de Assinaturas
 * 
 * Configure no Supabase Edge Functions ou Vercel Cron Jobs:
 * - Executar diariamente às 00:00 UTC
 * - URL: /api/cron/renewal
 * 
 * Vercel Cron (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/renewal",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  try {
    // Verificar autenticação (opcional - adicione token secreto)
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Executar verificação de renovações
    const result = await checkSubscriptionRenewal();

    return NextResponse.json({
      success: result.success,
      message: `Renovações processadas: ${result.renewed} renovadas, ${result.expired} expiradas`,
      data: {
        renewed: result.renewed,
        expired: result.expired,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro no cron job de renovação:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
