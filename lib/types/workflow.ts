import { Asset } from "./asset";

export enum WorkflowStep {
  IMAGE_SELECTION = "image_selection",
  AUDIO_METHOD = "audio_method",
  AI_AUDIO_GENERATION = "ai_audio_generation",
  AUDIO_FILE_SELECTION = "audio_file_selection",
  VIDEO_GENERATION = "video_generation",
}

export enum AudioMethod {
  AI_GENERATION = "ai_generation",
  FILE_UPLOAD = "file_upload",
}

export interface ImageSelection {
  id: string;
  order: number;
  asset: Asset;
}

export interface AudioSelection {
  id: string;
  order: number;
  asset: Asset;
}

export interface WorkflowState {
  currentStep: WorkflowStep;
  selectedImages: ImageSelection[];
  audioMethod?: AudioMethod;
  selectedAudios: AudioSelection[];
  lyrics?: string;
  isGenerating: boolean;
  canProceed: boolean;
}

export interface WorkflowActions {
  goToStep: (step: WorkflowStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  selectImage: (asset: Asset) => void;
  removeImage: (assetId: string) => void;
  setAudioMethod: (method: AudioMethod) => void;
  selectAudio: (asset: Asset) => void;
  removeAudio: (assetId: string) => void;
  setLyrics: (lyrics: string) => void;
  resetWorkflow: () => void;
}
