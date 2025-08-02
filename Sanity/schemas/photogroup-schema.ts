// schemas/photoGroup.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "photoGroup",
  title: "Photo Group",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "description", type: "text" }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" }
          ]
        }
      ]
    })
  ]
});
