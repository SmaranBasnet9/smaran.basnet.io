import { defineField, defineType } from "sanity";

export default defineType({
  name: "tool",
  title: "AI Tool",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "focus",
      title: "Focus area",
      type: "string",
      options: { list: ["Marketing", "Tech", "Both"] },
      initialValue: "Marketing",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "SEO & Content",
          "Social Media",
          "Email Marketing",
          "Paid Ads",
          "Analytics",
          "Design",
          "AI Writing & Automation",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "howToUse",
      title: "How to use it for digital marketing",
      description: "Plain-language explanation of how a marketer would actually use this tool day-to-day.",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "insight",
      title: "Smaran's insight",
      description:
        "Short human-written take on why this tool is trending, byline Smaran. Auto-generated and cached by the homepage pipeline if left blank.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category" },
  },
});
