"use client";

import Image from "next/image";
import { Overlay } from "./overlay";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@clerk/clerk-react";
import { Footer } from "./footer";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/action";
import { MoreHorizontal } from "lucide-react";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface BoardCardProps{
  id:string
  title:string
  imageurl:string
  authorId:string
  authorName:string
  createdAt:number
  orgId:string
  isFavorite:boolean
}

export const BoardCard = ({
  id,
  title,
  imageurl,
  authorId,
  authorName,
  createdAt,
  orgId,
  isFavorite
}:BoardCardProps) =>{
  const {userId} = useAuth();

  const authorLabel = authorId === userId ? "You" : authorName;

  const createdAtLabel = formatDistanceToNow(new Date(createdAt),{
    addSuffix:true
  });

  console.log(JSON.stringify({id,title,imageurl,authorId,authorName,createdAt,orgId}));

  const {mutate:onFavorite,isLoading:loadingFavorite} = useApiMutation(api.board.favorite); 

  const unfavorite = useMutation(api.board.unfavorite); 

  const toggleFavorite = () => {
    if(isFavorite){
      console.log("unFavorite",id);
      unfavorite({id:id as Id<"boards">})
        .catch((e)=>{
          toast.error("Failed to unfavorite board");
        });
    }else{
      onFavorite({id,orgId})
      .catch((e)=>{
        toast.error("Failed to favorite board");
      });
    }
  }

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/127] border rounded-lg flex
      flex-col justify-between overflow-hidden">
        <div className="relative flex-1 bg-amber-50">
          <Image
            src={imageurl}
            alt={title}
            fill
            className="object-fit"
          />
          <Overlay/>
          <Actions
            id={id}
            title={title}
            side="right"
          >
            <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity
            px-3 py-2 outline-none">
              <MoreHorizontal
                className="text-white opacity-75 hover:opacity-100 transition-opacity"
              />
            </button>
          </Actions>
        </div>
        <Footer
          isFavorite={isFavorite}
          title={title}
          authorLable={authorLabel}
          createdAtLable={createdAtLabel}
          onClick={toggleFavorite}
          disabled={loadingFavorite}
        />
      </div>
    </Link>
  )
}

BoardCard.Skeleton = function BoardCardSkeleton(){
  return (
    <div className="aspect-[100/127] rounded-lg overflow-hidden">
      <Skeleton  className="h-full w-full"/>
    </div>
  );
}