import { dev } from '$app/environment';
import { PUBLIC_DEV_API, PUBLIC_PROD_API } from '$env/static/public';

const path = dev ? PUBLIC_DEV_API : PUBLIC_PROD_API;

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
	tracks: [Track];
};

export type Playlists = {
	data: {
		playlists: {
			nodes: [Playlist];
		};
	};
};

export async function load({ fetch }) {
	const query = `{
    playlists {
      nodes {
        databaseId
        date
        title
        artistName
        tracks {
          title
          file
          id
          artist
          lyrics
          downloadable
        }
      }
    }
  }`;

	const res = await fetch(path, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query })
	});
	const page: Playlists = await res.json();
	return { page };
}
