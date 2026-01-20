import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, Users, Trophy, BookOpen, MessageSquare, Settings, BarChart3, FileText, Calendar, Award, Menu, X, Gavel } from "lucide-react";
import { useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface PortalLayoutProps {
  children: ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { label: "Participants", path: "/participants", icon: Users },
    // { label: "Find Teammates", path: "/teammates", icon: Users },
    // { label: "Teams", path: "/teams", icon: Trophy },
    { label: "Schedule", path: "/schedule", icon: Calendar },
    { label: "Sponsors", path: "/sponsors", icon: Award },
    { label: "Resources", path: "/resources", icon: BookOpen },
    { label: "Announcements", path: "/announcements", icon: MessageSquare },
    { label: "Profile", path: "/profile", icon: Settings },
  ];

  const adminItems = [
    { label: "Admin Panel", path: "/admin", icon: BarChart3 },
    { label: "Submissions", path: "/admin/submissions", icon: FileText },
  ];

  const judgeItems = [
    { label: "Judges Portal", path: "/judges", icon: Gavel },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleNavigate = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-8" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        {user?.role === "admin" && (
          <>
            <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Admin
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </>
        )}

        {user?.role === "judge" && (
          <>
            <div className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Judges
            </div>
            {judgeItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t p-4 space-y-3">
        <div className="px-2 py-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          {user?.role === "admin" && (
            <span className="inline-block mt-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded font-semibold">
              Admin
            </span>
          )}
          {user?.role === "judge" && (
            <span className="inline-block mt-1 px-2 py-1 bg-purple-500/10 text-purple-500 text-xs rounded font-semibold">
              Judge
            </span>
          )}
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-8" />
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <div className="h-full flex flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r bg-card sticky top-0 h-screen flex-col">        <SidebarContent />

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
