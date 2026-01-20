import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { BookOpen, MessageSquare, Upload, AlertCircle, Calendar, Award } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [submissionsEnabled, setSubmissionsEnabled] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const { data: announcements } = trpc.announcements.list.useQuery(undefined, {
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
      <PortalLayout>
        <div className="p-8 space-y-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-9 w-12 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-16 w-full" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-16 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const latestAnnouncements = announcements?.slice(0, 3) || [];

  return (
    <PortalLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Welcome back, {user?.name}!</h1>
          <p className="text-white/70 text-lg">
            Ready to build something amazing at HackGreenwich?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-white/60">Announcements</p>
                <p className="text-3xl font-bold text-white">{announcements?.length || 0}</p>
                <p className="text-xs text-white/50">total updates</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-white/60">Status</p>
                <p className="text-3xl font-bold text-white">Active</p>
                <p className="text-xs text-white/50">registered</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-white/60">Your Role</p>
                <p className="text-3xl font-bold text-white capitalize">{user?.role || "Participant"}</p>
                <p className="text-xs text-white/50">access level</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Announcements Section */}
          <Card className="lg:col-span-2 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Latest Announcements</CardTitle>
              <CardDescription className="text-white/60">Stay updated with important information</CardDescription>
            </CardHeader>
            <CardContent>
              {latestAnnouncements.length > 0 ? (
                <div className="space-y-4">
                  {latestAnnouncements.map((announcement: any) => (
                    <div key={announcement.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white mb-1">{announcement.title}</h4>
                          <p className="text-sm text-white/70 mb-2">{announcement.content}</p>
                          <p className="text-xs text-white/50">
                            {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10" 
                    onClick={() => setLocation("/announcements")}
                  >
                    View All Announcements
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No announcements yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Submission */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="h-5 w-5" />
                Project Submission
              </CardTitle>
              <CardDescription className="text-white/60">Submit your project for review</CardDescription>
            </CardHeader>
            <CardContent>
              {submissionsEnabled ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex gap-2">
                    <AlertCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-300">Submissions are open!</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Project Title</label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      placeholder="Enter project title"
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Description</label>
                    <textarea
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Describe your project..."
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/40"
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700">Submit Project</Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60 text-sm">
                    Submissions are not yet open. Check back later!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card 
            className="cursor-pointer hover:border-red-500/50 transition-colors bg-white/5 border-white/10" 
            onClick={() => setLocation("/participants")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">View</p>
                  <h3 className="text-lg font-bold text-white">Participants</h3>
                </div>
                <MessageSquare className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-red-500/50 transition-colors bg-white/5 border-white/10" 
            onClick={() => setLocation("/resources")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Browse</p>
                  <h3 className="text-lg font-bold text-white">Resources</h3>
                </div>
                <BookOpen className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-red-500/50 transition-colors bg-white/5 border-white/10" 
            onClick={() => setLocation("/schedule")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Check</p>
                  <h3 className="text-lg font-bold text-white">Schedule</h3>
                </div>
                <Calendar className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:border-red-500/50 transition-colors bg-white/5 border-white/10" 
            onClick={() => setLocation("/sponsors")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">View</p>
                  <h3 className="text-lg font-bold text-white">Sponsors</h3>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
