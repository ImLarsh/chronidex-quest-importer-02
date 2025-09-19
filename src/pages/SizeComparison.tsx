import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Shuffle } from "lucide-react";
import { usePokemon } from "@/hooks/usePokemon";

const SizeComparison = () => {
  const { pokemon, loading } = usePokemon();
  const [pokemon1, setPokemon1] = useState<any>(null);
  const [pokemon2, setPokemon2] = useState<any>(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [suggestions1, setSuggestions1] = useState<any[]>([]);
  const [suggestions2, setSuggestions2] = useState<any[]>([]);

  useEffect(() => {
    if (search1) {
      const filtered = pokemon.filter(p => 
        p.name.toLowerCase().includes(search1.toLowerCase()) ||
        p.id.toString().includes(search1)
      ).slice(0, 5);
      setSuggestions1(filtered);
    } else {
      setSuggestions1([]);
    }
  }, [search1, pokemon]);

  useEffect(() => {
    if (search2) {
      const filtered = pokemon.filter(p => 
        p.name.toLowerCase().includes(search2.toLowerCase()) ||
        p.id.toString().includes(search2)
      ).slice(0, 5);
      setSuggestions2(filtered);
    } else {
      setSuggestions2([]);
    }
  }, [search2, pokemon]);

  const selectPokemon = (poke: any, slot: 1 | 2) => {
    if (slot === 1) {
      setPokemon1(poke);
      setSearch1(poke.name);
      setSuggestions1([]);
    } else {
      setPokemon2(poke);
      setSearch2(poke.name);
      setSuggestions2([]);
    }
  };

  const getRandomComparison = () => {
    if (pokemon.length === 0) return;
    const random1 = pokemon[Math.floor(Math.random() * pokemon.length)];
    const random2 = pokemon[Math.floor(Math.random() * pokemon.length)];
    selectPokemon(random1, 1);
    selectPokemon(random2, 2);
  };

  const getScaleSize = (height: number, weight: number, maxHeight: number, maxWeight: number) => {
    // Scale based on height primarily, with some weight consideration
    const heightRatio = height / maxHeight;
    const weightRatio = weight / maxWeight;
    const avgRatio = (heightRatio * 0.7) + (weightRatio * 0.3);
    
    // Minimum size of 60px, maximum of 200px
    return Math.max(60, Math.min(200, 60 + (avgRatio * 140)));
  };

  const getSizeCategory = (height: number, weight: number) => {
    if (height <= 6 && weight <= 100) return "Small";
    if (height <= 15 && weight <= 500) return "Medium";
    if (height <= 30 && weight <= 1500) return "Large";
    return "Giant";
  };

  const maxHeight = pokemon1 && pokemon2 ? Math.max(pokemon1.height, pokemon2.height) : 1;
  const maxWeight = pokemon1 && pokemon2 ? Math.max(pokemon1.weight, pokemon2.weight) : 1;

  const PokemonSearchCard = ({ pokemon: poke, search, setSearch, suggestions, slot, title }: any) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 bg-background border rounded-md mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion: any) => (
                <div
                  key={suggestion.id}
                  className="p-2 hover:bg-accent cursor-pointer flex items-center gap-2"
                  onClick={() => selectPokemon(suggestion, slot)}
                >
                  <img 
                    src={suggestion.sprites.front_default} 
                    alt={suggestion.name}
                    className="w-8 h-8"
                  />
                  <span className="capitalize">{suggestion.name}</span>
                  <span className="text-muted-foreground">#{suggestion.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {poke ? (
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold capitalize">{poke.name}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Height:</span>
                <div className="text-lg">{(poke.height / 10).toFixed(1)} m</div>
                <div className="text-muted-foreground">{(poke.height * 3.28084 / 10).toFixed(1)} ft</div>
              </div>
              <div>
                <span className="font-semibold">Weight:</span>
                <div className="text-lg">{(poke.weight / 10).toFixed(1)} kg</div>
                <div className="text-muted-foreground">{(poke.weight * 2.20462 / 10).toFixed(1)} lbs</div>
              </div>
            </div>
            <Badge variant="secondary">
              {getSizeCategory(poke.height, poke.weight)}
            </Badge>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Search for a Pokémon to compare
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Size Comparison</h1>
          <p className="text-muted-foreground mb-4">
            Visually compare the height and weight of two Pokémon
          </p>
          <Button onClick={getRandomComparison} variant="outline">
            <Shuffle className="w-4 h-4 mr-2" />
            Random Comparison
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Loading Pokémon data...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <PokemonSearchCard 
                pokemon={pokemon1}
                search={search1}
                setSearch={setSearch1}
                suggestions={suggestions1}
                slot={1}
                title="First Pokémon"
              />
              <PokemonSearchCard 
                pokemon={pokemon2}
                search={search2}
                setSearch={setSearch2}
                suggestions={suggestions2}
                slot={2}
                title="Second Pokémon"
              />
            </div>

            {pokemon1 && pokemon2 && (
              <div className="space-y-8">
                {/* Visual Size Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visual Size Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-center gap-8 py-8 min-h-[300px]">
                      <div className="text-center">
                        <img 
                          src={pokemon1.sprites.other['official-artwork']?.front_default || pokemon1.sprites.front_default}
                          alt={pokemon1.name}
                          className="mx-auto mb-2"
                          style={{ 
                            height: `${getScaleSize(pokemon1.height, pokemon1.weight, maxHeight, maxWeight)}px`,
                            width: 'auto'
                          }}
                        />
                        <p className="font-semibold capitalize">{pokemon1.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(pokemon1.height / 10).toFixed(1)}m, {(pokemon1.weight / 10).toFixed(1)}kg
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <img 
                          src={pokemon2.sprites.other['official-artwork']?.front_default || pokemon2.sprites.front_default}
                          alt={pokemon2.name}
                          className="mx-auto mb-2"
                          style={{ 
                            height: `${getScaleSize(pokemon2.height, pokemon2.weight, maxHeight, maxWeight)}px`,
                            width: 'auto'
                          }}
                        />
                        <p className="font-semibold capitalize">{pokemon2.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(pokemon2.height / 10).toFixed(1)}m, {(pokemon2.weight / 10).toFixed(1)}kg
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Height Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{pokemon1.name}</span>
                          <span className="font-bold">{(pokemon1.height / 10).toFixed(1)} m</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full" 
                            style={{ width: `${(pokemon1.height / maxHeight) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{pokemon2.name}</span>
                          <span className="font-bold">{(pokemon2.height / 10).toFixed(1)} m</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full" 
                            style={{ width: `${(pokemon2.height / maxHeight) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          Difference: {Math.abs((pokemon1.height - pokemon2.height) / 10).toFixed(1)} m
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Weight Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{pokemon1.name}</span>
                          <span className="font-bold">{(pokemon1.weight / 10).toFixed(1)} kg</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full" 
                            style={{ width: `${(pokemon1.weight / maxWeight) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{pokemon2.name}</span>
                          <span className="font-bold">{(pokemon2.weight / 10).toFixed(1)} kg</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full" 
                            style={{ width: `${(pokemon2.weight / maxWeight) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          Difference: {Math.abs((pokemon1.weight - pokemon2.weight) / 10).toFixed(1)} kg
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SizeComparison;