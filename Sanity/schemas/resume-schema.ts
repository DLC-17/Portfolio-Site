// schemas/resume-schema.ts
import type { Rule } from "sanity";

export default {
  name: "resume",
  title: "Resume",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "David Coleman - Resume",
      validation: (rule: Rule) => rule.required().max(100),
    },
    {
      name: "resumeFile",
      title: "Resume PDF File",
      type: "file",
      description: "Upload the current PDF version of your resume (PDF only)",
      options: {
        accept: ".pdf",
      },
    },
    {
      name: "externalUrl",
      title: "External Resume Link (Optional)",
      type: "url",
      description: "Optional fallback or external link (e.g. Google Drive, Notion, ReadCV)",
      validation: (rule: Rule) =>
        rule.uri({
          scheme: ["http", "https"],
          allowRelative: false,
        }),
    },
    {
      name: "lastUpdated",
      title: "Last Updated Date (Optional)",
      type: "date",
      description: "Auto-synced to the file upload date on the website if left blank, or manually specify if preferred.",
    },
  ],
};

