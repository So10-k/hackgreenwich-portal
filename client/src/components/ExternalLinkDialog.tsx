import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle } from "lucide-react";

interface ExternalLinkDialogProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExternalLinkDialog({ url, isOpen, onClose, onConfirm }: ExternalLinkDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            External Link
          </DialogTitle>
          <DialogDescription>
            You are about to visit an external website. Please verify the URL before proceeding.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted p-3 rounded-md break-all">
          <p className="text-sm font-mono">{url}</p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="w-full sm:w-auto">
            <ExternalLink className="h-4 w-4 mr-2" />
            Continue to Site
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SafeExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SafeExternalLink({ href, children, className }: SafeExternalLinkProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={className}
      >
        {children}
      </a>
      <ExternalLinkDialog
        url={href}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
