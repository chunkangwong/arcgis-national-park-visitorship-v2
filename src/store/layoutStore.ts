import create from "zustand";

interface LayoutState {
  tempDrawerOpen: boolean;
  setTempDrawerOpen: (open: boolean) => void;
}

export const useLayout = create<LayoutState>((set) => ({
  tempDrawerOpen: false,
  setTempDrawerOpen: (open: boolean) => set(() => ({ tempDrawerOpen: open })),
}));
