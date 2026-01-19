import { useState } from "react";
import { trpc } from "@/lib/trpc-supabase";
import PortalLayout from "@/components/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Search, Github, Shield, User, Linkedin, Globe } from "lucide-react";

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-red-400" />
              Participants
            </h1>
            <p className="text-muted-foreground mt-2">
              Browse all registered participants for HackGreenwich 2026
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {participants?.length || 0} Registered
          </Badge>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Participants Grid */}
        {filteredParticipants && filteredParticipants.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredParticipants.map((participant: any) => (
              <Card key={participant.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 flex items-center justify-center text-white font-bold text-lg">
                        {participant.name?.[0]?.toUpperCase() || <User className="h-6 w-6" />}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{participant.name || "Anonymous"}</CardTitle>
                      </div>
                    </div>
                    {participant.role === "admin" && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Skills */}
                  {participant.skills && participant.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {participant.skills.slice(0, 5).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {participant.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{participant.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-2">
                    {participant.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={participant.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                        </a>
                      </Button>
                    )}
                    {participant.linkedin_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={participant.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {participant.portfolio_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={participant.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Participants Found</h3>
                <p className="text-muted-foreground">
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
