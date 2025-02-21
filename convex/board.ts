import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const images = [
  "/1.svg",
  "/2.svg",
  "/3.svg",
  "/4.svg",
  "/5.svg",
  "/6.svg",
  "/7.svg",
  "/8.svg",
  "/9.svg",
  "/10.svg",
  "/11.svg",
  "/12.svg",
  "/13.svg",
  "/14.svg",
  "/15.svg",
];

export const create = mutation({
  args:{
    orgId:v.string(),
    title:v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
      throw new Error("Unauthorized");
    }

    const randomImage = images[Math.floor(Math.random()* images.length)];

    const board = await ctx.db.insert("boards",{
      title:args.title,
      orgId:args.orgId,
      authorId:identity.subject,
      authorName:identity.name!,
      imageurl:randomImage,

    });

    return board;
  }
});

export const remove = mutation({
  args:{
    id:v.id("boards"),
  },
  handler:async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
      throw new Error("Unauthorized");
    }


    // for specific users creaters
    
    // const board = await ctx.db.get(args.id);

    // if(board && (board.authorId !== identity.subject)){
    //   throw new Error("Unauthorized");
    // }  

    const existingFavorite = await ctx.db.query("userFavorites")
      .withIndex("by_user_board",(q)=>q.eq("userId",identity.subject).eq("boardId",args.id))
      .unique();

    if(existingFavorite){
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);
  }
});

export const update = mutation({
  args:{
    id:v.id("boards"),
    title:v.string(),
  },
  handler:async (ctx, args) => {
    const title=args.title.trim();
    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
      throw new Error("Unauthorized");
    }
    if(!title){
      throw new Error("Title is required");
    }

    if(title.length > 60){
      throw new Error("Title is too long");
    }

    const board = await ctx.db.patch(args.id,{
      title:title,
    });

    return board;
  }
});

export const favorite = mutation({
  args:{
    id:v.id("boards"),
    orgId:v.string(),
  },
  handler:async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if(!board){
      throw new Error("Board not found");    
    }

    const existingFavorite = await ctx.db.query("userFavorites")
      .withIndex("by_user_board_org",(q)=>{
        return q.eq("userId",identity.subject).eq("boardId",args.id).eq("orgId",args.orgId);
      }).unique();

    if(existingFavorite){
      throw new Error("Board already favorited");
    }

    const favorite = await ctx.db.insert("userFavorites",{
      userId:identity.subject,
      boardId:args.id,
      orgId:args.orgId,
    });

    return favorite;
  }
});


export const unfavorite = mutation({
  args:{
    id:v.id("boards"),
  },
  handler:async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if(!identity){
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if(!board){
      throw new Error("Board not found");    
    }

    const existingFavorite = await ctx.db.query("userFavorites")
      .withIndex("by_user_board",(q)=>{
        return q.eq("userId",identity.subject).eq("boardId",args.id);
      }).unique();

    if(!existingFavorite){
      throw new Error("favorited board not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return favorite;
  }
});

export const get = query({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id);
    
    return board; 
  }
})