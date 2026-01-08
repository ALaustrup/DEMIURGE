# Deploying portal-web to Vercel

## Quick Deploy

```bash
# Navigate to portal-web directory
cd apps/portal-web

# Login to Vercel (first time only)
vercel login

# Deploy to production
vercel --prod
```

## Configuration

The project is configured via `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

## Custom Domain Setup

1. After deployment, go to: https://vercel.com/dashboard
2. Select your project
3. Go to: **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `demiurge.guru`
6. Follow Vercel's DNS instructions

## Environment Variables (Optional)

If you need API endpoints:

```bash
NEXT_PUBLIC_API_URL=https://api.demiurge.cloud/graphql
NEXT_PUBLIC_RPC_URL=https://rpc.demiurge.cloud/rpc
```

Add these in: **Settings** → **Environment Variables**

## Automatic Deployments

Once configured, Vercel will automatically deploy when you push to:
- **Production:** `main` branch → demiurge.guru
- **Preview:** Other branches → temporary URL

## Rebranding Note

⚠️ This app still references "AbyssID" in some places and needs the QOR rebrand applied.

To rebrand before deploying:
1. Update `QorIDDialog` component (missing)
2. Update `QorIDContext` (missing)  
3. Update `QorIDAuthDoc` (missing)
4. Apply Genesis theme colors

See `apps/qloud-os` for reference on Genesis theme implementation.
