import { useSupabaseAuth as useAuth } from "@/_core/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, Users, Trophy, BookOpen, MessageSquare, Settings, BarChart3, FileText, Calendar, Award } from "lucide-react";
import { useLocation } from "wouter";
import { ReactNode } from "react";

interface PortalLayoutProps {
  children: ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { label: "Find Teammates", path: "/teammates", icon: Users },
    { label: "Teams", path: "/teams", icon: Trophy },
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

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card sticky top-0 h-screen flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">HackGreenwich</span>
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
                onClick={() => setLocation(item.path)}
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
                    onClick={() => setLocation(item.path)}
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
