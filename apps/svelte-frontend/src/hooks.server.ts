import { VITE_DOMAIN_DEV, VITE_DOMAIN_PROD } from '$env/static/private';
import type { HandleFetch } from '@sveltejs/kit';

// Handle sub-domain cookies
export const handleFetch: HandleFetch = async ({ request, fetch }) => {
  if (request.url.startsWith(`https://${VITE_DOMAIN_PROD}`)) {
    // clone original request but change the URL
    request = new Request(
      request.url.replace(`https://${VITE_DOMAIN_PROD}`, `https://${VITE_DOMAIN_DEV}`),
      request
    );
  }

  return fetch(request);
};
