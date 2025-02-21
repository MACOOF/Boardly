import { v } from "convex/values";
import { query } from "./_generated/server";
import { favorite } from "./board";
import {getAllOrThrow} from "convex-helpers/server/relationships"

export const get = query({
  args: {
    orgId: v.string(),
    search: v.optional(v.string()),
    favorites:v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if(args.favorites){
      const favoriteBoards=await ctx.db.query("userFavorites")
        .withIndex("by_user_org",(q)=>
          q 
          .eq("userId",identity.subject)
          .eq("orgId",args.orgId)
        )
        .order("desc")
        .collect();

        const ids=favoriteBoards.map((b)=>{
          return b.boardId;
        });
        const boards = await getAllOrThrow(ctx.db,ids);

        return boards.map((board)=>({
          ...board,
          isFavorite:true,
        }));
    }

    const title = args.search as string;
    let boards = [];

    if(title){
      boards = await ctx.db.query("boards")
                .withSearchIndex("search_title",(q)=>
                  q
                  .search("title",title)
                  .eq("orgId",args.orgId)
                )
                .collect();
    }else{
      // Fetch all boards for the organization
      boards = await ctx.db
        .query("boards")
        .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
        .order("desc")
        .collect();
    }
  
      // Fetch all favorite boardIds for the user in the organization
      const userFavorites = await ctx.db
        .query("userFavorites")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", args.orgId)
        )
        .collect();
  
      // Convert favorites to a Set for quick lookup
      const favoriteBoardIds = new Set(userFavorites.map((fav) => fav.boardId));
  
      // Map boards with isFavorite flag
      const boardWithFavorites = boards.map((board) => ({
        ...board,
        isFavorite: favoriteBoardIds.has(board._id),
      }));
  
    return boardWithFavorites;
  },
});
