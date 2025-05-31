export type MarkdownBlogPost = {
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

export type Tag = {
  tag: string;
  count: number;
};
