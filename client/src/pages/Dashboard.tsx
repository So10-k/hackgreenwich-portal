import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Users, Trophy, BookOpen, MessageSquare, Upload, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [submissionsEnabled, setSubmissionsEnabled] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const { data: myTeam } = trpc.teams.getMyTeam.useQuery(undefined, {
    enabled: isAuthenticated && user?.portalAccessGranted === true,
  });

  const { data: announcements } = trpc.announcements.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.portalAccessGranted === true,
  });

  const { data: connectionRequests } = trpc.teammates.getConnectionRequests.useQuery(undefined, {
    enabled: isAuthenticated && user?.portalAccessGranted === true,
  });

  const { data: teamInvitations } = trpc.teams.getInvitations.useQuery(undefined, {
    enabled: isAuthenticated && user?.portalAccessGranted === true,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/");
    }
    if (!loading && user && !user.portalAccessGranted) {
      setLocation("/register");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingNotifications = (connectionRequests?.length || 0) + (teamInvitations?.length || 0);
  const latestAnnouncements = announcements?.slice(0, 3) || [];

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground text-lg">
            {myTeam ? `You're in ${myTeam.team.name}` : "Ready to build something amazing at HackGreenwich?"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Your Team</p>
                <p className="text-3xl font-bold">{myTeam ? myTeam.members.length : 0}</p>
                <p className="text-xs text-muted-foreground">members</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-bold">{pendingNotifications}</p>
                <p className="text-xs text-muted-foreground">connections & invites</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Announcements</p>
                <p className="text-3xl font-bold">{announcements?.length || 0}</p>
                <p className="text-xs text-muted-foreground">total updates</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-3xl font-bold">Active</p>
                <p className="text-xs text-muted-foreground">registered</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Team Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
              <CardDescription>Current team status and members</CardDescription>
            </CardHeader>
            <CardContent>
              {myTeam ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{myTeam.team.name}</h3>
                    {myTeam.team.description && (
                      <p className="text-muted-foreground mb-2">{myTeam.team.description}</p>
                    )}
                    {myTeam.team.projectIdea && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm font-medium text-primary mb-1">Project Idea</p>
                        <p className="text-sm text-muted-foreground">{myTeam.team.projectIdea}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-3">Team Members ({myTeam.members.length}/{myTeam.team.maxMembers})</p>
                    <div className="space-y-2">
                      {myTeam.members.map((member) => (
                        <div key={member.userId} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="font-semibold text-primary text-sm">
                              {member.user?.name?.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{member.user?.name || "Unknown User"}</p>
                            <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setLocation("/teams")}>
                    Manage Team
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Team Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a team or wait for an invitation
                  </p>
                  <Button onClick={() => setLocation("/teams")}>
                    Create or Join Team
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Submission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Project Submission
              </CardTitle>
              <CardDescription>Submit your project for review</CardDescription>
            </CardHeader>
            <CardContent>
              {submissionsEnabled ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex gap-2">
                    <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700">Submissions are open!</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Project Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Enter project title"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <Button className="w-full">Submit Project</Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm">
                    Submissions are not yet open. Check back later!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Announcements</CardTitle>
            <CardDescription>Stay updated with important information</CardDescription>
          </CardHeader>
          <CardContent>
            {latestAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {latestAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="pb-4 border-b last:border-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{announcement.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                      {announcement.isPinned && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-semibold flex-shrink-0">
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setLocation("/announcements")}>
                  View All Announcements
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No announcements yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setLocation("/teammates")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Find</p>
                  <h3 className="text-lg font-bold">Teammates</h3>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setLocation("/resources")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Browse</p>
                  <h3 className="text-lg font-bold">Resources</h3>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setLocation("/announcements")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">View</p>
                  <h3 className="text-lg font-bold">Updates</h3>
                </div>
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setLocation("/profile")}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Edit</p>
                  <h3 className="text-lg font-bold">Profile</h3>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
