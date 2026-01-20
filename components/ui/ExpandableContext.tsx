"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface STARContext {
    situation?: string;
    task?: string;
    action?: string;
    result?: string;
    lessonsLearned?: string;
}

interface TechnicalContext {
    problemStatement?: string;
    technicalChallenges?: string;
    solutionsAndDecisions?: string;
    impact?: string;
    technicalHighlights?: string[];
}

type AIContextData = STARContext | TechnicalContext;

interface ExpandableContextProps {
    context: AIContextData;
    type: "experience" | "project";
    title?: string;
}

function isSTARContext(context: AIContextData): context is STARContext {
    return "situation" in context || "task" in context;
}

export function ExpandableContext({
    context,
    type,
    title = "View AI Context",
}: ExpandableContextProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasContent = Object.values(context).some(
        (value) =>
            value !== undefined &&
            value !== null &&
            (typeof value === "string" ? value.trim() !== "" : value.length > 0)
    );

    if (!hasContent) {
        return null;
    }

    return (
        <div className="mt-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
                {title}
            </button>

            {isExpanded && (
                <div className="mt-4 p-6 rounded-lg border border-border bg-muted/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {type === "experience" && isSTARContext(context) ? (
                        <>
                            {context.situation && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        📍 Situation
                                    </h4>
                                    <p className="text-sm leading-relaxed">{context.situation}</p>
                                </div>
                            )}

                            {context.task && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        🎯 Task
                                    </h4>
                                    <p className="text-sm leading-relaxed">{context.task}</p>
                                </div>
                            )}

                            {context.action && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        ⚡ Action
                                    </h4>
                                    <p className="text-sm leading-relaxed">{context.action}</p>
                                </div>
                            )}

                            {context.result && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        ✅ Result
                                    </h4>
                                    <p className="text-sm leading-relaxed">{context.result}</p>
                                </div>
                            )}

                            {context.lessonsLearned && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        💡 Lessons Learned
                                    </h4>
                                    <p className="text-sm leading-relaxed">
                                        {context.lessonsLearned}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {!isSTARContext(context) && context.problemStatement && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        🎯 Problem Statement
                                    </h4>
                                    <p className="text-sm leading-relaxed">
                                        {context.problemStatement}
                                    </p>
                                </div>
                            )}

                            {!isSTARContext(context) && context.technicalChallenges && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        ⚠️ Technical Challenges
                                    </h4>
                                    <p className="text-sm leading-relaxed">
                                        {context.technicalChallenges}
                                    </p>
                                </div>
                            )}

                            {!isSTARContext(context) && context.solutionsAndDecisions && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        💡 Solutions & Decisions
                                    </h4>
                                    <p className="text-sm leading-relaxed">
                                        {context.solutionsAndDecisions}
                                    </p>
                                </div>
                            )}

                            {!isSTARContext(context) && context.impact && (
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                        📊 Impact & Results
                                    </h4>
                                    <p className="text-sm leading-relaxed">{context.impact}</p>
                                </div>
                            )}

                            {!isSTARContext(context) &&
                                context.technicalHighlights &&
                                context.technicalHighlights.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                                            ⭐ Technical Highlights
                                        </h4>
                                        <ul className="space-y-1">
                                            {context.technicalHighlights.map((highlight, index) => (
                                                <li key={index} className="text-sm leading-relaxed">
                                                    • {highlight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
