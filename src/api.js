/**
 * Minimal API client for the admin panel
 * Supports both live API calls and demo mode with static data
 */

class FetchError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
}

class Api {
	constructor() {
		// Demo mode: use static data files, POST operations are no-ops
		this.demoMode = false;

		// Base path for static data files (relative to index.html)
		this.dataPath = 'data/';

		// Map API endpoints to static data files
		this.staticDataMap = {
			'api/admin.php?req=accounts': 'accounts.tsv',
			'api/admin.php?req=users': 'users.tsv',
		};
	}

	enableDemoMode(dataPath = 'data/') {
		this.demoMode = true;
		this.dataPath = dataPath;
		console.log('[API] Demo mode enabled - using static data from:', dataPath);
	}

	disableDemoMode() {
		this.demoMode = false;
		console.log('[API] Demo mode disabled - using live API');
	}

	get(url, body = 'text', signal) {
		// In demo mode, serve from static files
		if (this.demoMode) {
			const staticFile = this.staticDataMap[url];
			if (staticFile) {
				url = this.dataPath + staticFile;
				console.log('[API] Demo mode: fetching', url);
			}
		}

		let promise = fetch(url, {
			credentials: 'same-origin',
			signal,
		}).then(async (response) => {
			if (!response.ok) {
				throw new FetchError(response.status, (await response.text()).trim() || response.statusText);
			}
			return response;
		});

		if (body === 'text') promise = promise.then((response) => response.text());
		else if (body === 'json') promise = promise.then((response) => response.json());

		return promise;
	}

	post(url, content = '', json = false) {
		// In demo mode, POST operations are no-ops
		if (this.demoMode) {
			console.log('[API] Demo mode: POST ignored', url, content);
			return Promise.resolve('ok');
		}

		const headers = {};

		if (json) {
			if (content && typeof content === 'object') {
				content = Object.keys(content)
					.map(key => key + '=' + encodeURIComponent(content[key] === null ? '' : content[key]))
					.join('&');
			}
		} else {
			headers['Content-Type'] = 'application/x-www-form-urlencoded';

			if (content === null) {
				const queryIndex = url.indexOf('?');
				if (queryIndex === -1) {
					content = '';
				} else {
					content = url.substring(queryIndex + 1);
					url = url.substring(0, queryIndex);
				}
			} else if (typeof content === 'object') {
				content = Object.keys(content)
					.map((key) => key + '=' + encodeURIComponent(content[key]))
					.join('&');
			}
		}

		return fetch(url, {
			method: 'POST',
			credentials: 'same-origin',
			headers: headers,
			body: content,
		})
			.then(async (response) => {
				if (!response.ok) {
					throw new FetchError(response.status, (await response.text()).trim() || response.statusText);
				}
				return response;
			})
			.then((response) => response.text());
	}
}

export default new Api();
