import { Mastra } from "@mastra/core";
import { Step, Workflow } from "@mastra/core";
import { z } from "zod";
import {
  fetchRedditPosts,
  SimplifiedRedditPostSchema,
  SimplifiedRedditPost,
} from "@root/src/main";
import { redditInfoAgent } from "@root/src/mastra/agents/redditAgent";
import { savePostsToPDF } from "@util/index";

const getSubredditPosts = new Step({
  id: "fetchRedditPosts",
  inputSchema: z.object({
    sub: z.string().describe("name of the sub"),
  }),
  outputSchema: z.array(SimplifiedRedditPostSchema),
  execute: async ({ context }) => {
    console.log(context);
    const sub = context.triggerData.sub;
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
    console.log(`allPosts length is************`, allPosts.length);
    const prompt = `
  ${process.env.PROMPT} "${JSON.stringify(allPosts)}"
        `;

    console.log(`prompt is************`, prompt);
    try {
      const res = await redditInfoAgent.generate(prompt, {
        output: z.array(SimplifiedRedditPostSchema),
      });

      console.log(JSON.stringify(res.object));
      return res.object;
    } catch (error) {
      console.log(error);
      return [
        {
          authorName: "",
          authorId: "",
          authorUrl: "",
          contentText: "",
          creationDate: "",
          title: "",
          url: "",
        },
      ];
    }
  },
});

export const saveToFile = new Step({
  id: "saveToFile",
  inputSchema: z.object({ items: z.array(SimplifiedRedditPostSchema) }),
  outputSchema: z.string(),
  execute: async ({ context }) => {
    const allPosts =
      context?.getStepResult<SimplifiedRedditPost[]>("getInsights");
    savePostsToPDF(allPosts, "reddit_posts.pdf");
    return "done";
  },
});

export const redditExtractorWorkFlow = new Workflow({
  name: "redditExtractorWorkFlow",
  triggerSchema: z.object({
    sub: z.string(),
  }),
});

redditExtractorWorkFlow
  .step(getSubredditPosts)
  .then(qetInsights)
  .then(saveToFile);

redditExtractorWorkFlow.commit();
