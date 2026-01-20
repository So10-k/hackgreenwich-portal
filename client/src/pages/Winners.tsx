import { trpc } from "@/lib/trpc-supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ExternalLink, Github, Users } from "lucide-react";
import { SafeExternalLink } from "@/components/ExternalLinkDialog";
import { Link, useLocation } from "wouter";
import { MobileMenu } from "@/components/MobileMenu";
import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";

export default function Winners() {
  const { data: winners, isLoading } = trpc.winners.list.useQuery();
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  const getPrizeBadgeColor = (category: string) => {
    if (category.includes("1st") || category.toLowerCase().includes("first")) {
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    }
    if (category.includes("2nd") || category.toLowerCase().includes("second")) {
      return "bg-gray-400/20 text-gray-400 border-gray-400/50";
    }
    if (category.includes("3rd") || category.toLowerCase().includes("third")) {
      return "bg-amber-700/20 text-amber-700 border-amber-700/50";
    }
    return "bg-primary/20 text-primary border-primary/50";
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-20 cursor-pointer" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/schedule">
                <a className="text-slate-300 hover:text-white transition-colors">Schedule</a>
              </Link>
              <Link href="/sponsors">
                <a className="text-slate-300 hover:text-white transition-colors">Sponsors</a>
              </Link>
              <Link href="/winners">
                <a className="text-white font-semibold">Winners</a>
              </Link>
              <Link href="/signin">
                <a className="text-slate-300 hover:text-white transition-colors">Sign In</a>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu */}
            <MobileMenu user={user} onNavigate={(path) => setLocation(path)} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-transparent to-transparent"></div>
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="text-yellow-500 font-semibold">HackGreenwich 2026 Winners</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Congratulations to Our
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Winners!
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Celebrating the most innovative projects from HackGreenwich 2026. These teams pushed boundaries and created amazing solutions.
          </p>
        </div>
      </div>

      {/* Winners Grid */}
      <div className="container px-4 pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-slate-400">Loading winners...</p>
            </div>
          </div>
        ) : winners && winners.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {winners.map((winner: any) => (
              <Card key={winner.id} className="bg-slate-900/50 border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
                {winner.project_image_url && (
                  <div className="h-48 overflow-hidden bg-slate-800">
                    <img
                      src={winner.project_image_url}
                      alt={winner.project_title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2 text-white">{winner.project_title}</CardTitle>
                      <CardDescription className="text-slate-300">{winner.team_name}</CardDescription>
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm font-semibold whitespace-nowrap ${getPrizeBadgeColor(winner.prize_category)}`}>
                      {winner.prize_category}
                    </div>
                  </div>
                  {winner.prize_amount && (
                    <div className="text-lg font-semibold text-green-500">
                      {winner.prize_amount}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-200">{winner.project_description}</p>

                  {winner.team_members && winner.team_members.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Users className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div className="flex flex-wrap gap-2">
                        {winner.team_members.map((member: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-slate-800 rounded text-sm text-slate-200">
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {winner.devpost_url && (
                      <SafeExternalLink href={winner.devpost_url}>
                        <Button variant="outline" size="sm" className="gap-2 border-slate-600 text-white hover:bg-slate-800 hover:text-white">
                          <ExternalLink className="h-4 w-4" />
                          Devpost
                        </Button>
                      </SafeExternalLink>
                    )}
                    {winner.github_url && (
                      <SafeExternalLink href={winner.github_url}>
                        <Button variant="outline" size="sm" className="gap-2 border-slate-600 text-white hover:bg-slate-800 hover:text-white">
                          <Github className="h-4 w-4" />
                          GitHub
                        </Button>
                      </SafeExternalLink>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Trophy className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-300 mb-2">Winners Coming Soon</h3>
            <p className="text-slate-400">
              Check back after the hackathon to see the winning projects!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-4">
              <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-16" />
              <p className="text-sm text-slate-400 text-center md:text-left">Sponsored by</p>
              <img src="/onercf-logo.png" alt="OneRCF" className="h-12" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-slate-400 text-sm">
                © 2026 HackGreenwich. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
