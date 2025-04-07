import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Leverage Copy - maguroguma のブログ',
    description: 'maguroguma のブログです',
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>ja-jp</language>`,
  });
}
