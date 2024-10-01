import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const notes = await getCollection("notes");
  const sortedNotes = notes.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
  const rssLangTag = {
    English: "en",
    Korean: "ko",
  };

  return rss({
    title: "Hyun Don's Blog",
    description:
      "A blog about web development, software engineering, and other things I find interesting.",
    site: context.site,
    items: sortedNotes.map(({ data, slug }) => ({
      title: data.title,
      pubDate: data.pubDate,
      description: data.summary,
      link: `/notes/${slug}`,
      customData: `<language>${rssLangTag[data.language] || "en"}</language>`,
    })),
  });
}
