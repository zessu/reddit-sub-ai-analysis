![logo](upvote.gif)

## Reddit Agent

Fetch posts from a Reddit sub and analyze them with AI.

### Why?

**Scenario:** Market Research for a New Product Launch

**Context:** Imagine a company, "TechInnovate," is developing a new noise-canceling headphone designed specifically for gamers. They want to understand the current sentiment and needs of their target audience (gamers) before launching the product. Rather than relying on assumptions or expensive surveys, they decide to leverage the vast, real-time data available on Reddit.
<br /> <br />
![Reddit Sub AI agent](fetcher.png)

![Workflow example diagram](workflow.png)

### Technical Details

- **Language:** NodeJS
- **APIs:** RapidAPI-Reddit
- **Data Source:** Reddit

### Benefits

- Provides real-time insights into user sentiment and needs.
- Offers a cost-effective alternative to traditional market research.
- Allows for data driven product development.
- Can be used for ongoing product monitoring.

### Usage

1.  **Configuration:** Add check env.example for needed API keys. e.g RapidAPI and OpenAI/Google. Also configure prompts as queries you need to be passed to the agent. Configure/Change Agent instructions to your own liking.
2.  **Execution:** Pull repo and install packages e.g bun install then run bunx/npx mastra dev. Navigate to localhost:4111 and either use the defined workflow or just ask the bot. The Agent is configured to use an MCP server to save your data to spreadsheets. You will need to authenticate this.
3.  **Output:** The agent will either save your data on spreadsheets, a local file (under the .mastra folder). Output can also be viewed through the terminal

### Output Data Example.

```json
[
  {
    "authorName": "trat_la",
    "authorId": "t2_eillqiu9",
    "authorUrl": "https://www.reddit.com/user/trat_la",
    "contentText": "We know this is normally the place for Reddit product, platform, and ~~Oscar’s~~ updates, so if you want to see Reddit, Inc. investor-related news and content, head on over to r/RDDT. Spoiler alert: as a community, r/RDDT will have regulatory limitations and operate slightly differently ([lawyercat](https://i.redd.it/p6bk2mmlxjoc1.gif)).",
    "creationDate": "2024-03-21T17:28:58.245000+0000",
    "title": "Introducing a new community: r/RDDT",
    "url": "https://www.reddit.com/r/reddit/comments/1bkc508/introducing_a_new_community_rrddt/"
  }
  // ... more posts
]
```

### Upcoming features

- [ ] Agent Memory - agent remembers past conversations
- [x] Agent workflows - agent does A, then B, then C with conditional logic
- [x] Save to local file
- [ ] Agent RAG capabilities
- [x] Save data to Google Spreadsheet
- [ ] Agents send email when its done
- [ ] Agent autonomy. Agent works at a set schedule without needing user input
