import type { GemData } from '$lib/types';
import type { Filters } from '$features/filtering';
import { fuzzySearch, filterByTags } from '$features/filtering';

interface WorkerFilteringState {
	filteredGems: GemData[];
	isFiltering: boolean;
	error: string | null;
}

export function useWorkerFiltering(
	initialGems: () => GemData[],
	getSearch: () => string,
	getTagFilters: () => Filters,
	debounceMs: number = 300
) {
	let state = $state<WorkerFilteringState>({
		filteredGems: initialGems(),
		isFiltering: false,
		error: null
	});

	let worker: Worker | null = null;
	let requestId = 0;
	let debounceTimeout: number | null = null;

	// Synchronous fallback filtering function
	function filterGemsSynchronously(
		gems: GemData[],
		search: string,
		tagFilters: Filters
	): GemData[] {
		return gems
			.filter((gem: GemData) => fuzzySearch(gem.name, search))
			.filter((gem: GemData) => filterByTags(gem.tags, tagFilters));
	}

	// Initialize worker
	$effect(() => {
		if (typeof Worker !== 'undefined') {
			worker = new Worker('/filter-worker.js');

			worker.onmessage = (e) => {
				const { filteredGems, error, requestId: responseRequestId } = e.data;

				// Only process if this is the most recent request
				if (responseRequestId === requestId) {
					if (error) {
						// Use synchronous filtering as fallback on error
						const gems = initialGems();
						const search = getSearch();
						const tagFilters = getTagFilters();
						const filteredGems = filterGemsSynchronously(gems, search, tagFilters);

						state = {
							filteredGems,
							isFiltering: false,
							error: `Worker error: ${error}. Using synchronous filtering.`
						};
					} else {
						state = {
							filteredGems: filteredGems || [],
							isFiltering: false,
							error: null
						};
					}
				}
			};

			worker.onerror = (error) => {
				console.error('Worker error:', error);
				// Use synchronous filtering as fallback on worker error
				const gems = initialGems();
				const search = getSearch();
				const tagFilters = getTagFilters();
				const filteredGems = filterGemsSynchronously(gems, search, tagFilters);

				state = {
					filteredGems,
					isFiltering: false,
					error: 'Worker failed. Using synchronous filtering.'
				};
			};
		} else {
			// Fallback for environments without Worker support
			console.warn('Web Workers not supported, using synchronous filtering');
			// Use synchronous filtering as fallback
			const gems = initialGems();
			const search = getSearch();
			const tagFilters = getTagFilters();
			const filteredGems = filterGemsSynchronously(gems, search, tagFilters);

			state = {
				filteredGems,
				isFiltering: false,
				error: null
			};
		}

		return () => {
			worker?.terminate();
			if (debounceTimeout !== null) {
				clearTimeout(debounceTimeout);
			}
		};
	});

	// Handle filtering when dependencies change with debouncing
	$effect(() => {
		// Read reactive values to establish dependencies
		const gems = initialGems();
		const search = getSearch();
		const tagFilters = getTagFilters();

		// Clear existing timeout
		if (debounceTimeout !== null) {
			clearTimeout(debounceTimeout);
		}

		if (!worker) {
			// Fallback: use synchronous filtering if worker not available
			const filteredGems = filterGemsSynchronously(gems, search, tagFilters);
			state = {
				...state,
				filteredGems,
				isFiltering: false
			};
			return;
		}

		// Set loading state immediately for quick feedback
		if (search.trim() !== '' || Object.values(tagFilters).some((v) => v === false)) {
			state = {
				...state,
				isFiltering: true,
				error: null
			};
		}

		// Debounce the actual worker call
		debounceTimeout = setTimeout(() => {
			// Increment request ID to handle race conditions
			requestId++;
			const currentRequestId = requestId;

			worker.postMessage({
				gems,
				search,
				tagFilters,
				requestId: currentRequestId
			});
		}, debounceMs) as unknown as number;
	});

	return {
		get filteredGems() {
			return state.filteredGems;
		},
		get isFiltering() {
			return state.isFiltering;
		},
		get error() {
			return state.error;
		}
	};
}
