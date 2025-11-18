"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { cancelSubscription } from "@/lib/actions/cancel-subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Zap, AlertCircle } from "lucide-react";

interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "premium" | "business";
  status: "active" | "inactive";
  type: "monthly" | "annual";
  renew_at: string | null;
  credits_remaining: number;
  created_at: string;
  updated_at: string;
}

const PLAN_DETAILS = {
  free: { name: "Free", price: "R$ 0", color: "bg-gray-500" },
  premium: { name: "Premium", price: "R$ 49,90", color: "bg-blue-500" },
  business: { name: "Business", price: "R$ 99,90", color: "bg-purple-500" },
};

const CREDITS_TOTAL = {
  free: 30,
  premium_monthly: 300,
  premium_annual: 1000,
  business_monthly: 1000,
  business_annual: 3000,
};

export default function SubscriptionDashboard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  async function loadSubscription() {
    try {
      const {
        data: { user },
      } = await supabaseBrowser.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabaseBrowser
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Erro ao carregar assinatura:", error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!subscription) return;

    const confirmed = confirm(
      "Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium."
    );

    if (!confirmed) return;

    setCanceling(true);

    try {
      const result = await cancelSubscription(subscription.user_id);

      if (result.success) {
        alert("Assinatura cancelada com sucesso!");
        loadSubscription();
      } else {
        alert("Erro ao cancelar assinatura: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert("Erro ao cancelar assinatura");
    } finally {
      setCanceling(false);
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="w-5 h-5" />
            <p>Nenhuma assinatura encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const planDetails = PLAN_DETAILS[subscription.plan];
  const planKey = `${subscription.plan}_${subscription.type}` as keyof typeof CREDITS_TOTAL;
  const totalCredits = CREDITS_TOTAL[planKey] || CREDITS_TOTAL.free;
  const usedCredits = totalCredits - subscription.credits_remaining;
  const creditsPercentage = (subscription.credits_remaining / totalCredits) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Minha Assinatura</CardTitle>
          <Badge
            variant={subscription.status === "active" ? "default" : "secondary"}
            className={
              subscription.status === "active"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-500"
            }
          >
            {subscription.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Plano Atual */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div
            className={`w-12 h-12 ${planDetails.color} rounded-full flex items-center justify-center`}
          >
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{planDetails.name}</h3>
            <p className="text-sm text-gray-600">
              {subscription.type === "monthly" ? "Mensal" : "Anual"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{planDetails.price}</p>
            <p className="text-xs text-gray-500">por mês</p>
          </div>
        </div>

        {/* Próxima Cobrança */}
        {subscription.renew_at && subscription.status === "active" && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Próxima cobrança</p>
              <p className="font-semibold">
                {new Date(subscription.renew_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Créditos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Créditos</span>
            </div>
            <span className="text-sm text-gray-600">
              {subscription.credits_remaining} / {totalCredits}
            </span>
          </div>

          <Progress value={creditsPercentage} className="h-3" />

          <div className="flex justify-between text-xs text-gray-500">
            <span>Usados: {usedCredits}</span>
            <span>Disponíveis: {subscription.credits_remaining}</span>
          </div>
        </div>

        {/* Botão Cancelar */}
        {subscription.status === "active" && subscription.plan !== "free" && (
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleCancel}
            disabled={canceling}
          >
            {canceling ? "Cancelando..." : "Cancelar Plano"}
          </Button>
        )}

        {subscription.status === "inactive" && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Sua assinatura está inativa. Renove para continuar usando os
              recursos premium.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
