import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Team } from "@/types/pokemon";
import { Plus, MoreHorizontal, Edit, Trash2, Copy, Download, Upload, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamManagerProps {
  teams: Team[];
  currentTeam: Team | null;
  onTeamSelect: (team: Team) => void;
  onTeamCreate: (name: string, description?: string) => void;
  onTeamUpdate: (team: Team) => void;
  onTeamDelete: (teamId: string) => void;
  onTeamDuplicate: (teamId: string) => void;
  onTeamExport: (teamId: string) => void;
  onTeamImport: (teamData: string) => void;
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  currentTeam,
  onTeamSelect,
  onTeamCreate,
  onTeamUpdate,
  onTeamDelete,
  onTeamDuplicate,
  onTeamExport,
  onTeamImport,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [importData, setImportData] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const { toast } = useToast();

  const handleCreateTeam = () => {
    if (newTeamName.trim()) {
      onTeamCreate(newTeamName.trim(), newTeamDescription.trim() || undefined);
      setNewTeamName("");
      setNewTeamDescription("");
      setIsCreateModalOpen(false);
      toast({
        title: "Team created",
        description: `"${newTeamName}" has been created successfully.`,
      });
    }
  };

  const handleUpdateTeam = () => {
    if (editingTeam && editingTeam.name.trim()) {
      onTeamUpdate(editingTeam);
      setEditingTeam(null);
      toast({
        title: "Team updated",
        description: `"${editingTeam.name}" has been updated successfully.`,
      });
    }
  };

  const handleDeleteTeam = (team: Team) => {
    if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
      onTeamDelete(team.id);
      toast({
        title: "Team deleted",
        description: `"${team.name}" has been deleted.`,
        variant: "destructive",
      });
    }
  };

  const handleDuplicateTeam = (team: Team) => {
    onTeamDuplicate(team.id);
    toast({
      title: "Team duplicated",
      description: `"${team.name}" has been duplicated.`,
    });
  };

  const handleExportTeam = (team: Team) => {
    onTeamExport(team.id);
    toast({
      title: "Team exported",
      description: "Team data copied to clipboard.",
    });
  };

  const handleImportTeam = () => {
    if (importData.trim()) {
      try {
        onTeamImport(importData.trim());
        setImportData("");
        setIsImportModalOpen(false);
        toast({
          title: "Team imported",
          description: "Team has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid team data. Please check the format.",
          variant: "destructive",
        });
      }
    }
  };

  const getTeamPokemonCount = (team: Team) => {
    return team.pokemon.filter(slot => slot !== null).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Manager</h2>
          <p className="text-muted-foreground">Create and manage your Pokémon teams</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Team Data (JSON)</Label>
                  <Textarea
                    placeholder="Paste team JSON data here..."
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    rows={10}
                  />
                </div>
                <Button onClick={handleImportTeam} className="w-full">
                  Import Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Team Name</Label>
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team name..."
                  />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={newTeamDescription}
                    onChange={(e) => setNewTeamDescription(e.target.value)}
                    placeholder="Enter team description..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateTeam} className="w-full">
                  Create Team
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card 
            key={team.id}
            className={`cursor-pointer transition-all duration-200 card-organic ${
              currentTeam?.id === team.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onTeamSelect(team)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{team.name}</CardTitle>
                  {team.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {team.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setEditingTeam(team);
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateTeam(team);
                    }}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleExportTeam(team);
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Pokemon Preview */}
                <div className="flex gap-1 overflow-hidden">
                  {team.pokemon.slice(0, 6).map((slot, index) => (
                    <div key={index} className="w-8 h-8 flex-shrink-0">
                      {slot ? (
                        <img
                          src={slot.isShiny 
                            ? slot.pokemon.sprites.front_shiny || slot.pokemon.sprites.front_default
                            : slot.pokemon.sprites.front_default
                          }
                          alt={slot.nickname || slot.pokemon.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Team Stats */}
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">
                    {getTeamPokemonCount(team)}/6 Pokémon
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {team.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {teams.length === 0 && (
          <Card className="col-span-full border-2 border-dashed border-muted-foreground/25">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No teams created yet</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Team
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Team Dialog */}
      <Dialog open={editingTeam !== null} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          {editingTeam && (
            <div className="space-y-4">
              <div>
                <Label>Team Name</Label>
                <Input
                  value={editingTeam.name}
                  onChange={(e) => setEditingTeam({
                    ...editingTeam,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingTeam.description || ""}
                  onChange={(e) => setEditingTeam({
                    ...editingTeam,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <Button onClick={handleUpdateTeam} className="w-full">
                Update Team
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};