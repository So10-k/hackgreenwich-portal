import { useAuth } from "@/_core/hooks/useAuth";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) setLocation("/");
    if (user) {
      setSkills(user.skills || []);
      setInterests(user.interests || []);
    }
  }, [loading, isAuthenticated, user, setLocation]);

  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => toast.success("Profile updated!"),
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateProfile.mutateAsync({
      bio: formData.get("bio") as string,
      skills,
      interests,
      githubUrl: formData.get("githubUrl") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <PortalLayout>
      <div className="p-8 space-y-6 bg-gradient-to-br from-background via-primary/5 to-background py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" name="bio" defaultValue={user?.bio || ""} rows={4} /></div>
              <div><Label htmlFor="githubUrl">GitHub URL</Label><Input id="githubUrl" name="githubUrl" defaultValue={user?.githubUrl || ""} /></div>
              <div><Label htmlFor="linkedinUrl">LinkedIn URL</Label><Input id="linkedinUrl" name="linkedinUrl" defaultValue={user?.linkedinUrl || ""} /></div>
              <Button type="submit" className="w-full" disabled={updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </PortalLayout>
  );
}