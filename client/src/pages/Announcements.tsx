import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Pin } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Announcements() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: announcements, isLoading } = trpc.announcements.list.useQuery();

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
  }, [loading, isAuthenticated, setLocation]);

  if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Announcements</h1>
        <div className="space-y-4">
          {announcements?.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {announcement.isPinned && <Pin className="h-5 w-5 text-primary" />}
                    {announcement.title}
                  </CardTitle>
                  {announcement.category && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{announcement.category}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  {new Date(announcement.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
