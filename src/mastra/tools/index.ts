import { createTool } from "@mastra/core";
import { z } from "zod";
import { fetchRedditPosts, SimplifiedRedditPostSchema } from "@root/src/main";
import { savePostsToPDF } from "../util";

export const subredditPostExtractor = createTool({
  id: "subredditPostExtractor",
  description:
    "This tool fetches posts from a give subreddit and returns. Access this if the user wants to fetch posts from a subreddit",
  inputSchema: z.object({
    sub: z
      .string()
      .describe(
        "This is the name of the subreddit that the user passes e.g cars subreddit or finance subreddit"
      ),
  }),
  outputSchema: z.array(SimplifiedRedditPostSchema),
  execute: async ({ context }) => {
    return await fetchRedditPosts(context.sub);
  },
});

export const saveToFile = createTool({
  id: "createFileTool",
  description: "This tools saves JSON data to a file",
  inputSchema: z.object({ items: z.array(SimplifiedRedditPostSchema) }),
  outputSchema: z.string(),
  execute: async ({ context }) => {
    await savePostsToPDF(context.items, "reddit_posts");
    return "done";
  },
});
