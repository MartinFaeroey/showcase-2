// Web Worker for filtering gems
// This runs the filtering logic in a separate thread to avoid blocking the UI

// Fuzzy search function using Levenshtein distance
function fuzzySearch(text, query, maxAllowedDistance = 2) {
    const normalizedQuery = query.toLowerCase();
    const normalizedText = text.toLowerCase();

    if (normalizedQuery === '') return true;

    for (let i = 0; i <= normalizedText.length - normalizedQuery.length; i++) {
        const distance = levenshteinDistance(
            normalizedText.slice(i, i + normalizedQuery.length),
            normalizedQuery
        );

        if (distance <= maxAllowedDistance) {
            return true;
        }
    }

    return false;
}

// Filter gems by tags
function filterByTags(tags, enabledTags) {
    for (const tag of tags) {
        if (enabledTags[tag] === false) {
            return false;
        }
    }
    return true;
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;

    const matrix = Array(len1 + 1)
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

// Handle messages from the main thread
self.onmessage = function(e) {
    try {
        const { gems, search, tagFilters, requestId } = e.data;

        if (!Array.isArray(gems)) {
            throw new Error('Invalid gems data received');
        }

        // Apply filtering
        const filteredGems = gems
            .filter(gem => {
                if (!gem || !gem.name) return false;
                return fuzzySearch(gem.name, search || '');
            })
            .filter(gem => {
                if (!gem || !Array.isArray(gem.tags)) return false;
                return filterByTags(gem.tags, tagFilters || {});
            });

        // Send results back to main thread
        self.postMessage({
            filteredGems,
            requestId,
            error: null
        });

    } catch (error) {
        // Send error back to main thread
        self.postMessage({
            filteredGems: null,
            requestId: e.data?.requestId,
            error: error.message || 'Unknown error occurred during filtering'
        });
    }
};

// Handle worker errors
self.onerror = function(error) {
    console.error('Worker error:', error);
    self.postMessage({
        filteredGems: null,
        requestId: null,
        error: 'Worker encountered an unexpected error'
    });
};
