import { createClient } from "next-sanity";

const token = process.env.SANITY_API_TOKEN;

export const sanityWriteClient = token
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      token,
      useCdn: false,
    })
  : null;
