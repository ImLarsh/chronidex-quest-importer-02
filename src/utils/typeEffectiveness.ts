// Type effectiveness chart - attacking type vs defending type
export const TYPE_EFFECTIVENESS: Record<string, Record<string, number>> = {
  normal: {
    rock: 0.5, ghost: 0, steel: 0.5
  },
  fire: {
    fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2
  },
  water: {
    fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5
  },
  electric: {
    water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5
  },
  grass: {
    fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5
  },
  ice: {
    fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5
  },
  fighting: {
    normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5
  },
  poison: {
    grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2
  },
  ground: {
    fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2
  },
  flying: {
    electric: 0.5, grass: 2, ice: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5
  },
  psychic: {
    fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5
  },
  bug: {
    fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5
  },
  rock: {
    fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5
  },
  ghost: {
    normal: 0, psychic: 2, ghost: 2, dark: 0.5
  },
  dragon: {
    dragon: 2, steel: 0.5, fairy: 0
  },
  dark: {
    fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5
  },
  steel: {
    fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2
  },
  fairy: {
    fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5
  }
};

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export function getTypeEffectiveness(attackingType: string, defendingTypes: string[]): number {
  let effectiveness = 1;
  
  defendingTypes.forEach(defendingType => {
    const multiplier = TYPE_EFFECTIVENESS[attackingType]?.[defendingType] ?? 1;
    effectiveness *= multiplier;
  });
  
  return effectiveness;
}

export function getDefensiveTypeAnalysis(defendingTypes: string[]) {
  const weaknesses: string[] = [];
  const resistances: string[] = [];
  const immunities: string[] = [];
  
  ALL_TYPES.forEach(attackingType => {
    const effectiveness = getTypeEffectiveness(attackingType, defendingTypes);
    
    if (effectiveness > 1) {
      weaknesses.push(attackingType);
    } else if (effectiveness < 1 && effectiveness > 0) {
      resistances.push(attackingType);
    } else if (effectiveness === 0) {
      immunities.push(attackingType);
    }
  });
  
  return { weaknesses, resistances, immunities };
}

export function getTeamTypeAnalysis(teamTypes: string[][]) {
  const typeCoverage: Record<string, number> = {};
  const teamWeaknesses: Record<string, number> = {};
  
  // Count type coverage
  teamTypes.forEach(pokemonTypes => {
    pokemonTypes.forEach(type => {
      Object.keys(TYPE_EFFECTIVENESS[type] || {}).forEach(defendingType => {
        const effectiveness = TYPE_EFFECTIVENESS[type][defendingType];
        if (effectiveness > 1) {
          typeCoverage[defendingType] = Math.max(typeCoverage[defendingType] || 0, effectiveness);
        }
      });
    });
  });
  
  // Count team weaknesses
  teamTypes.forEach(pokemonTypes => {
    const analysis = getDefensiveTypeAnalysis(pokemonTypes);
    analysis.weaknesses.forEach(weakness => {
      teamWeaknesses[weakness] = (teamWeaknesses[weakness] || 0) + 1;
    });
  });
  
  return { typeCoverage, teamWeaknesses };
}