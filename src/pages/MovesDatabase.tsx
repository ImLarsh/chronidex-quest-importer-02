import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Zap, Sword, Shield, Star, Info } from "lucide-react";

interface Move {
  id: number;
  name: string;
  type: string;
  category: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number;
  pp: number;
  priority: number;
  generation: number;
  description: string;
  effect: string;
  learnedBy: string[];
  flags: string[];
  contestType?: string;
  target: string;
  damageClass: string;
}

const SAMPLE_MOVES: Move[] = [
  {
    id: 1, name: "Pound", type: "normal", category: "physical", power: 40, accuracy: 100, pp: 35, priority: 0,
    generation: 1, description: "The target is physically pounded with a long tail, a foreleg, or the like.",
    effect: "Inflicts regular damage with no additional effect.", learnedBy: ["Kangaskhan", "Jigglypuff", "Wigglytuff"],
    flags: ["contact", "protect"], target: "selected-pokemon", damageClass: "physical", contestType: "tough"
  },
  {
    id: 2, name: "Thunderbolt", type: "electric", category: "special", power: 90, accuracy: 100, pp: 15, priority: 0,
    generation: 1, description: "A strong electric blast crashes down on the target. This may also leave the target with paralysis.",
    effect: "Has a 10% chance to paralyze the target.", learnedBy: ["Pikachu", "Raichu", "Magnemite", "Magneton", "Voltorb", "Electrode"],
    flags: ["protect"], target: "selected-pokemon", damageClass: "special", contestType: "cool"
  },
  {
    id: 3, name: "Flamethrower", type: "fire", category: "special", power: 90, accuracy: 100, pp: 15, priority: 0,
    generation: 1, description: "The target is scorched with an intense blast of fire. This may also leave the target with a burn.",
    effect: "Has a 10% chance to burn the target.", learnedBy: ["Charmander", "Charmeleon", "Charizard", "Vulpix", "Ninetales"],
    flags: ["protect"], target: "selected-pokemon", damageClass: "special", contestType: "beauty"
  },
  {
    id: 4, name: "Surf", type: "water", category: "special", power: 90, accuracy: 100, pp: 15, priority: 0,
    generation: 1, description: "The user attacks everything around it by swamping its surroundings with a giant wave.",
    effect: "Hits all adjacent Pokémon. If the target is using Dive, this move will deal double damage.",
    learnedBy: ["Squirtle", "Wartortle", "Blastoise", "Psyduck", "Golduck", "Poliwag", "Poliwhirl", "Poliwrath"],
    flags: ["protect"], target: "all-adjacent-foes", damageClass: "special", contestType: "beauty"
  },
  {
    id: 5, name: "Earthquake", type: "ground", category: "physical", power: 100, accuracy: 100, pp: 10, priority: 0,
    generation: 1, description: "The user sets off an earthquake that strikes every Pokémon around it.",
    effect: "Hits all adjacent Pokémon. If the target is using Dig, this move will deal double damage.",
    learnedBy: ["Sandshrew", "Sandslash", "Nidoqueen", "Nidoking", "Dugtrio", "Machamp", "Golem", "Onix"],
    flags: ["protect"], target: "all-adjacent-foes", damageClass: "physical", contestType: "tough"
  },
  {
    id: 6, name: "Psychic", type: "psychic", category: "special", power: 90, accuracy: 100, pp: 10, priority: 0,
    generation: 1, description: "The target is hit by a strong telekinetic force. This may also lower the target's Sp. Def stat.",
    effect: "Has a 10% chance to lower the target's Special Defense by one stage.",
    learnedBy: ["Alakazam", "Slowbro", "Slowking", "Drowzee", "Hypno", "Exeggcute", "Exeggutor"],
    flags: ["protect"], target: "selected-pokemon", damageClass: "special", contestType: "smart"
  },
  {
    id: 7, name: "Ice Beam", type: "ice", category: "special", power: 90, accuracy: 100, pp: 10, priority: 0,
    generation: 1, description: "The target is struck with an icy-cold beam of energy. This may also leave the target frozen.",
    effect: "Has a 10% chance to freeze the target.", learnedBy: ["Squirtle", "Wartortle", "Blastoise", "Lapras", "Articuno"],
    flags: ["protect"], target: "selected-pokemon", damageClass: "special", contestType: "beauty"
  },
  {
    id: 8, name: "Swords Dance", type: "normal", category: "status", power: null, accuracy: 101, pp: 20, priority: 0,
    generation: 1, description: "A frenetic dance to uplift the fighting spirit. This sharply raises the user's Attack stat.",
    effect: "Raises the user's Attack by two stages.", learnedBy: ["Scyther", "Scizor", "Farfetch'd", "Kabutops"],
    flags: ["snatch"], target: "user", damageClass: "status", contestType: "beauty"
  },
  {
    id: 9, name: "Thunder Wave", type: "electric", category: "status", power: null, accuracy: 90, pp: 20, priority: 0,
    generation: 1, description: "The user launches a weak jolt of electricity that paralyzes the target.",
    effect: "Paralyzes the target.", learnedBy: ["Pikachu", "Raichu", "Magnemite", "Magneton", "Voltorb", "Electrode"],
    flags: ["protect"], target: "selected-pokemon", damageClass: "status", contestType: "cool"
  },
  {
    id: 10, name: "Dragon Pulse", type: "dragon", category: "special", power: 85, accuracy: 100, pp: 10, priority: 0,
    generation: 4, description: "The target is attacked with a shock wave generated by the user's gaping mouth.",
    effect: "Inflicts regular damage with no additional effect.", learnedBy: ["Dragonite", "Kingdra", "Flygon", "Altaria", "Latios", "Latias"],
    flags: ["protect", "pulse"], target: "selected-pokemon", damageClass: "special", contestType: "smart"
  },
  {
    id: 11, name: "Close Combat", type: "fighting", category: "physical", power: 120, accuracy: 100, pp: 5, priority: 0,
    generation: 4, description: "The user fights the target up close without guarding itself. This also lowers the user's Defense and Sp. Def stats.",
    effect: "Lowers the user's Defense and Special Defense by one stage each.",
    learnedBy: ["Lucario", "Garchomp", "Dialga", "Palkia"], flags: ["contact", "protect"],
    target: "selected-pokemon", damageClass: "physical", contestType: "tough"
  },
  {
    id: 12, name: "Shadow Ball", type: "ghost", category: "special", power: 80, accuracy: 100, pp: 15, priority: 0,
    generation: 2, description: "The user hurls a shadowy blob at the target. This may also lower the target's Sp. Def stat.",
    effect: "Has a 20% chance to lower the target's Special Defense by one stage.",
    learnedBy: ["Gastly", "Haunter", "Gengar", "Misdreavus", "Mismagius"], flags: ["protect", "bullet"],
    target: "selected-pokemon", damageClass: "special", contestType: "smart"
  },
  {
    id: 13, name: "Stealth Rock", type: "rock", category: "status", power: null, accuracy: 101, pp: 20, priority: 0,
    generation: 4, description: "The user lays a trap of levitating stones around the opposing team. The trap hurts opposing Pokémon that switch into battle.",
    effect: "Causes damage to opposing Pokémon that switch in, based on their weakness to Rock-type moves.",
    learnedBy: ["Onix", "Graveler", "Golem", "Forretress", "Skarmory"], flags: ["reflectable"],
    target: "foeside", damageClass: "status", contestType: "cool"
  },
  {
    id: 14, name: "Toxic", type: "poison", category: "status", power: null, accuracy: 90, pp: 10, priority: 0,
    generation: 1, description: "A move that leaves the target badly poisoned. Its poison damage worsens every turn.",
    effect: "Badly poisons the target. Damage increases each turn.", learnedBy: ["Ekans", "Arbok", "Nidoran♀", "Nidorina", "Nidoqueen"],
    flags: ["protect", "reflectable"], target: "selected-pokemon", damageClass: "status", contestType: "smart"
  },
  {
    id: 15, name: "Heal Bell", type: "normal", category: "status", power: null, accuracy: 101, pp: 5, priority: 0,
    generation: 2, description: "The user makes a soothing bell chime to heal the status conditions of all the party Pokémon.",
    effect: "Cures all status conditions of all Pokémon in the user's party.",
    learnedBy: ["Chansey", "Blissey", "Miltank", "Celebi"], flags: ["snatch", "sound"],
    target: "user-and-allies", damageClass: "status", contestType: "beauty"
  },
  {
    id: 16, name: "U-turn", type: "bug", category: "physical", power: 70, accuracy: 100, pp: 20, priority: 0,
    generation: 4, description: "After making its attack, the user rushes back to switch places with a party Pokémon in waiting.",
    effect: "User switches out after dealing damage.", learnedBy: ["Scyther", "Scizor", "Crobat", "Forretress"],
    flags: ["contact", "protect"], target: "selected-pokemon", damageClass: "physical", contestType: "cute"
  },
  {
    id: 17, name: "Bullet Punch", type: "steel", category: "physical", power: 40, accuracy: 100, pp: 30, priority: 1,
    generation: 4, description: "The user strikes the target with tough punches as fast as bullets. This move always goes first.",
    effect: "Always moves first in its priority bracket.", learnedBy: ["Hitmonchan", "Scizor", "Lucario"],
    flags: ["contact", "protect", "punch"], target: "selected-pokemon", damageClass: "physical", contestType: "tough"
  },
  {
    id: 18, name: "Fake Out", type: "normal", category: "physical", power: 40, accuracy: 100, pp: 10, priority: 3,
    generation: 3, description: "An attack that hits first and makes the target flinch. It only works the first turn the user is out.",
    effect: "Always moves first and makes the target flinch. Only usable on the first turn after entering battle.",
    learnedBy: ["Meowth", "Persian", "Kangaskhan", "Spinda"], flags: ["contact", "protect"],
    target: "selected-pokemon", damageClass: "physical", contestType: "cute"
  },
  {
    id: 19, name: "Roost", type: "flying", category: "status", power: null, accuracy: 101, pp: 10, priority: 0,
    generation: 4, description: "The user lands and rests its body. It restores the user's HP by up to half of its max HP.",
    effect: "Restores 50% of the user's maximum HP. User loses Flying type until end of turn if it has one.",
    learnedBy: ["Pidgey", "Pidgeotto", "Pidgeot", "Spearow", "Fearow", "Aerodactyl"], flags: ["snatch", "heal"],
    target: "user", damageClass: "status", contestType: "cool"
  },
  {
    id: 20, name: "Energy Ball", type: "grass", category: "special", power: 90, accuracy: 100, pp: 10, priority: 0,
    generation: 4, description: "The user draws power from nature and fires it at the target. This may also lower the target's Sp. Def stat.",
    effect: "Has a 10% chance to lower the target's Special Defense by one stage.",
    learnedBy: ["Bulbasaur", "Ivysaur", "Venusaur", "Oddish", "Gloom", "Vileplume"], flags: ["protect", "bullet"],
    target: "selected-pokemon", damageClass: "special", contestType: "beauty"
  }
];

const MovesDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGeneration, setSelectedGeneration] = useState("all");
  const [minPower, setMinPower] = useState("");
  const [maxPower, setMaxPower] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const types = [
    "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ];

  const filteredMoves = useMemo(() => {
    let filtered = SAMPLE_MOVES.filter(move => {
      const matchesSearch = searchTerm === '' || 
        move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.learnedBy.some(pokemon => pokemon.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === 'all' || move.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || move.category === selectedCategory;
      const matchesGeneration = selectedGeneration === 'all' || move.generation.toString() === selectedGeneration;
      
      const matchesPowerRange = () => {
        if (move.power === null) return selectedCategory === 'all' || selectedCategory === 'status';
        const min = minPower ? parseInt(minPower) : 0;
        const max = maxPower ? parseInt(maxPower) : 999;
        return move.power >= min && move.power <= max;
      };

      return matchesSearch && matchesType && matchesCategory && matchesGeneration && matchesPowerRange();
    });

    // Sort moves
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'power':
          aValue = a.power ?? -1;
          bValue = b.power ?? -1;
          break;
        case 'accuracy':
          aValue = a.accuracy;
          bValue = b.accuracy;
          break;
        case 'pp':
          aValue = a.pp;
          bValue = b.pp;
          break;
        default:
          aValue = a.id;
          bValue = b.id;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedType, selectedCategory, selectedGeneration, minPower, maxPower, sortBy, sortOrder]);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-400", fire: "bg-red-500", water: "bg-blue-500", electric: "bg-yellow-400",
      grass: "bg-green-500", ice: "bg-blue-200", fighting: "bg-red-700", poison: "bg-purple-500",
      ground: "bg-yellow-600", flying: "bg-indigo-400", psychic: "bg-pink-500", bug: "bg-green-400",
      rock: "bg-yellow-800", ghost: "bg-purple-700", dragon: "bg-indigo-700", dark: "bg-gray-800",
      steel: "bg-gray-500", fairy: "bg-pink-300"
    };
    return colors[type] || "bg-gray-400";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'physical': return <Sword className="h-4 w-4" />;
      case 'special': return <Zap className="h-4 w-4" />;
      case 'status': return <Shield className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'physical': return 'bg-red-100 text-red-800';
      case 'special': return 'bg-blue-100 text-blue-800';
      case 'status': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedGeneration("all");
    setMinPower("");
    setMaxPower("");
    setSortBy("id");
    setSortOrder("asc");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Star className="h-8 w-8" />
            Moves Database
          </h1>
          <p className="text-muted-foreground">
            Comprehensive database of Pokémon moves with detailed information, stats, and filtering options
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
            <TabsTrigger value="browse">Browse Moves</TabsTrigger>
            <TabsTrigger value="stats">Move Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search and Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search moves or Pokémon..."
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
                      {types.map(type => (
                        <SelectItem key={type} value={type} className="capitalize">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="physical">Physical</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedGeneration} onValueChange={setSelectedGeneration}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Generations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Generations</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(gen => (
                        <SelectItem key={gen} value={gen.toString()}>
                          Generation {gen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    placeholder="Min Power"
                    value={minPower}
                    onChange={(e) => setMinPower(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Power"
                    value={maxPower}
                    onChange={(e) => setMaxPower(e.target.value)}
                  />

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="id">ID</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="power">Power</SelectItem>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                      <SelectItem value="pp">PP</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      variant={sortOrder === 'asc' ? 'default' : 'outline'}
                      onClick={() => setSortOrder('asc')}
                      className="flex-1"
                    >
                      Ascending
                    </Button>
                    <Button
                      variant={sortOrder === 'desc' ? 'default' : 'outline'}
                      onClick={() => setSortOrder('desc')}
                      className="flex-1"
                    >
                      Descending
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Found {filteredMoves.length} moves
                  </span>
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            {/* Results Grid */}
            <div className="grid gap-4">
              {filteredMoves.map((move) => (
                <Card key={move.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Move Header */}
                      <div className="lg:w-1/3 space-y-3">
                        <div>
                          <h3 className="text-xl font-bold">{move.name}</h3>
                          <p className="text-sm text-muted-foreground">Move #{move.id}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getTypeColor(move.type)} text-white`}>
                            {move.type}
                          </Badge>
                          <Badge className={getCategoryColor(move.category)}>
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(move.category)}
                              {move.category}
                            </div>
                          </Badge>
                          <Badge variant="outline">Gen {move.generation}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span>Power:</span>
                            <span className="font-medium">{move.power || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Accuracy:</span>
                            <span className="font-medium">{move.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PP:</span>
                            <span className="font-medium">{move.pp}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Priority:</span>
                            <span className="font-medium">{move.priority > 0 ? '+' : ''}{move.priority}</span>
                          </div>
                        </div>
                      </div>

                      {/* Move Details */}
                      <div className="lg:w-2/3 space-y-3">
                        <div>
                          <h4 className="font-semibold mb-1">Description:</h4>
                          <p className="text-sm text-muted-foreground">{move.description}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Effect:</h4>
                          <p className="text-sm text-muted-foreground">{move.effect}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-1">Target:</h4>
                          <p className="text-sm text-muted-foreground capitalize">{move.target.replace(/-/g, ' ')}</p>
                        </div>

                        {move.flags.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-1">Flags:</h4>
                            <div className="flex flex-wrap gap-1">
                              {move.flags.map(flag => (
                                <Badge key={flag} variant="secondary" className="text-xs">
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-1">Learned by:</h4>
                          <div className="flex flex-wrap gap-1">
                            {move.learnedBy.slice(0, 8).map(pokemon => (
                              <Badge key={pokemon} variant="outline" className="text-xs">
                                {pokemon}
                              </Badge>
                            ))}
                            {move.learnedBy.length > 8 && (
                              <Badge variant="outline" className="text-xs">
                                +{move.learnedBy.length - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMoves.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No moves found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to find moves.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            {/* Statistics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Moves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{SAMPLE_MOVES.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Physical Moves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {SAMPLE_MOVES.filter(m => m.category === 'physical').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Special Moves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {SAMPLE_MOVES.filter(m => m.category === 'special').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status Moves</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">
                    {SAMPLE_MOVES.filter(m => m.category === 'status').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Moves by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {types.map(type => {
                    const count = SAMPLE_MOVES.filter(m => m.type === type).length;
                    return (
                      <div key={type} className="text-center">
                        <Badge className={`${getTypeColor(type)} text-white mb-1 w-full justify-center`}>
                          {type}
                        </Badge>
                        <div className="text-sm font-medium">{count}</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Generation Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Moves by Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map(gen => {
                    const count = SAMPLE_MOVES.filter(m => m.generation === gen).length;
                    return (
                      <div key={gen} className="text-center p-3 border rounded">
                        <div className="text-lg font-bold">Gen {gen}</div>
                        <div className="text-sm text-muted-foreground">{count} moves</div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MovesDatabase;