// convex/video.ts

import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { embedd } from "../src/lib/embedd"; // Embedding library
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

// 1. Fetch multiple videos by IDs
export const fetchVideosData = internalQuery({
  args: { ids: v.array(v.id("videos")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const video = await ctx.db.get(id);
      if (video) results.push(video);
    }
    return results;
  },
});

// 2. Find similar videos using embeddings
export const similarVideos = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const embeddings = await embedd(args.query);
    console.log("Embeddings:", embeddings);

    const result = await ctx.vectorSearch("videos", "by_search", {
      vector: embeddings,
      limit: 2,
    });

    const videoIds = result.map((r) => r._id);

    const videos: Array<Doc<"videos">> = await ctx.runQuery(
      internal.video.fetchVideosData,
      { ids: videoIds }
    );
    return videos;
  },
});

// 3. Insert a new video with embeddings
export const insertVideos = internalMutation({
  args: {
    title: v.string(),
    url: v.string(),
    description: v.string(),
    thumbnail: v.string(),
    category: v.string(),
    embeddings: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    if (
      !args.title ||
      !args.url ||
      !args.description ||
      !args.thumbnail ||
      !args.category ||
      !args.embeddings
    ) {
      throw new Error("Missing required fields");
    }

    const video = await ctx.db.insert("videos", {
      title: args.title,
      url: args.url,
      description: args.description,
      thumbnail: args.thumbnail,
      category: args.category,
      embeddings: args.embeddings,
    });
    return video;
  },
});

// 4. Add a new video and generate embeddings
export const addVideo = action({
  args: {
    title: v.string(),
    url: v.string(),
    description: v.string(),
    thumbnail: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    if (
      !args.title ||
      !args.url ||
      !args.description ||
      !args.thumbnail ||
      !args.category
    ) {
      throw new Error("Missing required fields");
    }

    const embeddings = await embedd(args.title);
    await ctx.runMutation(internal.video.insertVideos, {
      title: args.title,
      url: args.url,
      description: args.description,
      thumbnail: args.thumbnail,
      category: args.category,
      embeddings: embeddings,
    });

    return true;
  },
});

// 5. Fetch all videos
export const allVideos = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db.query("videos").collect();
    return videos;
  },
});

// 6. Fetch a single video by ID
export const getVideo = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    return await ctx.db.get(args.id);
  },
});
