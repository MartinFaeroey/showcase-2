import type { PageServerLoad } from './$types';
import type { RepoeGemResponse } from '$features/repoe-api';
import type { GemData } from '$lib/types';

export const load: PageServerLoad = async () => {
	const gemsResponse = await getGems();
	const gems = toGemData(gemsResponse);

	return { gems };
};

async function getGems(): Promise<RepoeGemResponse> {
	const url = 'https://lvlvllvlvllvlvl.github.io/RePoE/gems.min.json';
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`${url} responded with ${response.status}`);
	}

	return JSON.parse(await response.text());
}

const toGemData = (gems: RepoeGemResponse): GemData[] =>
	Object.values(gems)
		.filter((x) => x !== undefined)
		.filter((x) => x.display_name !== undefined)
		.map((x) => ({
			name: x?.display_name ?? '',
			tags: x?.tags ?? [],
			url: x?.display_name.toLowerCase().split(' ').join('-') ?? ''
		}));
