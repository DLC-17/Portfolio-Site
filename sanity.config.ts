import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import project from "./Sanity/schemas/project-schemas";
import photoSchema from "./Sanity/schemas/photo-schema";
import postSchema from "./Sanity/schemas/post-schema";
import photogroupSchema from "./Sanity/schemas/photogroup-schema";

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? (() => { throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set"); })(),

  dataset: "production",

  title: "website",

  apiVersion: "2023-07-26",

  basePath: "/admin-studio",

  plugins: [structureTool()],

  schema: { types:[project,photoSchema,postSchema,photogroupSchema] }
});

export default config;