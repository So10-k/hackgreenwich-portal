import { useState } from "react";
import { trpc } from "@/lib/trpc-supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Bell, ExternalLink, Search, Mail, Github, Linkedin, Globe } from "lucide-react";
import { SafeExternalLink } from "@/components/ExternalLinkDialog";

export default function JudgesDashboard() {
  const { data: participants, isLoading: participantsLoading } = trpc.judges.getAllParticipants.useQuery();
  const { data: announcements, isLoading: announcementsLoading } = trpc.judges.getAnnouncements.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants = participants?.filter((p: any) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Judges Portal</h1>
          <p className="text-muted-foreground">
            Welcome to the HackGreenwich judges dashboard. View participants, announcements, and access Devpost submissions.
          </p>
        </div>

        {/* Devpost Link Card */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Devpost Submissions
            </CardTitle>
            <CardDescription>
              View all project submissions on Devpost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SafeExternalLink href="https://hackgreenwich.devpost.com">
              <Button className="w-full sm:w-auto">
                Open Devpost <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </SafeExternalLink>
          </CardContent>
        </Card>

        {/* Judge Announcements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Judge Announcements
            </CardTitle>
            <CardDescription>
              Important updates and information for judges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {announcementsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : announcements && announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
                  <div
                    key={announcement.id}
                    className="p-4 bg-muted rounded-lg border"
                  >
                    <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Posted {new Date(announcement.created_at).toLocaleDateString()} at{" "}
                      {new Date(announcement.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No announcements yet. Check back later for updates.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Participants List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Participants
            </CardTitle>
            <CardDescription>
              View all registered participants with their contact information and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {participantsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading participants...</p>
                </div>
              </div>
            ) : filteredParticipants && filteredParticipants.length > 0 ? (
              <div className="space-y-4">
                {filteredParticipants.map((participant: any) => (
                  <div
                    key={participant.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg">{participant.name || "No name provided"}</h3>
                          {participant.role === "admin" && (
                            <Badge variant="destructive">Admin</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${participant.email}`} className="hover:underline">
                            {participant.email}
                          </a>
                        </div>

                        {participant.bio && (
                          <p className="text-sm text-muted-foreground">{participant.bio}</p>
                        )}

                        {participant.skills && participant.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {participant.skills.map((skill: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {participant.github_username && (
                            <SafeExternalLink href={`https://github.com/${participant.github_username}`}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Github className="h-4 w-4" />
                                GitHub
                              </Button>
                            </SafeExternalLink>
                          )}
                          {participant.linkedin_username && (
                            <SafeExternalLink href={`https://linkedin.com/in/${participant.linkedin_username}`}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                              </Button>
                            </SafeExternalLink>
                          )}
                          {participant.portfolio_url && (
                            <SafeExternalLink href={participant.portfolio_url}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Globe className="h-4 w-4" />
                                Portfolio
                              </Button>
                            </SafeExternalLink>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                {searchQuery ? "No participants match your search." : "No participants registered yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
