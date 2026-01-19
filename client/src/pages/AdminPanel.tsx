import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Loader2, Check, X, Users, MessageSquare, Trophy, Settings, Calendar, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

type TabType = "users" | "announcements" | "teams" | "submissions" | "schedule" | "sponsors";

export default function AdminPanel() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementCategory, setAnnouncementCategory] = useState("general");
  const [isPinned, setIsPinned] = useState(false);

  const { data: allUsers, isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery();
  const { data: announcements, isLoading: announcementsLoading, refetch: refetchAnnouncements } = trpc.announcements.list.useQuery();
  const { data: allTeams, isLoading: teamsLoading } = trpc.teams.list.useQuery();
  const { data: teamsWithMembers, isLoading: teamsWithMembersLoading } = trpc.teams.getAllTeamsWithMembers.useQuery(undefined, {
    enabled: activeTab === 'teams' && user?.role === 'admin',
  });

  const approveAccess = trpc.admin.approvePortalAccess.useMutation({
    onSuccess: () => {
      toast.success("Portal access approved!");
      refetchUsers();
    },
    onError: (error) => toast.error(error.message),
  });



  const createAnnouncement = trpc.announcements.create.useMutation({
    onSuccess: () => {
      toast.success("Announcement created!");
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setAnnouncementCategory("general");
      setIsPinned(false);
      refetchAnnouncements();
    },
    onError: (error: any) => toast.error(error.message),
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading || usersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingUsers = allUsers?.filter(u => !u.portalAccessGranted && u.devpostVerified) || [];
  const approvedUsers = allUsers?.filter(u => u.portalAccessGranted) || [];

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage participants, announcements, teams, and submissions</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {[
            { id: "users" as TabType, label: "Users", icon: Users },
            { id: "announcements" as TabType, label: "Announcements", icon: MessageSquare },
            { id: "teams" as TabType, label: "Teams", icon: Trophy },
            { id: "schedule" as TabType, label: "Schedule", icon: Calendar },
            { id: "sponsors" as TabType, label: "Sponsors", icon: Award },
            { id: "submissions" as TabType, label: "Submissions", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Portal Access</CardTitle>
                <CardDescription>Users waiting for admin approval after Devpost verification</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length > 0 ? (
                  <div className="space-y-4">
                    {pendingUsers.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex-1">
                          <h4 className="font-semibold">{u.name}</h4>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Devpost: {u.devpostUsername}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => approveAccess.mutate({ userId: u.id })}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>

                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No pending approvals</p>
                )}
              </CardContent>
            </Card>

            {/* All Users */}
            <Card>
              <CardHeader>
                <CardTitle>All Participants</CardTitle>
                <CardDescription>Total: {allUsers?.length || 0} users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allUsers?.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.portalAccessGranted
                            ? "bg-green-500/10 text-green-700"
                            : "bg-yellow-500/10 text-yellow-700"
                        }`}>
                          {u.portalAccessGranted ? "Approved" : "Pending"}
                        </span>
                        {u.devpostVerified && (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-500/10 text-blue-700">
                            Devpost ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            {/* Create Announcement */}
            <Card>
              <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>Post important updates for all participants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <textarea
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    placeholder="Announcement content"
                    rows={5}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={announcementCategory}
                      onChange={(e) => setAnnouncementCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                    >
                      <option value="general">General</option>
                      <option value="urgent">Urgent</option>
                      <option value="schedule">Schedule</option>
                      <option value="rules">Rules</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPinned}
                        onChange={(e) => setIsPinned(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Pin this announcement</span>
                    </label>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() =>
                    createAnnouncement.mutate({
                      title: announcementTitle,
                      content: announcementContent,
                      category: announcementCategory,
                      isPinned,
                    })
                  }
                  disabled={!announcementTitle || !announcementContent}
                >
                  Post Announcement
                </Button>
              </CardContent>
            </Card>

            {/* Recent Announcements */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Total: {announcements?.length || 0}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {announcements?.slice(0, 10).map((a) => (
                    <div key={a.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{a.title}</h4>
                        {a.isPinned && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded font-semibold">
                            Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{a.content}</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded capitalize">{a.category}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === "teams" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>Overview of all teams in the hackathon</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    if (!teamsWithMembers || teamsWithMembers.length === 0) {
                      toast.error('No teams to export');
                      return;
                    }
                    
                    // Generate CSV content
                    const csvRows = [];
                    csvRows.push(['Team Name', 'Team Description', 'Project Idea', 'Max Members', 'Member Name', 'Member Email', 'Member Role', 'Joined At']);
                    
                    teamsWithMembers.forEach((teamData) => {
                      const { team, members } = teamData;
                      if (members.length === 0) {
                        csvRows.push([
                          team.name,
                          team.description || '',
                          team.projectIdea || '',
                          team.maxMembers.toString(),
                          '',
                          '',
                          '',
                          ''
                        ]);
                      } else {
                        members.forEach((member) => {
                          csvRows.push([
                            team.name,
                            team.description || '',
                            team.projectIdea || '',
                            team.maxMembers.toString(),
                            member.user?.name || 'Unknown',
                            member.user?.email || '',
                            member.role,
                            member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : ''
                          ]);
                        });
                      }
                    });
                    
                    // Convert to CSV string
                    const csvContent = csvRows.map(row => 
                      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
                    ).join('\n');
                    
                    // Create download link
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `hackgreenwich-teams-${new Date().toISOString().split('T')[0]}.csv`;
                    link.click();
                    URL.revokeObjectURL(url);
                    
                    toast.success('Team roster exported successfully!');
                  }}
                  disabled={teamsWithMembersLoading || !teamsWithMembers || teamsWithMembers.length === 0}
                >
                  {teamsWithMembersLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Export to CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {teamsLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : allTeams && allTeams.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {allTeams.map((team) => (
                    <div key={team.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{team.name}</h4>
                          {team.description && (
                            <p className="text-sm text-muted-foreground">{team.description}</p>
                          )}
                        </div>
                        <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded">
                          {team.maxMembers} members max
                        </span>
                      </div>
                      {team.projectIdea && (
                        <p className="text-sm text-muted-foreground italic">
                          Project: {team.projectIdea}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No teams yet</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Schedule Event</CardTitle>
                <CardDescription>Add events, workshops, meals, and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.info("Schedule event creation coming soon");
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Event Title" required />
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="workshop">Workshop</option>
                      <option value="meal">Meal</option>
                      <option value="deadline">Deadline</option>
                      <option value="ceremony">Ceremony</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="datetime-local" placeholder="Start Time" required />
                    <Input type="datetime-local" placeholder="End Time" required />
                  </div>
                  <Input placeholder="Location (optional)" />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="important" className="h-4 w-4" />
                    <label htmlFor="important" className="text-sm">Mark as important</label>
                  </div>
                  <Button type="submit">Create Event</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Events</CardTitle>
                <CardDescription>Manage all hackathon events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Event management interface coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sponsors Tab */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Sponsor</CardTitle>
                <CardDescription>Add companies and partners supporting the hackathon</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.info("Sponsor creation coming soon");
                  }}
                  className="space-y-4"
                >
                  <Input placeholder="Sponsor Name" required />
                  <textarea
                    placeholder="Description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Logo URL" />
                    <Input placeholder="Website URL" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="gold">Gold Tier</option>
                      <option value="silver">Silver Tier</option>
                      <option value="bronze">Bronze Tier</option>
                      <option value="partner">Partner</option>
                    </select>
                    <Input type="number" placeholder="Display Order" defaultValue="0" />
                  </div>
                  <Button type="submit">Add Sponsor</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Sponsors</CardTitle>
                <CardDescription>Manage sponsor information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sponsor management interface coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <Card>
            <CardHeader>
              <CardTitle>Project Submissions</CardTitle>
              <CardDescription>Review and manage submitted projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Project submission management coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
