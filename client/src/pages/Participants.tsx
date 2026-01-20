import { useState } from "react";
import { trpc } from "@/lib/trpc-supabase";
import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Github, Shield, User, Linkedin, Globe } from "lucide-react";
import { SafeExternalLink } from "@/components/ExternalLinkDialog";

export default function Participants() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: participants, isLoading } = trpc.participants.list.useQuery();

  const filteredParticipants = participants?.filter((p: any) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.skills?.some((skill: string) => skill.toLowerCase().includes(query))
    );
  });

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading participants...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
              <Users className="h-8 w-8 text-red-400" />
              Participants
            </h1>
            <p className="text-white/70 mt-2">
              Browse all registered participants for HackGreenwich 2026
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2 bg-white/5 border-white/20 text-white">
            {participants?.length || 0} Registered
          </Badge>
        </div>

        {/* Search */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search by name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </CardContent>
        </Card>

        {/* Participants Grid */}
        {filteredParticipants && filteredParticipants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"> {filteredParticipants.map((participant: any) => (
              <Card key={participant.id} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <CardContent className="pt-6 space-y-4">
                  {/* Avatar and Name - Centered */}
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                      {participant.name?.[0]?.toUpperCase() || <User className="h-10 w-10" />}
                    </div>
                    <h3 className="font-semibold text-lg text-white">{participant.name || "Anonymous"}</h3>
                    {participant.role === "admin" && (
                      <Badge className="mt-2 bg-red-500/20 text-red-400 border-red-500/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {participant.experience_level && (
                      <Badge variant="outline" className="mt-2 bg-white/5 border-white/20 text-white/70">
                        {participant.experience_level}
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {participant.bio && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/70 text-center line-clamp-3">{participant.bio}</p>
                    </div>
                  )}

                  {/* Skills */}
                  {participant.skills && participant.skills.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm font-medium mb-2 text-white text-center">Skills</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {participant.skills.slice(0, 6).map((skill: string, idx: number) => (
                          <Badge key={idx} className="text-xs bg-gradient-to-r from-yellow-500/20 to-red-500/20 text-white border-white/10">
                            {skill}
                          </Badge>
                        ))}
                        {participant.skills.length > 6 && (
                          <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                            +{participant.skills.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {(participant.github_url || participant.linkedin_url || participant.portfolio_url) && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm font-medium mb-2 text-white text-center">Connect</p>
                      <div className="flex gap-2 justify-center">
                        {participant.github_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                            asChild
                          >
                            <SafeExternalLink href={participant.github_url}>
                              <Github className="h-4 w-4" />
                            </SafeExternalLink>
                          </Button>
                        )}
                        {participant.linkedin_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                            asChild
                          >
                            <SafeExternalLink href={participant.linkedin_url}>
                              <Linkedin className="h-4 w-4" />
                            </SafeExternalLink>
                          </Button>
                        )}
                        {participant.portfolio_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                            asChild
                          >
                            <SafeExternalLink href={participant.portfolio_url}>
                              <Globe className="h-4 w-4" />
                            </SafeExternalLink>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No Participants Found</h3>
                <p className="text-white/60">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Participants will appear here once they register"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}
