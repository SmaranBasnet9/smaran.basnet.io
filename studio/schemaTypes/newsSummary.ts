import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsSummary",
  title: "News Summary (cache)",
  type: "document",
  description:
    "Auto-generated cache of Smaran's human-language summaries of trending news. Managed by the homepage pipeline — editing is optional.",
  fields: [
    defineField({
      name: "sourceLink",
      title: "Source link",
      description: "Original article URL. Used as the cache key.",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceName",
      title: "Source name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Original title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Smaran's summary",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "byline",
      title: "Byline",
      type: "string",
      initialValue: "Smaran",
    }),
    defineField({
      name: "generatedAt",
      title: "Generated at",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "sourceName" },
  },
});
