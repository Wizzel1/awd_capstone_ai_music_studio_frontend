"use client";

import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { AudioMethod, WorkflowStep } from "@/lib/types/workflow";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepInfo {
  step: WorkflowStep;
  title: string;
  description: string;
}

const baseSteps: StepInfo[] = [
  {
    step: WorkflowStep.IMAGE_SELECTION,
    title: "Select Images",
    description: "Choose images for your video",
  },
  {
    step: WorkflowStep.AUDIO_METHOD,
    title: "Audio Method",
    description: "Choose how to add audio",
  },
  {
    step: WorkflowStep.VIDEO_GENERATION,
    title: "Generate Video",
    description: "Create your final video",
  },
];

export default function StepProgress() {
  const { state } = useVideoWorkflow();
  const { currentStep, audioMethod } = state;

  // Dynamically build steps based on audio method
  const steps: StepInfo[] = [...baseSteps];

  // Insert the appropriate audio step
  if (audioMethod === AudioMethod.AI_GENERATION) {
    steps.splice(2, 0, {
      step: WorkflowStep.AI_AUDIO_GENERATION,
      title: "Generate Audio",
      description: "Create audio with AI",
    });
  } else if (audioMethod === AudioMethod.FILE_UPLOAD) {
    steps.splice(2, 0, {
      step: WorkflowStep.AUDIO_FILE_SELECTION,
      title: "Select Audio",
      description: "Choose audio files",
    });
  }

  const currentStepIndex = steps.findIndex((step) => step.step === currentStep);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Line */}
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-200">
            <div
              className="h-full bg-zinc-900 transition-all duration-300"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);

              return (
                <div key={step.step} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white transition-all duration-300",
                      {
                        "border-zinc-900 bg-zinc-900":
                          status === "current" || status === "completed",
                        "border-zinc-300": status === "upcoming",
                      }
                    )}
                  >
                    {status === "completed" ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={cn("text-sm font-semibold", {
                          "text-white": status === "current",
                          "text-zinc-400": status === "upcoming",
                        })}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="mt-3 text-center max-w-32">
                    <p
                      className={cn("text-sm font-medium", {
                        "text-zinc-900":
                          status === "current" || status === "completed",
                        "text-zinc-500": status === "upcoming",
                      })}
                    >
                      {step.title}
                    </p>
                    <p
                      className={cn("text-xs mt-1", {
                        "text-zinc-600":
                          status === "current" || status === "completed",
                        "text-zinc-400": status === "upcoming",
                      })}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
