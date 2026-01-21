import { useSupabaseAuth } from "@/_core/hooks/useSupabaseAuth";
import { Button, LiquidButton } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Users, Trophy, Sparkles, ArrowRight, Calendar, MapPin } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { HeroScrollVideo } from "@/components/ui/scroll-animated-video";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useSupabaseAuth();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandComplete, setExpandComplete] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  // Expansion animations based on scroll progress
  const containerWidth = 400 + scrollProgress * 1200;
  const containerHeight = 500 + scrollProgress * 400;
  
  // Scroll expansion event handlers
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (expandComplete && e.deltaY < 0 && window.scrollY <= 5) {
        setExpandComplete(false);
        e.preventDefault();
      } else if (!expandComplete) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);
        
        if (newProgress >= 1) {
          setExpandComplete(true);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      if (expandComplete && deltaY < -20 && window.scrollY <= 5) {
        setExpandComplete(false);
        e.preventDefault();
      } else if (!expandComplete) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);
        
        if (newProgress >= 1) {
          setExpandComplete(true);
        }
        
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!expandComplete) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollProgress, expandComplete, touchStartY]);

  // Allow logged-in users to view homepage - they'll see Dashboard button instead

  return (
    <div ref={containerRef} className="relative overflow-hidden scroll-smooth">
      <style>{`
        html {
          scroll-snap-type: y proximity;
        }
        section {
          scroll-snap-align: start;
          scroll-snap-stop: normal;
        }
      `}</style>
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

      <PublicHeader />

      {/* Hero Section with Scroll Expansion */}
      <section className="min-h-screen flex items-center justify-center relative pt-20 scroll-snap-align-start">
        <div className="relative w-full flex flex-col items-center min-h-screen">
          {/* Expanding container */}
          <div className="flex flex-col items-center justify-center w-full h-screen relative">
            <motion.div
              className="relative flex flex-col items-center justify-center rounded-2xl overflow-hidden"
              style={{
                width: expandComplete ? '100%' : `${Math.min(containerWidth, window.innerWidth * 0.95)}px`,
                height: expandComplete ? '100vh' : `${Math.min(containerHeight, window.innerHeight * 0.85)}px`,
                maxWidth: expandComplete ? '100%' : '95vw',
                maxHeight: expandComplete ? '100vh' : '85vh',
                transition: expandComplete ? 'all 0.3s ease-out' : 'none',
              }}
            >
              {/* Content inside expanding container */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
                <motion.div
                  animate={{ opacity: scrollProgress > 0.3 ? 1 : 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
                >
                  <Trophy className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium">HackGreenwich 2026 - Registration Open</span>
                </motion.div>

                <motion.h1
                  animate={{ 
                    scale: 0.6 + scrollProgress * 0.4,
                    opacity: 1
                  }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 text-white px-4"
                >
                  Build the Future at
                  <br />
                  <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">HackGreenwich</span>
                </motion.h1>

                <motion.div
                  animate={{ opacity: scrollProgress > 0.5 ? 1 : 0 }}
                  className="text-lg md:text-xl lg:text-2xl text-white max-w-3xl mx-auto mb-8 md:mb-12 leading-relaxed text-center px-4"
                >
                  <p className="mb-2 text-base md:text-lg">Sponsored by</p>
                  <img src="/onercf-logo.png" alt="OneRCF" className="h-12 md:h-16 mx-auto" />
                </motion.div>

                <motion.div
                  animate={{ opacity: scrollProgress > 0.7 ? 1 : 0 }}
                  className="flex justify-center items-center"
                >
                  <LiquidButton
                    size="xxl"
                    className="text-white font-bold text-xl px-12"
                    onClick={() => setLocation("/signup")}
                  >
                    Register Now <ArrowRight className="ml-2 h-6 w-6" />
                  </LiquidButton>
                </motion.div>
                <motion.div
                  animate={{ opacity: scrollProgress > 0.8 ? 1 : 0 }}
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
              </div>
            </motion.div>
          </div>
        </div>

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

      {/* Why HackGreenwich Section */}
      <section className="relative py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">HackGreenwich</span>?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              More than just a hackathon—it's where innovation meets opportunity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💡",
                title: "Learn & Build",
                description: "Workshops, mentorship, and hands-on experience with cutting-edge technologies"
              },
              {
                icon: "🤝",
                title: "Network",
                description: "Connect with fellow innovators, industry professionals, and potential teammates"
              },
              {
                icon: "🏆",
                title: "Win Prizes",
                description: "Compete for amazing prizes, recognition, and opportunities to showcase your work"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Are We Looking For Section */}
      <section className="relative py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Are We <span className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">Looking For</span>?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Build innovative platforms powered by RoleColorAI
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <Sparkles className="h-8 w-8 text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Challenge</h3>
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    The goal of HackGreenwich is to <strong>develop a new platform using our RoleColorAI API</strong>. Every participant gets <strong className="text-yellow-400">free unlimited access</strong> to the API during the event!
                  </p>
                  <p className="text-white/80 mb-8">
                    Whether you're building a career guidance tool, a team formation platform, a personality-based game, or something completely innovative—we want to see how you leverage AI-powered role and personality insights to create something amazing.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.a
                  href="https://rolecolorfinder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="block p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-yellow-500/20 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                >
                  <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    🎯 RoleColorFinder
                  </h4>
                  <p className="text-white/80 text-sm mb-3">
                    Discover the platform behind the API. Learn about role-based personality insights and how they help people find their perfect career fit.
                  </p>
                  <span className="text-red-400 text-sm font-semibold">Learn More →</span>
                </motion.a>

                <motion.a
                  href="https://rolecolorai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="block p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 hover:border-green-500/50 transition-all duration-300"
                >
                  <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    🤖 RoleColorAI API
                  </h4>
                  <p className="text-white/80 text-sm mb-3">
                    Explore the AI-powered API you'll be using. Access comprehensive documentation, examples, and get your free unlimited API key for the hackathon.
                  </p>
                  <span className="text-green-400 text-sm font-semibold">Get API Access →</span>
                </motion.a>
              </div>

              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-white/90 text-center">
                  <strong className="text-yellow-400">💡 Pro Tip:</strong> Check out the API documentation early to brainstorm ideas and plan your project architecture before the event starts!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll Animated Video Section */}
      <section className="relative py-20">
      <HeroScrollVideo
        title="Ready to Build the Future?"
        subtitle="Join HackGreenwich 2026"
        meta="March 2026 • Greenwich, CT"
        credits={null}
        media="https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
        overlay={{
          caption: "HACKATHON • 2026",
          heading: "Innovation Starts Here",
          paragraphs: [
            "Join 200+ students for 24 hours of coding, creativity, and collaboration.",
            "Build groundbreaking projects, learn from industry mentors, and compete for amazing prizes.",
          ],
          extra: (
            <Button
              size="lg"
              className="mt-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg px-8 py-6 rounded-full shadow-lg"
              onClick={() => setLocation("/signup")}
            >
              Register for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ),
        }}
        initialBoxSize={400}
        scrollHeightVh={250}
        showHeroExitAnimation={true}
        smoothScroll={false}
      />
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
