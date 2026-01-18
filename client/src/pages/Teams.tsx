import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Teams() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const { data: myTeam } = trpc.teams.getMyTeam.useQuery();
  const createTeam = trpc.teams.create.useMutation({
    onSuccess: () => {
      toast.success("Team created!");
      setOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
  }, [loading, isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createTeam.mutateAsync({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      projectIdea: formData.get("projectIdea") as string,
      maxMembers: 4,
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Team</h1>
          {!myTeam && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Create Team</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a Team</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label htmlFor="name">Team Name *</Label><Input id="name" name="name" required /></div>
                  <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} /></div>
                  <div><Label htmlFor="projectIdea">Project Idea</Label><Textarea id="projectIdea" name="projectIdea" rows={3} /></div>
                  <Button type="submit" className="w-full" disabled={createTeam.isPending}>
                    {createTeam.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Team
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {myTeam ? (
          <Card>
            <CardHeader>
              <CardTitle>{myTeam.team.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {myTeam.team.description && <p className="text-muted-foreground">{myTeam.team.description}</p>}
              <div>
                <h3 className="font-semibold mb-4">Team Members ({myTeam.members.length}/{myTeam.team.maxMembers})</h3>
                <div className="space-y-3">
                  {myTeam.members.map((member) => (
                    <div key={member.userId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">{member.user.name?.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Team Yet</h3>
              <p className="text-muted-foreground mb-6">Create a team to start collaborating</p>
              <Button onClick={() => setOpen(true)}>Create Your Team</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
