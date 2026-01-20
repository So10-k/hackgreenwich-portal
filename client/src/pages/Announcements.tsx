import { useAuth } from "@/_core/hooks/useAuth";
import PortalLayout from "@/components/PortalLayout";
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
    <PortalLayout>
      <div className="p-8 space-y-6">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-white">Announcements</h1>
        <div className="space-y-4">
          {announcements?.map((announcement) => (
            <Card key={announcement.id} className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    {announcement.isPinned && <Pin className="h-5 w-5 text-red-400" />}
                    {announcement.title}
                  </CardTitle>
                  {announcement.category && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs">{announcement.category}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 whitespace-pre-wrap">{announcement.content}</p>
                <p className="text-xs text-white/50 mt-4">
                  {new Date(announcement.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </PortalLayout>
  );
}
