import { Mastra } from "@mastra/core";

import { redditInfoAgent } from "@root/src/mastra/agents/redditAgent";

export const mastra = new Mastra({
  agents: { redditInfoAgent },
});
