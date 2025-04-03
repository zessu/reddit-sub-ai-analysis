import { createTool } from "@mastra/core";
import { z } from "zod";
import { fetchRedditPosts, SimplifiedRedditPostSchema } from "@root/src/main";

export const subredditPostExtractor = createTool({
  id: "subredditPostExtractor",
  description: "Extracts reddit posts from a subreddit.",
  inputSchema: z.object({ sub: z.string().describe("name of the sub") }),
  outputSchema: z.array(SimplifiedRedditPostSchema),
  execute: async ({ context }) => {
    return await fetchRedditPosts(context.sub);
  },
});
