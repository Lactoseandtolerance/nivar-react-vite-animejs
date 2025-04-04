import { create } from 'zustand';

export const useScrollStore = create((set) => ({
  // Current section being viewed
  currentSection: 'intro',
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Overall scroll progress (0 to 1)
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  
  // Section-specific progress
  sectionProgress: {},
  setSectionProgress: (section, progress) => 
    set((state) => ({ 
      sectionProgress: { 
        ...state.sectionProgress, 
        [section]: progress 
      } 
    })),
}));
