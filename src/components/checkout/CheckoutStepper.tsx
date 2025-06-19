
"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Circle, Dot } from "lucide-react";

interface Step {
  id: string;
  name: string;
}

interface CheckoutStepperProps {
  steps: Step[];
  currentStepId: string;
  className?: string;
}

export function CheckoutStepper({ steps, currentStepId, className }: CheckoutStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <nav aria-label="Progress" className={cn("mb-8 py-4 bg-card shadow rounded-lg", className)}>
      <ol role="list" className="flex items-center justify-around">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn("relative", stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20 md:pr-32 lg:pr-40" : "")}>
            <div className="flex items-center text-sm">
              {stepIdx < currentStepIndex ? (
                // Completed Step
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground group-hover:bg-primary/80">
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-primary">{step.name}</span>
                </>
              ) : stepIdx === currentStepIndex ? (
                // Current Step
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                    <Dot className="h-6 w-6 animate-pulse" aria-hidden="true" />
                  </span>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-primary">{step.name}</span>
                </>
              ) : (
                // Upcoming Step
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-foreground/50 bg-muted text-muted-foreground/70 group-hover:border-muted-foreground">
                     <Circle className="h-3 w-3" />
                  </span>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground">{step.name}</span>
                </>
              )}

              {/* Separator was here, now removed */}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

