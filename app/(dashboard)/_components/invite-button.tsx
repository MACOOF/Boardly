import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/nextjs";
import { Dialog,DialogContent,DialogTrigger,DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const InviteButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <DialogTitle className="hidden">Invite members</DialogTitle>
        <OrganizationProfile />
      </DialogContent>
    </Dialog>
  );
};
