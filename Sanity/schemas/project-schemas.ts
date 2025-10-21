import { title } from "process";

// schemas/project.ts
export default {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Project Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    },
    {
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
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
    },
    {
      name: "githubUrl",
      title: "GitHub Repo URL",
      type: "url",
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    },
    {
      name: "featured",
      title: "Featured",
      type: "boolean"
    },
  ],
};
