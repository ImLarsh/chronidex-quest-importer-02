import React from 'react';
import { Heart, Sword, Shield, Zap, Gauge, BarChart3, Circle, User, Calendar, Music, Shuffle, Gamepad2 } from 'lucide-react';

// Pokemon-themed icon components using Lucide icons as fallbacks
export const PokemonHeart = ({ className }: { className?: string }) => (
  <Heart className={className} />
);

export const PokemonFight = ({ className }: { className?: string }) => (
  <Sword className={className} />
);

export const PokemonDefense = ({ className }: { className?: string }) => (
  <Shield className={className} />
);

export const PokemonSpecial = ({ className }: { className?: string }) => (
  <Zap className={className} />
);

export const PokemonSpeed = ({ className }: { className?: string }) => (
  <Gauge className={className} />
);

export const PokemonStats = ({ className }: { className?: string }) => (
  <BarChart3 className={className} />
);

export const Pokeball = ({ className }: { className?: string }) => (
  <Circle className={className} />
);

export const Pikachu = ({ className }: { className?: string }) => (
  <User className={className} />
);

export const PokemonCalendar = ({ className }: { className?: string }) => (
  <Calendar className={className} />
);

export const PokemonMusic = ({ className }: { className?: string }) => (
  <Music className={className} />
);

export const PokemonShuffle = ({ className }: { className?: string }) => (
  <Shuffle className={className} />
);

export const PokemonBattle = ({ className }: { className?: string }) => (
  <Gamepad2 className={className} />
);

// Icon mapping for stats
export const getPokemonStatIcon = (statName: string) => {
  switch (statName) {
    case 'hp':
      return PokemonHeart;
    case 'attack':
      return PokemonFight;
    case 'defense':
      return PokemonDefense;
    case 'special-attack':
      return PokemonSpecial;
    case 'special-defense':
      return PokemonDefense;
    case 'speed':
      return PokemonSpeed;
    default:
      return PokemonStats;
  }
};