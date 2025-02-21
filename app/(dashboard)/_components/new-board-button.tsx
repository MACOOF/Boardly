"use client";

import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export const NewBoardButton = ({orgId,disabled}:{orgId:string;disabled?:boolean}) => {
  const router = useRouter();
  const {mutate,isLoading} = useApiMutation(api.board.create);

  const onClick = () => {
    mutate({
      orgId,
      title:"Untitled"
    })
    .then((id)=>{
      toast.success("Board created");
      router.push(`/board/${id}`);
    })
    .catch((e)=>{
      toast.error("Failed to create board");
    })
  }
  
  return (
    <button
      disabled={disabled||isLoading}
      onClick={onClick}
      className={cn(
        "w-full h-full col-span-1 aspect-[100/27] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6"
      , (disabled || isLoading)&& "hover:bg-blue-600 cursor-not-allowed opacity-75")}
    >
      <div />
      <Plus className="h-12 w-12 text-white stroke-1"/>
      <p className="text-xs text-white font-light">
        New board
      </p>
    </button>
  )
}