import { useState, useEffect, useCallback } from 'react';
import { Team, TeamPokemon, Pokemon } from '@/types/pokemon';

interface UseTeamBuilderReturn {
  teams: Team[];
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  createTeam: (name: string, description?: string) => Team;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  addPokemonToTeam: (pokemon: Pokemon, slotIndex?: number) => void;
  removePokemonFromTeam: (slotIndex: number) => void;
  updateTeamPokemon: (slotIndex: number, teamPokemon: TeamPokemon) => void;
  reorderTeamPokemon: (fromIndex: number, toIndex: number) => void;
  duplicateTeam: (teamId: string) => Team;
  exportTeam: (teamId: string) => string;
  importTeam: (teamData: string) => boolean;
  getTeamTypeAnalysis: () => any;
  getTeamStatSummary: () => any;
  saveTeamsToStorage: () => void;
}

const STORAGE_KEY = 'pokemon-teams';

const createDefaultTeamPokemon = (pokemon: Pokemon): TeamPokemon => ({
  pokemon,
  level: 50,
  nature: 'Hardy',
  ability: pokemon.abilities[0]?.ability.name || '',
  isShiny: false,
  ivs: {
    hp: 31,
    attack: 31,
    defense: 31,
    specialAttack: 31,
    specialDefense: 31,
    speed: 31,
  },
  evs: {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  },
  moves: pokemon.moves.slice(0, 4).map(move => move.move.name),
});

export function useTeamBuilder(): UseTeamBuilderReturn {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  // Load teams from localStorage on mount
  useEffect(() => {
    const storedTeams = localStorage.getItem(STORAGE_KEY);
    if (storedTeams) {
      try {
        const parsedTeams = JSON.parse(storedTeams).map((team: any) => ({
          ...team,
          createdAt: new Date(team.createdAt),
          updatedAt: new Date(team.updatedAt),
        }));
        setTeams(parsedTeams);
      } catch (error) {
        console.error('Error loading teams from storage:', error);
      }
    }
  }, []);

  const saveTeamsToStorage = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  }, [teams]);

  // Save teams to localStorage whenever teams change
  useEffect(() => {
    if (teams.length > 0) {
      saveTeamsToStorage();
    }
  }, [teams, saveTeamsToStorage]);

  const createTeam = useCallback((name: string, description?: string): Team => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      description,
      pokemon: Array(6).fill(null),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setTeams(prev => [...prev, newTeam]);
    setCurrentTeam(newTeam);
    return newTeam;
  }, []);

  const updateTeam = useCallback((updatedTeam: Team) => {
    const teamWithUpdatedTime = {
      ...updatedTeam,
      updatedAt: new Date(),
    };
    
    setTeams(prev => prev.map(team => 
      team.id === updatedTeam.id ? teamWithUpdatedTime : team
    ));
    
    if (currentTeam?.id === updatedTeam.id) {
      setCurrentTeam(teamWithUpdatedTime);
    }
  }, [currentTeam?.id]);

  const deleteTeam = useCallback((teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
    }
  }, [currentTeam?.id]);

  const addPokemonToTeam = useCallback((pokemon: Pokemon, slotIndex?: number) => {
    if (!currentTeam) return;

    const newPokemon = [...currentTeam.pokemon];
    const targetSlot = slotIndex ?? newPokemon.findIndex(slot => slot === null);
    
    if (targetSlot >= 0 && targetSlot < 6) {
      newPokemon[targetSlot] = createDefaultTeamPokemon(pokemon);
      updateTeam({ ...currentTeam, pokemon: newPokemon });
    }
  }, [currentTeam, updateTeam]);

  const removePokemonFromTeam = useCallback((slotIndex: number) => {
    if (!currentTeam) return;

    const newPokemon = [...currentTeam.pokemon];
    newPokemon[slotIndex] = null;
    updateTeam({ ...currentTeam, pokemon: newPokemon });
  }, [currentTeam, updateTeam]);

  const updateTeamPokemon = useCallback((slotIndex: number, teamPokemon: TeamPokemon) => {
    if (!currentTeam) return;

    const newPokemon = [...currentTeam.pokemon];
    newPokemon[slotIndex] = teamPokemon;
    updateTeam({ ...currentTeam, pokemon: newPokemon });
  }, [currentTeam, updateTeam]);

  const reorderTeamPokemon = useCallback((fromIndex: number, toIndex: number) => {
    if (!currentTeam) return;

    const newPokemon = [...currentTeam.pokemon];
    const [removed] = newPokemon.splice(fromIndex, 1);
    newPokemon.splice(toIndex, 0, removed);
    updateTeam({ ...currentTeam, pokemon: newPokemon });
  }, [currentTeam, updateTeam]);

  const duplicateTeam = useCallback((teamId: string): Team => {
    const teamToDuplicate = teams.find(team => team.id === teamId);
    if (!teamToDuplicate) throw new Error('Team not found');

    const duplicatedTeam: Team = {
      ...teamToDuplicate,
      id: Date.now().toString(),
      name: `${teamToDuplicate.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTeams(prev => [...prev, duplicatedTeam]);
    return duplicatedTeam;
  }, [teams]);

  const exportTeam = useCallback((teamId: string): string => {
    const team = teams.find(t => t.id === teamId);
    if (!team) throw new Error('Team not found');
    return JSON.stringify(team, null, 2);
  }, [teams]);

  const importTeam = useCallback((teamData: string): boolean => {
    try {
      const parsedTeam = JSON.parse(teamData);
      const newTeam: Team = {
        ...parsedTeam,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTeams(prev => [...prev, newTeam]);
      return true;
    } catch (error) {
      console.error('Error importing team:', error);
      return false;
    }
  }, []);

  const getTeamTypeAnalysis = useCallback(() => {
    if (!currentTeam) return null;

    const typeCount: Record<string, number> = {};
    const typeWeaknesses: Record<string, number> = {};
    const typeResistances: Record<string, number> = {};
    
    currentTeam.pokemon.forEach(slot => {
      if (slot) {
        slot.pokemon.types.forEach(type => {
          typeCount[type.type.name] = (typeCount[type.type.name] || 0) + 1;
        });
      }
    });

    return {
      typeCount,
      typeWeaknesses,
      typeResistances,
      teamSize: currentTeam.pokemon.filter(slot => slot !== null).length,
    };
  }, [currentTeam]);

  const getTeamStatSummary = useCallback(() => {
    if (!currentTeam) return null;

    const validPokemon = currentTeam.pokemon.filter(slot => slot !== null) as TeamPokemon[];
    if (validPokemon.length === 0) return null;

    const statTotals = {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };

    validPokemon.forEach(teamPokemon => {
      const stats = teamPokemon.pokemon.stats;
      statTotals.hp += stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
      statTotals.attack += stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
      statTotals.defense += stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
      statTotals.specialAttack += stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
      statTotals.specialDefense += stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0;
      statTotals.speed += stats.find(s => s.stat.name === 'speed')?.base_stat || 0;
    });

    return {
      averageStats: {
        hp: Math.round(statTotals.hp / validPokemon.length),
        attack: Math.round(statTotals.attack / validPokemon.length),
        defense: Math.round(statTotals.defense / validPokemon.length),
        specialAttack: Math.round(statTotals.specialAttack / validPokemon.length),
        specialDefense: Math.round(statTotals.specialDefense / validPokemon.length),
        speed: Math.round(statTotals.speed / validPokemon.length),
      },
      totalStats: statTotals,
      teamSize: validPokemon.length,
    };
  }, [currentTeam]);

  return {
    teams,
    currentTeam,
    setCurrentTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addPokemonToTeam,
    removePokemonFromTeam,
    updateTeamPokemon,
    reorderTeamPokemon,
    duplicateTeam,
    exportTeam,
    importTeam,
    getTeamTypeAnalysis,
    getTeamStatSummary,
    saveTeamsToStorage,
  };
}