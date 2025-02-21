"use client"; 
import { useOrganizationList } from "@clerk/nextjs";
import { Item } from "./items";

export const List = () => {
    const { userMemberships } = useOrganizationList({
      userMemberships:{
        infinite:true,
      }
    });

    if (!userMemberships?.data?.length) return null;

    return (
       <ul className="space-y-4">
            {userMemberships.data.map((mem) => (
             <Item key={mem.id} {...mem.organization} />
            ))}
        </ul> 
    );
};
