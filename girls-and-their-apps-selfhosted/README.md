# Girls & Their Apps — Self-Hosted Live Version

## What's in this folder
- `index.html` — the website itself (what visitors see and interact with)
- `api/generate.js` — the backend function. Holds your Anthropic API key and
  makes the actual call to Claude. Runs on the server, never in the visitor's
  browser.
- `package.json` — tells Vercel this is a Node.js project
- `.gitignore` — keeps local secret files out of GitHub

## The one thing you must never do
Never paste your Anthropic API key into `index.html` or any file that gets
uploaded to GitHub. It only ever goes into Vercel's Environment Variables
(Project → Settings → Environment Variables → `ANTHROPIC_API_KEY`).

## Full deploy instructions
See the step-by-step walkthrough in your conversation with Claude. Quick
summary once you've done it once:
1. Push these files to a GitHub repo.
2. Import that repo in Vercel (vercel.com → Add New Project).
3. Set `ANTHROPIC_API_KEY` in Vercel's Environment Variables.
4. Redeploy.
5. Visit your `.vercel.app` URL (or connect a custom domain under
   Project → Settings → Domains).

## Changing the AI model or cost
In `api/generate.js`, look for this line:

```js
model: 'claude-sonnet-5',
```

Swap `claude-sonnet-5` for `claude-haiku-4-5-20251001` for a cheaper, faster
model, or `claude-opus-4-8` for the highest-quality (and most expensive)
option.

## Embedding on Kajabi
See `kajabi-embed-snippet.html` in this folder — paste its contents into a
Kajabi Custom Code Block after replacing the placeholder URL with your real
Vercel URL (in both places it appears). The page automatically reports its
height to the parent page, so the embedded iframe resizes itself as content
changes (no scrollbars, no clipped content).

## Local testing (optional, requires comfort with a terminal)
```
npm install -g vercel
vercel dev
```
This runs the site on your own computer at `localhost:3000` before you
deploy it live, using a `.env` file locally (never commit that file).
