const path = import.meta.env.VITE_GRAPHQL_API as string;

import type { LayoutLoad } from './$types';
// import graphql from '$lib/graphql';

export type GeneralSettings = {
  data: {
    generalSettings: {
      title: string;
      description: string;
    }
  }
}

export const load: LayoutLoad = async ({ fetch }) => {
  // const query = `{
  //   generalSettings {
  //     title
  //     description
  //   }
  // }`;

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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  // const layout: GeneralSettings = await res.json();
  // return {layout};
  const response = await res.json();
  return {response};
}