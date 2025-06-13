/* eslint-disable @typescript-eslint/no-explicit-any */
// courtesy of Claude https://claude.ai/chat/44ed3e52-1f04-413d-a7e2-bf196acb9ca0
import { createFetchGuard } from './fetchGuard';
import type { FetchGuardFunction } from './types';

interface ApiConfig {
	baseUrl: string;
	authToken?: string;
}

export class ApiClient {
	private fetch: FetchGuardFunction;
	private config: ApiConfig;

	constructor(config: ApiConfig, fetchGuard?: FetchGuardFunction) {
		this.config = config;
		this.fetch = fetchGuard ? createFetchGuard(fetchGuard) : createFetchGuard(fetch);
	}

	async graphql<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
		const response = await this.fetch(`${this.config.baseUrl}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(this.config.authToken && { 'Authorization': `Bearer ${this.config.authToken}` })
			},
			body: JSON.stringify({ query, variables })
		});

		if (!response.ok) {
			throw new Error(`GraphQL request failed: ${response.status}`);
		}

		return response.json();
	}

	async downloadFile(fileId: string, filename?: string): Promise<void> {
		try {
			const response = await this.fetch(`${this.config.baseUrl}/uploads/${fileId}`, {
				method: 'GET',
				download: true, // Custom flag to trigger header modification
				...(this.config.authToken && {
					headers: {
						'Authorization': `Bearer ${this.config.authToken}`
					}
				})
			});

			if (!response.ok) {
				throw new Error(`Download failed: ${response.status} ${response.statusText}`);
			}

			// Handle the download
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);

			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = filename || fileId;
			link.style.display = 'none';

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error('Download failed:', error);
			throw error;
		}
	}
}
