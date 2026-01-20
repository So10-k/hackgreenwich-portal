import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Users, Trophy, Sparkles, ArrowRight, Calendar, MapPin } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";
import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  // Allow logged-in users to view homepage - they'll see Dashboard button instead

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Fixed background with gradient - Softer brand colors */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-600/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-12 md:h-16 lg:h-20" />
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 text-sm md:text-base px-2 md:px-4"
              onClick={() => setLocation("/schedule")}
            >
              Schedule
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 text-sm md:text-base px-2 md:px-4"
              onClick={() => setLocation("/sponsors")}
            >
              Sponsors
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 text-sm md:text-base px-2 md:px-4"
              onClick={() => setLocation("/winners")}
            >
              Winners
            </Button>
            {user ? (
              <Button
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm md:text-base px-3 md:px-4"
                onClick={() => setLocation("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 text-sm md:text-base px-2 md:px-4"
                  onClick={() => setLocation("/signin")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-sm md:text-base px-3 md:px-4"
                  onClick={() => setLocation("/signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu */}
          <MobileMenu user={user} onNavigate={setLocation} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <motion.div
          style={{ opacity, scale }}
          className="container mx-auto px-4 text-center text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
          >
            <Trophy className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium">HackGreenwich 2026 - Registration Open</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white px-4"
          >
            Build the Future at
            <br />
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">HackGreenwich</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed text-center px-4"
          >
            <p className="mb-2 text-base md:text-lg">Sponsored by</p>
            <img src="/onercf-logo.png" alt="OneRCF" className="h-12 md:h-16 mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 rounded-full shadow-lg"
              onClick={() => setLocation("/signup")}
            >
              Register Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-sm"
            >
              Learn More
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-col sm:flex-row gap-8 justify-center items-center text-white"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>March 1-3, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Greenwich, CT</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section with Scroll Animations */}
      <section className="min-h-screen flex items-center justify-center relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 px-4">
              Everything You Need
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto px-4">
              Our portal provides all the tools and resources to make your hackathon experience seamless
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Users,
                title: "Find Teammates",
                description: "Browse participants, filter by skills, and connect with the perfect team members",
                delay: 0,
              },
              {
                icon: Code,
                title: "Access Resources",
                description: "Get instant access to APIs, tutorials, tools, and datasets curated for your success",
                delay: 0.2,
              },
              {
                icon: Trophy,
                title: "Submit Projects",
                description: "Showcase your work, track submissions, and compete for amazing prizes",
                delay: 0.4,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: feature.delay }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-600/80 to-yellow-500/80 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-white/90 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="min-h-screen flex items-center justify-center relative py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 md:p-16"
          >
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "500+", label: "Participants" },
                { number: "3", label: "Hours" },
                { number: "Super Cool", label: "Prizes" },
                { number: "A lot of", label: "Projects" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-white/90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center relative py-20">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 md:mb-8 px-4">
            Ready to Build?
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            Join the next generation of innovators at HackGreenwich 2026
          </p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-8 rounded-full shadow-lg"
            onClick={() => setLocation("/signup")}
          >
            Register for Free <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-white/80">
          <div className="flex items-center justify-center mb-4">
            <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-8" />
          </div>
          <p className="text-sm">© 2026 HackGreenwich. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
