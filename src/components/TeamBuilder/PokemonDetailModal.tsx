import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { TeamPokemon, NATURES, TYPE_COLORS } from "@/types/pokemon";
import { getDefensiveTypeAnalysis } from "@/utils/typeEffectiveness";

interface PokemonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamPokemon: TeamPokemon | null;
  onSave: (teamPokemon: TeamPokemon) => void;
}

export const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({
  isOpen,
  onClose,
  teamPokemon,
  onSave,
}) => {
  const [editedPokemon, setEditedPokemon] = useState<TeamPokemon | null>(teamPokemon);

  React.useEffect(() => {
    setEditedPokemon(teamPokemon);
  }, [teamPokemon]);

  if (!editedPokemon) return null;

  const pokemon = editedPokemon.pokemon;
  const typeAnalysis = getDefensiveTypeAnalysis(pokemon.types.map(t => t.type.name));

  const handleSave = () => {
    if (editedPokemon) {
      onSave(editedPokemon);
      onClose();
    }
  };

  const updateEV = (stat: keyof typeof editedPokemon.evs, value: number) => {
    const totalEVs = Object.values(editedPokemon.evs).reduce((sum, ev) => sum + ev, 0) - editedPokemon.evs[stat];
    const maxEV = Math.min(252, 508 - totalEVs);
    const newValue = Math.max(0, Math.min(maxEV, value));
    
    setEditedPokemon(prev => prev ? {
      ...prev,
      evs: { ...prev.evs, [stat]: newValue }
    } : null);
  };

  const updateIV = (stat: keyof typeof editedPokemon.ivs, value: number) => {
    setEditedPokemon(prev => prev ? {
      ...prev,
      ivs: { ...prev.ivs, [stat]: Math.max(0, Math.min(31, value)) }
    } : null);
  };

  const getTotalEVs = () => Object.values(editedPokemon.evs).reduce((sum, ev) => sum + ev, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img 
              src={editedPokemon.isShiny 
                ? pokemon.sprites.other['official-artwork']?.front_shiny || pokemon.sprites.front_shiny 
                : pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default
              }
              alt={pokemon.name}
              className="w-16 h-16"
            />
            <div>
              <h3 className="text-xl font-bold capitalize">{editedPokemon.nickname || pokemon.name}</h3>
              <p className="text-muted-foreground">#{pokemon.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stats">Stats & EVs</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Nickname</Label>
                    <Input
                      value={editedPokemon.nickname || ""}
                      onChange={(e) => setEditedPokemon(prev => prev ? { ...prev, nickname: e.target.value } : null)}
                      placeholder={pokemon.name}
                    />
                  </div>
                  <div>
                    <Label>Level</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={editedPokemon.level}
                      onChange={(e) => setEditedPokemon(prev => prev ? { ...prev, level: parseInt(e.target.value) || 1 } : null)}
                    />
                  </div>
                  <div>
                    <Label>Nature</Label>
                    <Select 
                      value={editedPokemon.nature}
                      onValueChange={(value) => setEditedPokemon(prev => prev ? { ...prev, nature: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {NATURES.map(nature => (
                          <SelectItem key={nature} value={nature}>{nature}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editedPokemon.isShiny}
                      onCheckedChange={(checked) => setEditedPokemon(prev => prev ? { ...prev, isShiny: checked } : null)}
                    />
                    <Label>Shiny</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ability & Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Ability</Label>
                    <Select 
                      value={editedPokemon.ability}
                      onValueChange={(value) => setEditedPokemon(prev => prev ? { ...prev, ability: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pokemon.abilities.map(ability => (
                          <SelectItem key={ability.ability.name} value={ability.ability.name}>
                            {ability.ability.name} {ability.is_hidden && "(Hidden)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Held Item</Label>
                    <Input
                      value={editedPokemon.heldItem || ""}
                      onChange={(e) => setEditedPokemon(prev => prev ? { ...prev, heldItem: e.target.value } : null)}
                      placeholder="Enter held item..."
                    />
                  </div>
                  <div>
                    <Label>Types</Label>
                    <div className="flex gap-2">
                      {pokemon.types.map(type => (
                        <Badge 
                          key={type.type.name}
                          className={`bg-gradient-to-r ${TYPE_COLORS[type.type.name]} text-white`}
                        >
                          {type.type.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Base Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pokemon.stats.map(stat => (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{stat.stat.name.replace('-', ' ')}</span>
                          <span className="font-medium">{stat.base_stat}</span>
                        </div>
                        <Progress value={(stat.base_stat / 255) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>EVs (Total: {getTotalEVs()}/508)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(editedPokemon.evs).map(([stat, value]) => (
                      <div key={stat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{value}</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="252"
                          value={value}
                          onChange={(e) => updateEV(stat as keyof typeof editedPokemon.evs, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>IVs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(editedPokemon.ivs).map(([stat, value]) => (
                      <div key={stat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1')}</span>
                          <span>{value}</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          max="31"
                          value={value}
                          onChange={(e) => updateIV(stat as keyof typeof editedPokemon.ivs, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="moves" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moveset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[0, 1, 2, 3].map(index => (
                  <div key={index}>
                    <Label>Move {index + 1}</Label>
                    <Select
                      value={editedPokemon.moves[index] || ""}
                      onValueChange={(value) => {
                        const newMoves = [...editedPokemon.moves];
                        newMoves[index] = value;
                        setEditedPokemon(prev => prev ? { ...prev, moves: newMoves } : null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a move..." />
                      </SelectTrigger>
                      <SelectContent>
                        {pokemon.moves.slice(0, 20).map(move => (
                          <SelectItem key={move.move.name} value={move.move.name}>
                            {move.move.name.replace('-', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typeAnalysis.weaknesses.map(type => (
                      <Badge 
                        key={type}
                        variant="destructive"
                        className={`bg-gradient-to-r ${TYPE_COLORS[type]}`}
                      >
                        {type}
                      </Badge>
                    ))}
                    {typeAnalysis.weaknesses.length === 0 && (
                      <p className="text-muted-foreground text-sm">No weaknesses</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resistances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typeAnalysis.resistances.map(type => (
                      <Badge 
                        key={type}
                        variant="secondary"
                        className={`bg-gradient-to-r ${TYPE_COLORS[type]}`}
                      >
                        {type}
                      </Badge>
                    ))}
                    {typeAnalysis.resistances.length === 0 && (
                      <p className="text-muted-foreground text-sm">No resistances</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Immunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {typeAnalysis.immunities.map(type => (
                      <Badge 
                        key={type}
                        className={`bg-gradient-to-r ${TYPE_COLORS[type]} text-white`}
                      >
                        {type}
                      </Badge>
                    ))}
                    {typeAnalysis.immunities.length === 0 && (
                      <p className="text-muted-foreground text-sm">No immunities</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};