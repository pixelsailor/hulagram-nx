import { dev } from '$app/environment';
import { PUBLIC_DEV_API, PUBLIC_PROD_API } from '$env/static/public';

import type { LayoutLoad } from './$types';

export type GeneralSettings = {
	data: {
		generalSettings: {
			title: string;
			description: string;
		};
	};
};

const path = dev ? PUBLIC_DEV_API : PUBLIC_PROD_API;

export const load: LayoutLoad = async ({ fetch }) => {
	const query = `{
    generalSettings {
      title
      description
    },
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
	const response = await res.json();
	return { response };
};
