import { z } from "zod";

type Author = {
  deleted: boolean;
  icon: string;
  id: string;
  name: string;
  nsfw: boolean;
  suspended: boolean;
  url: string;
};

type ContentMedia = {
  height: number;
  url: string;
  width: number;
  altText?: string;
};

type Content = {
  gallery: null | any;
  gif: ContentMedia;
  image: ContentMedia;
  link: {
    thumbnail: ContentMedia;
    url: string;
  };
  text: string;
  video: ContentMedia & {
    duration: number;
    thumbnail: ContentMedia;
  };
  video_embed: {
    authorName: string;
    authorUrl: string;
    description: string;
    providerName: string;
    providerUrl: string;
    title: string;
    url: string;
  };
};

type Subreddit = {
  banner: string;
  icon: string;
  id: string;
  name: string;
  nsfw: boolean;
  subscribers: number;
  title: string;
  type: string;
  url: string;
};

type RedditPost = {
  author: Author;
  comments: number;
  content: Content;
  contentLanguage: string;
  creationDate: string;
  editedDate: string;
  flair: string;
  id: string;
  nsfw: boolean;
  score: number;
  shares: number;
  subreddit: Subreddit;
  thumbnail: ContentMedia;
  title: string;
  upvoteRatio: number;
  url: string;
};

type cursorInfo = {
  hasNextPage: boolean;
  nextPageCursor: string | null;
};

type ApiResponse = {
  data: RedditPost[];
  pageInfo: cursorInfo;
};

export const SimplifiedRedditPostSchema = z.object({
  authorName: z.string(),
  authorId: z.string(),
  authorUrl: z.string(),
  contentText: z.string(),
  creationDate: z.string(),
  title: z.string(),
  url: z.string(),
});

export type SimplifiedRedditPost = z.infer<typeof SimplifiedRedditPostSchema>;

export async function fetchRedditPosts(
  subreddit: string
): Promise<SimplifiedRedditPost[]> {
  const allPosts: RedditPost[] = [];
  let nextCursor: string | null = null;
  const fetchCount = 4;

  for (let i = 0; i < fetchCount; i++) {
    const baseUrl = `https://reddit-scraper2.p.rapidapi.com/sub_posts_v3?sub=https://www.reddit.com/r/${subreddit}/&sort=NEW&time=ALL`;
    const url = nextCursor ? `${baseUrl}&after=${nextCursor}` : baseUrl;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-host": process.env.RAPID_API_HOST as string,
        "x-rapidapi-key": process.env.RAPID_API_KEY as string,
      },
    };

    try {
      const response = await fetch(url, options);
      const result = (await response.json()) as ApiResponse;
      allPosts.push(...result.data);
      console.log("GrvBb3d p0$ts, !0VDing m0r3 ...");
      nextCursor = result.pageInfo.nextPageCursor;

      if (!result.pageInfo.hasNextPage) break;

      // Add a small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error fetching page ${i + 1}:`, error);
      break;
    }
  }

  console.log("GrVbb3d all p0$t$ $3nD!nG PROMPT to 3XtRvCt...");
  return allPosts.map((post) => ({
    authorName: post.author.name,
    authorId: post.author.id,
    authorUrl: post.author.url,
    contentText: post.content.text,
    creationDate: post.creationDate,
    title: post.title,
    url: post.url,
  }));
}
