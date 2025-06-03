// GraphQL queries
export type Track = {
  title: string;
  file: string;
  id: string;
  artist: string;
  lyrics: string;
  downloadable: boolean;
}

export type Playlist = {
  databaseId: number;
  date: string;
  title: string;
  artistName: string;
  tracks: [Track]
}

export type Playlists = {
  data: {
    playlists: {
      nodes: [Playlist]
    }
  }
}

//
export type PlaylistContext = {
  isVisible: () => void,
  playlist: () => void,
  onSelectPlaylist: (P: Playlist) => void
}

export type AudioPlayerContext = {
  title: string,
  paused: boolean,
  src: string,
  artist: string,
  playlist: Playlist,
  onSelectPlaylist: () => void,
}