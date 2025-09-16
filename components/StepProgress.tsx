"use client";

import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { AudioMethod, WorkflowStep } from "@/lib/types/workflow";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepInfo {
  step: WorkflowStep;
  title: string;
}

const baseSteps: StepInfo[] = [
  {
    step: WorkflowStep.IMAGE_SELECTION,
    title: "Select Images",
  },
  {
    step: WorkflowStep.AUDIO_METHOD,
    title: "Audio Method",
  },
  {
    step: WorkflowStep.VIDEO_GENERATION,
    title: "Generate Video",
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
    });
  } else if (audioMethod === AudioMethod.FILE_UPLOAD) {
    steps.splice(2, 0, {
      step: WorkflowStep.AUDIO_FILE_SELECTION,
      title: "Select Audio",
    });
  }

  const currentStepIndex = steps.findIndex((step) => step.step === currentStep);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full py-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Line */}
        <div className="relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-zinc-200">
            <motion.div
              className="h-full bg-zinc-900"
              initial={{ width: "0%" }}
              animate={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);

              return (
                <motion.div
                  key={step.step}
                  className="flex flex-col items-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                >
                  {/* Step Circle */}
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white",
                      {
                        "border-zinc-900 bg-zinc-900":
                          status === "current" || status === "completed",
                        "border-zinc-300": status === "upcoming",
                      }
                    )}
                    animate={{
                      scale: status === "current" ? 1.1 : 1,
                      borderColor:
                        status === "current" || status === "completed"
                          ? "#18181b"
                          : "#d4d4d8",
                      backgroundColor:
                        status === "current" || status === "completed"
                          ? "#18181b"
                          : "#ffffff",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    {status === "completed" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.2 }}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </motion.div>
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
                  </motion.div>

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
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
