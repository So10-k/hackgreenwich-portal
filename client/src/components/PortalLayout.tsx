import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Users, BookOpen, MessageSquare, Settings, BarChart3, FileText, Calendar, Award, Menu, Gavel, ChevronDown, ChevronRight, Scale } from "lucide-react";
import { useLocation } from "wouter";
import { ReactNode, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface PortalLayoutProps {
  children: ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["Main", "Event Info", "Community"]));

  // Link groups organized by access level
  const linkGroups = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: BarChart3 },
        { label: "Profile", path: "/profile", icon: Settings },
      ],
      visible: true,
    },
    {
      title: "Event Info",
      items: [
        { label: "Schedule", path: "/schedule", icon: Calendar },
        { label: "Sponsors", path: "/sponsors", icon: Award },
        { label: "Rules", path: "/dashboard-rules", icon: Scale },
      ],
      visible: true,
    },
    {
      title: "Community",
      items: [
        { label: "Participants", path: "/participants", icon: Users },
        { label: "Resources", path: "/resources", icon: BookOpen },
        { label: "Announcements", path: "/announcements", icon: MessageSquare },
      ],
      visible: true,
    },
    {
      title: "Judges",
      items: [
        { label: "Judges Page", path: "/judges", icon: Gavel },
        { label: "Judges Dashboard", path: "/judges-dashboard", icon: BarChart3 },
      ],
      visible: user?.role === "judge" || user?.role === "admin",
    },
    {
      title: "Admin",
      items: [
        { label: "Admin Panel", path: "/admin", icon: BarChart3 },
        { label: "Submissions", path: "/submissions", icon: FileText },
      ],
      visible: user?.role === "admin",
    },
  ];

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleNavigate = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupTitle)) {
        next.delete(groupTitle);
      } else {
        next.add(groupTitle);
      }
      return next;
    });
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <img src="/hackitnow-logo.png" alt="HackItNow" className="h-8" />
        </div>
      </div>

      {/* Navigation with Collapsible Groups */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {linkGroups
          .filter((group) => group.visible)
          .map((group, groupIndex) => {
            const isExpanded = expandedGroups.has(group.title);
            return (
              <div key={groupIndex} className="space-y-1">
                {/* Group Header - Collapsible */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
                >
                  <span>{group.title}</span>
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
                
                {/* Group Items - Animated Collapse */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-1 pt-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-red-600/20 to-yellow-600/20 text-white border-l-2 border-red-500"
                              : "text-white/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-4 space-y-3 bg-black/20">
        <div className="px-2 py-2 rounded-lg bg-white/5 backdrop-blur-sm">
          <p className="text-sm font-medium truncate text-white">{user?.name}</p>
          <p className="text-xs text-white/60 truncate">{user?.email}</p>
          {user?.role === "admin" && (
            <span className="inline-block mt-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded font-semibold">
              Admin
            </span>
          )}
          {user?.role === "judge" && (
            <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded font-semibold">
              Judge
            </span>
          )}
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full justify-start gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/hackitnow-logo.png" alt="HackItNow" className="h-8" />
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-white hover:bg-white/10"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 bg-slate-900 border-l border-white/10">
            <div className="h-full flex flex-col">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-white/10 bg-black/40 backdrop-blur-md sticky top-0 h-screen flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
