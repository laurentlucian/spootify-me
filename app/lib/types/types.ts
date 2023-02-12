import type { Profile, Settings } from '@prisma/client';

export interface Track {
  albumName: string;
  albumUri: string;
  artist: string;
  artistUri: string;
  explicit: boolean;
  image: string;
  link: string;
  name: string;
  preview_url: string | null;
  trackId: string;
  uri: string;
  userId?: string;
}

export type Activity = {
  action: string;
  createdAt: Date;
  id: number;
  likedBy?: Profile[];
  owner?: { user: Profile | null };
  track: {
    albumName: string;
    albumUri: string;
    artist: string;
    artistUri: string;
    explicit: boolean;
    image: string;
    liked?: { user: Profile | null }[];
    link: string;
    name: string;
    preview_url: string | null;
    recent?: { user: Profile | null }[];
    uri: string;
  };
  trackId: string;
  user: Profile | null;
  userId: string | null;
};
export interface PlaylistTrack {
  description: string | null;
  image: string;
  isPublic: boolean;
  link: string;
  name: string;
  playlistId: string;
  trackTotal: number;
  tracks?: SpotifyApi.PlaylistObjectSimplified[];
  uri: string;
  userId?: string;
}

export interface User extends Profile {
  liked?: {
    trackId: string;
  }[];
  settings: Settings | null;
}
