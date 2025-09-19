import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Shuffle } from "lucide-react";
import { usePokemon } from "@/hooks/usePokemon";

const PokemonCompare = () => {
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

  const getRandomPokemon = () => {
    if (pokemon.length === 0) return;
    const random1 = pokemon[Math.floor(Math.random() * pokemon.length)];
    const random2 = pokemon[Math.floor(Math.random() * pokemon.length)];
    selectPokemon(random1, 1);
    selectPokemon(random2, 2);
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

  const PokemonCard = ({ pokemon: poke, search, setSearch, suggestions, slot }: any) => (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Pokémon {slot}</CardTitle>
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
          <div className="space-y-4">
            <div className="text-center">
              <img 
                src={poke.sprites.other['official-artwork'].front_default || poke.sprites.front_default}
                alt={poke.name}
                className="w-32 h-32 mx-auto"
              />
              <h3 className="text-xl font-bold capitalize mt-2">{poke.name}</h3>
              <p className="text-muted-foreground">#{poke.id}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Types</h4>
              <div className="flex gap-2">
                {poke.types.map((type: any) => (
                  <Badge 
                    key={type.type.name} 
                    className={`${getTypeColor(type.type.name)} text-white`}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Height</h4>
                <p>{(poke.height / 10).toFixed(1)} m</p>
              </div>
              <div>
                <h4 className="font-semibold">Weight</h4>
                <p>{(poke.weight / 10).toFixed(1)} kg</p>
              </div>
            </div>
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
          <h1 className="text-4xl font-bold mb-4">Pokémon Comparison</h1>
          <p className="text-muted-foreground mb-4">
            Compare two Pokémon side by side to see their differences
          </p>
          <Button onClick={getRandomPokemon} variant="outline">
            <Shuffle className="w-4 h-4 mr-2" />
            Random Comparison
          </Button>
        </div>

        {loading ? (
          <div className="text-center">Loading Pokémon data...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <PokemonCard 
              pokemon={pokemon1}
              search={search1}
              setSearch={setSearch1}
              suggestions={suggestions1}
              slot={1}
            />
            <PokemonCard 
              pokemon={pokemon2}
              search={search2}
              setSearch={setSearch2}
              suggestions={suggestions2}
              slot={2}
            />
          </div>
        )}

        {pokemon1 && pokemon2 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="font-semibold">Height Difference</h4>
                  <p className={`text-lg ${pokemon1.height > pokemon2.height ? 'text-green-600' : pokemon1.height < pokemon2.height ? 'text-red-600' : 'text-gray-600'}`}>
                    {pokemon1.height > pokemon2.height ? `${pokemon1.name} is taller` : 
                     pokemon1.height < pokemon2.height ? `${pokemon2.name} is taller` : 'Same height'}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold">Weight Difference</h4>
                  <p className={`text-lg ${pokemon1.weight > pokemon2.weight ? 'text-green-600' : pokemon1.weight < pokemon2.weight ? 'text-red-600' : 'text-gray-600'}`}>
                    {pokemon1.weight > pokemon2.weight ? `${pokemon1.name} is heavier` : 
                     pokemon1.weight < pokemon2.weight ? `${pokemon2.name} is heavier` : 'Same weight'}
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="font-semibold">Type Advantage</h4>
                  <p className="text-lg">Check type chart for effectiveness</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PokemonCompare;