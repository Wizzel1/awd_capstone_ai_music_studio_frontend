"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { AudioMethod } from "@/lib/types/workflow";
import { cn } from "@/lib/utils";
import { Mic, Music, Sparkles, Upload } from "lucide-react";

export default function AudioMethodSelection() {
  const { state, actions } = useVideoWorkflow();
  const { audioMethod } = state;

  const methods = [
    {
      id: AudioMethod.AI_GENERATION,
      title: "Generate with AI",
      description: "Create custom audio from your lyrics using AI",
      icon: Sparkles,
      features: [
        "Write your own lyrics",
        "AI-generated music",
        "Multiple music styles",
        "Instant generation",
      ],
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: AudioMethod.FILE_UPLOAD,
      title: "Use your own",
      description: "Upload your own audio files or select from project",
      icon: Upload,
      features: [
        "Upload audio files",
        "Use existing project audio",
        "Support for MP3, WAV",
        "Full control over audio",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  const handleMethodSelect = (method: AudioMethod) => {
    actions.setAudioMethod(method);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Choose Audio Method
        </h2>
        <p className="text-zinc-600">
          How would you like to add audio to your video?
        </p>
      </div>

      {/* Method Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {methods.map((method) => {
          const isSelected = audioMethod === method.id;
          const Icon = method.icon;

          return (
            <Card
              key={method.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-lg",
                {
                  "ring-2 ring-zinc-900 shadow-lg": isSelected,
                  "hover:ring-1 hover:ring-zinc-300": !isSelected,
                }
              )}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-6">
                {/* Header with Icon */}
                <div className="flex items-start space-x-4 mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-gradient-to-r text-white",
                      method.gradient
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-zinc-900 mb-1">
                      {method.title}
                    </h3>
                    <p className="text-zinc-600 text-sm">
                      {method.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4">
                  {method.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="text-sm text-zinc-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Use Case Description */}
                <div className="mb-4 p-3 bg-zinc-50 rounded-lg">
                  <p className="text-sm text-zinc-700">
                    {method.id === AudioMethod.AI_GENERATION
                      ? "Perfect when you have lyrics but need music to go with them. Create custom audio that matches your video's mood."
                      : "Ideal when you already have audio files or want full control over the sound. Upload your own tracks or use existing project audio."}
                  </p>
                </div>

                {/* Status and Next Step */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <div className="flex items-center space-x-2 text-zinc-400">
                    {method.id === AudioMethod.AI_GENERATION ? (
                      <>
                        <Mic className="w-4 h-4" />
                        <span className="text-xs">AI Generation</span>
                      </>
                    ) : (
                      <>
                        <Music className="w-4 h-4" />
                        <span className="text-xs">File Upload</span>
                      </>
                    )}
                  </div>
                  {isSelected && (
                    <span className="text-xs font-medium text-green-600">
                      Next:{" "}
                      {method.id === AudioMethod.AI_GENERATION
                        ? "Write lyrics"
                        : "Select audio files"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
