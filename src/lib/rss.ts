import Parser from "rss-parser";

export interface Post {
  title: string;
  pubDate: string;
  contentSnippet: string;
  link: string;
}

const parser = new Parser();

export async function getSubstackPosts(count = 6): Promise<Post[] | null> {
  try {
    const feed = await parser.parseURL(
      "https://sarrahsandbox.substack.com/feed"
    );
    return feed.items.slice(0, count).map((item) => ({
      title: item.title ?? "",
      pubDate: item.pubDate ?? "",
      contentSnippet: item.contentSnippet ?? "",
      link: item.link ?? "https://sarrahsandbox.substack.com",
    }));
  } catch {
    return null;
  }
}

export function formatDate(pubDate: string): string {
  if (!pubDate) return "";
  try {
    return new Date(pubDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return pubDate;
  }
}

export function truncate(text: string, chars = 120): string {
  if (text.length <= chars) return text;
  return text.slice(0, chars).trimEnd() + "...";
}
