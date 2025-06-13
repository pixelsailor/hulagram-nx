// import { dev } from '$app/environment';
// import { PUBLIC_DEV_MEDIA_URL, PUBLIC_PROD_MEDIA_URL } from '$env/static/public';
import type { FetchGuardFunction, FetchGuardOptions } from './types';

// const uploads = dev ? PUBLIC_DEV_MEDIA_URL : PUBLIC_PROD_MEDIA_URL;

export function createFetchGuard(originalFetch: FetchGuardFunction): FetchGuardFunction {
  return async function fetchGuard(
    input: RequestInfo | URL,
    options: FetchGuardOptions = {}
  ): Promise<Response> {
    // const url = input instanceof URL ? input : new URL(input.toString(), window.location.origin);
    const { download, skipCorsModification, ...fetchOptions } = options;

    // Check if this is a request to your API subdomain
    // const isApiSubdomain = url.hostname.startsWith('cms.') || url.hostname.endsWith(PUBLIC_DEV_DOMAIN);
    // const isFileEndpoint = url.pathname.includes('/files/') || 
    //                       url.pathname.includes('/download/') || 
    //                       url.pathname.includes('/media/') ||
    //                       download === true;

    // Only modify headers for download requests
    if (download === true && !skipCorsModification) {
      const modifiedOptions: RequestInit = {
        ...fetchOptions,
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          ...Object.fromEntries(
            Object.entries(fetchOptions.headers || {}).filter(
              ([key]) => key.toLowerCase() !== 'content-type'
            )
          ),
          'Accept': '*/*',
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache'
        }
      };

      return originalFetch(input, modifiedOptions);
    }

    // For GraphQL and other API requests, keep original headers
    return originalFetch(input, fetchOptions);
  }
}