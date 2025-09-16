"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useVideoWorkflow } from "@/lib/providers/VideoWorkflowProvider";
import { Download, Pause, Play, RotateCcw, Sparkles } from "lucide-react";
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

export default function AIAudioGeneration() {
  const { state, actions } = useVideoWorkflow();
  const { lyrics, isGenerating, generatedAudioId } = state;

  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLyricsChange = (newLyrics: string) => {
    actions.setLyrics(newLyrics);
  };

  const handleGenerate = async () => {
    // TODO: Implement actual API call in Phase 4
    // For now, simulate generation
    console.log("Generating audio with:", {
      lyrics,
      selectedStyle,
      selectedMood,
    });

    // Simulate loading
    setTimeout(() => {
      actions.setGeneratedAudio("mock-audio-id");
    }, 3000);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const handleRegenerate = () => {
    actions.setGeneratedAudio("");
    // Reset and regenerate
    handleGenerate();
  };

  const charCount = lyrics?.length || 0;
  const maxChars = 1000;
  const isValidLyrics = charCount > 0 && charCount <= maxChars;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          Generate Audio with AI
        </h2>
        <p className="text-zinc-600">
          Write your lyrics and choose a style to create custom audio for your
          video
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Lyrics Input */}
          <div className="space-y-3">
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
              placeholder="Write your lyrics here...&#10;&#10;Verse 1:&#10;Your story begins here&#10;With words that inspire&#10;&#10;Chorus:&#10;Sing your heart out loud&#10;Let the music flow..."
              value={lyrics || ""}
              onChange={(e) => handleLyricsChange(e.target.value)}
              className="min-h-48 resize-none"
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

        {/* Right Column - Preview/Output */}
        <div className="space-y-6">
          {/* Configuration Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-zinc-900 mb-3">Configuration</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Lyrics length:</span>
                  <Badge variant="outline">{charCount} characters</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Music style:</span>
                  <Badge variant="outline">
                    {selectedStyle
                      ? musicStyles.find((s) => s.value === selectedStyle)
                          ?.label
                      : "Not selected"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Mood:</span>
                  <Badge variant="outline">
                    {selectedMood
                      ? moods.find((m) => m.value === selectedMood)?.label
                      : "Not selected"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Audio Preview */}
          {generatedAudioId && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-zinc-900">Generated Audio</h3>
                  <Badge className="bg-green-100 text-green-800">Ready</Badge>
                </div>

                {/* Audio Player Mock */}
                <div className="bg-zinc-50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="h-2 bg-zinc-200 rounded-full">
                        <div
                          className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                          style={{ width: isPlaying ? "45%" : "0%" }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500">2:34</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium text-zinc-900 mb-3">
                Tips for better results
              </h3>
              <div className="space-y-2 text-sm text-zinc-600">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2" />
                  <span>
                    Keep lyrics between 50-500 characters for best results
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2" />
                  <span>Use simple verse/chorus structure</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2" />
                  <span>Match the mood with your video content</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2" />
                  <span>Generation typically takes 30-60 seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
