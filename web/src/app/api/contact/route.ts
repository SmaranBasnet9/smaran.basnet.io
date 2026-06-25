import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTHS = { name: 200, email: 320, company: 200, message: 5000 };

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, company, message } = body as {
    name?: string;
    email?: string;
    company?: string;
    message?: string;
  };

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    (company?.length ?? 0) > MAX_LENGTHS.company ||
    message.length > MAX_LENGTHS.message
  ) {
    return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet — missing SANITY_API_TOKEN." },
      { status: 500 }
    );
  }

  try {
    await writeClient.create({
      _type: "contactSubmission",
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || undefined,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: "new",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong submitting the form." }, { status: 500 });
  }
}
