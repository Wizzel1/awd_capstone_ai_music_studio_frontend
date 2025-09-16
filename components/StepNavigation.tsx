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

  const getProceedMessage = () => {
    switch (currentStep) {
      case WorkflowStep.IMAGE_SELECTION:
        return "Select at least one image to continue";
      case WorkflowStep.AUDIO_METHOD:
        return "Choose an audio method to continue";
      case WorkflowStep.AI_AUDIO_GENERATION:
        return "Enter lyrics to generate audio";
      case WorkflowStep.AUDIO_FILE_SELECTION:
        return "Select at least one audio file to continue";
      case WorkflowStep.VIDEO_GENERATION:
        return "Ready to generate your video";
      default:
        return "Complete this step to continue";
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

        {/* Status Message */}
        <div className="flex-1 text-center">
          <p className="text-sm text-zinc-600">{getProceedMessage()}</p>
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
