import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc-supabase";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Registration() {
  const { user: supabaseUser, loading: authLoading } = useSupabaseAuth();
  const isAuthenticated = !!supabaseUser;
  const [, setLocation] = useLocation();
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Query user profile to check registration status
  const { data: userProfile } = trpc.profile.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  // Query registration status to persist step
  const { data: registrationStatus } = trpc.profile.getRegistrationStatus.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  
  // Update currentStep based on registration status from backend
  useEffect(() => {
    if (registrationStatus) {
      setCurrentStep(registrationStatus.step || 1);
    }
  }, [registrationStatus]);

  const completeRegistration = trpc.profile.completeRegistration.useMutation({
    onSuccess: () => {
      toast.success("Profile completed! Moving to next step.");
      setCurrentStep(2);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const confirmDevpost = trpc.profile.confirmDevpostRegistration.useMutation({
    onSuccess: () => {
      toast.success("Devpost registration confirmed!");
      setCurrentStep(3);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/signin");
    }
    // If user has portal access, redirect to dashboard
    if (userProfile?.portalAccessGranted) {
      setLocation("/dashboard");
    }
  }, [authLoading, isAuthenticated, userProfile, setLocation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    await completeRegistration.mutateAsync({
      devpostUsername: formData.get("devpostUsername") as string,
      bio: formData.get("bio") as string,
      skills,
      interests,
      experienceLevel: formData.get("experienceLevel") as any,
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step < currentStep ? <CheckCircle2 className="h-6 w-6" /> : step}
                  </div>
                  <div className="ml-3 text-sm font-medium">
                    {step === 1 && "Complete Profile"}
                    {step === 2 && "Register on Devpost"}
                    {step === 3 && "Portal Access"}
                  </div>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step < currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Tell us about yourself to help find the perfect teammates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="devpostUsername">Devpost Username *</Label>
                  <Input
                    id="devpostUsername"
                    name="devpostUsername"
                    placeholder="your-devpost-username"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select name="experienceLevel" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    />
                    <Button type="button" onClick={addSkill}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <div key={skill} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                        {skill}
                        <button
                          type="button"
                          onClick={() => setSkills(skills.filter((s) => s !== skill))}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="flex gap-2">
                    <Input
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      placeholder="Add an interest"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                    />
                    <Button type="button" onClick={addInterest}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest) => (
                      <div key={interest} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                        {interest}
                        <button
                          type="button"
                          onClick={() => setInterests(interests.filter((i) => i !== interest))}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={completeRegistration.isPending}>
                  {completeRegistration.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Register on Devpost</CardTitle>
              <CardDescription>
                Complete your registration on the official HackGreenwich Devpost page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted rounded-lg space-y-4">
                <p className="font-medium">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Click the button below to open the HackGreenwich Devpost page</li>
                  <li>Register for the hackathon using your Devpost account</li>
                  <li>Return here once completed</li>
                  <li>Wait for admin approval</li>
                </ol>
              </div>

              <Button asChild className="w-full" size="lg">
                <a href="https://devpost.com" target="_blank" rel="noopener noreferrer">
                  Go to Devpost <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => confirmDevpost.mutate()}
                disabled={confirmDevpost.isPending}
              >
                {confirmDevpost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                I've Completed Devpost Registration
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep >= 3 && !userProfile?.portalAccessGranted && (
          <Card className="mt-6">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <h3 className="text-xl font-semibold">Waiting for Approval</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your registration is being reviewed. You'll receive access once verified by an admin.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
