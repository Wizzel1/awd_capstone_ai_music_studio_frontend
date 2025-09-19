"use client";

import AudioFileCard from "@/app/projects/[id]/create/AudioFileCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AudioPlaybackProvider } from "@/lib/providers/AudioPlaybackProvider";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { AiService } from "@/lib/services/aiService";
import { Project } from "@/lib/types/project";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const musicStyles = [
  { value: "pop", label: "Pop", description: "Upbeat and catchy" },
  { value: "rock", label: "Rock", description: "Energetic and powerful" },
  { value: "jazz", label: "Jazz", description: "Smooth and sophisticated" },
  {
    value: "classical",
    label: "Classical",
    description: "Elegant and timeless",
  },
  {
    value: "electronic",
    label: "Electronic",
    description: "Modern and synthetic",
  },
  { value: "acoustic", label: "Acoustic", description: "Natural and organic" },
  { value: "hip-hop", label: "Hip-Hop", description: "Rhythmic and urban" },
  { value: "folk", label: "Folk", description: "Traditional and storytelling" },
];

const moods = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "romantic", label: "Romantic", emoji: "💕" },
  { value: "dramatic", label: "Dramatic", emoji: "🎭" },
  { value: "mysterious", label: "Mysterious", emoji: "🕵️" },
];

export default function AIAudioGeneration({ project }: { project: Project }) {
  const { state, actions } = useVideoWorkflow();
  const { lyrics, isGenerating, selectedImages, selectedAudios } = state;

  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isGeneratingLyrics, setIsGeneratingLyrics] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generatedAudio = project.assets.filter(
    (asset) => asset.format === "ai_audio"
  );

  const router = useRouter();

  const handleLyricsChange = (newLyrics: string) => {
    actions.setLyrics(newLyrics);
  };

  const handleGenerateLyrics = async () => {
    setIsGeneratingLyrics(true);
    AiService.generateLyrics(
      selectedImages.map((image) => image.asset),
      project.id
    )
      .then((data) => {
        actions.setLyrics(data.lyrics);
      })
      .finally(() => {
        setIsGeneratingLyrics(false);
      });
  };

  const handleGenerate = async () => {
    setIsGeneratingAudio(true);
    AiService.generateAudio({
      lyrics: lyrics || "",
      lyricsPrompt: selectedStyle + " " + selectedMood,
      projectId: project.id,
    })
      .then(router.refresh)
      .finally(() => {
        setIsGeneratingAudio(false);
      });
  };

  const charCount = lyrics?.length || 0;
  const maxChars = 600;
  const isValidLyrics = charCount > 0 && charCount <= maxChars;

  return (
    <div className="space-y-8">
      {/* Controls Section - 2 Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Input */}
        <div className="flex flex-col space-y-6">
          {/* Generate Lyrics from Images */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900">
              Generate Lyrics from Your Images
            </label>
            <div className="p-4 border-2 border-dashed border-zinc-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-zinc-900">
                    AI Lyrics Generation
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedImages.length} images selected
                </Badge>
              </div>
              <p className="text-sm text-zinc-600 mb-4">
                Let AI analyze your selected images and create lyrics that match
                the visual story and mood.
              </p>
              <Button
                onClick={handleGenerateLyrics}
                disabled={selectedImages.length === 0 || isGeneratingLyrics}
                variant="outline"
                className="w-full"
              >
                {isGeneratingLyrics ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing images and generating lyrics...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Lyrics from Images
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Music Style */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900">
              Music Style
            </label>
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a music style" />
              </SelectTrigger>
              <SelectContent>
                {musicStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{style.label}</span>
                      <span className="text-xs text-zinc-500">
                        {style.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Mood Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900">Mood</label>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((mood) => (
                <Button
                  key={mood.value}
                  variant={selectedMood === mood.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMood(mood.value)}
                  className="justify-start"
                >
                  <span className="mr-2">{mood.emoji}</span>
                  {mood.label}
                </Button>
              ))}
            </div>
          </div>
          {/* Generation Status */}
          {isGeneratingAudio && (
            <div className="flex items-center justify-center py-8 flex-1">
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-zinc-600">Generating Audio...</span>
            </div>
          )}
        </div>

        {/* Right Column - Controls & Preview */}
        <div className="flex flex-col space-y-6">
          {/* Lyrics Input */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-900">
                Lyrics
              </label>
              <span
                className={`text-xs ${
                  charCount > maxChars ? "text-red-500" : "text-zinc-500"
                }`}
              >
                {charCount}/{maxChars}
              </span>
            </div>
            <Textarea
              placeholder="Generate lyrics from your images above, or write your own lyrics here...&#10;&#10;Verse 1:&#10;Your story begins here&#10;With words that inspire&#10;&#10;Chorus:&#10;Sing your heart out loud&#10;Let the music flow..."
              value={lyrics || ""}
              onChange={(e) => handleLyricsChange(e.target.value)}
              className="h-72 resize-none"
              maxLength={maxChars}
            />
            {!isValidLyrics && charCount > 0 && (
              <p className="text-sm text-red-500">
                {charCount > maxChars
                  ? `Lyrics exceed maximum length by ${
                      charCount - maxChars
                    } characters`
                  : "Please enter some lyrics to continue"}
              </p>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={
              !isValidLyrics || !selectedStyle || !selectedMood || isGenerating
            }
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Audio...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Audio
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Audio Files Section - Full Width Below */}
      {generatedAudio.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">
              Generated Audio ({generatedAudio.length})
            </h3>
          </div>

          <AudioPlaybackProvider>
            <div className="space-y-3">
              <AnimatePresence>
                {generatedAudio.map((audio) => (
                  <motion.div
                    key={audio.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <AudioFileCard
                      key={audio.id}
                      file={audio}
                      isSelected={selectedAudios.some(
                        (item) => item.asset.id === audio.id
                      )}
                      toggleFileSelection={() => {
                        if (
                          selectedAudios.some(
                            (item) => item.asset.id === audio.id
                          )
                        ) {
                          actions.removeAudio(audio.id);
                        } else {
                          actions.selectAudio(audio);
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </AudioPlaybackProvider>
        </div>
      )}
    </div>
  );
}
