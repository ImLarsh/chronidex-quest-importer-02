import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { usePokemon } from "@/hooks/usePokemon";
import { useTeamBuilder } from "@/hooks/useTeamBuilder";
import { TeamManager } from "@/components/TeamBuilder/TeamManager";
import { TeamPokemonSlot } from "@/components/TeamBuilder/TeamPokemonSlot";
import { PokemonSearch } from "@/components/TeamBuilder/PokemonSearch";
import { TeamAnalysis } from "@/components/TeamBuilder/TeamAnalysis";
import { PokemonDetailModal } from "@/components/TeamBuilder/PokemonDetailModal";
import { TeamPokemon, Pokemon } from "@/types/pokemon";

const TeamBuilder = () => {
  const { pokemon, loading, favorites, toggleFavorite } = usePokemon();
  const teamBuilder = useTeamBuilder();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedPokemonForDetail, setSelectedPokemonForDetail] = useState<TeamPokemon | null>(null);
  const [selectedSlotForDetail, setSelectedSlotForDetail] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id.split('-')[1]);
      const newIndex = parseInt(over.id.split('-')[1]);
      teamBuilder.reorderTeamPokemon(oldIndex, newIndex);
    }
  };

  const addToTeam = (poke: any, slotIndex?: number) => {
    const newTeam = [...team];
    const targetSlot = slotIndex !== undefined ? slotIndex : team.length;
    
    if (targetSlot < 6) {
      newTeam[targetSlot] = poke;
      setTeam(newTeam);
      setSearchTerm("");
      setSuggestions([]);
      setSelectedSlot(null);
    }
  };

  const removeFromTeam = (index: number) => {
    const newTeam = team.filter((_, i) => i !== index);
    setTeam(newTeam);
  };

  const clearTeam = () => {
    setTeam([]);
  };

  const generateRandomTeam = () => {
    if (pokemon.length === 0) return;
    const randomTeam = [];
    const usedIds = new Set();
    
    while (randomTeam.length < 6 && usedIds.size < pokemon.length) {
      const randomPokemon = pokemon[Math.floor(Math.random() * pokemon.length)];
      if (!usedIds.has(randomPokemon.id)) {
        usedIds.add(randomPokemon.id);
        randomTeam.push(randomPokemon);
      }
    }
    
    setTeam(randomTeam);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      normal: "bg-gray-400", fire: "bg-red-500", water: "bg-blue-500", electric: "bg-yellow-400",
      grass: "bg-green-500", ice: "bg-blue-200", fighting: "bg-red-700", poison: "bg-purple-500",
      ground: "bg-yellow-600", flying: "bg-indigo-400", psychic: "bg-pink-500", bug: "bg-green-400",
      rock: "bg-yellow-800", ghost: "bg-purple-700", dragon: "bg-indigo-700", dark: "bg-gray-800",
      steel: "bg-gray-500", fairy: "bg-pink-300"
    };
    return colors[type as keyof typeof colors] || "bg-gray-400";
  };

  const getTeamTypes = () => {
    const typeCount: { [key: string]: number } = {};
    team.forEach(poke => {
      poke.types.forEach((type: any) => {
        typeCount[type.type.name] = (typeCount[type.type.name] || 0) + 1;
      });
    });
    return typeCount;
  };

  const teamTypes = getTeamTypes();

  const EmptySlot = ({ index }: { index: number }) => (
    <Card 
      className="h-48 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors"
      onClick={() => setSelectedSlot(index)}
    >
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">Add Pokémon</p>
          <p className="text-xs">Slot {index + 1}</p>
        </div>
      </CardContent>
    </Card>
  );

  const PokemonSlot = ({ poke, index }: { poke: any; index: number }) => (
    <Card className="h-48 relative group">
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={() => removeFromTeam(index)}
      >
        <X className="h-4 w-4" />
      </Button>
      <CardContent className="p-4 text-center">
        <img 
          src={poke.sprites.other['official-artwork']?.front_default || poke.sprites.front_default}
          alt={poke.name}
          className="w-20 h-20 mx-auto mb-2"
        />
        <h4 className="font-semibold capitalize text-sm">{poke.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">#{poke.id}</p>
        <div className="flex justify-center gap-1">
          {poke.types.map((type: any) => (
            <Badge 
              key={type.type.name}
              className={`${getTypeColor(type.type.name)} text-white text-xs`}
            >
              {type.type.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Team Builder</h1>
          <p className="text-muted-foreground mb-4">
            Build your perfect Pokémon team with up to 6 members
          </p>
          
          <div className="flex gap-4 mb-4">
            <Button onClick={generateRandomTeam} variant="outline">
              <Shuffle className="w-4 h-4 mr-2" />
              Random Team
            </Button>
            {team.length > 0 && (
              <Button onClick={clearTeam} variant="outline">
                Clear Team
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading Pokémon data...</div>
        ) : (
          <>
            {/* Search Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add Pokémon to Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for Pokémon to add..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-background border rounded-md mt-1 max-h-60 overflow-y-auto">
                      {suggestions.map((suggestion: any) => (
                        <div
                          key={suggestion.id}
                          className="p-3 hover:bg-accent cursor-pointer flex items-center gap-3"
                          onClick={() => addToTeam(suggestion, selectedSlot ?? undefined)}
                        >
                          <img 
                            src={suggestion.sprites.front_default} 
                            alt={suggestion.name}
                            className="w-10 h-10"
                          />
                          <div className="flex-1">
                            <p className="font-medium capitalize">{suggestion.name}</p>
                            <div className="flex gap-1 mt-1">
                              {suggestion.types.map((type: any) => (
                                <Badge 
                                  key={type.type.name}
                                  className={`${getTypeColor(type.type.name)} text-white text-xs`}
                                >
                                  {type.type.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <span className="text-muted-foreground">#{suggestion.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Display */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {Array.from({ length: 6 }, (_, index) => {
                const pokemon = team[index];
                return pokemon ? (
                  <PokemonSlot key={`${pokemon.id}-${index}`} poke={pokemon} index={index} />
                ) : (
                  <EmptySlot key={`empty-${index}`} index={index} />
                );
              })}
            </div>

            {/* Team Analysis */}
            {team.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Composition</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Team Size:</span>
                        <span className="font-medium">{team.length}/6</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unique Types:</span>
                        <span className="font-medium">{Object.keys(teamTypes).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(teamTypes)
                        .sort(([,a], [,b]) => b - a)
                        .map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getTypeColor(type)} text-white`}>
                              {type}
                            </Badge>
                          </div>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamBuilder;