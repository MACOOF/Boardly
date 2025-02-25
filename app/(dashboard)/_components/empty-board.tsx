"use client"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";;
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const EmptyBoard = () => {
  const router = useRouter();

  const {mutate,isLoading} = useApiMutation(api.board.create);
  const { organization } = useOrganization();

  const onClick = () => {
    if(!organization) return ;
    mutate({
      orgId:organization.id,
      title:"Untitled"
    })
    .then((id)=>{
      toast.success("Board created");
      router.push(`/board/${id}`);
    })
    .catch(()=>{
      toast.error("Failed to create board");
    })
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image
        src="/notes.svg"
        alt="Empty"
        width={140}
        height={140}
      />
      <h2 className="text-2xl font-semibold mt-6">
        Create your first board!
      </h2>
      <p className="text-muted-foreground text-sm mt-2">
        Start by creating a board for your organization
      </p>
      <div className="mt-6">
        <Button disabled={isLoading} size="lg" onClick={onClick} >
          Create board
        </Button>
      </div>
    </div>
  );
};