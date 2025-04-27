import { create } from "zustand";

export interface BackgroundState {
    brightness: number; // 0 (dark) to 1 (bright)
    starVisibility: number; // 0 (invisible) to 1 (fully visible)
    setBrightness: (brightness: number) => void;
    setStarVisibility: (starVisibility: number) => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
    brightness: 0,
    starVisibility: 1,
    setBrightness: (brightness) => set({ brightness }),
    setStarVisibility: (starVisibility) => set({ starVisibility }),
})); 