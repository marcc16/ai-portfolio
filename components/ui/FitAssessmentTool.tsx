"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type FitLevel = "strong" | "partial" | "weak" | null;

interface FitAnalysis {
    fitLevel: FitLevel;
    summary: string;
    alignments: string[];
    gaps: string[];
    recommendation: string;
}

export function FitAssessmentTool() {
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            setError("Por favor pega primero una descripción del trabajo");
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setAnalysis(null);

        try {
            const response = await fetch("/api/analyze-fit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ jobDescription }),
            });

            if (!response.ok) {
                throw new Error("Error al analizar compatibilidad");
            }

            const data = await response.json();
            setAnalysis(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Ocurrió un error durante el análisis"
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getFitIcon = (fitLevel: FitLevel) => {
        switch (fitLevel) {
            case "strong":
                return <CheckCircle2 className="w-8 h-8 text-green-500" />;
            case "partial":
                return <AlertCircle className="w-8 h-8 text-yellow-500" />;
            case "weak":
                return <XCircle className="w-8 h-8 text-red-500" />;
            default:
                return null;
        }
    };

    const getFitColor = (fitLevel: FitLevel) => {
        switch (fitLevel) {
            case "strong":
                return "border-green-500 bg-green-50 dark:bg-green-950/20";
            case "partial":
                return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20";
            case "weak":
                return "border-red-500 bg-red-50 dark:bg-red-950/20";
            default:
                return "border-border";
        }
    };

    const getFitTitle = (fitLevel: FitLevel) => {
        switch (fitLevel) {
            case "strong":
                return "Muy Compatible - ¡Hablemos!";
            case "partial":
                return "Parcialmente Compatible - Algo de Alineación";
            case "weak":
                return "Poco Compatible - No Recomendado";
            default:
                return "";
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold mb-2">Evaluación de Compatibilidad</h3>
                <p className="text-muted-foreground">
                    Pega una descripción del trabajo y te daré una evaluación honesta de
                    qué tan bien mi experiencia se alinea con el puesto.
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="job-description"
                        className="block text-sm font-medium mb-2"
                    >
                        Descripción del Trabajo
                    </label>
                    <textarea
                        id="job-description"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Pega la descripción completa del trabajo aquí..."
                        className="w-full min-h-[200px] p-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                        disabled={isAnalyzing}
                    />
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !jobDescription.trim()}
                    className="w-full py-3 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analizando Compatibilidad...
                        </>
                    ) : (
                        "Analizar Compatibilidad"
                    )}
                </button>

                {error && (
                    <div className="p-4 rounded-lg border border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300">
                        {error}
                    </div>
                )}

                {analysis && (
                    <div
                        className={`p-6 rounded-lg border-2 ${getFitColor(analysis.fitLevel)} space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        <div className="flex items-center gap-3">
                            {getFitIcon(analysis.fitLevel)}
                            <h4 className="text-xl font-bold">
                                {getFitTitle(analysis.fitLevel)}
                            </h4>
                        </div>

                        <p className="text-lg">{analysis.summary}</p>

                        {analysis.alignments.length > 0 && (
                            <div>
                                <h5 className="font-semibold mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    Qué se Alinea
                                </h5>
                                <ul className="space-y-1 ml-7">
                                    {analysis.alignments.map((item, index) => (
                                        <li key={index} className="text-sm">
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {analysis.gaps.length > 0 && (
                            <div>
                                <h5 className="font-semibold mb-2 flex items-center gap-2">
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    Brechas y Consideraciones
                                </h5>
                                <ul className="space-y-1 ml-7">
                                    {analysis.gaps.map((item, index) => (
                                        <li key={index} className="text-sm">
                                            • {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pt-4 border-t border-border">
                            <h5 className="font-semibold mb-2">Mi Recomendación</h5>
                            <p className="text-sm">{analysis.recommendation}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
