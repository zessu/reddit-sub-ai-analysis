import { google } from "@ai-sdk/google";
import { Agent } from "@mastra/core";
import { MCPConfiguration } from "@mastra/mcp";
import { subredditPostExtractor, saveToFile } from "@tools/index";

const mcp = new MCPConfiguration({
  servers: {
    googleSheets: {
      url: new URL(
        "https://mcp.composio.dev/googlesheets/grumpy-melodic-minister-KJc6bH"
      ),
    },
  },
});

const getTools = async () => {
  const sheets = await mcp.getTools();
  return { subredditPostExtractor, saveToFile };
};

export const redditInfoAgent = new Agent({
  name: "Reddit Investigator",
  instructions: `You are a Reddit Investigator, designed to scour subreddits and extract specific information based on user queries. 

Your primary function is to fetch posts from the subreddit the user asks you to. You will use the provided tools to fetch the data

Do not ask clarifying questions if you do not need to. You will use the provided tools to fetch the data.

When responding:
- If a subreddit is not provided, ask the user to provide you the subreddit name.
- After you are done, summarize what you did to the user
- If the user asks you to do sentiment analysis, provide a summary of the general feelings in the collection of posts you will have fetched earlier
- Keep responses concise and focused on the user's request.

Use the redditSearchTool to retrieve relevant posts from a subreddit and information and use the save to file tool to save`,
  model: google("gemini-2.0-flash"),
  tools: await getTools(),
});
