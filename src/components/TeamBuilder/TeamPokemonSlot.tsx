import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TeamPokemon, TYPE_COLORS } from "@/types/pokemon";
import { X, Users, GripVertical, Edit, Sparkles } from "lucide-react";

interface TeamPokemonSlotProps {
  teamPokemon: TeamPokemon | null;
  slotIndex: number;
  onRemove: () => void;
  onEdit: () => void;
  onAddPokemon: () => void;
  isDragDisabled?: boolean;
}

export const TeamPokemonSlot: React.FC<TeamPokemonSlotProps> = ({
  teamPokemon,
  slotIndex,
  onRemove,
  onEdit,
  onAddPokemon,
  isDragDisabled = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `slot-${slotIndex}`,
    disabled: isDragDisabled || !teamPokemon,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (!teamPokemon) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="h-56 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-all duration-300 group"
        onClick={onAddPokemon}
      >
        <CardContent className="flex flex-col items-center justify-center h-full p-4">
          <div className="text-center text-muted-foreground group-hover:text-foreground transition-colors">
            <Users className="h-12 w-12 mx-auto mb-3" />
            <p className="font-medium">Add Pokémon</p>
            <p className="text-xs mt-1">Slot {slotIndex + 1}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pokemon = teamPokemon.pokemon;
  const spriteUrl = teamPokemon.isShiny
    ? pokemon.sprites.other['official-artwork']?.front_shiny || pokemon.sprites.front_shiny
    : pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="h-56 relative group transition-all duration-300 hover:shadow-lg card-organic"
      {...attributes}
    >
      {/* Drag Handle */}
      {!isDragDisabled && (
        <div
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          {...listeners}
        >
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Shiny Indicator */}
      {teamPokemon.isShiny && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </div>
      )}

      <CardContent className="p-4 text-center h-full flex flex-col justify-between">
        <div className="pokemon-3d-container">
          <img
            src={spriteUrl}
            alt={teamPokemon.nickname || pokemon.name}
            className="w-20 h-20 mx-auto mb-2 pokemon-3d-image"
          />
        </div>

        <div className="space-y-2">
          <div>
            <h4 className="font-semibold capitalize text-sm truncate">
              {teamPokemon.nickname || pokemon.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              #{pokemon.id} • Lv.{teamPokemon.level}
            </p>
          </div>

          {/* Types */}
          <div className="flex justify-center gap-1 flex-wrap">
            {pokemon.types.map((type) => (
              <Badge
                key={type.type.name}
                className={`text-white text-xs bg-gradient-to-r ${TYPE_COLORS[type.type.name]}`}
              >
                {type.type.name}
              </Badge>
            ))}
          </div>

          {/* Nature & Ability */}
          <div className="text-xs space-y-1">
            <p className="text-muted-foreground">
              <span className="font-medium">{teamPokemon.nature}</span> nature
            </p>
            <p className="text-muted-foreground truncate">
              {teamPokemon.ability}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};