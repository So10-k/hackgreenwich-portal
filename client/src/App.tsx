import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import Teammates from "./pages/Teammates";
// import Teams from "./pages/Teams";
import Resources from "./pages/Resources";
import Participants from "./pages/Participants";
import Announcements from "./pages/Announcements";
import AdminPanel from "./pages/AdminPanel";
import Submissions from "./pages/Submissions";
import Registration from "./pages/Registration";
import Schedule from "./pages/Schedule";
import Sponsors from "./pages/Sponsors";
import { useSupabaseAuth } from "./_core/hooks/useSupabaseAuth";
import { Loader2 } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, getTrpcClient } from "./lib/trpc-supabase";

const queryClient = new QueryClient();
const trpcClient = getTrpcClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useSupabaseAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    setLocation("/signin");
    return null;
  }

  return <Component />;
}

function Router() {
  const { loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/register" component={() => <ProtectedRoute component={Registration} />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      {/* Team features commented out - using Devpost */}
      {/* <Route path="/teammates" component={() => <ProtectedRoute component={Teammates} />} /> */}
      {/* <Route path="/teams" component={() => <ProtectedRoute component={Teams} />} /> */}
      <Route path="/resources" component={() => <ProtectedRoute component={Resources} />} />
      <Route path="/participants" component={() => <ProtectedRoute component={Participants} />} />
      <Route path="/announcements" component={() => <ProtectedRoute component={Announcements} />} />
      <Route path="/admin" component={() => <ProtectedRoute component={AdminPanel} />} />
      <Route path="/submissions" component={() => <ProtectedRoute component={Submissions} />} />
      
      {/* Public pages */}
      <Route path="/schedule" component={Schedule} />
      <Route path="/sponsors" component={Sponsors} />
      
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </trpc.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
