"use client";

import { cn } from "@/lib/utils";
import { useOrganization,useOrganizationList } from "@clerk/nextjs";
import Image from "next/image";

interface ItemsProps {
  id:string;
  name:string;
  imageUrl: string;
}

export const Item = ({id,name,imageUrl}:ItemsProps) => {
  const { organization } = useOrganization();
  const { setActive } = useOrganizationList();
  
  const isActive = organization?.id === id;

  const onClick = () => {
    if(!isActive) return;
    if(setActive)
      setActive({organization:id});
  }

  return (
    <div className="aspect-square relative">
      <Image 
        fill
        src={imageUrl}
        alt={name} 
        onClick={onClick}
        className={cn("rounded-md cursor-pointer opacity-75 hover:opacity-100 transition",isActive && "opacity-100")}
      />
    </div>
  );
}