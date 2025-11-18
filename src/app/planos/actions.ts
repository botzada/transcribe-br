"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

interface CreatePixPaymentParams {
  planName: string;
  planType: "monthly" | "annual";
  amount: number;
}

interface PixPaymentResponse {
  success: boolean;
  chargeId?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
  error?: string;
}

/**
 * Cria uma cobrança PIX no Asaas e salva no Supabase
 */
export async function createPixPayment(
  params: CreatePixPaymentParams
): Promise<PixPaymentResponse> {
  try {
    const supabase = getSupabaseServer();

    // 1. Verificar se usuário está autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Usuário não autenticado" };
    }

    // 2. Verificar se já existe cobrança pendente para este usuário e plano
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", user.id)
      .eq("plan", `${params.planName} - ${params.planType}`)
      .eq("status", "pending")
      .single();

    // Se já existe cobrança pendente, retornar ela
    if (existingPayment && existingPayment.pix_code) {
      return {
        success: true,
        chargeId: existingPayment.id,
        pixCopyPaste: existingPayment.pix_code,
        pixQrCode: existingPayment.pix_code, // Usando o mesmo campo
      };
    }

    // 3. Criar cobrança no Asaas
    const apiKey = process.env.ASAS_API_KEY;
    const baseUrl = process.env.ASAS_BASE_URL;

    if (!apiKey || !baseUrl) {
      return {
        success: false,
        error: "Configuração da API Asaas não encontrada",
      };
    }

    // Buscar dados do cliente (email do usuário)
    const customerEmail = user.email || "";

    // Criar cobrança PIX
    const asaasResponse = await fetch(`${baseUrl}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: apiKey,
      },
      body: JSON.stringify({
        customer: customerEmail, // Pode precisar criar customer antes
        billingType: "PIX",
        value: params.amount,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // +24h
        description: `Plano ${params.planName} - ${
          params.planType === "monthly" ? "Mensal" : "Anual"
        }`,
        externalReference: user.id,
      }),
    });

    if (!asaasResponse.ok) {
      const errorData = await asaasResponse.json();
      console.error("Erro Asaas:", errorData);
      return {
        success: false,
        error: `Erro ao criar cobrança: ${
          errorData.errors?.[0]?.description || "Erro desconhecido"
        }`,
      };
    }

    const asaasData = await asaasResponse.json();

    // 4. Buscar QR Code PIX
    let pixQrCode = "";
    let pixCopyPaste = "";

    if (asaasData.id) {
      const pixResponse = await fetch(
        `${baseUrl}/payments/${asaasData.id}/pixQrCode`,
        {
          headers: {
            access_token: apiKey,
          },
        }
      );

      if (pixResponse.ok) {
        const pixData = await pixResponse.json();
        pixQrCode = pixData.encodedImage || ""; // Base64 do QR Code
        pixCopyPaste = pixData.payload || ""; // Código PIX copia e cola
      }
    }

    // 5. Salvar no Supabase
    const { data: payment, error: insertError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        plan: `${params.planName} - ${params.planType}`,
        amount: params.amount,
        status: "pending",
        pix_code: pixCopyPaste || pixQrCode,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Erro ao salvar pagamento:", insertError);
      return {
        success: false,
        error: "Erro ao salvar pagamento no banco de dados",
      };
    }

    revalidatePath("/planos");

    return {
      success: true,
      chargeId: payment.id,
      pixQrCode,
      pixCopyPaste,
    };
  } catch (error) {
    console.error("Erro ao criar pagamento PIX:", error);
    return {
      success: false,
      error: "Erro interno ao processar pagamento",
    };
  }
}

/**
 * Verifica o status de um pagamento
 */
export async function checkPaymentStatus(
  chargeId: string
): Promise<{ status: string; error?: string }> {
  try {
    const supabase = getSupabaseServer();

    const { data: payment, error } = await supabase
      .from("payments")
      .select("status")
      .eq("id", chargeId)
      .single();

    if (error || !payment) {
      return { status: "error", error: "Pagamento não encontrado" };
    }

    return { status: payment.status };
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    return { status: "error", error: "Erro ao verificar status" };
  }
}
