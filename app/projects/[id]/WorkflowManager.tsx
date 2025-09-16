"use client";

import StepNavigation from "@/components/StepNavigation";
import StepProgress from "@/components/StepProgress";
import AIAudioGeneration from "@/components/steps/AIAudioGeneration";
import AudioFileSelection from "@/components/steps/AudioFileSelection";
import AudioMethodSelection from "@/components/steps/AudioMethodSelection";
import ImageSelection from "@/components/steps/ImageSelection";
import VideoGenerationSummary from "@/components/steps/VideoGenerationSummary";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { Project } from "@/lib/types/project";
import { WorkflowStep } from "@/lib/types/workflow";

interface WorkflowManagerProps {
  project: Project;
}

export default function WorkflowManager({ project }: WorkflowManagerProps) {
  const { state } = useVideoWorkflow();
  const { currentStep } = state;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case WorkflowStep.IMAGE_SELECTION:
        return <ImageSelection project={project} />;
      case WorkflowStep.AUDIO_METHOD:
        return <AudioMethodSelection />;
      case WorkflowStep.AI_AUDIO_GENERATION:
        return <AIAudioGeneration />;
      case WorkflowStep.AUDIO_FILE_SELECTION:
        return <AudioFileSelection project={project} />;
      case WorkflowStep.VIDEO_GENERATION:
        return <VideoGenerationSummary />;
      default:
        return <ImageSelection project={project} />;
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
