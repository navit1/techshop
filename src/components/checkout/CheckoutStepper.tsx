
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
      <ol role="list" className="flex items-start justify-around">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn("relative px-1 flex-1 min-w-0", stepIdx !== steps.length - 1 ? "sm:pr-2" : "")}>
            <div className="flex flex-col sm:flex-row items-center text-sm">
              {stepIdx < currentStepIndex ? (
                // Completed Step
                <>
                  <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground group-hover:bg-primary/80">
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="mt-1 sm:mt-0 sm:ml-2 text-xs sm:text-sm font-medium text-primary text-center sm:text-left break-words">{step.name}</span>
                </>
              ) : stepIdx === currentStepIndex ? (
                // Current Step
                <>
                  <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                    <Dot className="h-6 w-6 animate-pulse" aria-hidden="true" />
                  </span>
                  <span className="mt-1 sm:mt-0 sm:ml-2 text-xs sm:text-sm font-medium text-primary text-center sm:text-left break-words">{step.name}</span>
                </>
              ) : (
                // Upcoming Step
                <>
                  <span className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full border-2 border-muted-foreground/50 bg-muted text-muted-foreground/70 group-hover:border-muted-foreground">
                     <Circle className="h-3 w-3" />
                  </span>
                  <span className="mt-1 sm:mt-0 sm:ml-2 text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground text-center sm:text-left break-words">{step.name}</span>
                </>
              )}
            </div>
             {/* Connector line for larger screens */}
             {stepIdx !== steps.length - 1 && (
              <div className="hidden sm:block absolute top-4 left-1/2 w-[calc(100%-2rem)] -translate-x-1/2 -z-10" aria-hidden="true">
                <div className={cn(
                    "h-0.5 w-full",
                    stepIdx < currentStepIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

    