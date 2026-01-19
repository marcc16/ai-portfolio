"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Lock, Sparkles, Crown, Infinity } from "lucide-react";
import { CustomSignIn } from "@/components/auth/CustomSignIn";
import { BillingModal } from "@/components/billing/BillingModal";

interface ChatAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageLimit: number;
  isGuest: boolean;
}

type AuthMode = "info" | "signin";

export function ChatAuthModal({
  open,
  onOpenChange,
  messageLimit,
  isGuest,
}: ChatAuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("info");
  const [showBillingModal, setShowBillingModal] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
    setAuthMode("info");
    // Reload the page to refresh the session
    window.location.reload();
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset to info mode after a delay
    setTimeout(() => setAuthMode("info"), 300);
  };

  const handleUpgrade = () => {
    // Don't close the auth modal, just show billing modal on top
    // This prevents the rate limit check from reopening the auth modal
    setShowBillingModal(true);
  };
  // Render different content based on auth mode
  const renderContent = () => {
    if (authMode === "signin") {
      return <CustomSignIn onSuccess={handleSuccess} />;
    }

    // Default info mode
    return (
      <>
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            {isGuest
              ? "Límite de mensajes alcanzado"
              : "Límite diario alcanzado"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isGuest ? (
            <>
              <div className="text-center text-sm text-muted-foreground">
                Has usado tus <span className="font-semibold">{messageLimit} mensajes gratuitos</span> de hoy.
              </div>
              <div className="space-y-3 text-left bg-muted/50 rounded-lg p-4">
                <div className="font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Inicia sesión para obtener:
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Hasta <span className="font-semibold">5 mensajes al día</span></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Historial de conversaciones guardado</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Experiencia personalizada</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-muted-foreground">
                Has alcanzado el límite de <span className="font-semibold">{messageLimit} mensajes diarios</span>.
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm">
                  Tu límite se restablecerá a la <span className="font-semibold">medianoche</span>.
                </div>
              </div>
              <div className="space-y-3 text-left bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                <div className="font-medium text-foreground flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Actualiza al Plan Recruiter:
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Infinity className="h-4 w-4 text-yellow-500" />
                    <span><span className="font-semibold">Mensajes ilimitados</span> al día</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Acceso prioritario a nuevas funciones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span>Soporte dedicado para reclutadores</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="space-y-3 pt-4">
          {isGuest && (
            <>
              <Button
                className="w-full"
                size="lg"
                onClick={() => setAuthMode("signin")}
              >
                <Lock className="mr-2 h-4 w-4" />
                Iniciar sesión
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleUpgrade}
              >
                <Crown className="mr-2 h-4 w-4" />
                Ver planes y precios
              </Button>
            </>
          )}
          {!isGuest && (
            <>
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                size="lg"
                onClick={handleUpgrade}
              >
                <Crown className="mr-2 h-4 w-4" />
                Actualizar a Recruiter
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleClose}
              >
                Más tarde
              </Button>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[450px]">
          {renderContent()}
        </DialogContent>
      </Dialog>

      <BillingModal
        open={showBillingModal}
        onOpenChange={(open) => {
          setShowBillingModal(open);
          // Close auth modal when billing modal closes
          if (!open) {
            handleClose();
          }
        }}
      />
    </>
  );
}
