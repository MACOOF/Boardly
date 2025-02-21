"use client";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useRenameModal } from "@/store/use-rename-modal";
import { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export const RenameModal = () => {
  const {mutate,isLoading} = useApiMutation(api.board.update);
  const {isOpen,onClose,initialValues} = useRenameModal();

  const [title,setTitle] = useState(initialValues.title); 

  useEffect(() => { 
    setTitle(initialValues.title);
  },[initialValues.title]);

  const onSubmit : FormEventHandler<HTMLFormElement>= (e) => {
    e.preventDefault();

    mutate({
      id:initialValues.id,
      title
    }).then(()=>{
      toast.success("Board title updated");
      onClose();
    }).catch(()=>{
      toast.error("Failed to update board title");
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit board title
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Enter a new title for the board
        </DialogDescription>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input 
            disabled={isLoading}
            required
            maxLength={60}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
          />
          <DialogFooter>
              <DialogClose>
                <Button type="button" variant={"outline"}>
                  Cancle
                </Button>
              </DialogClose>
              <Button disabled={isLoading} type="submit">
                Save
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}