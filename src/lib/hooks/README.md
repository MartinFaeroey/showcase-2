# Web Worker Filtering Hook

This directory contains the `useWorkerFiltering` hook that implements non-blocking filtering using Web Workers.

## Overview

The `useWorkerFiltering` hook moves expensive filtering operations (fuzzy search with Levenshtein distance) to a Web Worker, preventing UI blocking during filtering of large datasets.

## Features

- **Non-blocking filtering**: Uses Web Workers to run filtering in a separate thread
- **Debounced input**: Prevents excessive worker calls during rapid user input (default 300ms)
- **Race condition handling**: Uses request IDs to ensure only the latest results are applied
- **Graceful fallback**: Falls back to synchronous filtering if Web Workers aren't supported or fail
- **Error handling**: Provides error states and automatic recovery
- **Loading states**: Shows filtering progress to users

## Usage

```typescript
import { useWorkerFiltering } from '$lib/hooks/useWorkerFiltering.svelte';

// In your component
let search = $state('');
let tagFilters = $state(defaultFilters);

const filtering = useWorkerFiltering(
  () => data.gems,           // Getter for initial data
  () => search,              // Getter for search term
  () => tagFilters,          // Getter for tag filters
  300                        // Optional: debounce delay in ms (default: 300)
);

// Access results
filtering.filteredGems     // Filtered results
filtering.isFiltering      // Loading state
filtering.error           // Error message (if any)
```

## Architecture

### Main Thread (`useWorkerFiltering.svelte.ts`)
- Manages reactive state and worker lifecycle
- Debounces user input to prevent excessive worker calls
- Handles race conditions using request IDs
- Provides synchronous fallback when workers fail

### Web Worker (`static/filter-worker.js`)
- Implements the filtering algorithms (fuzzy search, tag filtering)
- Runs Levenshtein distance calculations without blocking UI
- Returns filtered results with request tracking

## Performance Benefits

### Before (Synchronous)
```typescript
// This blocks the main thread for large datasets
let gems = $derived(
  data.gems
    .filter(gem => fuzzySearch(gem.name, search))
    .filter(gem => filterByTags(gem.tags, tagFilters))
);
```

### After (Web Worker)
```typescript
// This runs in a separate thread, keeping UI responsive
const filtering = useWorkerFiltering(
  () => data.gems,
  () => search,
  () => tagFilters
);
```

## Error Handling

The hook provides robust error handling:

1. **Worker creation errors**: Falls back to synchronous filtering
2. **Runtime worker errors**: Catches errors and uses fallback
3. **Missing Worker support**: Detects environment and uses fallback
4. **Invalid data**: Validates input and provides error messages

## Implementation Details

### State Management
```typescript
interface WorkerFilteringState {
  filteredGems: GemData[];
  isFiltering: boolean;
  error: string | null;
}
```

### Debouncing
- Default 300ms debounce prevents excessive worker calls
- Loading state shows immediately for responsive UI
- Actual filtering is debounced for performance

### Race Condition Prevention
- Each request gets a unique `requestId`
- Only results from the latest request are applied
- Older responses are discarded automatically

## Browser Compatibility

- **Modern browsers**: Full Web Worker support
- **Older browsers**: Automatic fallback to synchronous filtering
- **SSR environments**: Handles `Worker` not being defined

## Testing

The hook can be tested by:
1. Verifying filtering results match synchronous implementation
2. Testing debouncing behavior with rapid input changes
3. Testing fallback behavior when workers are unavailable
4. Ensuring race conditions are handled correctly

## File Structure

```
src/lib/hooks/
├── useWorkerFiltering.svelte.ts    # Main hook implementation
└── README.md                       # This documentation

static/
└── filter-worker.js                # Web Worker implementation
```

## Migration from Synchronous Filtering

To migrate from the original synchronous approach:

1. Replace `$derived` filtering with `useWorkerFiltering`
2. Update template to handle loading states
3. Add error handling UI
4. Test with your dataset size to verify performance benefits

## Performance Considerations

- **Small datasets (<100 items)**: Web Worker overhead might exceed benefits
- **Large datasets (>1000 items)**: Significant UI responsiveness improvement
- **Complex filtering**: Levenshtein distance calculations benefit most from worker threading
- **Memory usage**: Worker creates a copy of data, consider for very large datasets