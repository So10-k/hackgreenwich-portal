import { motion } from "framer-motion";
import ProfileCard from "../components/ui/profile-card";
import { PublicHeader } from "@/components/PublicHeader";

export default function Judges() {

  // Placeholder judge data
  const judges = [
    {
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      name: "Dr. Sarah Chen",
      role: "Tech Industry Expert",
      company: "TechVentures Inc.",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      name: "Emily Rodriguez",
      role: "Venture Capitalist",
      company: "Innovation Capital",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      name: "Michael Thompson",
      role: "Senior Software Engineer",
      company: "CloudScale Systems",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
      name: "Jessica Park",
      role: "Product Design Lead",
      company: "DesignFlow Studios",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
      name: "David Martinez",
      role: "CTO & Co-Founder",
      company: "StartupLab",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      name: "Rachel Kim",
      role: "AI Research Scientist",
      company: "DataMind Labs",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      name: "James Wilson",
      role: "Startup Advisor",
      company: "Growth Partners",
      socials: {
        github: "https://github.com",
      },
    },
    {
      imageSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      name: "Sophia Lee",
      role: "Engineering Manager",
      company: "WebFlow Studios",
      socials: {
        github: "https://github.com",
      },
    },
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Fixed background with gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-green-600/10 rounded-full blur-3xl"
        />
      </div>

      <PublicHeader />

      {/* Main Content */}
      <main className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Meet Our Judges
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Our distinguished panel of judges brings decades of combined experience from leading tech companies, 
              venture capital firms, and innovative startups. They'll be evaluating projects based on innovation, 
              technical execution, and real-world impact.
            </p>
          </motion.div>

          {/* Judges Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 mb-16"
          >
            {judges.map((judge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="flex flex-col items-center"
              >
                <ProfileCard
                  imageSrc={judge.imageSrc}
                  name={judge.name}
                  role={judge.role}
                  socials={judge.socials}
                  className="mb-4"
                />
                <div className="text-center mt-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{judge.name}</h3>
                  <p className="text-sm text-white/70 mb-1">{judge.role}</p>
                  <p className="text-xs text-white/50">{judge.company}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Judging Criteria Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Judging Criteria</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600/80 to-red-500/80 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <span className="text-3xl">💡</span>
                </div>
                <h3 className="text-xl font-semibold text-red-400 mb-3">Innovation</h3>
                <p className="text-white/70">
                  Originality and creativity of the solution. Does it solve a real problem in a novel way?
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-600/80 to-yellow-500/80 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">Technical Execution</h3>
                <p className="text-white/70">
                  Quality of code, architecture, and implementation. How well does it work?
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600/80 to-green-500/80 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-xl font-semibold text-green-400 mb-3">Impact</h3>
                <p className="text-white/70">
                  Potential for real-world application and scalability. Can this make a difference?
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-white/80">
          <div className="flex items-center justify-center mb-4">
            <img src="/hackitnow-logo.png" alt="HackItNow" className="h-8" />
          </div>
          <p className="text-sm">© 2026 HackItNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
