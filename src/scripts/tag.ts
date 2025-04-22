type Tag = {
  tag: string;
  count: number;
};

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
