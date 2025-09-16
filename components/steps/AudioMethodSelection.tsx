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
                <div className="space-y-2">
                  {method.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="text-sm text-zinc-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Indicator */}
                <div className="mt-6 pt-4 border-t border-zinc-100">
                  <div className="flex items-center justify-center space-x-2 text-zinc-400">
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
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-zinc-50 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h4 className="font-medium text-zinc-900 mb-2">
            Need help deciding?
          </h4>
          <div className="space-y-2 text-sm text-zinc-600">
            <p>
              <strong>AI Generation</strong> is perfect when you have lyrics but
              need music to go with them.
            </p>
            <p>
              <strong>File Upload</strong> is ideal when you already have audio
              files or want full control over the sound.
            </p>
          </div>
        </div>
      </div>

      {/* Selection Confirmation */}
      {audioMethod && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium text-green-800">
              {audioMethod === AudioMethod.AI_GENERATION
                ? "AI Generation selected - You'll write lyrics in the next step"
                : "File Upload selected - You'll choose audio files in the next step"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
