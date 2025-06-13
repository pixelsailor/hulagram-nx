// GraphQL queries
export type Track = {
	title: string;
	file: string;
	id: string;
	artist: string;
	lyrics: string;
	downloadable: boolean;
};

export type Playlist = {
	databaseId: number;
	date: string;
	title: string;
	artistName: string;
	releaseDate: string;
	archive: string;
	tracks: [Track];
};

export type Playlists = {
	data: {
		playlists: {
			nodes: [Playlist];
		};
	};
};

//
export type PlaylistContext = {
	isVisible: () => void;
	playlist: () => void;
	onSelectPlaylist: (P: Playlist) => void;
};

export type AudioPlayerContext = {
	title: string;
	paused: boolean;
	src: string;
	artist: string;
	lyrics: string;
	playlist: string;
	onSelectPlaylist: () => void;
};

// Custom fetch for bypassing CORS for downloads
export type FetchGuardOptions = RequestInit & {
	download?: boolean;
	skipCorsModification?: boolean;
};

export type FetchGuardFunction = (
	input: RequestInfo | URL,
	init?: RequestInit & { download?: boolean }
) => Promise<Response>;
