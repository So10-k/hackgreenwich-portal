import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc-supabase";
import { Loader2, User, Code, Heart, Briefcase, Github, Linkedin, Globe, X, Plus, Users, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

// Predefined skill options
const SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby", "PHP",
  "React", "Vue.js", "Angular", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring Boot",
  "HTML/CSS", "Tailwind CSS", "SASS", "Bootstrap",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Firebase", "Supabase",
  "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Data Science",
  "Mobile Development", "React Native", "Flutter", "Swift", "Kotlin",
  "UI/UX Design", "Figma", "Adobe XD", "Graphic Design",
  "Blockchain", "Web3", "Solidity", "Smart Contracts",
  "DevOps", "CI/CD", "Git", "Linux",
  "API Development", "REST", "GraphQL", "WebSockets"
];

// Predefined interest options
const INTEREST_OPTIONS = [
  "AI/Machine Learning", "Web Development", "Mobile Apps", "Game Development", "Blockchain/Web3",
  "IoT/Hardware", "Cybersecurity", "Data Science", "Cloud Computing", "DevOps",
  "AR/VR", "Fintech", "Healthcare Tech", "EdTech", "Social Impact",
  "E-commerce", "Sustainability", "Open Source", "Startups", "Research",
  "UI/UX Design", "Product Management", "Entrepreneurship", "Networking", "Mentorship"
];

// Experience level options
const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (1-3 years)" },
  { value: "advanced", label: "Advanced (3-5 years)" },
  { value: "expert", label: "Expert (5+ years)" }
];

export default function Profile() {
  const { user: authUser, loading: authLoading } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  
  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [lookingForTeam, setLookingForTeam] = useState(true);
  
  // Custom input state
  const [customSkill, setCustomSkill] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);

  // Fetch profile data
  const { data: profile, isLoading: profileLoading, refetch } = trpc.profile.getProfile.useQuery(undefined, {
    enabled: !!authUser,
  });

  // Update profile mutation
  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  // Populate form with existing data
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
      setExperienceLevel(profile.experience_level || "");
      setGithubUrl(profile.github_url || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setPortfolioUrl(profile.portfolio_url || "");
      setLookingForTeam(profile.looking_for_team ?? true);
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !authUser) {
      setLocation("/signin");
    }
  }, [authLoading, authUser, setLocation]);

  const handleAddSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setCustomSkill("");
    setShowSkillDropdown(false);
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
    setCustomInterest("");
    setShowInterestDropdown(false);
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync({
      name,
      bio,
      skills,
      interests,
      experienceLevel,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      lookingForTeam,
    });
  };

  const filteredSkills = SKILL_OPTIONS.filter(
    (skill) => 
      skill.toLowerCase().includes(customSkill.toLowerCase()) && 
      !skills.includes(skill)
  ).slice(0, 8);

  const filteredInterests = INTEREST_OPTIONS.filter(
    (interest) => 
      interest.toLowerCase().includes(customInterest.toLowerCase()) && 
      !interests.includes(interest)
  ).slice(0, 8);

  if (authLoading || profileLoading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-red-400" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <p className="text-white/70 mt-2">Complete your profile to help others find you for team formation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="h-5 w-5 text-red-400" />
                    Basic Information
                  </CardTitle>
                  <CardDescription className="text-white/60">Tell others about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Display Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a brief introduction about yourself, your background, and what you're hoping to build at HackItNow..."
                      rows={4}
                      maxLength={500}
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                    <p className="text-sm text-white/50 mt-1">{bio.length}/500 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="experienceLevel" className="text-white">Experience Level</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger className="mt-1 bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/20">
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value} className="text-white hover:bg-white/10">
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Code className="h-5 w-5 text-yellow-400" />
                    Skills
                  </CardTitle>
                  <CardDescription className="text-white/60">What technologies and skills do you bring to a team?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Skills */}
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 text-white border-white/10 hover:bg-yellow-500/30 cursor-pointer"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 hover:text-red-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-white/50">No skills added yet</p>
                    )}
                  </div>

                  {/* Add Skill Input */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <Input
                        value={customSkill}
                        onChange={(e) => {
                          setCustomSkill(e.target.value);
                          setShowSkillDropdown(true);
                        }}
                        onFocus={() => setShowSkillDropdown(true)}
                        placeholder="Type to search or add a skill..."
                        className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => customSkill && handleAddSkill(customSkill)}
                        disabled={!customSkill}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Dropdown */}
                    {showSkillDropdown && customSkill && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-white/20 rounded-md shadow-lg max-h-48 overflow-auto">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Interests */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Heart className="h-5 w-5 text-green-400" />
                    Interests
                  </CardTitle>
                  <CardDescription className="text-white/60">What areas are you passionate about?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Interests */}
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-white/10 hover:bg-green-500/30 cursor-pointer"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-1 hover:text-green-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {interests.length === 0 && (
                      <p className="text-sm text-white/50">No interests added yet</p>
                    )}
                  </div>

                  {/* Add Interest Input */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <Input
                        value={customInterest}
                        onChange={(e) => {
                          setCustomInterest(e.target.value);
                          setShowInterestDropdown(true);
                        }}
                        onFocus={() => setShowInterestDropdown(true)}
                        placeholder="Type to search or add an interest..."
                        className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => customInterest && handleAddInterest(customInterest)}
                        disabled={!customInterest}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Dropdown */}
                    {showInterestDropdown && customInterest && filteredInterests.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-white/20 rounded-md shadow-lg max-h-48 overflow-auto">
                        {filteredInterests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleAddInterest(interest)}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-white/10"
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="h-5 w-5 text-blue-400" />
                    Social Links
                  </CardTitle>
                  <CardDescription className="text-white/60">Help others connect with you outside the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="githubUrl" className="flex items-center gap-2 text-white">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Label>
                    <Input
                      id="githubUrl"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl" className="flex items-center gap-2 text-white">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedinUrl"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolioUrl" className="flex items-center gap-2 text-white">
                      <Globe className="h-4 w-4" />
                      Portfolio
                    </Label>
                    <Input
                      id="portfolioUrl"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="mt-1 bg-white/5 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Team Preferences */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-purple-400" />
                    Team Preferences
                  </CardTitle>
                  <CardDescription className="text-white/60">Let others know if you're looking for a team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lookingForTeam" className="text-white">Looking for Team</Label>
                      <p className="text-sm text-white/60">
                        Show that you're open to team invitations
                      </p>
                    </div>
                    <Switch
                      id="lookingForTeam"
                      checked={lookingForTeam}
                      onCheckedChange={setLookingForTeam}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </Button>
            </form>
          </div>

          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Profile Preview</CardTitle>
                  <CardDescription className="text-white/60">How others will see your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar and Name */}
                  <div className="text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                      {name?.[0]?.toUpperCase() || <User className="h-10 w-10" />}
                    </div>
                    <h3 className="font-semibold text-lg text-white">{name || "Your Name"}</h3>
                    {experienceLevel && (
                      <Badge variant="outline" className="mt-2 bg-white/5 border-white/20 text-white/70">
                        {EXPERIENCE_LEVELS.find(l => l.value === experienceLevel)?.label || experienceLevel}
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {bio && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/70">{bio}</p>
                    </div>
                  )}

                  {/* Skills Preview */}
                  {skills.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm font-medium mb-2 text-white">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 6).map((skill) => (
                          <Badge key={skill} className="text-xs bg-gradient-to-r from-yellow-500/20 to-red-500/20 text-white border-white/10">
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 6 && (
                          <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                            +{skills.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interests Preview */}
                  {interests.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm font-medium mb-2 text-white">Interests</p>
                      <div className="flex flex-wrap gap-1">
                        {interests.slice(0, 4).map((interest) => (
                          <Badge key={interest} className="text-xs bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-white/10">
                            {interest}
                          </Badge>
                        ))}
                        {interests.length > 4 && (
                          <Badge variant="outline" className="text-xs bg-white/5 border-white/20 text-white/70">
                            +{interests.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links Preview */}
                  {(githubUrl || linkedinUrl || portfolioUrl) && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm font-medium mb-2 text-white">Connect</p>
                      <div className="flex gap-2">
                        {githubUrl && (
                          <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                            <Github className="h-4 w-4" />
                          </Button>
                        )}
                        {linkedinUrl && (
                          <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        )}
                        {portfolioUrl && (
                          <Button size="sm" variant="outline" className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10">
                            <Globe className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Team Status */}
                  {lookingForTeam && (
                    <div className="pt-4 border-t border-white/10">
                      <Badge className="w-full justify-center bg-green-500/20 text-green-400 border-green-500/30">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Looking for Team
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
