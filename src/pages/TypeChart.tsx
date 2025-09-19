import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const types = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

const typeEffectiveness = {
  normal: { weak: ["rock", "ghost", "steel"], strong: [], immune: ["ghost"] },
  fire: { weak: ["fire", "water", "rock", "dragon"], strong: ["bug", "steel", "fire", "grass", "ice"], immune: [] },
  water: { weak: ["water", "grass", "dragon"], strong: ["ground", "rock", "fire"], immune: [] },
  electric: { weak: ["grass", "ground", "electric", "dragon"], strong: ["flying", "water"], immune: ["ground"] },
  grass: { weak: ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"], strong: ["ground", "rock", "water"], immune: [] },
  ice: { weak: ["steel", "fire", "water", "ice"], strong: ["flying", "ground", "grass", "dragon"], immune: [] },
  fighting: { weak: ["flying", "poison", "psychic", "bug", "ghost", "fairy"], strong: ["normal", "rock", "steel", "ice", "dark"], immune: ["ghost"] },
  poison: { weak: ["poison", "ground", "rock", "ghost", "steel"], strong: ["grass", "fairy"], immune: [] },
  ground: { weak: ["bug", "grass"], strong: ["poison", "flying", "rock", "steel", "fire", "electric"], immune: ["flying"] },
  flying: { weak: ["rock", "steel", "electric"], strong: ["fighting", "ground", "grass", "bug"], immune: [] },
  psychic: { weak: ["steel", "psychic"], strong: ["fighting", "poison"], immune: ["dark"] },
  bug: { weak: ["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"], strong: ["grass", "psychic", "dark"], immune: [] },
  rock: { weak: ["fighting", "ground", "steel"], strong: ["flying", "bug", "fire", "ice"], immune: [] },
  ghost: { weak: ["ghost", "dark"], strong: ["ghost", "psychic"], immune: ["normal"] },
  dragon: { weak: ["steel", "fairy"], strong: ["dragon"], immune: [] },
  dark: { weak: ["fighting", "dark", "fairy"], strong: ["ghost", "psychic"], immune: [] },
  steel: { weak: ["steel", "fire", "water", "electric"], strong: ["rock", "ice", "fairy"], immune: [] },
  fairy: { weak: ["poison", "steel", "fire"], strong: ["fighting", "dragon", "dark"], immune: [] }
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

const TypeChart = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Type Effectiveness Chart</h1>
          <p className="text-muted-foreground">
            Learn about Pokémon type advantages and disadvantages in battle
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {types.map((type) => (
            <Card key={type} className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge className={`${getTypeColor(type)} text-white capitalize`}>
                    {type}
                  </Badge>
                  Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Super Effective Against:</h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness[type as keyof typeof typeEffectiveness].strong.map((strongType) => (
                      <Badge key={strongType} variant="secondary" className={`${getTypeColor(strongType)} text-white text-xs`}>
                        {strongType}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Not Very Effective Against:</h4>
                  <div className="flex flex-wrap gap-1">
                    {typeEffectiveness[type as keyof typeof typeEffectiveness].weak.map((weakType) => (
                      <Badge key={weakType} variant="secondary" className={`${getTypeColor(weakType)} text-white text-xs`}>
                        {weakType}
                      </Badge>
                    ))}
                  </div>
                </div>

                {typeEffectiveness[type as keyof typeof typeEffectiveness].immune.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-600 mb-2">No Effect Against:</h4>
                    <div className="flex flex-wrap gap-1">
                      {typeEffectiveness[type as keyof typeof typeEffectiveness].immune.map((immuneType) => (
                        <Badge key={immuneType} variant="secondary" className={`${getTypeColor(immuneType)} text-white text-xs`}>
                          {immuneType}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypeChart;