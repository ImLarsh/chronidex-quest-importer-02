import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Team, TYPE_COLORS } from "@/types/pokemon";
import { getTeamTypeAnalysis } from "@/utils/typeEffectiveness";

interface TeamAnalysisProps {
  team: Team;
}

export const TeamAnalysis: React.FC<TeamAnalysisProps> = ({ team }) => {
  const validPokemon = team.pokemon.filter(slot => slot !== null);
  
  if (validPokemon.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Add Pokémon to see team analysis</p>
        </CardContent>
      </Card>
    );
  }

  const teamTypes = validPokemon.map(pokemon => 
    pokemon!.pokemon.types.map(t => t.type.name)
  );
  
  const typeAnalysis = getTeamTypeAnalysis(teamTypes);
  
  // Type distribution
  const typeCount: Record<string, number> = {};
  validPokemon.forEach(pokemon => {
    pokemon!.pokemon.types.forEach(type => {
      typeCount[type.type.name] = (typeCount[type.type.name] || 0) + 1;
    });
  });

  // Average stats calculation
  const statTotals = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };

  validPokemon.forEach(teamPokemon => {
    const stats = teamPokemon!.pokemon.stats;
    statTotals.hp += stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
    statTotals.attack += stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
    statTotals.defense += stats.find(s => s.stat.name === 'defense')?.base_stat || 0;
    statTotals.specialAttack += stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0;
    statTotals.specialDefense += stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0;
    statTotals.speed += stats.find(s => s.stat.name === 'speed')?.base_stat || 0;
  });

  const averageStats = {
    hp: Math.round(statTotals.hp / validPokemon.length),
    attack: Math.round(statTotals.attack / validPokemon.length),
    defense: Math.round(statTotals.defense / validPokemon.length),
    specialAttack: Math.round(statTotals.specialAttack / validPokemon.length),
    specialDefense: Math.round(statTotals.specialDefense / validPokemon.length),
    speed: Math.round(statTotals.speed / validPokemon.length),
  };

  const statChartData = [
    { stat: 'HP', value: averageStats.hp, fullMark: 150 },
    { stat: 'ATK', value: averageStats.attack, fullMark: 150 },
    { stat: 'DEF', value: averageStats.defense, fullMark: 150 },
    { stat: 'SpA', value: averageStats.specialAttack, fullMark: 150 },
    { stat: 'SpD', value: averageStats.specialDefense, fullMark: 150 },
    { stat: 'SPD', value: averageStats.speed, fullMark: 150 },
  ];

  const typeChartData = Object.entries(typeCount)
    .sort(([,a], [,b]) => b - a)
    .map(([type, count]) => ({ type, count }));

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{validPokemon.length}/6</div>
            <Progress value={(validPokemon.length / 6) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Unique Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(typeCount).length}</div>
            <p className="text-sm text-muted-foreground mt-1">Different type combinations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(validPokemon.reduce((sum, p) => sum + p!.level, 0) / validPokemon.length)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {typeChartData.map(({ type, count }) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={`bg-gradient-to-r ${TYPE_COLORS[type]} text-white`}>
                      {type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{count}</span>
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${(count / validPokemon.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Weaknesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(typeAnalysis.teamWeaknesses)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 6)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Badge 
                      variant="destructive" 
                      className={`bg-gradient-to-r ${TYPE_COLORS[type]}`}
                    >
                      {type}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{count} vulnerable</span>
                      <Progress 
                        value={(count / validPokemon.length) * 100} 
                        className="w-16 h-2"
                      />
                    </div>
                  </div>
                ))}
              {Object.keys(typeAnalysis.teamWeaknesses).length === 0 && (
                <p className="text-muted-foreground text-sm">No major weaknesses detected</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stat Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Base Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stat" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={statChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="stat" />
                <PolarRadiusAxis angle={90} domain={[0, 150]} />
                <Radar
                  name="Average Stats"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Type Coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Offensive Type Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(typeAnalysis.typeCoverage).map(([type, effectiveness]) => (
              <div key={type} className="text-center">
                <Badge 
                  className={`w-full bg-gradient-to-r ${TYPE_COLORS[type]} text-white mb-1`}
                >
                  {type}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {effectiveness}x
                </div>
              </div>
            ))}
          </div>
          {Object.keys(typeAnalysis.typeCoverage).length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-4">
              No super effective coverage detected
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};