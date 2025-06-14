import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { PUBLIC_DEV_API, PUBLIC_PROD_API } from '$env/static/public';
import type { PageLoad } from './$types';

const graphqlApi = dev ? PUBLIC_DEV_API : PUBLIC_PROD_API;

export const load: PageLoad = async ({ fetch }) => {
	const query = `{
    page(id: "about-randy-and-linda", idType: URI) {
      title
      content
    }
  }`;

	const request = await fetch(graphqlApi, {
    method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query })
	});

	if (!request.ok) error(404);

	const response = await request.json();
  const { page } = response.data;
	return { page }; // "page" will be the key name in the `$props()` `data` object
};
