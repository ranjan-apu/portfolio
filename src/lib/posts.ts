import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function topicSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Display names for tags whose slug form reads badly ("ai", "distributed-systems"). */
const TOPIC_LABELS: Record<string, string> = {
  ai: 'AI',
  rag: 'RAG',
  llm: 'LLMs',
  api: 'APIs',
  'distributed-systems': 'Distributed systems',
  'developer-tools': 'Developer tools',
};

export function topicLabel(tag: string): string {
  const slug = topicSlug(tag);
  const known = TOPIC_LABELS[slug];
  if (known) return known;
  const words = slug.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function topicUrl(tag: string): string {
  return `/topics/${topicSlug(tag)}/`;
}

export function topicsFor(posts: Post[]) {
  const topics = new Map<string, { name: string; label: string; slug: string; count: number }>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = topicSlug(name);
      const existing = topics.get(slug);
      if (existing) existing.count++;
      else topics.set(slug, { name, label: topicLabel(name), slug, count: 1 });
    }
  }
  return [...topics.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Posts that share at least one topic, best match first. Never pads with unrelated posts. */
export function relatedPosts(posts: Post[], post: Post, count = 2): Post[] {
  const tags = new Set(post.data.tags.map(topicSlug));
  return posts
    .filter((other) => other.id !== post.id)
    .map((other) => ({
      post: other,
      rank: other.data.tags.filter((tag) => tags.has(topicSlug(tag))).length,
    }))
    .filter((item) => item.rank > 0)
    .sort((a, b) => b.rank - a.rank || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, count)
    .map((item) => item.post);
}

export function seriesPosts(posts: Post[], post: Post): Post[] {
  if (!post.data.series) return [];
  return posts
    .filter((item) => item.data.series === post.data.series)
    .sort(
      (a, b) =>
        (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0) ||
        a.data.date.getTime() - b.data.date.getTime(),
    );
}
