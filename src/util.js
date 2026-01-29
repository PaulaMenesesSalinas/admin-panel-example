/**
 * Minimal utility functions for the admin panel
 */

export default {
	/**
	 * Parse delimiter-separated values (CSV, TSV, etc.)
	 * @param {string} data - Raw DSV string
	 * @param {string} sep - Field separator (default: comma)
	 * @param {string} lineSep - Line separator (default: newline)
	 * @returns {Array} Array of objects with field names from header row
	 */
	parseDsv(data, sep = ',', lineSep = '\n') {
		if (!data) return null;

		const rows = data.split(lineSep);
		if (rows.length < 2) return [];

		const fields = rows[0].split(sep);

		const res = [];
		const numberRegex = /^[-]?[\d\.]+$/;

		for (let i = 1; i < rows.length; i++) {
			if (rows[i].length === 0) continue;

			const parts = rows[i].split(sep);

			const row = {};
			for (let j = 0; j < fields.length; j++) {
				// Auto-convert numeric strings to numbers (max 16 chars to avoid precision issues)
				if (parts[j] && parts[j].length <= 16 && parts[j].match(numberRegex)) {
					parts[j] = parseFloat(parts[j]);
				}
				row[fields[j]] = parts[j];
			}

			res.push(row);
		}
		return res;
	},

	/**
	 * Generate a random alphanumeric ID
	 * @param {number} length - Length of the ID
	 * @returns {string} Random ID
	 */
	randomId(length = 8) {
		return Math.random()
			.toString(36)
			.replace(/[^a-z0-9]+/g, '')
			.substr(2, length);
	}
};
