"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createSession, getMessageUsage } from "@/app/actions/create-session";
import type { CHAT_PROFILE_QUERYResult } from "@/sanity.types";
import { useSidebar } from "../ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { ChatAuthModal } from "./ChatAuthModal";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";

export function Chat({
  profile,
}: {
  profile: CHAT_PROFILE_QUERYResult | null;
}) {
  const { toggleSidebar } = useSidebar();
  const { isSignedIn } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);
  const [messageUsage, setMessageUsage] = useState<{
    remaining: number;
    limit: number;
    allowed: boolean;
  } | null>(null);

  // Fetch initial message usage
  useEffect(() => {
    const fetchUsage = async () => {
      setIsLoadingUsage(true);
      try {
        const usage = await getMessageUsage();
        setMessageUsage(usage);
        // Mark if already at limit, but don't auto-show modal
        if (!usage.allowed) {
          setRateLimitReached(true);
        }
      } catch (error) {
        console.error("Error fetching message usage:", error);
        // Set default values on error
        setMessageUsage({
          remaining: isSignedIn ? 10 : 3,
          limit: isSignedIn ? 10 : 3,
          allowed: true,
        });
      } finally {
        setIsLoadingUsage(false);
      }
    };

    fetchUsage();
    // Reset rate limit state when auth state changes
    setRateLimitReached(false);
  }, [isSignedIn]);

  // Reset rate limit state when sidebar opens
  // This allows users to retry or navigate away from blocked state
  const { open, openMobile, isMobile } = useSidebar();
  const isSidebarOpen = isMobile ? openMobile : open;

  useEffect(() => {
    // When sidebar closes, reset the rate limit reached state
    // This prevents the app from staying blocked
    if (!isSidebarOpen) {
      setRateLimitReached(false);
    }
  }, [isSidebarOpen]);

  // Handle session creation with error handling
  const handleCreateSession = useCallback(async () => {
    try {
      const secret = await createSession();

      // Refresh message usage after creating session
      const usage = await getMessageUsage();
      setMessageUsage(usage);

      return secret;
    } catch (error) {
      // If rate limit exceeded, mark as reached but don't auto-show modal
      if (error instanceof Error && error.message.includes("límite")) {
        setRateLimitReached(true);
      }
      throw error;
    }
  }, [isSignedIn]);
  // Generate greeting based on available profile data
  const getGreeting = () => {
    if (!profile?.firstName) {
      return "¡Hola! Pregúntame lo que quieras sobre mi trabajo, experiencia o proyectos.";
    }

    // The .filter(Boolean) removes all falsy values from the array, so if the firstName or lastName is not set, it will be removed
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");

    return `¡Hola! Soy ${fullName}. Pregúntame lo que quieras sobre mi trabajo, experiencia o proyectos.`;
  };

  const { control } = useChatKit({
    api: {
      getClientSecret: handleCreateSession,
    },
    // https://chatkit.studio/playground
    theme: {
      colorScheme: 'dark',
    },
    header: {
      title: {
        text: `Chat con ${profile?.firstName || "migo"}`,
      },
      leftAction: {
        icon: "close",
        onClick: (e?: Event) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          toggleSidebar();
        },
      },
    },
    startScreen: {
      greeting: getGreeting(),
      prompts: [
        {
          icon: "suitcase",
          label: "¿Cuál es tu experiencia?",
          prompt:
            "Cuéntame sobre tu experiencia profesional y tus roles anteriores",
        },
        {
          icon: "square-code",
          label: "¿Qué habilidades tienes?",
          prompt:
            "¿En qué tecnologías y lenguajes de programación te especializas?",
        },
        {
          icon: "cube",
          label: "¿Qué has construido?",
          prompt: "Muéstrame algunos de tus proyectos más interesantes",
        },
        {
          icon: "profile",
          label: "¿Quién eres?",
          prompt: "Cuéntame más sobre ti y tu trayectoria",
        },
      ],
    },
    composer: {
      models: [
        {
          id: "crisp",
          label: "Conciso",
          description: "Breve y al grano",
        },
        {
          id: "clear",
          label: "Claro",
          description: "Enfocado y útil",
        },
        {
          id: "chatty",
          label: "Charlatán",
          description: "Compañero conversacional",
        },
      ],
    },

    disclaimer: {
      text: "Aviso: Este es mi gemelo digital con IA. Puede no ser 100% preciso, verifica la información importante.",
    },
  });

  // Show blocked state if rate limit reached (but user can still close sidebar)
  if (rateLimitReached && !isSignedIn) {
    return (
      <>
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
              <Lock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Límite alcanzado</h3>
              <p className="text-muted-foreground">
                Has usado tus {messageUsage?.limit || 3} mensajes gratuitos de hoy.
              </p>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowAuthModal(true)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Iniciar sesión para continuar
            </Button>
            <p className="text-xs text-muted-foreground">
              Obtén hasta 10 mensajes al día con tu cuenta
            </p>
          </div>
        </div>

        <ChatAuthModal
          open={showAuthModal}
          onOpenChange={(open) => {
            setShowAuthModal(open);
            // Don't reset rate limit state - let user close sidebar instead
          }}
          messageLimit={messageUsage?.limit || 3}
          isGuest={!isSignedIn}
        />
      </>
    );
  }

  if (rateLimitReached && isSignedIn) {
    return (
      <>
        <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
              <Lock className="h-8 w-8 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Límite diario alcanzado</h3>
              <p className="text-muted-foreground">
                Has usado tus {messageUsage?.limit || 10} mensajes de hoy.
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu límite se restablecerá a la <span className="font-semibold">medianoche</span>.
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowAuthModal(true)}
            >
              Ver planes premium
            </Button>
          </div>
        </div>

        <ChatAuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          messageLimit={messageUsage?.limit || 10}
          isGuest={false}
        />
      </>
    );
  }

  return (
    <>
      <ChatKit control={control} className="h-full w-full z-50" />

      {/* Auth Modal */}
      {messageUsage && (
        <ChatAuthModal
          open={showAuthModal}
          onOpenChange={(open) => {
            setShowAuthModal(open);
            if (!open) {
              setRateLimitReached(false);
            }
          }}
          messageLimit={messageUsage.limit}
          isGuest={!isSignedIn}
        />
      )}
    </>
  );
}

export default Chat;
