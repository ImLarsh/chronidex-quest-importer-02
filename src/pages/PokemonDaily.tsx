import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shuffle, Calendar, Star } from "lucide-react";
import { usePokemon } from "@/hooks/usePokemon";

const PokemonDaily = () => {
  const { pokemon, loading } = usePokemon();
  const [dailyPokemon, setDailyPokemon] = useState<any>(null);
  const [streak, setStreak] = useState(0);

  const getTodaysDate = () => {
    return new Date().toDateString();
  };

  const getDailyPokemon = () => {
    const today = getTodaysDate();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    if (pokemon.length > 0) {
      return pokemon[seed % pokemon.length];
    }
    return null;
  };

  useEffect(() => {
    if (pokemon.length > 0) {
      const todaysPokemon = getDailyPokemon();
      setDailyPokemon(todaysPokemon);

      const today = getTodaysDate();
      const lastVisitDate = localStorage.getItem('pokemonDailyLastVisit');
      const currentStreak = parseInt(localStorage.getItem('pokemonDailyStreak') || '0');

      if (lastVisitDate && lastVisitDate !== today) {
        setStreak(currentStreak + 1);
        localStorage.setItem('pokemonDailyStreak', (currentStreak + 1).toString());
      } else if (!lastVisitDate) {
        setStreak(1);
        localStorage.setItem('pokemonDailyStreak', '1');
      } else {
        setStreak(currentStreak);
      }

      localStorage.setItem('pokemonDailyLastVisit', today);
    }
  }, [pokemon]);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Pokémon of the Day</h1>
          </div>
          <p className="text-muted-foreground">
            Discover a new featured Pokémon every day! Come back daily to maintain your streak.
          </p>
        </div>

        {loading ? (
          <div className="text-center">Loading today's Pokémon...</div>
        ) : dailyPokemon ? (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <div>
                    <h3 className="font-semibold">Daily Streak</h3>
                    <p className="text-sm text-muted-foreground">Keep coming back daily!</p>
                  </div>
                </div>
                <div className="text-3xl font-bold">{streak}</div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-primary/20 to-primary/10">
                <CardTitle className="text-2xl">Today's Featured Pokémon</CardTitle>
                <p className="text-muted-foreground">{getTodaysDate()}</p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <img 
                    src={dailyPokemon.sprites.other['official-artwork']?.front_default || dailyPokemon.sprites.front_default}
                    alt={dailyPokemon.name}
                    className="w-48 h-48 mx-auto"
                  />
                  
                  <div>
                    <h2 className="text-3xl font-bold capitalize mb-2">{dailyPokemon.name}</h2>
                    <p className="text-muted-foreground mb-4">#{dailyPokemon.id}</p>
                    
                    <div className="flex justify-center gap-2 mb-6">
                      {dailyPokemon.types.map((type: any) => (
                        <Badge 
                          key={type.type.name}
                          className={`${getTypeColor(type.type.name)} text-white`}
                        >
                          {type.type.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto">
                    <div className="text-center">
                      <h4 className="font-semibold text-lg mb-1">Height</h4>
                      <p className="text-2xl">{(dailyPokemon.height / 10).toFixed(1)} m</p>
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-lg mb-1">Weight</h4>
                      <p className="text-2xl">{(dailyPokemon.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center">No Pokémon data available</div>
        )}
      </div>
    </div>
  );
};

export default PokemonDaily;