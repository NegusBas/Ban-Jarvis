import { create } from 'zustand'; 

type SystemStatus = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

interface JarvisState {
  status: SystemStatus;
  transcript: string;
  lastGesture: string | null;
  setStatus: (s: SystemStatus) => void;
  setTranscript: (t: string) => void;
  setGesture: (g: string | null) => void;
}

export const useJarvisStore = create<JarvisState>((set) => ({
  status: 'IDLE',
  transcript: '',
  lastGesture: null,
  setStatus: (status) => set({ status }),
  setTranscript: (transcript) => set({ transcript }),
  setGesture: (lastGesture) => set({ lastGesture }),
}));
