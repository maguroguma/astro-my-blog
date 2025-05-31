import type { Tag } from '@/scripts/types';

// FIXME: テストを書く！

/** * Aggregates tags from an array of arrays of strings.
 * * @param tagsList - An array of arrays of strings representing tags.
 * * @returns An array of objects, each containing a tag and its count.
 * */
const aggregateTags = (tagsList: string[][]): Tag[] => {
  const tags: Tag[] = [];
  tagsList.forEach((tagsArray) => {
    tagsArray.forEach((tag) => {
      const existingTag = tags.find((t) => t.tag === tag);
      if (existingTag) {
        existingTag.count++;
      } else {
        tags.push({ tag, count: 1 });
      }
    });
  });

  tags.sort((a, b) => a.tag.localeCompare(b.tag));

  return tags;
};

/**
 * Filters global tags to include only those that are present in the recent tags.
 *
 * @param recentTags - An array of Tag objects representing recently used tags.
 * @param globalTags - An array of Tag objects representing all available tags.
 * @returns An array of Tag objects that are present in both recentTags and globalTags.
 */
const topTags = (recentTags: Tag[], globalTags: Tag[]): Tag[] => {
  const recentTagsSet = new Set(recentTags.map((tag) => tag.tag));
  const filteredGlobalTags = globalTags.filter((tag) =>
    recentTagsSet.has(tag.tag),
  );

  return filteredGlobalTags;
};

export { aggregateTags, topTags };
