"use client";

import StepNavigation from "@/components/StepNavigation";
import StepProgress from "@/components/StepProgress";
import AIAudioGeneration from "@/components/steps/AIAudioGeneration";
import AudioFileSelection from "@/components/steps/AudioFileSelection";
import AudioMethodSelection from "@/components/steps/AudioMethodSelection";
import ImageSelection from "@/components/steps/ImageSelection";
import VideoGenerationSummary from "@/components/steps/VideoGenerationSummary";
import { Button } from "@/components/ui/button";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { Project } from "@/lib/types/project";
import { WorkflowStep } from "@/lib/types/workflow";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkflowManagerProps {
  project: Project;
}

export default function WorkflowManager({ project }: WorkflowManagerProps) {
  const { state } = useVideoWorkflow();
  const { currentStep } = state;

  const renderCurrentStep = () => {
    const stepComponents = {
      [WorkflowStep.IMAGE_SELECTION]: <ImageSelection project={project} />,
      [WorkflowStep.AUDIO_METHOD]: <AudioMethodSelection />,
      [WorkflowStep.AI_AUDIO_GENERATION]: (
        <AIAudioGeneration project={project} />
      ),
      [WorkflowStep.AUDIO_FILE_SELECTION]: (
        <AudioFileSelection project={project} />
      ),
      [WorkflowStep.VIDEO_GENERATION]: (
        <VideoGenerationSummary project={project} />
      ),
    };

    return (
      stepComponents[currentStep] ||
      stepComponents[WorkflowStep.IMAGE_SELECTION]
    );
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-white space-y-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              className="text-3xl font-bold text-zinc-900 whitespace-nowrap"
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              Create Video
            </motion.h1>
          </div>

          <p className="text-sm text-zinc-600 mt-1 whitespace-nowrap">
            Create a video from your images and audio
          </p>
        </div>
        <StepProgress />
      </div>

      {/* Main Content Area with bottom padding for fixed navigation */}
      <div className="p-6 pb-24 ">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Navigation */}
      <StepNavigation />
    </div>
  );
}
