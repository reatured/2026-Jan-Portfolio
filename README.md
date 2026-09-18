# Lingyi Zhou — personal portfolio

The formal React, TypeScript, and Vite portfolio served at
[personal.lingyizhou.com](https://personal.lingyizhou.com).

## Repository and local checkouts

This website lives on the `site` branch of
[`reatured/2026-Jan-Portfolio`](https://github.com/reatured/2026-Jan-Portfolio).
The branch continues the original portfolio's Git history.

In the portfolio workspace, the two checkouts are linked Git worktrees:

- `2026-Jan-Portfolio/`: original website on `main`; stores the shared Git database.
- `site/`: formal replacement website on `site`; application files are at this branch's repository root.

Keep the original checkout available while this linked worktree is in use. Use
`git worktree list` to inspect their relationship. Review artifacts, local agent
state, dependencies, build output, environment files, and Vercel link metadata
stay local and are excluded from commits.

## Development

Run these commands from this checkout:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

The local workspace's `../AGENTS.md` documents design, content, and verification
requirements. The optional legacy import script uses the sibling
`../2026-Jan-Portfolio/` checkout as its source; it is not part of the build.

## Deployment

The existing Vercel project is `lingyi-personal-portfolio` in the
`reatureds-projects` scope. For an authorized production update, build and verify
the site, then run:

```sh
vercel deploy --prod --yes --scope reatureds-projects
```

Publishing this branch to GitHub and deploying the website are separate actions.
