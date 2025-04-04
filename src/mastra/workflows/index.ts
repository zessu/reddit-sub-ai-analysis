import { Mastra } from "@mastra/core";
import { Step, Workflow } from "@mastra/core";
import { z } from "zod";
import {
  fetchRedditPosts,
  SimplifiedRedditPostSchema,
  SimplifiedRedditPost,
} from "@root/src/main";
import { redditInfoAgent } from "@root/src/mastra/agents/redditAgent";

const getSubredditPosts = new Step({
  id: "fetchRedditPosts",
  inputSchema: z.object({
    sub: z.string().describe("name of the sub"),
  }),
  outputSchema: z.array(SimplifiedRedditPostSchema),
  execute: async ({ context }) => {
    const sub = context.inputData.sub;
    return await fetchRedditPosts(sub);
  },
});

const qetInsights = new Step({
  id: "getInsights",
  inputSchema: z.object({
    sub: z
      .array(SimplifiedRedditPostSchema)
      .describe("subreddit posts you need insights for"),
  }),
  outputSchema: z.array(SimplifiedRedditPostSchema),
  execute: async ({ context }) => {
    const allPosts =
      context?.getStepResult<SimplifiedRedditPost[]>("fetchRedditPosts");
    const prompt = `
  ${process.env.PROMPT} "${allPosts}"
        `;
    const res = await redditInfoAgent.generate(prompt, {
      output: z.array(SimplifiedRedditPostSchema),
    });

    console.log(JSON.stringify(res.object));
    return res.object;
  },
});

export const redditExtractorWorkFlow = new Workflow({
  name: "redditExtractorWorkFlow",
  triggerSchema: z.object({
    sub: z.string(),
  }),
});

redditExtractorWorkFlow.step(getSubredditPosts).then(qetInsights);

redditExtractorWorkFlow.commit();
