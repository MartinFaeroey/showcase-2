export interface RepoeGem {
	base_item: {
		display_name?: string;
		experience_type: string;
		id: string;
		max_level: number;
		release_state: 'released' | 'unreleased' | 'legacy';
	};
	color: 'r' | 'g' | 'b' | 'w';
	display_name: string;
	is_support: boolean;
	stat_translation_file: string;
	static: {
		x: string;
	};
	tags: string[]; // This should be changed to tags when tags are implemented.
	active_skill?: {
		description: string;
		display_name: string;
		id: string;
		is_manually_casted: boolean;
		is_skill_totem: boolean;
		stat_convertions: unknown;
		types: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_active_skill_types
		weapon_restrictions: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_active_skill_weapon_restrictions
		minion_types: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_active_skill_minion_types
		skill_totem_life_multiplier: number;
	};
	cast_time?: number;
	secondary_granted_effect?: string;
	quest_reward?: {
		act: number;
		classes: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_quest_reward_classes
		quest: string;
	};
	discriminator?: 'alt_x' | 'alt_y';
	support_gem?: {
		allowed_types: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_support_gem_allowed_types
		letter: string;
		support_gems_only: boolean;
		excluded_types: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_support_gem_excluded_types
		added_types: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_support_gem_added_types
		added_minion_types: string[]; // see https://lvlvllvlvllvlvl.github.io/RePoE/gems_minimal.schema.html#items_support_gem_added_minion_types
	};
}

export type RepoeGemResponse = {
	[key: string]: RepoeGem | undefined;
};
