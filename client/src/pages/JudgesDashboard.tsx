import { useState } from "react";
import { trpc } from "@/lib/trpc-supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Bell, ExternalLink, Search, Mail, Github, Linkedin, Globe } from "lucide-react";
import { SafeExternalLink } from "@/components/ExternalLinkDialog";
import PortalLayout from "@/components/PortalLayout";

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
    <PortalLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">Judges Portal</h1>
          <p className="text-white/70">
            Welcome to the HackItNow judges dashboard. View participants, announcements, and access Devpost submissions.
          </p>
        </div>

        {/* Devpost Link Card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ExternalLink className="h-5 w-5 text-purple-400" />
              Devpost Submissions
            </CardTitle>
            <CardDescription className="text-white/60">
              View all project submissions on Devpost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SafeExternalLink href="https://hackitnow.devpost.com">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                Open Devpost <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </SafeExternalLink>
          </CardContent>
        </Card>

        {/* Judge Announcements */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-yellow-400" />
              Judge Announcements
            </CardTitle>
            <CardDescription className="text-white/60">
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
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-white">{announcement.title}</h3>
                    <p className="text-sm text-white/70 mb-2">{announcement.content}</p>
                    <p className="text-xs text-white/50">
                      Posted {new Date(announcement.created_at).toLocaleDateString()} at{" "}
                      {new Date(announcement.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white/60 py-8">
                No announcements yet. Check back later for updates.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Participants List */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-red-400" />
              All Participants
            </CardTitle>
            <CardDescription className="text-white/60">
              View all registered participants with their contact information and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search by name, email, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                />
              </div>
            </div>

            {participantsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-white/60">Loading participants...</p>
                </div>
              </div>
            ) : filteredParticipants && filteredParticipants.length > 0 ? (
              <div className="space-y-4">
                {filteredParticipants.map((participant: any) => (
                  <div
                    key={participant.id}
                    className="p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-white">{participant.name || "No name provided"}</h3>
                          {participant.role === "admin" && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Admin</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${participant.email}`} className="hover:underline hover:text-white">
                            {participant.email}
                          </a>
                        </div>

                        {participant.bio && (
                          <p className="text-sm text-white/70">{participant.bio}</p>
                        )}

                        {participant.skills && participant.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {participant.skills.map((skill: string, idx: number) => (
                              <Badge key={idx} className="text-xs bg-gradient-to-r from-red-500/20 to-yellow-500/20 text-white border-white/10">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {participant.github_username && (
                            <SafeExternalLink href={`https://github.com/${participant.github_username}`}>
                              <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                                <Github className="h-4 w-4" />
                                GitHub
                              </Button>
                            </SafeExternalLink>
                          )}
                          {participant.linkedin_username && (
                            <SafeExternalLink href={`https://linkedin.com/in/${participant.linkedin_username}`}>
                              <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                              </Button>
                            </SafeExternalLink>
                          )}
                          {participant.portfolio_url && (
                            <SafeExternalLink href={participant.portfolio_url}>
                              <Button variant="outline" size="sm" className="gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10">
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
              <p className="text-center text-white/60 py-12">
                {searchQuery ? "No participants match your search." : "No participants registered yet."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
