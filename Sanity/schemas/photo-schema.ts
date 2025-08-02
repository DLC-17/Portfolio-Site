// schemas/photo.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt Text" }
      ]
    }),
    defineField({ name: "caption", type: "string" })
  ]
});

