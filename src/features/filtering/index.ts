import type { Filters } from './types';

/* Performs a fuzzy search on the given text using the provided query.
 * Returns true if the query matches the text within the allowed Levenshtein distance.
 */
function fuzzySearch(text: string, query: string, max_allowed_distance: number = 2): boolean {
	const normalizedQuery = query.toLowerCase();
	const normalizedText = text.toLowerCase();

	for (let i = 0; i <= normalizedText.length - normalizedQuery.length; i++) {
		const distance = levenshteinDistance(
			normalizedText.slice(i, i + normalizedQuery.length),
			normalizedQuery
		);

		if (distance <= max_allowed_distance) {
			return true;
		}
	}

	return false
}


function filterByTags(tags: string[], enabled_tags: Filters) {
	for (const tag of tags) {
		if (enabled_tags[tag as keyof Filters] === false) {
			return false;
		}
	}
	return true;
}


function levenshteinDistance(str1: string, str2: string): number {
	const len1 = str1.length;
	const len2 = str2.length;

	const matrix: number[][] = Array(len1 + 1)
		.fill(null)
		.map(() => Array(len2 + 1).fill(0));

	for (let i = 0; i <= len1; i++) {
		matrix[i][0] = i;
	}
	for (let j = 0; j <= len2; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= len1; i++) {
		for (let j = 1; j <= len2; j++) {
			if (str1[i - 1] === str2[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
                const deletion = matrix[i - 1][j] + 1;
                const insertion = matrix[i][j - 1] + 1;
                const substitution = matrix[i - 1][j - 1] + 1;

				matrix[i][j] = 1 + Math.min(deletion, insertion, substitution);
			}
		}
	}


	return matrix[len1][len2];
}


const defaultFilters: Filters = {
	intelligence: true,
	strength: true,
	dexterity: true,
	physical: true,
	chaos: true,
	fire: true,
	cold: true,
	lightning: true,
	// spell: true,
	// attack: true,
	// area: true,
	// aura: true,
	// chaining: true,
	// channelling: true,
	// critical: true,
	// curse: true,
	// duration: true,
	// guard: true,
	// hex: true,
	// mark: true,
	// melee: true,
	// mine: true,
	// minion: true,
	// movement: true,
	// nova: true,
	// projectile: true,
	// slam: true,
	// stance: true,
	// strike: true,
	// totem: true,
	// trap: true,
	// trigger: true,
	// awakened: true,
	// exceptional: true,
	// vaal: true,
	// grants_active_skill: true,
	// support: true
};


export { defaultFilters, fuzzySearch, filterByTags, type Filters };
