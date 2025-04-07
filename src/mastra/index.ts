import { Mastra } from "@mastra/core";
import { redditInfoAgent } from "@root/src/mastra/agents/redditAgent";
import { redditExtractorWorkFlow } from "@root/src/mastra/workflows/index";

export const mastra = new Mastra({
  agents: { redditInfoAgent },
  workflows: { redditExtractorWorkFlow },
});

// (async () => {
//   const { runId, start } = mastra
//     .getWorkflow("redditExtractorWorkFlow")
//     .createRun();

//   console.log("Run", runId);

//   const runResult = await start({
//     triggerData: { sub: process.env.SUB as string },
//   });

//   console.log("Final output:", runResult.results);
// })();
