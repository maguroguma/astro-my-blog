type Tag = {
  tag: string;
  count: number;
};

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

export { aggregateTags };
