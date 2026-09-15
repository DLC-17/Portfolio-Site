import type { Rule } from "sanity";

export default {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: Rule) => rule.required().min(2).max(100),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      description: "A short summary of the post.",
      type: "text",
      rows: 3,
      validation: (rule: Rule) => rule.max(300),
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        { 
          type: "code",
          options: {
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "Python", value: "python" },
              { title: "BASH", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "SQL", value: "sql" }
            ],
            withFilename: true
          }
        },
      ],
    },
  ],
};
