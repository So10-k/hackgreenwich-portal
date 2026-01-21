import { useAuth } from "@/_core/hooks/useAuth";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Loader2, Lock, Clock } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Resources() {
  const { loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Check if hackathon has started (March 1st, 2026 at 12:00pm EST)
  const hackathonStartDate = new Date('2026-03-01T12:00:00-05:00');
  const hasHackathonStarted = new Date() >= hackathonStartDate;

  const { data: resources, isLoading } = trpc.resources.list.useQuery();

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
  }, [loading, isAuthenticated, setLocation]);

  if (loading || isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const categories = ["api", "tutorial", "tool", "dataset", "other"];

  return (
    <PortalLayout>
      <div className="p-8 space-y-6 bg-gradient-to-br from-background via-primary/5 to-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-white">Resource Library</h1>
        
        {/* Locked Notice */}
        {!hasHackathonStarted && (
          <Card className="mb-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Lock className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">Resources Locked Until Event Start</h3>
                  <p className="text-white/80 mb-2">
                    The resource library will automatically unlock on <strong>March 1st, 2026 at 12:00pm EST</strong> when the hackathon officially begins.
                  </p>
                  <div className="flex items-center gap-2 text-white/70">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Check back when the event starts to access APIs, tutorials, tools, and datasets!</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {hasHackathonStarted && (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">{cat}</TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources?.map((resource) => (
                <Card key={resource.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs capitalize">{resource.category}</span>
                    </div>
                    {resource.description && <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>}
                    {resource.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          View Resource <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources?.filter(r => r.category === cat).map((resource) => (
                  <Card key={resource.id}>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">{resource.title}</h3>
                      {resource.description && <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>}
                      {resource.url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            View Resource <ExternalLink className="ml-2 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        )}
      </div>
    </div>
    </PortalLayout>
  );
}
