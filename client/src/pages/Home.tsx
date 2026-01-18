import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Trophy, BookOpen, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";

export default function Home() {
  const { user, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && user) {
      setLocation("/dashboard");
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">HackGreenwich</span>
          </div>
          <Button
            onClick={() => setLocation("/signin")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
            <Trophy className="h-4 w-4" />
            HackGreenwich 2026 - Registration Open
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
              Build the Future at{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HackGreenwich
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of innovators, creators, and problem-solvers for 48 hours of coding, collaboration, and
              creativity. Find your team, access resources, and bring your ideas to life.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => setLocation("/signup")}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Portal Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Find Teammates</h3>
                <p className="text-gray-600 text-sm">
                  Browse participants, filter by skills and interests, and connect with potential team members.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Trophy className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Team Management</h3>
                <p className="text-gray-600 text-sm">
                  Create teams, invite members, and manage your team's projects and submissions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Resources</h3>
                <p className="text-gray-600 text-sm">
                  Access APIs, tutorials, tools, and datasets to help you build your project.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Announcements</h3>
                <p className="text-gray-600 text-sm">
                  Stay updated with important announcements and schedule updates from organizers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Sparkles className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Project Submission</h3>
                <p className="text-gray-600 text-sm">
                  Submit your team's project for admin review and showcase your work.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Networking</h3>
                <p className="text-gray-600 text-sm">
                  Connect with fellow hackers, mentors, and sponsors throughout the event.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg my-12">
        <div className="max-w-2xl mx-auto text-center text-white space-y-6">
          <h2 className="text-3xl font-bold">Ready to Build Something Amazing?</h2>
          <p className="text-lg opacity-90">Join the HackGreenwich community and start your hackathon journey today.</p>
          <Button
            onClick={() => setLocation("/signup")}
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 HackGreenwich. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
