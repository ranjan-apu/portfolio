import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';
import { postUrl, routeFromUrl } from '../../lib/utils';
import { SITE_TITLE, SITE_DESCRIPTION } from '../../consts';

const posts = await getCollection('blog', ({ data }) => !data.draft);

const postPages = Object.fromEntries(
  posts.map((post) => {
    const route = routeFromUrl(postUrl(post));
    return [
      route,
      {
        title: post.data.title,
        description: post.data.description,
      },
    ];
  })
);

const pages = {
  default: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  ...postPages,
};

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [
      [26, 26, 26],
      [37, 37, 37],
    ],
    border: { color: [255, 140, 66], width: 8, side: 'inline-start' },
    padding: 60,
    font: {
      title: { color: [236, 234, 233], size: 64, lineHeight: 1.2 },
      description: { color: [168, 165, 162], size: 32, lineHeight: 1.4 },
    },
  }),
});
