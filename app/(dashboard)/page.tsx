"use client";

import { useSearchParams } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { EmptyOrg } from "./_components/empty-org";
import { BoardList } from "./_components/board-list";

export default function DashboardPage() {
  const { organization } = useOrganization();
  const searchParams = useSearchParams();

  const query = {
    search: searchParams.get("Search") || "",
    favorites: searchParams.get("favorites") || "",
  };

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList orgId={organization.id} query={query} />
      )}
    </div>
  );
}
