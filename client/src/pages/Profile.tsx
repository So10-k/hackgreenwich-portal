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
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">Complete your profile to help others find you for team formation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-600" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Tell others about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a brief introduction about yourself, your background, and what you're hoping to build at HackGreenwich..."
                      rows={4}
                      maxLength={500}
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">{bio.length}/500 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="experienceLevel">Experience Level</Label>
                    <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-600" />
                    Skills
                  </CardTitle>
                  <CardDescription>What technologies and skills do you bring to a team?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Skills */}
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 hover:text-purple-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {skills.length === 0 && (
                      <p className="text-sm text-gray-500">No skills added yet</p>
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
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => customSkill && handleAddSkill(customSkill)}
                        disabled={!customSkill}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Dropdown */}
                    {showSkillDropdown && customSkill && filteredSkills.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => handleAddSkill(skill)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 hover:text-purple-700"
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-purple-600" />
                    Interests
                  </CardTitle>
                  <CardDescription>What areas are you passionate about?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Selected Interests */}
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(interest)}
                          className="ml-1 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {interests.length === 0 && (
                      <p className="text-sm text-gray-500">No interests added yet</p>
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
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => customInterest && handleAddInterest(customInterest)}
                        disabled={!customInterest}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Dropdown */}
                    {showInterestDropdown && customInterest && filteredInterests.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto">
                        {filteredInterests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleAddInterest(interest)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-700"
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Social Links
                  </CardTitle>
                  <CardDescription>Help others connect with you outside the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="githubUrl" className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      GitHub
                    </Label>
                    <Input
                      id="githubUrl"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedinUrl"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Portfolio/Website
                    </Label>
                    <Input
                      id="portfolioUrl"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Team Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Team Preferences
                  </CardTitle>
                  <CardDescription>Let others know if you're looking for a team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lookingForTeam">Looking for a team</Label>
                      <p className="text-sm text-gray-500">
                        Enable this to appear in the teammate finder
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
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Preview</CardTitle>
                  <CardDescription>How others will see your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar and Name */}
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                      {name ? name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <h3 className="mt-3 font-semibold text-gray-900">{name || "Your Name"}</h3>
                    {experienceLevel && (
                      <Badge variant="outline" className="mt-1">
                        {EXPERIENCE_LEVELS.find(l => l.value === experienceLevel)?.label || experienceLevel}
                      </Badge>
                    )}
                  </div>

                  {/* Bio */}
                  {bio && (
                    <div>
                      <p className="text-sm text-gray-600 text-center">{bio}</p>
                    </div>
                  )}

                  {/* Looking for Team Badge */}
                  {lookingForTeam && (
                    <div className="flex justify-center">
                      <Badge className="bg-green-100 text-green-700">
                        <Users className="h-3 w-3 mr-1" />
                        Looking for team
                      </Badge>
                    </div>
                  )}

                  {/* Skills Preview */}
                  {skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                            {skill}
                          </Badge>
                        ))}
                        {skills.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interests Preview */}
                  {interests.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-1">
                        {interests.slice(0, 4).map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            {interest}
                          </Badge>
                        ))}
                        {interests.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{interests.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Links Preview */}
                  {(githubUrl || linkedinUrl || portfolioUrl) && (
                    <div className="flex justify-center gap-3 pt-2">
                      {githubUrl && (
                        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {portfolioUrl && (
                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-600">
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
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
