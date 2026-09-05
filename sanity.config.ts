import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { deskStructure } from "./Sanity/desk-structure";
import project from "./Sanity/schemas/project-schemas";
import postSchema from "./Sanity/schemas/post-schema";
import resume from "./Sanity/schemas/resume-schema";

const singletonTypes = new Set(["resume"]);

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? (() => { throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set"); })(),

  dataset: "production",

  title: "David Coleman - Portfolio Studio",

  apiVersion: "2023-07-26",

  basePath: "/admin-studio",

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
  ],

  schema: {
    types: [project, postSchema, resume],
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(
          ({ action }) => action !== "delete" && action !== "duplicate"
        );
      }
      return prev;
    },
  },
});

export default config;