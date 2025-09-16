"use client";

import StepNavigation from "@/components/StepNavigation";
import StepProgress from "@/components/StepProgress";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { Project } from "@/lib/types/project";
import { WorkflowStep } from "@/lib/types/workflow";

// Placeholder step components (will be created in Phase 3)
function ImageSelectionStep() {
  return (
    <div className="flex items-center justify-center h-96 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Image Selection
        </h3>
        <p className="text-zinc-600">
          This step will be implemented in Phase 3
        </p>
      </div>
    </div>
  );
}

function AudioMethodSelectionStep() {
  return (
    <div className="flex items-center justify-center h-96 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Audio Method Selection
        </h3>
        <p className="text-zinc-600">
          This step will be implemented in Phase 3
        </p>
      </div>
    </div>
  );
}

function AIAudioGenerationStep() {
  return (
    <div className="flex items-center justify-center h-96 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          AI Audio Generation
        </h3>
        <p className="text-zinc-600">
          This step will be implemented in Phase 3
        </p>
      </div>
    </div>
  );
}

function AudioFileSelectionStep() {
  return (
    <div className="flex items-center justify-center h-96 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Audio File Selection
        </h3>
        <p className="text-zinc-600">
          This step will be implemented in Phase 3
        </p>
      </div>
    </div>
  );
}

function VideoGenerationStep() {
  return (
    <div className="flex items-center justify-center h-96 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-300">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Video Generation
        </h3>
        <p className="text-zinc-600">
          This step will be implemented in Phase 3
        </p>
      </div>
    </div>
  );
}

interface WorkflowManagerProps {
  project: Project;
}

export default function WorkflowManager({ project }: WorkflowManagerProps) {
  const { state } = useVideoWorkflow();
  const { currentStep } = state;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case WorkflowStep.IMAGE_SELECTION:
        return <ImageSelectionStep />;
      case WorkflowStep.AUDIO_METHOD:
        return <AudioMethodSelectionStep />;
      case WorkflowStep.AI_AUDIO_GENERATION:
        return <AIAudioGenerationStep />;
      case WorkflowStep.AUDIO_FILE_SELECTION:
        return <AudioFileSelectionStep />;
      case WorkflowStep.VIDEO_GENERATION:
        return <VideoGenerationStep />;
      default:
        return <ImageSelectionStep />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-zinc-900">{project.name}</h1>
          <p className="text-zinc-600 mt-1">
            Create a video from your images and audio
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <StepProgress />

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">{renderCurrentStep()}</div>
      </div>

      {/* Navigation */}
      <StepNavigation />
    </div>
  );
}
