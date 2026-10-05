import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, AUTHOR } from '../consts';
import { postUrl } from '../lib/utils';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    trailingSlash: false,
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: postUrl(post),
      author: post.data.author || AUTHOR,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
};