import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { MobileMenu } from "@/components/MobileMenu";

export function PublicHeader() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: "Schedule", path: "/schedule" },
    { label: "Sponsors", path: "/sponsors" },
    { label: "Winners", path: "/winners" },
    { label: "Judges", path: "/judges" },
    { label: "Rules", path: "/rules" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 xl:top-4">
      <div className="mx-6 flex items-center justify-between pt-4">
        <img 
          src="/hackitnow-logo.png" 
          alt="HackItNow" 
          className="h-10 md:h-12 cursor-pointer" 
          onClick={() => setLocation("/")}
        />

        <nav className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-full ${
                  location === item.path
                    ? "text-white bg-white/10"
                    : "text-white/80 hover:text-white/90"
                }`}
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => setLocation("/dashboard")}
                className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 transition-colors"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setLocation("/signup")}
                className="ml-1 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90 transition-colors"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </nav>
      
        {/* Mobile Menu */}
        <MobileMenu user={user} onNavigate={setLocation} />
      </div>
    </header>
  );
}
