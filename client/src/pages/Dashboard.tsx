import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, BookOpen, MessageSquare, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
    if (!loading && user && !user.portalAccessGranted) setLocation("/register");
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <nav className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HackGreenwich</span>
          </div>
          <Button variant="ghost" onClick={() => setLocation("/profile")}>{user?.name || "Profile"}</Button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome, {user?.name}!</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setLocation("/teammates")}>
            <CardContent className="pt-6"><Users className="h-8 w-8 text-primary mb-2" /><h3 className="text-xl font-bold">Find Teammates</h3></CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setLocation("/teams")}>
            <CardContent className="pt-6"><Trophy className="h-8 w-8 text-primary mb-2" /><h3 className="text-xl font-bold">Your Team</h3></CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setLocation("/resources")}>
            <CardContent className="pt-6"><BookOpen className="h-8 w-8 text-primary mb-2" /><h3 className="text-xl font-bold">Resources</h3></CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50" onClick={() => setLocation("/announcements")}>
            <CardContent className="pt-6"><MessageSquare className="h-8 w-8 text-primary mb-2" /><h3 className="text-xl font-bold">Announcements</h3></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}