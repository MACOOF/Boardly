import { api } from "@/convex/_generated/api";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET!,
});

export async function POST(request: Request) {

  const authorized = await auth();
  // Get the current user from your database
  const user = await currentUser();
  
  console.log("AUTH_INFO",{
    authorized,
    user
  });

  if (!authorized || !user) {
    return new Response("Unauthorized", { status: 403 });
  }

  const {room} = await request.json();
  const board = await convex.query(api.board.get,{id:room});

  console.log("AUTH_INFO",{
    room,
    board,
    boardOrgId:board?.orgId,
    userOrgId:authorized.orgId
  });

  if(board?.orgId !== authorized.orgId){
    return new Response("Unauthorized", { status: 401 });
  }
  const userInfo = {
    name:user.firstName || "Ananymous",
    picture:user.imageUrl!,
  }

  console.log({ userInfo });
  // Start an auth session inside your endpoint
  const session = liveblocks.prepareSession(
    user.id,
    { userInfo:userInfo } // Optional
  );

  // Use a naming pattern to allow access to rooms with wildcards
  // Giving the user read access on their org, and write access on their group
  if(room){
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the user and return the result
  const { status, body } = await session.authorize();

  console.log({status,body},"ALLOWED");
  return new Response(body, { status });
}
