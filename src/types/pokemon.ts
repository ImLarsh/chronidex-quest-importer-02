export interface BaseStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: {
      name: string;
    };
    version_group: {
      name: string;
    };
  }>;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    front_shiny: string;
    other: {
      'official-artwork': {
        front_default: string;
        front_shiny: string;
      };
    };
  };
  types: PokemonType[];
  height: number;
  weight: number;
  base_experience: number;
  stats: BaseStat[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
}

export interface TeamPokemon {
  pokemon: Pokemon;
  nickname?: string;
  level: number;
  nature: string;
  ability: string;
  heldItem?: string;
  isShiny: boolean;
  ivs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  evs: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  moves: string[];
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  pokemon: (TeamPokemon | null)[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TypeEffectiveness {
  normal: number;
  fire: number;
  water: number;
  electric: number;
  grass: number;
  ice: number;
  fighting: number;
  poison: number;
  ground: number;
  flying: number;
  psychic: number;
  bug: number;
  rock: number;
  ghost: number;
  dragon: number;
  dark: number;
  steel: number;
  fairy: number;
}

export const NATURES = [
  "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
  "Bold", "Docile", "Relaxed", "Impish", "Lax",
  "Timid", "Hasty", "Serious", "Jolly", "Naive",
  "Modest", "Mild", "Quiet", "Bashful", "Rash",
  "Calm", "Gentle", "Sassy", "Careful", "Quirky"
];

export const TYPE_COLORS: Record<string, string> = {
  normal: "from-gray-400 to-gray-500",
  fire: "from-red-500 to-orange-500",
  water: "from-blue-500 to-cyan-500",
  electric: "from-yellow-400 to-yellow-500",
  grass: "from-green-500 to-emerald-500",
  ice: "from-blue-200 to-cyan-300",
  fighting: "from-red-700 to-red-800",
  poison: "from-purple-500 to-purple-600",
  ground: "from-yellow-600 to-amber-600",
  flying: "from-indigo-400 to-sky-400",
  psychic: "from-pink-500 to-fuchsia-500",
  bug: "from-green-400 to-lime-500",
  rock: "from-yellow-800 to-amber-800",
  ghost: "from-purple-700 to-indigo-700",
  dragon: "from-indigo-700 to-purple-700",
  dark: "from-gray-800 to-slate-800",
  steel: "from-gray-500 to-slate-500",
  fairy: "from-pink-300 to-rose-300"
};