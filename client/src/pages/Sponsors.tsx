import { trpc } from "@/lib/trpc-supabase";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Award } from "lucide-react";
import { SafeExternalLink } from "@/components/ExternalLinkDialog";
import { PublicHeader } from "@/components/PublicHeader";

export default function Sponsors() {
  const { data: sponsors, isLoading } = trpc.sponsors.list.useQuery();
  const [, setLocation] = useLocation();

  const handleBecomeASponsor = () => {
    const subject = encodeURIComponent("HackItNow 2026 - Sponsorship Inquiry");
    const body = encodeURIComponent(
      `Hello HackItNow Team,\n\n` +
      `I am interested in becoming a sponsor for HackItNow 2026.\n\n` +
      `Company/Organization Name: [Your Company Name]\n` +
      `Contact Person: [Your Name]\n` +
      `Email: [Your Email]\n` +
      `Phone: [Your Phone Number]\n` +
      `Website: [Your Website]\n\n` +
      `Sponsorship Tier Interest: [Gold/Silver/Bronze/Partner]\n\n` +
      `Additional Information:\n` +
      `[Please share any specific interests, goals, or questions about sponsorship]\n\n` +
      `Thank you for considering our sponsorship inquiry.\n\n` +
      `Best regards`
    );
    window.location.href = `mailto:hackitnow@techmonium.com?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container py-12">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
                <p className="text-white/70">Loading sponsors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group sponsors by tier
  const sponsorsByTier = sponsors?.reduce((acc: Record<string, any[]>, sponsor: any) => {
    const tier = sponsor.tier || "partner";
    if (!acc[tier]) {
      acc[tier] = [];
    }
    acc[tier].push(sponsor);
    return acc;
  }, {});

  const tierOrder = ["gold", "silver", "bronze", "partner"];
  const tierLabels: Record<string, string> = {
    gold: "Gold Sponsors",
    silver: "Silver Sponsors",
    bronze: "Bronze Sponsors",
    partner: "Partners",
  };

  const tierColors: Record<string, string> = {
    gold: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    silver: "bg-gray-400/10 text-gray-600 border-gray-400/20",
    bronze: "bg-orange-600/10 text-orange-600 border-orange-600/20",
    partner: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };

  const getTierSize = (tier: string) => {
    switch (tier) {
      case "gold":
        return "lg:col-span-2";
      case "silver":
        return "lg:col-span-1";
      default:
        return "lg:col-span-1";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <PublicHeader />

      <div className="pt-20">
        <div className="container py-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="h-10 w-10 text-red-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white px-4">Our Sponsors</h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto px-4">
              HackItNow is made possible by the generous support of our sponsors. Thank you for
              believing in innovation and the next generation of developers!
            </p>
          </div>

        {/* Sponsors by Tier */}
        {sponsors && sponsors.length > 0 ? (
          <div className="space-y-12">
            {tierOrder.map((tier) => {
              const tierSponsors = sponsorsByTier?.[tier];
              if (!tierSponsors || tierSponsors.length === 0) return null;

              return (
                <div key={tier} className="space-y-6">
                  {/* Tier Header */}
                  <div className="text-center">
                    <Badge variant="outline" className={`${tierColors[tier]} text-lg px-4 py-2`}>
                      {tierLabels[tier]}
                    </Badge>
                  </div>

                  {/* Sponsor Cards */}
                  <div
                    className={`grid gap-6 ${
                      tier === "gold"
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {tierSponsors
                      .sort((a: any, b: any) => a.display_order - b.display_order)
                      .map((sponsor: any) => (
                        <Card
                          key={sponsor.id}
                          className={`hover:shadow-lg transition-shadow ${
                            tier === "gold" ? "border-2 border-primary" : ""
                          }`}
                        >
                          <CardHeader>
                            {/* Logo */}
                            {sponsor.logo_url ? (
                              <div
                                className={`flex items-center justify-center mb-4 ${
                                  tier === "gold" ? "h-32" : "h-24"
                                }`}
                              >
                                <img
                                  src={sponsor.logo_url}
                                  alt={`${sponsor.name} logo`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div
                                className={`flex items-center justify-center mb-4 bg-muted rounded-lg ${
                                  tier === "gold" ? "h-32" : "h-24"
                                }`}
                              >
                                <Award className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}

                            <CardTitle className="text-center text-xl">{sponsor.name}</CardTitle>
                          </CardHeader>

                          {(sponsor.description || sponsor.website_url) && (
                            <CardContent className="space-y-4">
                              {sponsor.description && (
                                <CardDescription className="text-center">
                                  {sponsor.description}
                                </CardDescription>
                              )}

                              {sponsor.website_url && (
                                <div className="flex justify-center">
                                  <Button variant="outline" asChild>
                                    <SafeExternalLink
                                      href={sponsor.website_url}
                                      className="flex items-center gap-2"
                                    >
                                      Visit Website
                                      <ExternalLink className="h-4 w-4" />
                                    </SafeExternalLink>
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Sponsors Yet</h3>
                <p className="text-muted-foreground">
                  Sponsor information will be added soon. Stay tuned!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

          {/* Call to Action */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-white">Interested in Sponsoring?</h3>
                <p className="text-white/80 max-w-xl mx-auto">
                  Join us in supporting the next generation of innovators. Contact us to learn about
                  sponsorship opportunities.
                </p>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleBecomeASponsor}>
                Become a Sponsor
              </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
