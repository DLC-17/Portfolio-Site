// schemas/project.ts
import type { Rule } from "sanity";

export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Project Title",
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
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (rule: Rule) => rule.required().max(500),
    },
    {
      name: "technologies",
      title: "Technologies Used",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "demoUrl",
      title: "Live Demo URL",
      type: "url",
      validation: (rule: Rule) =>
        rule.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    },
    {
      name: "githubUrl",
      title: "GitHub Repo URL",
      type: "url",
      validation: (rule: Rule) =>
        rule.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    },
  ],
};

