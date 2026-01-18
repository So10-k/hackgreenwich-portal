import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: users, refetch } = trpc.admin.getAllUsers.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });

  const approveAccess = trpc.admin.approvePortalAccess.useMutation({
    onSuccess: () => {
      toast.success("User approved!");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
    if (!loading && user && user.role !== "admin") setLocation("/dashboard");
  }, [loading, isAuthenticated, user, setLocation]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const pendingUsers = users?.filter(u => !u.portalAccessGranted && u.registrationStep >= 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals ({pendingUsers?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingUsers?.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-sm text-muted-foreground">Devpost: {u.devpostUsername}</p>
                  </div>
                  <Button onClick={() => approveAccess.mutate({ userId: u.id })} disabled={approveAccess.isPending}>
                    {approveAccess.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    Approve
                  </Button>
                </div>
              ))}
              {(!pendingUsers || pendingUsers.length === 0) && (
                <p className="text-center text-muted-foreground py-8">No pending approvals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
