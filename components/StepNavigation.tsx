"use client";

import { Button } from "@/components/ui/button";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { WorkflowStep } from "@/lib/types/workflow";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StepNavigation() {
  const { state, actions } = useVideoWorkflow();
  const { currentStep, canProceed } = state;

  const canGoBack = currentStep !== WorkflowStep.IMAGE_SELECTION;
  const isLastStep = currentStep === WorkflowStep.VIDEO_GENERATION;

  const getNextButtonText = () => {
    switch (currentStep) {
      case WorkflowStep.IMAGE_SELECTION:
        return "Continue";
      case WorkflowStep.AUDIO_METHOD:
        return "Continue";
      case WorkflowStep.AI_AUDIO_GENERATION:
        return "Continue";
      case WorkflowStep.AUDIO_FILE_SELECTION:
        return "Continue";
      case WorkflowStep.VIDEO_GENERATION:
        return "Generate Video";
      default:
        return "Continue";
    }
  };

  return (
    <div className="border-t bg-white px-6 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* Previous Button */}
        <div className="flex-1">
          {canGoBack && (
            <Button
              variant="outline"
              onClick={actions.previousStep}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          )}
        </div>

        {/* Next Button */}
        <div className="flex-1 flex justify-end">
          <Button
            onClick={actions.nextStep}
            disabled={!canProceed}
            className="gap-2"
          >
            {getNextButtonText()}
            {!isLastStep && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
