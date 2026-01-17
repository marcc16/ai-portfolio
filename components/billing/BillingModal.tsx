"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Infinity, MessageSquare, Sparkles, Check } from "lucide-react";
import { ChatAuthModal } from "@/components/chat/ChatAuthModal";

interface BillingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillingModal({ open, onOpenChange }: BillingModalProps) {
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleUpgrade = () => {
    if (isSignedIn) {
      // User is signed in, redirect to user profile
      onOpenChange(false);
      window.location.href = '/user-profile';
    } else {
      // User is not signed in, show the auth modal
      onOpenChange(false);
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Planes de suscripción
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Elige el plan que mejor se adapte a tus necesidades
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6 py-6">
            {/* Free Plan */}
            <div className="relative p-6 rounded-2xl border-2 border-border bg-card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">Gratis</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </div>

                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Hasta 10 mensajes al día</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Historial de conversaciones</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Experiencia personalizada</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full mt-6"
                  disabled
                >
                  Plan actual
                </Button>
              </div>
            </div>

            {/* Recruiter Plan */}
            <div className="relative p-6 rounded-2xl border-2 border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  RECOMENDADO
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-bold">Recruiter</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/mes</span>
                </div>

                <ul className="space-y-3 pt-4">
                  <li className="flex items-center gap-2 text-sm">
                    <Infinity className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">Mensajes ilimitados</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Acceso prioritario a nuevas funciones</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span>Soporte dedicado para reclutadores</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>Análisis avanzado de candidatos</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Integraciones personalizadas</span>
                  </li>
                </ul>

                <Button
                  className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  onClick={handleUpgrade}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Actualizar ahora
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChatAuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        messageLimit={10}
        isGuest={true}
      />
    </>
  );
}
