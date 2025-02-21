"use client";

import { CreateOrganization } from "@clerk/clerk-react";
import { Plus, X } from "lucide-react";
import { 
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { Hint } from "@/components/hint";

export const NewButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <Hint lable="Create organization" side="right" align="start" sideOffset={18}>
                      <button className="h-full w-full bg-white/25 rounded-md flex items-center justify-center opacity-60 hover:opacity-100 transition">
                          <Plus className="text-white" />
                      </button>
                    </Hint>
                </div>
            </DialogTrigger>
            <DialogContent className="p-0 border-none max-w-[480px]">
                <DialogTitle className="hidden">Create Organization</DialogTitle>
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    );
};
