"use client";

import { useState, useEffect } from "react";
import { Loader2, Briefcase, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Lock, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar";
import { AnalysisCounter } from "./AnalysisCounter";
import { getJobAnalysisUsage } from "@/app/actions/job-analysis";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { BillingModal } from "@/components/billing/BillingModal";

interface AssessmentResult {
    matchScore: number;
    summary: string;
    strengths: string[];
    gaps: string[];
    verdict: "High Match" | "Potential Match" | "Low Match";
    usage?: {
        remaining: number;
        limit: number;
    };
}

export function JobFitAssessment() {
    const { isSignedIn } = useUser();
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rateLimitReached, setRateLimitReached] = useState(false);
    const [showBillingModal, setShowBillingModal] = useState(false);
    const [analysisUsage, setAnalysisUsage] = useState<{
        remaining: number;
        limit: number;
        allowed: boolean;
    }>({
        remaining: isSignedIn ? 3 : 1,
        limit: isSignedIn ? 3 : 1,
        allowed: true,
    });

    // Load initial usage
    useEffect(() => {
        const loadUsage = async () => {
            try {
                const usage = await getJobAnalysisUsage();
                setAnalysisUsage(usage);
                // Only set rateLimitReached if there are truly no remaining analyses
                // But don't disable the form until user actually tries to submit
            } catch (err) {
                console.error("Error loading analysis usage:", err);
                // On error, keep the default optimistic state
            }
        };
        loadUsage();
    }, []);

    // Simulate loading progress
    useEffect(() => {
        if (!isLoading) {
            setLoadingProgress(0);
            return;
        }

        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 90) return prev; // Hold at 90% until real data arrives
                return prev + Math.random() * 10;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobDescription.trim()) return;

        setIsLoading(true);
        setLoadingProgress(0);
        setError(null);
        setResult(null);
        setRateLimitReached(false);

        try {
            const response = await fetch("/api/job-fit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription }),
            });

            const data = await response.json();

            if (response.status === 429) {
                // Rate limit exceeded
                setError(data.error);
                setRateLimitReached(true);
                setAnalysisUsage({
                    remaining: 0,
                    limit: data.limit,
                    allowed: false
                });
                setIsLoading(false);

                // Show billing modal if user is logged in and on free plan (limit < 5)
                if (isSignedIn && data.limit < 5) {
                    setShowBillingModal(true);
                }
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || "Failed to analyze job fit");
            }

            // Complete animation to 100%
            setLoadingProgress(100);

            // Update usage if provided
            if (data.usage) {
                setAnalysisUsage({
                    remaining: data.usage.remaining,
                    limit: data.usage.limit,
                    allowed: data.usage.remaining > 0
                });

                // If this was the last analysis (remaining is now 0) and user is signed in on free plan
                if (data.usage.remaining === 0 && isSignedIn && data.usage.limit < 5) {
                    // Show billing modal after a short delay to let them see the result
                    setTimeout(() => {
                        setShowBillingModal(true);
                    }, 2000);
                }
            }

            // Small delay to let animation finish before snapping result
            setTimeout(() => {
                setResult(data);
                setIsLoading(false);
            }, 600);

        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    // Color helper for verdict
    const getScoreHexColor = (score: number) => {
        if (score >= 80) return "#10b981"; // emerald-500
        if (score >= 50) return "#eab308"; // yellow-500
        return "#ef4444"; // red-500
    };

    const getScoreTextColor = (score: number) => {
        if (score >= 80) return "text-emerald-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    return (
        <section className="py-20 px-4 md:px-6 relative overflow-hidden" id="job-fit">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Herramienta IA para Reclutadores
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        ¿Encajo en el puesto?
                    </h2>
                    <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                        Pega una descripción del trabajo y deja que mi clon IA analice honestamente si soy una buena opción para tu equipo.
                    </p>
                </div>

                <div className="relative z-10">
                    {/* Analysis Counter */}
                    <div className="mb-4 max-w-md mx-auto">
                        <AnalysisCounter
                            remaining={analysisUsage.remaining}
                            limit={analysisUsage.limit}
                        />
                    </div>

                    {/* Rate Limit Warning */}
                    {rateLimitReached && error && (
                        <div className="mb-6 p-4 max-w-2xl mx-auto rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md">
                            <div className="flex items-start gap-3">
                                <Lock className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-200 text-sm">
                                        {error}
                                    </p>
                                    {!isSignedIn && (
                                        <Link
                                            href="/sign-in"
                                            className="mt-2 inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-100 underline underline-offset-4 transition-colors"
                                        >
                                            Iniciar sesión para más análisis
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    )}
                                    {isSignedIn && analysisUsage.limit < 5 && (
                                        <button
                                            onClick={() => setShowBillingModal(true)}
                                            className="mt-2 inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-100 transition-colors cursor-pointer"
                                        >
                                            <Crown className="h-4 w-4" />
                                            Actualizar a Recruiter para 5 análisis/día
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Input Card */}
                    <div className={cn(
                        "bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-500",
                        (result || isLoading) ? "mb-8" : ""
                    )}>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <Textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Pega la descripción del trabajo aquí (ej. 'Ingeniero Frontend Senior en TechCorp...')"
                                    className="w-full min-h-[150px] bg-white/5 border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-transparent resize-none transition-all scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent text-base"
                                    disabled={isLoading}
                                />
                                <div className="absolute bottom-4 right-4 translate-y-0">
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !jobDescription.trim()}
                                        className={cn(
                                            "rounded-full px-6 transition-all duration-300",
                                            isLoading ? "bg-primary/80" : "bg-primary hover:bg-primary/90 hover:scale-105"
                                        )}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Analizando...
                                            </>
                                        ) : (
                                            <>
                                                Analizar Compatibilidad <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Results Display */}
                    {(result || isLoading) && (
                        <div className="grid md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-10 fade-in duration-700">
                            {/* Score Card */}
                            <div className="md:col-span-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                                <div className="relative flex items-center justify-center py-4">
                                    <AnimatedCircularProgressBar
                                        max={100}
                                        min={0}
                                        value={result ? result.matchScore : loadingProgress}
                                        gaugePrimaryColor={result ? getScoreHexColor(result.matchScore) : "#ffffff"}
                                        gaugeSecondaryColor="rgba(255, 255, 255, 0.1)"
                                        className={cn(
                                            "font-bold text-4xl",
                                            result ? getScoreTextColor(result.matchScore) : "text-white"
                                        )}
                                    />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-medium">Puntuación de Compatibilidad</p>
                                    <h3 className={cn("text-xl font-bold mt-1", result ? getScoreTextColor(result.matchScore) : "text-white")}>
                                        {result?.verdict || "Calculando..."}
                                    </h3>

                                    {/* Conversion CTA */}
                                    {result && (
                                        <div className="pt-2 animate-in fade-in zoom-in duration-700 delay-300">
                                            <a
                                                href="#contact"
                                                className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white border border-white/5 hover:border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-500 hover:scale-105"
                                            >
                                                Hablemos de ello <ArrowRight className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Analysis Details */}
                            <div className="md:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
                                {isLoading ? (
                                    <div className="h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground animate-pulse">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" />
                                        <p>Analizando perfil vs requisitos del trabajo...</p>
                                    </div>
                                ) : (
                                    <>
                                        {result?.summary && (
                                            <div className="animate-in fade-in duration-500">
                                                <h4 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                                                    <Briefcase className="h-5 w-5 text-primary" />
                                                    Resumen
                                                </h4>
                                                <p className="text-neutral-300 leading-relaxed">
                                                    {result.summary}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid sm:grid-cols-2 gap-8">
                                            {result?.strengths && (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-left-5 duration-500 delay-100">
                                                    <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4" /> Por qué encajo
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.strengths.map((str, i) => (
                                                            <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                                {str}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {result?.gaps && (
                                                <div className="space-y-3 animate-in fade-in slide-in-from-right-5 duration-500 delay-200">
                                                    <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4" /> Posibles Brechas
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {result.gaps.map((gap, i) => (
                                                            <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                                                                {gap}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Billing Modal */}
            <BillingModal
                open={showBillingModal}
                onOpenChange={setShowBillingModal}
            />
        </section>
    );
}
