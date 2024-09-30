import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const notes = await getCollection("notes");
  return rss({
    title: "Hyun Don's Blog",
    description:
      "A blog about web development, software engineering, and other things I find interesting.",
    site: context.site,
    items: notes.map((note) => ({
      title: note.title,
      pubDate: note.summary,
      description: note.summary,
      link: `/notes/${note.slug}`,
      customData: {
        language: note.language,
      },
    })),
  });
}
