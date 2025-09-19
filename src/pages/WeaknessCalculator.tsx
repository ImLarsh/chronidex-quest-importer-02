import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap } from "lucide-react";

const WeaknessCalculator = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [defendingPokemon, setDefendingPokemon] = useState("");

  const types = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ];

  const typeChart = {
    normal: { strong: [], weak: ["rock", "steel"], immune: ["ghost"] },
    fire: { strong: ["grass", "ice", "bug", "steel"], weak: ["fire", "water", "rock", "dragon"], immune: [] },
    water: { strong: ["fire", "ground", "rock"], weak: ["water", "grass", "dragon"], immune: [] },
    electric: { strong: ["water", "flying"], weak: ["electric", "grass", "dragon"], immune: ["ground"] },
    grass: { strong: ["water", "ground", "rock"], weak: ["fire", "grass", "poison", "flying", "bug", "dragon", "steel"], immune: [] },
    ice: { strong: ["grass", "ground", "flying", "dragon"], weak: ["fire", "water", "ice", "steel"], immune: [] },
    fighting: { strong: ["normal", "ice", "rock", "dark", "steel"], weak: ["poison", "flying", "psychic", "bug", "fairy"], immune: ["ghost"] },
    poison: { strong: ["grass", "fairy"], weak: ["poison", "ground", "rock", "ghost"], immune: ["steel"] },
    ground: { strong: ["fire", "electric", "poison", "rock", "steel"], weak: ["grass", "bug"], immune: ["flying"] },
    flying: { strong: ["electric", "grass", "fighting", "bug"], weak: ["electric", "rock", "steel"], immune: [] },
    psychic: { strong: ["fighting", "poison"], weak: ["psychic", "steel"], immune: ["dark"] },
    bug: { strong: ["grass", "psychic", "dark"], weak: ["fire", "fighting", "poison", "flying", "ghost", "steel", "fairy"], immune: [] },
    rock: { strong: ["fire", "ice", "flying", "bug"], weak: ["fighting", "ground", "steel"], immune: [] },
    ghost: { strong: ["psychic", "ghost"], weak: ["dark"], immune: ["normal"] },
    dragon: { strong: ["dragon"], weak: ["steel"], immune: ["fairy"] },
    dark: { strong: ["psychic", "ghost"], weak: ["fighting", "dark", "fairy"], immune: [] },
    steel: { strong: ["ice", "rock", "fairy"], weak: ["fire", "water", "electric", "steel"], immune: [] },
    fairy: { strong: ["fighting", "dragon", "dark"], weak: ["fire", "poison", "steel"], immune: [] }
  };

  const addType = (type: string) => {
    if (selectedTypes.length < 2 && !selectedTypes.includes(type)) {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const removeType = (type: string) => {
    setSelectedTypes(selectedTypes.filter(t => t !== type));
  };

  const clearTypes = () => {
    setSelectedTypes([]);
  };

  const calculateDamageMultipliers = () => {
    if (selectedTypes.length === 0) return {};

    const multipliers: { [key: string]: number } = {};

    types.forEach(attackingType => {
      let multiplier = 1;
      
      selectedTypes.forEach(defendingType => {
        const effectiveness = typeChart[attackingType as keyof typeof typeChart];
        
        if (effectiveness.strong.includes(defendingType)) {
          multiplier *= 2; // Super effective
        } else if (effectiveness.weak.includes(defendingType)) {
          multiplier *= 0.5; // Not very effective
        } else if (effectiveness.immune.includes(defendingType)) {
          multiplier *= 0; // No effect
        }
        // Normal effectiveness = multiplier stays 1
      });

      multipliers[attackingType] = multiplier;
    });

    return multipliers;
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

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier === 0) return "text-gray-500";
    if (multiplier >= 4) return "text-red-700 font-bold";
    if (multiplier >= 2) return "text-red-600";
    if (multiplier > 1) return "text-red-500";
    if (multiplier === 1) return "text-gray-700";
    if (multiplier >= 0.5) return "text-green-600";
    if (multiplier >= 0.25) return "text-green-700";
    return "text-green-800 font-bold";
  };

  const getMultiplierText = (multiplier: number) => {
    if (multiplier === 0) return "No Effect";
    if (multiplier === 0.25) return "¼× (0.25)";
    if (multiplier === 0.5) return "½× (0.5)";
    if (multiplier === 1) return "1× (Normal)";
    if (multiplier === 2) return "2× (Super)";
    if (multiplier === 4) return "4× (Super)";
    return `${multiplier}×`;
  };

  const multipliers = calculateDamageMultipliers();
  const sortedMultipliers = Object.entries(multipliers).sort(([,a], [,b]) => b - a);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Weakness Calculator</h1>
          <p className="text-muted-foreground">
            Calculate damage multipliers for Pokémon type combinations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Type Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Defending Pokémon Types</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Choose up to 2 types for the defending Pokémon
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Pokémon name (optional)"
                    value={defendingPokemon}
                    onChange={(e) => setDefendingPokemon(e.target.value)}
                  />
                  
                  <div>
                    <h4 className="font-semibold mb-2">Selected Types ({selectedTypes.length}/2):</h4>
                    <div className="flex gap-2 mb-4">
                      {selectedTypes.map(type => (
                        <Badge 
                          key={type}
                          className={`${getTypeColor(type)} text-white cursor-pointer`}
                          onClick={() => removeType(type)}
                        >
                          {type} ×
                        </Badge>
                      ))}
                      {selectedTypes.length === 0 && (
                        <p className="text-muted-foreground text-sm">No types selected</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      <Button onClick={clearTypes} variant="outline" size="sm">
                        Clear Types
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Available Types:</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {types.map(type => (
                        <Button
                          key={type}
                          variant={selectedTypes.includes(type) ? "default" : "outline"}
                          size="sm"
                          className={`${selectedTypes.includes(type) ? `${getTypeColor(type)} text-white` : ''}`}
                          onClick={() => addType(type)}
                          disabled={selectedTypes.length >= 2 && !selectedTypes.includes(type)}
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Damage Multipliers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTypes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Select at least one type to see damage multipliers
                  </p>
                ) : (
                  <div className="space-y-2">
                    {sortedMultipliers.map(([attackingType, multiplier]) => (
                      <div key={attackingType} className="flex items-center justify-between p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getTypeColor(attackingType)} text-white text-xs`}>
                            {attackingType}
                          </Badge>
                        </div>
                        <span className={`font-medium ${getMultiplierColor(multiplier)}`}>
                          {getMultiplierText(multiplier)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Cards */}
        {selectedTypes.length > 0 && (
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Super Effective (2×+)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {sortedMultipliers.filter(([,mult]) => mult >= 2).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Normal Damage (1×)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700">
                  {sortedMultipliers.filter(([,mult]) => mult === 1).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Resisted (0.5×)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {sortedMultipliers.filter(([,mult]) => mult < 1 && mult > 0).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Immune (0×)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-500">
                  {sortedMultipliers.filter(([,mult]) => mult === 0).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeaknessCalculator;