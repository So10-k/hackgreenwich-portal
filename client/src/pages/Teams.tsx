import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Teams() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [projectIdea, setProjectIdea] = useState("");
  const [maxMembers, setMaxMembers] = useState("4");

  const { data: myTeam } = trpc.teams.getMyTeam.useQuery();
  const { data: allTeams, isLoading } = trpc.teams.list.useQuery();
  const { data: invitations } = trpc.teams.getInvitations.useQuery();

  const createTeam = trpc.teams.create.useMutation({
    onSuccess: () => {
      toast.success("Team created!");
      setTeamName("");
      setTeamDescription("");
      setProjectIdea("");
      setMaxMembers("4");
      setShowCreateForm(false);
    },
    onError: (error: any) => toast.error(error.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
  }, [loading, isAuthenticated, setLocation]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PortalLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Teams</h1>
            <p className="text-muted-foreground">Create or join a team for the hackathon</p>
          </div>
          {!myTeam && (
            <Button onClick={() => setShowCreateForm(!showCreateForm)} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Team
            </Button>
          )}
        </div>

        {showCreateForm && !myTeam && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Name</label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Describe your team"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Project Idea</label>
                <textarea
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  placeholder="What will you build?"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Members</label>
                <select
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() =>
                    createTeam.mutate({
                      name: teamName,
                      description: teamDescription || undefined,
                      projectIdea: projectIdea || undefined,
                      maxMembers: parseInt(maxMembers),
                    })
                  }
                  disabled={!teamName}
                >
                  Create Team
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {myTeam && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{myTeam.team.name}</h3>
                  {myTeam.team.description && <p className="text-muted-foreground">{myTeam.team.description}</p>}
                </div>
                {myTeam.team.projectIdea && (
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-sm font-medium mb-1">Project Idea</p>
                    <p className="text-sm text-muted-foreground">{myTeam.team.projectIdea}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium mb-3">Members ({myTeam.members.length}/{myTeam.team.maxMembers})</p>
                  <div className="space-y-2">
                    {myTeam.members.map((member) => (
                      <div key={member.userId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{member.user?.name || "Unknown User"}</p>
                          <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {invitations && invitations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Team Invitations</CardTitle>
              <CardDescription>You have {invitations.length} pending invitation(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invitations.map((inv) => (
                  <div key={inv.invitation.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-semibold">{inv.team.name}</p>
                      {inv.team.description && <p className="text-sm text-muted-foreground">{inv.team.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Accept</Button>
                      <Button size="sm" variant="outline">Decline</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {!myTeam && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Teams</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTeams?.map((team) => (
                <Card key={team.id}>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-2">{team.name}</h3>
                    {team.description && <p className="text-sm text-muted-foreground mb-3">{team.description}</p>}
                    {team.projectIdea && (
                      <p className="text-sm text-muted-foreground italic mb-3">Project: {team.projectIdea}</p>
                    )}
                    <p className="text-xs text-muted-foreground mb-4">{team.maxMembers} members max</p>
                    <Button className="w-full">Request to Join</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
