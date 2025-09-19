import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Trophy, 
  Clock, 
  Star, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  XCircle, 
  Target,
  Zap,
  Heart,
  Shield
} from "lucide-react";
import { usePokemon } from "@/hooks/usePokemon";

interface QuizQuestion {
  id: number;
  type: 'name' | 'type' | 'generation' | 'evolution' | 'stats' | 'silhouette';
  question: string;
  options: string[];
  correctAnswer: string;
  pokemon: any;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizStats {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  streak: number;
  bestStreak: number;
}

const PokemonQuiz = () => {
  const { pokemon, loading } = usePokemon();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState<QuizStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    timeSpent: 0,
    streak: 0,
    bestStreak: 0
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizMode, setQuizMode] = useState<'endless' | 'timed' | 'challenge'>('endless');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [questionTypes, setQuestionTypes] = useState<string[]>(['name', 'type', 'generation']);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(10);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResult && quizMode === 'timed') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer('', true); // Time out
    }
  }, [timeLeft, showResult, quizStarted, quizMode]);

  const getRandomPokemon = () => {
    if (pokemon.length === 0) return null;
    return pokemon[Math.floor(Math.random() * pokemon.length)];
  };

  const generateQuestion = useCallback((): QuizQuestion | null => {
    const selectedPokemon = getRandomPokemon();
    if (!selectedPokemon) return null;

    const availableTypes = difficulty === 'all' ? questionTypes : 
                          questionTypes.filter(type => {
                            if (difficulty === 'easy') return ['name', 'type'].includes(type);
                            if (difficulty === 'medium') return ['name', 'type', 'generation'].includes(type);
                            return true; // hard includes all
                          });

    const questionType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    let question: QuizQuestion;
    
    switch (questionType) {
      case 'name':
        question = generateNameQuestion(selectedPokemon);
        break;
      case 'type':
        question = generateTypeQuestion(selectedPokemon);
        break;
      case 'generation':
        question = generateGenerationQuestion(selectedPokemon);
        break;
      case 'evolution':
        question = generateEvolutionQuestion(selectedPokemon);
        break;
      case 'stats':
        question = generateStatsQuestion(selectedPokemon);
        break;
      case 'silhouette':
        question = generateSilhouetteQuestion(selectedPokemon);
        break;
      default:
        question = generateNameQuestion(selectedPokemon);
    }
    
    return question;
  }, [pokemon, difficulty, questionTypes]);

  const generateNameQuestion = (correctPokemon: any): QuizQuestion => {
    const options = [correctPokemon.name];
    while (options.length < 4) {
      const randomPokemon = getRandomPokemon();
      if (randomPokemon && !options.includes(randomPokemon.name)) {
        options.push(randomPokemon.name);
      }
    }
    
    return {
      id: Date.now(),
      type: 'name',
      question: "What is the name of this Pokémon?",
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer: correctPokemon.name,
      pokemon: correctPokemon,
      difficulty: 'easy',
      explanation: `This is ${correctPokemon.name}, a ${correctPokemon.types.map((t: any) => t.type.name).join('/')}-type Pokémon.`
    };
  };

  const generateTypeQuestion = (correctPokemon: any): QuizQuestion => {
    const correctTypes = correctPokemon.types.map((t: any) => t.type.name).sort().join('/');
    const options = [correctTypes];
    
    const allTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
                     "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];
    
    while (options.length < 4) {
      const randomType = correctPokemon.types.length === 1 ? 
        allTypes[Math.floor(Math.random() * allTypes.length)] :
        `${allTypes[Math.floor(Math.random() * allTypes.length)]}/${allTypes[Math.floor(Math.random() * allTypes.length)]}`;
      
      if (!options.includes(randomType)) {
        options.push(randomType);
      }
    }
    
    return {
      id: Date.now(),
      type: 'type',
      question: `What type is ${correctPokemon.name}?`,
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer: correctTypes,
      pokemon: correctPokemon,
      difficulty: 'medium',
      explanation: `${correctPokemon.name} is a ${correctTypes}-type Pokémon.`
    };
  };

  const generateGenerationQuestion = (correctPokemon: any): QuizQuestion => {
    const getGeneration = (id: number): number => {
      if (id <= 151) return 1;
      if (id <= 251) return 2;
      if (id <= 386) return 3;
      if (id <= 493) return 4;
      if (id <= 649) return 5;
      if (id <= 721) return 6;
      if (id <= 809) return 7;
      if (id <= 905) return 8;
      return 9;
    };

    const correctGeneration = getGeneration(correctPokemon.id);
    const options = [correctGeneration.toString()];
    
    while (options.length < 4) {
      const randomGen = Math.floor(Math.random() * 9) + 1;
      if (!options.includes(randomGen.toString())) {
        options.push(randomGen.toString());
      }
    }
    
    return {
      id: Date.now(),
      type: 'generation',
      question: `Which generation is ${correctPokemon.name} from?`,
      options: options.sort(() => Math.random() - 0.5).map(opt => `Generation ${opt}`),
      correctAnswer: `Generation ${correctGeneration}`,
      pokemon: correctPokemon,
      difficulty: 'medium',
      explanation: `${correctPokemon.name} is from Generation ${correctGeneration}.`
    };
  };

  const generateEvolutionQuestion = (correctPokemon: any): QuizQuestion => {
    // Simplified evolution question
    const evolutionFamilies: { [key: string]: string[] } = {
      'bulbasaur': ['bulbasaur', 'ivysaur', 'venusaur'],
      'charmander': ['charmander', 'charmeleon', 'charizard'],
      'squirtle': ['squirtle', 'wartortle', 'blastoise'],
      'caterpie': ['caterpie', 'metapod', 'butterfree'],
      'pidgey': ['pidgey', 'pidgeotto', 'pidgeot']
    };

    const pokemonName = correctPokemon.name.toLowerCase();
    const family = Object.values(evolutionFamilies).find(family => family.includes(pokemonName));
    
    if (!family) {
      // Fallback to name question if no evolution family found
      return generateNameQuestion(correctPokemon);
    }

    const correctAnswer = family.includes(pokemonName) ? 'Yes' : 'No';
    const randomFamily = Object.values(evolutionFamilies)[Math.floor(Math.random() * Object.values(evolutionFamilies).length)];
    const randomPokemon = randomFamily[Math.floor(Math.random() * randomFamily.length)];

    return {
      id: Date.now(),
      type: 'evolution',
      question: `Does ${correctPokemon.name} evolve into or from ${randomPokemon}?`,
      options: ['Yes', 'No'],
      correctAnswer,
      pokemon: correctPokemon,
      difficulty: 'hard',
      explanation: `Evolution relationships can be tricky to remember!`
    };
  };

  const generateStatsQuestion = (correctPokemon: any): QuizQuestion => {
    const stats = ['HP', 'Attack', 'Defense', 'Speed'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];
    const options = ['Very Low (1-50)', 'Low (51-80)', 'Medium (81-100)', 'High (101-120)', 'Very High (121+)'];
    
    // Simplified stat calculation for demo
    const baseStatValue = Math.floor(Math.random() * 120) + 30;
    const correctRange = baseStatValue <= 50 ? 'Very Low (1-50)' :
                        baseStatValue <= 80 ? 'Low (51-80)' :
                        baseStatValue <= 100 ? 'Medium (81-100)' :
                        baseStatValue <= 120 ? 'High (101-120)' : 'Very High (121+)';

    return {
      id: Date.now(),
      type: 'stats',
      question: `How would you rate ${correctPokemon.name}'s base ${randomStat} stat?`,
      options,
      correctAnswer: correctRange,
      pokemon: correctPokemon,
      difficulty: 'hard',
      explanation: `${correctPokemon.name}'s base ${randomStat} stat falls in the ${correctRange} range.`
    };
  };

  const generateSilhouetteQuestion = (correctPokemon: any): QuizQuestion => {
    const options = [correctPokemon.name];
    while (options.length < 4) {
      const randomPokemon = getRandomPokemon();
      if (randomPokemon && !options.includes(randomPokemon.name)) {
        options.push(randomPokemon.name);
      }
    }
    
    return {
      id: Date.now(),
      type: 'silhouette',
      question: "Can you identify this Pokémon from its silhouette?",
      options: options.sort(() => Math.random() - 0.5),
      correctAnswer: correctPokemon.name,
      pokemon: correctPokemon,
      difficulty: 'hard',
      explanation: `This silhouette belongs to ${correctPokemon.name}!`
    };
  };

  const startQuiz = () => {
    if (pokemon.length === 0) return;
    
    setQuizStarted(true);
    setQuizEnded(false);
    setQuestionNumber(1);
    setStats(prev => ({ ...prev, totalQuestions: 0, correctAnswers: 0, streak: 0, timeSpent: 0 }));
    setGameStartTime(Date.now());
    generateNewQuestion();
  };

  const generateNewQuestion = () => {
    const question = generateQuestion();
    if (question) {
      setCurrentQuestion(question);
      setSelectedAnswer("");
      setShowResult(false);
      setTimeLeft(quizMode === 'timed' ? 30 : 0);
    }
  };

  const handleAnswer = (answer: string, isTimeout: boolean = false) => {
    if (showResult) return;
    
    const correct = !isTimeout && answer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    setStats(prev => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      streak: correct ? prev.streak + 1 : 0,
      bestStreak: correct && prev.streak + 1 > prev.bestStreak ? prev.streak + 1 : prev.bestStreak,
      timeSpent: Math.floor((Date.now() - gameStartTime) / 1000)
    }));

    // Auto-advance after showing result
    setTimeout(() => {
      if (quizMode === 'challenge' && questionNumber >= totalQuestions) {
        endQuiz();
      } else {
        setQuestionNumber(prev => prev + 1);
        generateNewQuestion();
      }
    }, 2000);
  };

  const endQuiz = () => {
    setQuizEnded(true);
    setQuizStarted(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizEnded(false);
    setCurrentQuestion(null);
    setQuestionNumber(1);
    setSelectedAnswer("");
    setShowResult(false);
    setTimeLeft(30);
    setStats({
      totalQuestions: 0,
      correctAnswers: 0,
      timeSpent: 0,
      streak: 0,
      bestStreak: 0
    });
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading Pokémon data...</p>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    const accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0;
    
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl flex items-center justify-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
                Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.bestStreak}</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.timeSpent}s</div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Performance Rating</h3>
                {accuracy >= 90 && <Badge className="bg-yellow-500 text-white">🏆 Master Trainer</Badge>}
                {accuracy >= 80 && accuracy < 90 && <Badge className="bg-blue-500 text-white">🥇 Expert</Badge>}
                {accuracy >= 70 && accuracy < 80 && <Badge className="bg-green-500 text-white">🥈 Skilled</Badge>}
                {accuracy >= 60 && accuracy < 70 && <Badge className="bg-orange-500 text-white">🥉 Novice</Badge>}
                {accuracy < 60 && <Badge className="bg-gray-500 text-white">📚 Keep Learning</Badge>}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetQuiz} size="lg">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Brain className="h-8 w-8" />
              Pokémon Quiz
            </h1>
            <p className="text-muted-foreground">
              Test your Pokémon knowledge with our comprehensive quiz system
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Quiz Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quiz Mode</label>
                  <Select value={quizMode} onValueChange={(value: any) => setQuizMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="endless">Endless Mode</SelectItem>
                      <SelectItem value="timed">Timed Mode (30s per question)</SelectItem>
                      <SelectItem value="challenge">Challenge Mode (10 questions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy (Name, Type)</SelectItem>
                      <SelectItem value="medium">Medium (+Generation)</SelectItem>
                      <SelectItem value="hard">Hard (All Types)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Question Types</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'name', label: 'Name', icon: <Target className="h-4 w-4" /> },
                      { key: 'type', label: 'Type', icon: <Zap className="h-4 w-4" /> },
                      { key: 'generation', label: 'Generation', icon: <Star className="h-4 w-4" /> },
                      { key: 'stats', label: 'Stats', icon: <Shield className="h-4 w-4" /> },
                    ].map(({ key, label, icon }) => (
                      <Button
                        key={key}
                        variant={questionTypes.includes(key) ? "default" : "outline"}
                        onClick={() => {
                          if (questionTypes.includes(key)) {
                            setQuestionTypes(prev => prev.filter(t => t !== key));
                          } else {
                            setQuestionTypes(prev => [...prev, key]);
                          }
                        }}
                        className="justify-start gap-2"
                        size="sm"
                      >
                        {icon}
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>

                {quizMode === 'challenge' && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Number of Questions</label>
                    <Input
                      type="number"
                      min="5"
                      max="50"
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(parseInt(e.target.value) || 10)}
                    />
                  </div>
                )}

                <Button 
                  onClick={startQuiz} 
                  size="lg" 
                  className="w-full"
                  disabled={questionTypes.length === 0}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Stats Display */}
            <Card>
              <CardHeader>
                <CardTitle>Quiz Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">Total Correct</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.totalQuestions > 0 ? ((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.bestStreak}</div>
                    <div className="text-sm text-muted-foreground">Best Streak</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{stats.totalQuestions}</div>
                    <div className="text-sm text-muted-foreground">Questions Asked</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Quick Facts</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• {pokemon.length} Pokémon available in database</p>
                    <p>• Multiple question types and difficulties</p>
                    <p>• Real-time scoring and statistics</p>
                    <p>• Endless, timed, and challenge modes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Question {questionNumber}
              {quizMode === 'challenge' && ` of ${totalQuestions}`}
            </h1>
            <div className="flex items-center gap-4">
              {quizMode === 'timed' && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className={`font-mono ${timeLeft <= 10 ? 'text-red-600' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <Button onClick={resetQuiz} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          {quizMode === 'challenge' && (
            <Progress value={(questionNumber / totalQuestions) * 100} className="mb-4" />
          )}

          {/* Current Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{stats.correctAnswers} correct</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>{stats.totalQuestions - stats.correctAnswers} wrong</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Streak: {stats.streak}</span>
            </div>
            {stats.totalQuestions > 0 && (
              <div className="flex items-center gap-1">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span>{((stats.correctAnswers / stats.totalQuestions) * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>

        {currentQuestion && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardContent className="p-6">
                {/* Question Content */}
                <div className="text-center mb-6">
                  <div className="mb-4">
                    <Badge className="mb-2" variant="secondary">
                      {currentQuestion.type.charAt(0).toUpperCase() + currentQuestion.type.slice(1)} Question
                    </Badge>
                    <h2 className="text-2xl font-bold">{currentQuestion.question}</h2>
                  </div>
                  
                  {/* Pokemon Image */}
                  {currentQuestion.pokemon && (
                    <div className="mb-6">
                      <img
                        src={currentQuestion.type === 'silhouette' 
                          ? `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="black"/></svg>`)}`
                          : currentQuestion.pokemon.sprites.other?.['official-artwork']?.front_default || 
                            currentQuestion.pokemon.sprites.front_default
                        }
                        alt={currentQuestion.type === 'name' ? "Mystery Pokémon" : currentQuestion.pokemon.name}
                        className={`w-48 h-48 mx-auto object-contain ${currentQuestion.type === 'silhouette' ? 'filter brightness-0' : ''}`}
                      />
                      {currentQuestion.type !== 'name' && currentQuestion.type !== 'silhouette' && (
                        <div className="mt-2 flex justify-center gap-1">
                          {currentQuestion.pokemon.types.map((type: any) => (
                            <Badge 
                              key={type.type.name} 
                              className={`${getTypeColor(type.type.name)} text-white text-xs`}
                            >
                              {type.type.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Answer Options */}
                {!showResult && (
                  <div className="grid gap-3 max-w-2xl mx-auto">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="p-4 h-auto text-left justify-start"
                        onClick={() => {
                          setSelectedAnswer(option);
                          handleAnswer(option);
                        }}
                        disabled={showResult}
                      >
                        <span className="font-medium mr-2 bg-muted px-2 py-1 rounded">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="capitalize">{option}</span>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Result Display */}
                {showResult && (
                  <div className="text-center space-y-4">
                    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      <div className={`text-2xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                      </div>
                      <div className="mt-2 text-lg">
                        The correct answer is: <strong className="capitalize">{currentQuestion.correctAnswer}</strong>
                      </div>
                      {currentQuestion.explanation && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          {currentQuestion.explanation}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {quizMode === 'challenge' && questionNumber >= totalQuestions
                        ? "Quiz completed! Calculating results..."
                        : "Loading next question..."
                      }
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonQuiz;