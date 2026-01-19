import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Loader2, Search, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Teammates() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: teammates, isLoading } = trpc.teammates.list.useQuery();
  const sendRequest = trpc.teammates.sendConnectionRequest.useMutation({
    onSuccess: () => toast.success("Connection request sent!"),
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
  }, [loading, isAuthenticated, setLocation]);

  const filteredTeammates = teammates?.filter((t: any) => 
    t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading || isLoading) {
    return (
      <PortalLayout>
        <div className="p-8 space-y-6">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Skeleton className="h-6 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                  <Skeleton className="h-12 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Find Teammates</h1>
          <p className="text-muted-foreground">Connect with other participants and find your perfect team</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeammates?.map((teammate) => (
            <Card key={teammate.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{teammate.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{teammate.experienceLevel}</p>
                  </div>
                  <Button size="sm" onClick={() => sendRequest.mutate({ receiverId: teammate.id })}>
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
                {teammate.bio && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{teammate.bio}</p>}
                {teammate.skills && teammate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {teammate.skills.slice(0, 3).map((skill: string, index: number) => (
                      <span key={`${teammate.id}-skill-${index}`} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{skill}</span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
