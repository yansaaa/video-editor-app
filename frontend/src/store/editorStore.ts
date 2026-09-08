import { create } from 'zustand';

export interface Clip {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  endTime: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

export interface EditorState {
  clips: Clip[];
  textOverlays: TextOverlay[];
  currentTime: number;
  isPlaying: boolean;
  addClip: (clip: Clip) => void;
  removeClip: (clipId: string) => void;
  updateClip: (clipId: string, updates: Partial<Clip>) => void;
  addTextOverlay: (overlay: TextOverlay) => void;
  removeTextOverlay: (overlayId: string) => void;
  updateTextOverlay: (overlayId: string, updates: Partial<TextOverlay>) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  clips: [],
  textOverlays: [],
  currentTime: 0,
  isPlaying: false,
  addClip: (clip: Clip) => set((state) => ({ clips: [...state.clips, clip] })),
  removeClip: (clipId: string) =>
    set((state) => ({
      clips: state.clips.filter((c) => c.id !== clipId),
    })),
  updateClip: (clipId: string, updates: Partial<Clip>) =>
    set((state) => ({
      clips: state.clips.map((c) => (c.id === clipId ? { ...c, ...updates } : c)),
    })),
  addTextOverlay: (overlay: TextOverlay) =>
    set((state) => ({ textOverlays: [...state.textOverlays, overlay] })),
  removeTextOverlay: (overlayId: string) =>
    set((state) => ({
      textOverlays: state.textOverlays.filter((t) => t.id !== overlayId),
    })),
  updateTextOverlay: (overlayId: string, updates: Partial<TextOverlay>) =>
    set((state) => ({
      textOverlays: state.textOverlays.map((t) =>
        t.id === overlayId ? { ...t, ...updates } : t
      ),
    })),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
}));
