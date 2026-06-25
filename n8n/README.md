# Smaran daily AI news → GitHub PR (n8n)

Replaces the old `cms/` Flask backend. This n8n workflow runs on its own
(no local server needed) and does the whole pipeline end to end:

1. **Fetch** — pulls tech headlines from NewsData.io, twice a day (10:00 and
   19:00 server time, matching the old `PEAK_HOURS`).
2. **Filter** — keyword filter narrows to AI models, AI policy/regulation,
   and AI-relevant hardware (phones, chips, devices).
3. **Decide** — GPT (OpenAI `gpt-4o-mini`) picks the single most newsworthy
   story from the filtered candidates, or skips the run if nothing qualifies.
4. **Rewrite** — GPT rewrites it in the "Smaran voice" persona
   (`smaran-voice-prompt.md`) — short, plain, no press-release fluff.
5. **Publish request** — opens a GitHub pull request that adds the new
   `.news-card` to the homepage's scrolling news feed on `index.html`
   (capped at the 4 most recent stories; older ones roll off). News lives
   only on the homepage now — `blog.html` is essays only. **You reviewing
   and merging that PR is the admin-publish step** — nothing goes live
   until you merge.

Because the site is static HTML deployed via git, a PR review *is* the
admin gate — there's no separate login/admin panel to maintain.

## Setup

### 1. Import the workflow
In n8n: Workflows → Import from File → `smaran-news-workflow.json`.

### 2. Get a NewsData.io API key
Sign up at newsdata.io (free tier: 200 requests/day). Copy the API key.

### 3. Create a GitHub fine-grained PAT
GitHub → Settings → Developer settings → Fine-grained tokens → Generate new.
- Repository access: only this repo (`smaran.basnet.io` or whatever it's
  named on GitHub).
- Permissions: **Contents: Read and write**, **Pull requests: Read and
  write**. Nothing else.
- Copy the token once — GitHub won't show it again.

### 4. Set environment variables in n8n
In n8n's instance settings (or `.env` if self-hosted), set:
- `NEWSDATA_API_KEY` — from step 2
- `OPENAI_API_KEY` — an OpenAI API key (works on the free trial credit new
  accounts get; once that runs out you'll need billing enabled, since
  OpenAI has no permanently-free tier). Get it at platform.openai.com/api-keys.
- `GITHUB_TOKEN` — the PAT from step 3
- `GITHUB_REPO` — `your-github-username/your-repo-name`
- `SMARAN_VOICE_SYSTEM_PROMPT` — paste the persona text from
  `smaran-voice-prompt.md` (everything below the `---`) as a single string

### 5. Activate the workflow
Toggle it "Active" in n8n. It'll fire at 10:00 and 19:00 daily per the
cron trigger node.

## What you'll see day to day
A new PR shows up in the repo titled "Daily AI news: <title>" with the
diff to `blog.html`/`index.html`. Review the excerpt in the PR body,
edit the diff directly on GitHub if you want to tweak wording, then merge.
Merging = the deploy pipeline you already have (push to `main`) picks it
up exactly like any other commit.

If no story in a run met the AI/policy/hardware bar, the workflow stops
after the "Decide" step and no PR is opened — no empty/junk PRs.

## Migrating off cms/
`cms/` (the old Flask admin + APScheduler backend) is no longer needed for
this pipeline. It's left in place in case you want to reference its logic,
but you can stop running `python server.py` going forward. Nothing in this
n8n workflow depends on it.
