import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuProps {
  user: any;
  onNavigate: (path: string) => void;
}

export function MobileMenu({ user, onNavigate }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setOpen(false);
    onNavigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-slate-900 border-white/10">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <img src="/hackgreenwich-logo.png" alt="HackGreenwich" className="h-8" />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-8">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 text-lg"
            onClick={() => handleNavigate("/")}
          >
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 text-lg"
            onClick={() => handleNavigate("/schedule")}
          >
            Schedule
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10 text-lg"
            onClick={() => handleNavigate("/sponsors")}
          >
            Sponsors
          </Button>
          
          <div className="border-t border-white/10 my-4" />
          
          {user ? (
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-lg"
              onClick={() => handleNavigate("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 text-lg"
                onClick={() => handleNavigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white text-lg"
                onClick={() => handleNavigate("/signup")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
