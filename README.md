# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Main Page Layout (ASCII)

```
+--------------------------------------------------------------------------------------------------+
| PAGE FRAME                                                                                       |
|  Background: slate-50                                                                            |
|  Content Grid: 1 column (mobile) / 2 columns (lg)                                                 |
+--------------------------------------------------------------------------------------------------+
| [ LEFT COLUMN: SIDEBAR ]                       | [ RIGHT COLUMN: MAIN CONTENT ]                  |
|  - Sticky on desktop                           |  - Scrollable content                           |
|  - Intro + role/category links (in Sidebar)    |                                                 |
|                                                |  [ Mobile-only Intro ]                           |
|                                                |  "Welcome" + short prompt                         |
|                                                |                                                 |
|                                                |  [ Filter Status ] (only if category is set)      |
|                                                |  "Filtered by: <Category>"                        |
|                                                |                                                 |
|                                                |  [ Projects List ]                                |
|                                                |  Header: "All Projects" or "<N> Projects Found"   |
|                                                |  Grid: 1 col (mobile) / 2 col (md+)                |
|                                                |  - ProjectCard x N                                 |
|                                                |  Empty state if none                               |
|                                                |                                                 |
|                                                |  [ Footer ]                                        |
|                                                |  © YEAR Built with React, Tailwind & TypeScript.   |
+--------------------------------------------------------------------------------------------------+
```

## Project Card Layout (ASCII)

```
+----------------------------------------------------------------------------------+
| [ Media: image / video / media ] |  Title                                        |
|                                  |  Subtitle                                     |
|                                  |  Description (1–2 lines)                      |
|                                  |                                               |
|                                  |  Tech Stack: [ Tag ] [ Tag ] [ Tag ]   +N     |
+----------------------------------------------------------------------------------+
```


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. (Optional but recommended) set admin environment variables in `.env.local`:
   - `VITE_ADMIN_API_URL=http://localhost:3001`
   - `ADMIN_API_TOKEN=<your-secret-token>`
   - `ADMIN_CORS_ORIGINS=http://localhost:5173,http://localhost:3000`
3. Run the app:
   `npm run dev`
4. Run the admin API (or run both together with `npm run dev:all`):
   `npm run admin`

## Content Quality Check

Run a content consistency audit before publishing:

`npm run content:audit`
