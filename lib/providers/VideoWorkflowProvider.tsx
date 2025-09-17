"use client";

import { Asset } from "@/lib/types/asset";
import {
  AudioMethod,
  WorkflowActions,
  WorkflowState,
  WorkflowStep,
} from "@/lib/types/workflow";
import { createContext, ReactNode, useContext, useReducer } from "react";

// Initial state
const initialState: WorkflowState = {
  currentStep: WorkflowStep.IMAGE_SELECTION,
  selectedImages: [],
  audioMethod: undefined,
  selectedAudios: [],
  lyrics: undefined,
  isGenerating: false,
  canProceed: false,
};

// Action types
type WorkflowAction =
  | { type: "GO_TO_STEP"; payload: WorkflowStep }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "SELECT_IMAGE"; payload: Asset }
  | { type: "REMOVE_IMAGE"; payload: string }
  | { type: "SET_AUDIO_METHOD"; payload: AudioMethod }
  | { type: "SELECT_AUDIO"; payload: Asset }
  | { type: "REMOVE_AUDIO"; payload: string }
  | { type: "SET_LYRICS"; payload: string }
  | { type: "SET_GENERATING"; payload: boolean }
  | { type: "RESET_WORKFLOW" };

// Workflow step order - all possible steps
const stepOrder = [
  WorkflowStep.IMAGE_SELECTION,
  WorkflowStep.AUDIO_METHOD,
  WorkflowStep.AI_AUDIO_GENERATION,
  WorkflowStep.AUDIO_FILE_SELECTION,
  WorkflowStep.VIDEO_GENERATION,
];

// Reducer function
function workflowReducer(
  state: WorkflowState,
  action: WorkflowAction
): WorkflowState {
  switch (action.type) {
    case "GO_TO_STEP":
      return { ...state, currentStep: action.payload };

    case "NEXT_STEP": {
      const currentIndex = stepOrder.indexOf(state.currentStep);
      if (currentIndex < stepOrder.length - 1) {
        let nextStep = stepOrder[currentIndex + 1];

        // Skip AI_AUDIO_GENERATION if method is FILE_UPLOAD
        if (
          nextStep === WorkflowStep.AI_AUDIO_GENERATION &&
          state.audioMethod === AudioMethod.FILE_UPLOAD
        ) {
          nextStep = WorkflowStep.AUDIO_FILE_SELECTION;
        }
        // Skip AUDIO_FILE_SELECTION if method is AI_GENERATION
        if (
          nextStep === WorkflowStep.AUDIO_FILE_SELECTION &&
          state.audioMethod === AudioMethod.AI_GENERATION
        ) {
          nextStep = WorkflowStep.VIDEO_GENERATION;
        }

        return { ...state, currentStep: nextStep };
      }
      return state;
    }

    case "PREVIOUS_STEP": {
      const currentIndex = stepOrder.indexOf(state.currentStep);
      if (currentIndex > 0) {
        let prevStep = stepOrder[currentIndex - 1];

        // Handle conditional previous step logic
        if (state.currentStep === WorkflowStep.VIDEO_GENERATION) {
          // If coming from video generation, go back to the appropriate audio step
          if (state.audioMethod === AudioMethod.AI_GENERATION) {
            prevStep = WorkflowStep.AI_AUDIO_GENERATION;
          } else if (state.audioMethod === AudioMethod.FILE_UPLOAD) {
            prevStep = WorkflowStep.AUDIO_FILE_SELECTION;
          }
        } else if (state.currentStep === WorkflowStep.AUDIO_FILE_SELECTION) {
          // From audio file selection, always go back to audio method
          prevStep = WorkflowStep.AUDIO_METHOD;
        } else if (state.currentStep === WorkflowStep.AI_AUDIO_GENERATION) {
          // From AI audio generation, always go back to audio method
          prevStep = WorkflowStep.AUDIO_METHOD;
        }

        return { ...state, currentStep: prevStep };
      }
      return state;
    }

    case "SELECT_IMAGE": {
      const existingIndex = state.selectedImages.findIndex(
        (img) => img.asset.id === action.payload.id
      );
      if (existingIndex !== -1) {
        // Already selected, don't add again
        return state;
      }

      const newSelection = {
        id: action.payload.id,
        order: state.selectedImages.length + 1,
        asset: action.payload,
      };

      const newSelectedImages = [...state.selectedImages, newSelection];
      return {
        ...state,
        selectedImages: newSelectedImages,
        canProceed: newSelectedImages.length > 0,
      };
    }

    case "REMOVE_IMAGE": {
      const newSelectedImages = state.selectedImages
        .filter((img) => img.asset.id !== action.payload)
        .map((img, index) => ({ ...img, order: index + 1 }));

      return {
        ...state,
        selectedImages: newSelectedImages,
        canProceed: newSelectedImages.length > 0,
      };
    }

    case "SET_AUDIO_METHOD":
      return {
        ...state,
        audioMethod: action.payload,
        canProceed: true,
      };

    case "SELECT_AUDIO": {
      const existingIndex = state.selectedAudios.findIndex(
        (audio) => audio.asset.id === action.payload.id
      );
      if (existingIndex !== -1) {
        return state;
      }

      const newSelection = {
        id: action.payload.id,
        order: state.selectedAudios.length + 1,
        asset: action.payload,
      };

      const newSelectedAudio = [...state.selectedAudios, newSelection];
      return {
        ...state,
        selectedAudios: newSelectedAudio,
        canProceed: newSelectedAudio.length > 0,
      };
    }

    case "REMOVE_AUDIO": {
      const newSelectedAudio = state.selectedAudios
        .filter((audio) => audio.asset.id !== action.payload)
        .map((audio, index) => ({ ...audio, order: index + 1 }));

      return {
        ...state,
        selectedAudios: newSelectedAudio,
        canProceed: newSelectedAudio.length > 0,
      };
    }

    case "SET_LYRICS":
      return {
        ...state,
        lyrics: action.payload,
        canProceed: action.payload.trim().length > 0,
      };

    case "SET_GENERATING":
      return {
        ...state,
        isGenerating: action.payload,
      };

    case "RESET_WORKFLOW":
      return initialState;

    default:
      return state;
  }
}

// Context
const VideoWorkflowContext = createContext<{
  state: WorkflowState;
  actions: WorkflowActions;
} | null>(null);

// Provider component
interface VideoWorkflowProviderProps {
  children: ReactNode;
}

export function VideoWorkflowProvider({
  children,
}: VideoWorkflowProviderProps) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const actions: WorkflowActions = {
    goToStep: (step: WorkflowStep) =>
      dispatch({ type: "GO_TO_STEP", payload: step }),
    nextStep: () => dispatch({ type: "NEXT_STEP" }),
    previousStep: () => dispatch({ type: "PREVIOUS_STEP" }),
    selectImage: (asset: Asset) =>
      dispatch({ type: "SELECT_IMAGE", payload: asset }),
    removeImage: (assetId: string) =>
      dispatch({ type: "REMOVE_IMAGE", payload: assetId }),
    setAudioMethod: (method: AudioMethod) =>
      dispatch({ type: "SET_AUDIO_METHOD", payload: method }),
    selectAudio: (asset: Asset) =>
      dispatch({ type: "SELECT_AUDIO", payload: asset }),
    removeAudio: (assetId: string) =>
      dispatch({ type: "REMOVE_AUDIO", payload: assetId }),
    setLyrics: (lyrics: string) =>
      dispatch({ type: "SET_LYRICS", payload: lyrics }),
    resetWorkflow: () => dispatch({ type: "RESET_WORKFLOW" }),
  };

  return (
    <VideoWorkflowContext.Provider value={{ state, actions }}>
      {children}
    </VideoWorkflowContext.Provider>
  );
}

// Hook to use the workflow context
export function useVideoWorkflow() {
  const context = useContext(VideoWorkflowContext);
  if (!context) {
    throw new Error(
      "useVideoWorkflow must be used within a VideoWorkflowProvider"
    );
  }
  return context;
}
