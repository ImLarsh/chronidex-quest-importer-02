import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Target, Zap, Shield, Heart, Swords, Search, Copy, Download } from "lucide-react";
import { usePokemon } from "@/hooks/usePokemon";

const StatsCalculator = () => {
  const { pokemon, loading } = usePokemon();
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [pokemonName, setPokemonName] = useState("");
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState("hardy");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Base stats (using Charizard as example)
  const [baseStats, setBaseStats] = useState({
    hp: 78, attack: 84, defense: 78, 
    specialAttack: 109, specialDefense: 85, speed: 100
  });
  
  // IVs (Individual Values)
  const [ivs, setIvs] = useState({
    hp: 31, attack: 31, defense: 31, 
    specialAttack: 31, specialDefense: 31, speed: 31
  });
  
  // EVs (Effort Values)
  const [evs, setEvs] = useState({
    hp: 0, attack: 0, defense: 0, 
    specialAttack: 252, specialDefense: 4, speed: 252
  });

  const [calculatedStats, setCalculatedStats] = useState({
    hp: 0, attack: 0, defense: 0, 
    specialAttack: 0, specialDefense: 0, speed: 0
  });

  const [totalEvs, setTotalEvs] = useState(0);

  // Nature modifiers
  const natures = {
    hardy: { increase: "", decrease: "" },
    lonely: { increase: "attack", decrease: "defense" },
    brave: { increase: "attack", decrease: "speed" },
    adamant: { increase: "attack", decrease: "specialAttack" },
    naughty: { increase: "attack", decrease: "specialDefense" },
    bold: { increase: "defense", decrease: "attack" },
    docile: { increase: "", decrease: "" },
    relaxed: { increase: "defense", decrease: "speed" },
    impish: { increase: "defense", decrease: "specialAttack" },
    lax: { increase: "defense", decrease: "specialDefense" },
    timid: { increase: "speed", decrease: "attack" },
    hasty: { increase: "speed", decrease: "defense" },
    serious: { increase: "", decrease: "" },
    jolly: { increase: "speed", decrease: "specialAttack" },
    naive: { increase: "speed", decrease: "specialDefense" },
    modest: { increase: "specialAttack", decrease: "attack" },
    mild: { increase: "specialAttack", decrease: "defense" },
    quiet: { increase: "specialAttack", decrease: "speed" },
    bashful: { increase: "", decrease: "" },
    rash: { increase: "specialAttack", decrease: "specialDefense" },
    calm: { increase: "specialDefense", decrease: "attack" },
    gentle: { increase: "specialDefense", decrease: "defense" },
    sassy: { increase: "specialDefense", decrease: "speed" },
    careful: { increase: "specialDefense", decrease: "specialAttack" },
    quirky: { increase: "", decrease: "" }
  };

  // Calculate stats whenever inputs change
  useEffect(() => {
    const calculateStat = (base: number, iv: number, ev: number, statName: string) => {
      const natureData = natures[nature as keyof typeof natures];
      let natureModifier = 1.0;
      
      if (natureData.increase === statName) natureModifier = 1.1;
      if (natureData.decrease === statName) natureModifier = 0.9;

      if (statName === 'hp') {
        return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
      } else {
        return Math.floor((Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureModifier);
      }
    };

    setCalculatedStats({
      hp: calculateStat(baseStats.hp, ivs.hp, evs.hp, 'hp'),
      attack: calculateStat(baseStats.attack, ivs.attack, evs.attack, 'attack'),
      defense: calculateStat(baseStats.defense, ivs.defense, evs.defense, 'defense'),
      specialAttack: calculateStat(baseStats.specialAttack, ivs.specialAttack, evs.specialAttack, 'specialAttack'),
      specialDefense: calculateStat(baseStats.specialDefense, ivs.specialDefense, evs.specialDefense, 'specialDefense'),
      speed: calculateStat(baseStats.speed, ivs.speed, evs.speed, 'speed')
    });
  }, [baseStats, ivs, evs, level, nature]);

  // Calculate total EVs
  useEffect(() => {
    const total = Object.values(evs).reduce((sum, ev) => sum + ev, 0);
    setTotalEvs(total);
  }, [evs]);

  const updateEV = (stat: string, value: number) => {
    const newValue = Math.max(0, Math.min(252, value));
    setEvs(prev => ({ ...prev, [stat]: newValue }));
  };

  const updateIV = (stat: string, value: number) => {
    const newValue = Math.max(0, Math.min(31, value));
    setIvs(prev => ({ ...prev, [stat]: newValue }));
  };

  const resetStats = () => {
    setEvs({
      hp: 0, attack: 0, defense: 0, 
      specialAttack: 0, specialDefense: 0, speed: 0
    });
    setIvs({
      hp: 31, attack: 31, defense: 31, 
      specialAttack: 31, specialDefense: 31, speed: 31
    });
    setLevel(50);
    setNature("hardy");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Stats Calculator</h1>
          <p className="text-muted-foreground">
            Calculate Pokémon stats with IVs, EVs, nature, and level modifiers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Pokémon Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pokemon">Pokémon Name</Label>
                    <Input
                      id="pokemon"
                      placeholder="e.g., Charizard"
                      value={pokemonName}
                      onChange={(e) => setPokemonName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      min="1"
                      max="100"
                      value={level}
                      onChange={(e) => setLevel(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="nature">Nature</Label>
                  <Select value={nature} onValueChange={setNature}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.entries(natures).map(([natureName, data]) => (
                        <SelectItem key={natureName} value={natureName}>
                          {natureName.charAt(0).toUpperCase() + natureName.slice(1)}
                          {data.increase && ` (+${data.increase}, -${data.decrease})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Base Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Base Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(baseStats).map(([stat, value]) => (
                    <div key={stat}>
                      <Label>{stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                      <Input
                        type="number"
                        value={value}
                        onChange={(e) => setBaseStats(prev => ({ 
                          ...prev, 
                          [stat]: parseInt(e.target.value) || 0 
                        }))}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* IVs */}
            <Card>
              <CardHeader>
                <CardTitle>IVs (Individual Values) - 0-31</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(ivs).map(([stat, value]) => (
                    <div key={stat}>
                      <Label>{stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="31"
                        value={value}
                        onChange={(e) => updateIV(stat, parseInt(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* EVs */}
            <Card>
              <CardHeader>
                <CardTitle>
                  EVs (Effort Values) - 0-252 each, {totalEvs}/510 total
                  {totalEvs > 510 && <span className="text-red-500 ml-2">Over limit!</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(evs).map(([stat, value]) => (
                    <div key={stat}>
                      <Label>{stat.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="252"
                        value={value}
                        onChange={(e) => updateEV(stat, parseInt(e.target.value) || 0)}
                        className={totalEvs > 510 ? "border-red-500" : ""}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculated Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(calculatedStats).map(([stat, value]) => {
                  const natureData = natures[nature as keyof typeof natures];
                  const isIncreased = natureData.increase === stat;
                  const isDecreased = natureData.decrease === stat;
                  
                  return (
                    <div key={stat} className="flex justify-between items-center">
                      <span className="capitalize">
                        {stat.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className={`font-bold ${isIncreased ? 'text-green-600' : isDecreased ? 'text-red-600' : ''}`}>
                        {value}
                        {isIncreased && ' ↑'}
                        {isDecreased && ' ↓'}
                      </span>
                    </div>
                  );
                })}
                
                <div className="pt-4 border-t">
                  <Button onClick={resetStats} variant="outline" className="w-full">
                    Reset All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCalculator;