import { create } from "zustand"; // State management 

// structure of the state for the song player
interface PlayerStore {
  ids: string[];
  activeId?: string;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  reset: () => void;
}

// hook that maintains player state through setId, setIds, reset functions
const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  setId: (id: string) => set({ activeId: id}),
  setIds: (ids: string[]) => set({ ids: ids}),
  reset: () => set({ ids: [], activeId: undefined })
}));

export default usePlayer;