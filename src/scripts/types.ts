export type MarkdownBlogPost = {
  frontmatter: {
    title: string;
    pubDate: Date;
    updatedAt?: Date;
    description: string;
    image?: {
      url: string;
      alt: string;
    };
    tags: string[];
  };
};
