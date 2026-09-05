import type { StructureResolver } from "sanity/structure";
import { DocumentPdfIcon, CaseIcon, StarIcon, BookIcon, DocumentsIcon } from "@sanity/icons";

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content Management")
    .items([
      // Singleton: Resume
      S.listItem()
        .title("Resume Document")
        .icon(DocumentPdfIcon)
        .child(
          S.document()
            .schemaType("resume")
            .documentId("resume")
            .title("Resume Settings & File")
        ),

      S.divider(),

      // Projects Section with Filtered Views
      S.listItem()
        .title("Projects")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Project Filters")
            .items([
              S.listItem()
                .title("Featured Projects")
                .icon(StarIcon)
                .child(
                  S.documentList()
                    .title("Featured Projects")
                    .filter('_type == "project" && (featured == true || Featured == true)')
                ),
              S.listItem()
                .title("All Projects")
                .icon(DocumentsIcon)
                .child(
                  S.documentTypeList("project").title("All Projects")
                ),
            ])
        ),

      // Blog Posts
      S.listItem()
        .title("Blog Posts")
        .icon(BookIcon)
        .child(
          S.documentTypeList("post").title("Blog Posts")
        ),
    ]);
