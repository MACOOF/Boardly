"use client";

import { Actions } from "@/components/action";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useRenameModal } from "@/store/use-rename-modal";
import { useQueries, useQuery } from "convex/react";
import { Menu } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

interface InfoProps{
  boardId:string;
};

const font = Poppins({
  subsets: ["latin"],
  weight: "600",
});

const TabSeparator = () => {
  return (
    <div className="text-neutral-200 px-1.5">
      |
    </div>
  )
}

export const Info = ({
  boardId,
}:InfoProps) => {
  const {onOpen} = useRenameModal();  

  const data = useQuery(api.board.get,{id:boardId as Id<"boards">});

  if(!data) return <InfoSkeleton/>;
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
        <Hint lable="Go to boards">
        <Link href="/">
          <Button className="px-2" variant={"board"}>
            <Image
              src="/logo.svg"
              alt="Logo"
              height={40}
              width={40}
              />
            <span className={cn(
              "text-black font-semibold text-xl ml-2",
              font.className
            )}>
              Boardly
            </span>
          </Button>
        </Link>
        </Hint>
        <TabSeparator/>
        <Hint lable="Rename board">
          <Button 
            variant={"board"}
            className="text-base font-normal px-2"
            onClick={()=>{onOpen(data._id,data.title)}}
            >
            {data.title}
        </Button>
        </Hint>
        <TabSeparator/>
        <Actions 
          id={data._id}
          title={data.title}
          side="bottom"
          sideOffset={10}
        >
          <div>
            <Hint lable="Main menue" side="bottom" sideOffset={10}>
              <Button
                variant={"board"}
                size={"icon"}
              >
                <Menu />
              </Button>
            </Hint>
          </div> 
        </Actions>
      </div>
  );
} ;

export const InfoSkeleton =()=>{
  return (
    <div className="w-[300px] absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md"/>
  );
};