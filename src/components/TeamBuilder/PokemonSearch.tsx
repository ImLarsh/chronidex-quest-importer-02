import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pokemon, TYPE_COLORS } from "@/types/pokemon";
import { Search, Heart, Star } from "lucide-react";

interface PokemonSearchProps {
  pokemon: Pokemon[];
  favorites: number[];
  onPokemonSelect: (pokemon: Pokemon) => void;
  onToggleFavorite: (id: number) => void;
  selectedSlot?: number | null;
}

export const PokemonSearch: React.FC<PokemonSearchProps> = ({
  pokemon,
  favorites,
  onPokemonSelect,
  onToggleFavorite,
  selectedSlot,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);

  const generationRanges = {
    '1': [1, 151],
    '2': [152, 251],
    '3': [252, 386],
    '4': [387, 493],
    '5': [494, 649],
    '6': [650, 721],
    '7': [722, 809],
    '8': [810, 905],
    '9': [906, 1010],
  };

  const allTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  const filteredPokemon = useMemo(() => {
    return pokemon.filter(poke => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        poke.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poke.id.toString().includes(searchTerm);

      // Type filter
      const matchesType = selectedType === 'all' ||
        poke.types.some(type => type.type.name === selectedType);

      // Generation filter
      const matchesGeneration = selectedGeneration === 'all' ||
        (generationRanges[selectedGeneration as keyof typeof generationRanges] &&
         poke.id >= generationRanges[selectedGeneration as keyof typeof generationRanges][0] &&
         poke.id <= generationRanges[selectedGeneration as keyof typeof generationRanges][1]);

      // Favorites filter
      const matchesFavorites = !showFavorites || favorites.includes(poke.id);

      return matchesSearch && matchesType && matchesGeneration && matchesFavorites;
    });
  }, [pokemon, searchTerm, selectedType, selectedGeneration, showFavorites, favorites]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Add Pokémon to Team
          {selectedSlot !== null && (
            <Badge variant="outline">
              Slot {selectedSlot + 1}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
            <SelectTrigger>
              <SelectValue placeholder="All Generations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Generations</SelectItem>
              {Object.keys(generationRanges).map(gen => (
                <SelectItem key={gen} value={gen}>
                  Generation {gen}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showFavorites ? "default" : "outline"}
            onClick={() => setShowFavorites(!showFavorites)}
            className="justify-start"
          >
            <Heart className={`w-4 h-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
            Favorites ({favorites.length})
          </Button>
        </div>

        {/* Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredPokemon.length} Pokémon found
            </p>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setSelectedGeneration("all");
                  setShowFavorites(false);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredPokemon.slice(0, 50).map((poke) => (
              <div
                key={poke.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors group"
                onClick={() => onPokemonSelect(poke)}
              >
                <img
                  src={poke.sprites.front_default}
                  alt={poke.name}
                  className="w-12 h-12"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium capitalize truncate">{poke.name}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(poke.id);
                      }}
                    >
                      <Heart 
                        className={`w-3 h-3 ${
                          favorites.includes(poke.id) ? 'fill-red-500 text-red-500' : ''
                        }`} 
                      />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{poke.id}</span>
                    <div className="flex gap-1">
                      {poke.types.map((type) => (
                        <Badge
                          key={type.type.name}
                          className={`text-white text-xs bg-gradient-to-r ${TYPE_COLORS[type.type.name]}`}
                        >
                          {type.type.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {favorites.includes(poke.id) && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
            ))}

            {filteredPokemon.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No Pokémon found matching your search criteria.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                    setSelectedGeneration("all");
                    setShowFavorites(false);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {filteredPokemon.length > 50 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">
                  Showing first 50 results. Use filters to narrow down your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};