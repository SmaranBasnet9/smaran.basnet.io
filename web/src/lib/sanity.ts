import { createClient } from "next-sanity";

// The dataset is private, so reads need a token even for non-mutating queries.
const token = process.env.SANITY_API_TOKEN;

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token,
  useCdn: true,
});

// Bypasses the CDN, which can lag behind freshly written documents (e.g. newsSummary docs created at request time).
export const sanityFreshClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token,
  useCdn: false,
});
