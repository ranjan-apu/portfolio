import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

export async function publishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function topicSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function topicUrl(tag: string): string {
  return `/topics/${topicSlug(tag)}/`;
}

export function topicsFor(posts: Post[]) {
  const topics = new Map<string, { name: string; slug: string; count: number }>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const slug = topicSlug(name);
      const existing = topics.get(slug);
      if (existing) existing.count++;
      else topics.set(slug, { name, slug, count: 1 });
    }
  }
  return [...topics.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function relatedPosts(posts: Post[], post: Post, count = 2): Post[] {
  const tags = new Set(post.data.tags.map(topicSlug));
  return posts.filter(other => other.id !== post.id)
    .sort((a, b) => {
      const rank = (item: Post) => item.data.tags.filter(tag => tags.has(topicSlug(tag))).length;
      return rank(b) - rank(a) || b.data.date.getTime() - a.data.date.getTime();
    }).slice(0, count);
}

export function seriesPosts(posts: Post[], post: Post): Post[] {
  if (!post.data.series) return [];
  return posts.filter(item => item.data.series === post.data.series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0) || a.data.date.getTime() - b.data.date.getTime());
}
