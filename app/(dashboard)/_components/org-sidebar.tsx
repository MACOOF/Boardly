"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher } from "@clerk/clerk-react";
import { Layout, LayoutDashboard, Star } from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const font = Poppins({
    subsets: ["latin"],
    weight: "600",
});
export const OrgSidebar = () => {
    const searchParams = useSearchParams();
    const favorites = searchParams.get("favorites"); 

    return (
        <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5">
            <Link href="/">
                <div className="flex items-center gap-x-2">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={40}
                        height={40}
                    />
                    <span className={cn(
                              "text-black font-semibold text-xl ml-2",
                              font.className
                            )}>
                              Boardly
                    </span>
                  </div>
            </Link>
            <OrganizationSwitcher
            hidePersonal
            appearance={{
              elements: {
                rootBox: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                },
                organizationSwitcherTrigger: {
                  padding: "6px",
                  width: "100%",
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                },
                organizationSwitcher: {
                  width: "200px", // Adjust this to your desired width
                },
                organizationSwitcherPopoverCard: {
                  width: "300px", // Controls the dropdown width
                },
              },
            }}
          />

            <div className="space-y-1 w-full">
              <Button
                asChild
                size="lg"
                className="font-normal justify-start px-2 w-full"
                variant={favorites?"ghost":"secondary"}
              >
                <Link href="/">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Team boards
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="font-normal justify-start px-2 w-full"
                variant={favorites?"secondary":"ghost"}
              >
                <Link href={{
                  pathname:"/",
                  query:{ favorites:true } 
                }}>
                  <Star className="mr-2 h-4 w-4" />
                  Favorate boards
                </Link>
              </Button>
            </div>
        </div>
    );
}