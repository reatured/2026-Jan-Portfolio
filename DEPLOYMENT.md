# Deployment Guide

## Deploy Frontend to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
vercel --prod
```

## Admin Workflow

1. Run admin locally to make changes:
```bash
npm run admin
```

2. Access admin panel at: http://localhost:3000/admin

3. After making changes:
```bash
git add config/
git commit -m "Update portfolio content"
git push
```

4. Redeploy:
```bash
vercel --prod
```

## Environment Variables (Optional)

Create `.env.production` for any production configs:
```
VITE_ADMIN_API_URL=https://your-admin-api.com
```

## Notes

- The admin server writes to local JSON files
- Deployed site is static and reads from `config/data.json`
- No authentication needed for local admin
- Changes require redeploy to appear on live site
