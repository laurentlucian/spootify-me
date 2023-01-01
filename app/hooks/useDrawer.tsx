import create from 'zustand';
import shallow from 'zustand/shallow';
import type { Track } from '~/lib/types/types';

interface DrawerStateConfig {
  track: Track | null;
  actions: {
    onClose: () => void;
    onOpen: (by: Track) => void;
  };
}

const useDrawerStore = create<DrawerStateConfig>()((set) => ({
  track: null,
  actions: {
    onClose: () => set({ track: null }),
    onOpen: (by) =>
      set({
        track: {
          uri: by.uri,
          trackId: by.trackId,
          image: by.image,
          albumUri: by.albumUri,
          albumName: by.albumName,
          name: by.name,
          artist: by.artist,
          artistUri: by.artistUri,
          explicit: by.explicit,
          userId: by.userId,
        },
      }),
  },
}));

export const useDrawerTrack = () =>
  useDrawerStore(
    (state) => state.track,
    // by default, zustand checks if state changes with a strict equality check
    // this means that if you have an object in state, it would always be considered changed
    // a shallow comparison is used for objects
    shallow,
  );

export const useDrawerActions = () => useDrawerStore((state) => state.actions);