// schemas/post.ts
export default {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    },
    {
      name: "author",
      title: "Author",
      type: "string",
    },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 2,
    },
    {
      name: "body",
      title: "Body Content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
};
