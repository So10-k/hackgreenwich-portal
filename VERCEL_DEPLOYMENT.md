# Deploying HackGreenwich Portal to Vercel

This guide provides step-by-step instructions for deploying your HackGreenwich portal to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your Supabase credentials (URL, Anon Key, Service Key)
- Git repository with your code (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

1. Ensure you have the latest code with `vercel.json` configuration file
2. Push your code to a Git repository (GitHub recommended):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

## Step 2: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your Git provider (GitHub, GitLab, or Bitbucket)
4. Authorize Vercel to access your repositories
5. Select the `hackgreenwich-portal` repository
6. Click "Import"

## Step 3: Configure Build Settings

**IMPORTANT**: Vercel should auto-detect settings from `vercel.json`, but verify:

- **Framework Preset**: Other (or leave as detected)
- **Build Command**: Leave empty (uses `vercel-build` script automatically)
- **Output Directory**: Leave empty (configured in vercel.json)
- **Install Command**: `pnpm install`
- **Root Directory**: `./` (leave as root)

## Step 4: Add Environment Variables

Click "Environment Variables" and add the following:

### Required Environment Variables

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Node Environment
NODE_ENV=production
```

### How to get Supabase credentials:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** → use for `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **anon public** key → use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → use for `SUPABASE_SERVICE_KEY`

**IMPORTANT**: Make sure to add these variables for all environments:
- Production
- Preview
- Development

## Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, Vercel will provide you with a URL like `https://hackgreenwich-portal.vercel.app`

## Step 6: Configure Supabase Redirect URLs

After deployment, you need to add your Vercel URL to Supabase:

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel deployment URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add `https://your-app.vercel.app/**`
4. Click "Save"

## Step 7: Configure Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `hackgreenwich.org`)
4. Follow Vercel's instructions to update your DNS records
5. Wait for DNS propagation (can take up to 48 hours)
6. Update Supabase redirect URLs with your custom domain

## Step 8: Enable Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update portal"
git push origin main
```

Vercel will automatically build and deploy your changes.

## Troubleshooting

### Build Fails with "Cannot find module"

**Error**: `Cannot find module 'dist/index.js'`

**Solution**: This is fixed by the `vercel.json` configuration. Ensure:
1. `vercel.json` exists in your project root
2. Your `package.json` has the `vercel-build` script:
   ```json
   "vercel-build": "vite build && esbuild server/_core/index-supabase.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js"
   ```

### Deployment Shows Raw JavaScript Instead of Running App

**Problem**: Vercel is serving the compiled JS file instead of running it as a Node.js server.

**Solution**: Ensure `vercel.json` exists with proper configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ]
}
```

### Environment Variables Not Working

1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify all variables are set for "Production", "Preview", and "Development"
3. Redeploy the project (Deployments → ... → Redeploy)

### Supabase Authentication Errors

**Error**: "Invalid redirect URL" or "CORS error"

**Solution**:
1. Go to Supabase dashboard → Authentication → URL Configuration
2. Add your Vercel deployment URL to "Site URL"
3. Add `https://your-app.vercel.app/**` to "Redirect URLs"
4. Make sure to include both the Vercel domain AND any custom domains

### 404 Errors on Page Refresh

**Problem**: Direct navigation to routes like `/dashboard` returns 404

**Solution**: This is already handled by `vercel.json` routing configuration. If you still see 404s:
1. Check that `vercel.json` exists in your repository
2. Redeploy the project
3. Clear your browser cache

### Database Connection Issues

1. Verify your Supabase credentials in environment variables
2. Check Supabase project is active and not paused
3. Verify Row Level Security (RLS) policies are configured correctly

## Performance Optimization

### Enable Vercel Analytics

1. Go to your project dashboard
2. Click "Analytics" tab
3. Enable "Web Analytics" for free performance monitoring

### Monitor Bundle Size

The build will warn you if chunks are larger than 500 KB. To optimize:

1. Use dynamic imports for large components:
   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'));
   ```

2. Split vendor chunks in `vite.config.ts`:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'react-vendor': ['react', 'react-dom'],
           'ui-vendor': ['framer-motion', '@radix-ui/react-dialog'],
         }
       }
     }
   }
   ```

## Monitoring

### View Logs

1. Go to your project dashboard
2. Click "Deployments"
3. Click on any deployment
4. Click "View Function Logs" to see server logs

### Monitor Performance

1. Go to "Analytics" tab
2. View real-time metrics:
   - Page views
   - Unique visitors
   - Response times
   - Error rates

## Continuous Integration

Vercel automatically runs these checks on every deployment:

- Build success/failure
- TypeScript type checking (via `tsc --noEmit`)
- Preview deployments for pull requests

## Support

If you encounter issues:

1. Check Vercel's documentation: https://vercel.com/docs
2. Check Supabase documentation: https://supabase.com/docs
3. View deployment logs in Vercel dashboard
4. Contact Vercel support: https://vercel.com/support

## Security Best Practices

1. **Never commit** `.env` files to Git
2. Use Vercel's environment variables for all secrets
3. Rotate your Supabase service key periodically
4. Enable Supabase Row Level Security (RLS) policies
5. Set up rate limiting on your API endpoints
6. Use HTTPS only (Vercel provides this automatically)

## Updating Your Deployment

To update your deployed portal:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically detect the push and redeploy your application.

## Rollback

If a deployment has issues:

1. Go to Vercel dashboard → Deployments
2. Find a previous working deployment
3. Click "..." menu → "Promote to Production"

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] Supabase redirect URLs include your production domain
- [ ] Email verification is disabled in Supabase (or configured with email templates)
- [ ] Row Level Security policies are enabled and tested
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics are enabled for monitoring
- [ ] Test all authentication flows (signup, signin, logout)
- [ ] Test all major features (team creation, resource access, etc.)
- [ ] Check mobile responsiveness
- [ ] Verify all links work correctly

---

**Congratulations!** Your HackGreenwich portal is now live on Vercel! 🎉

## Quick Deploy Button (Optional)

Add this to your README.md for one-click deployment:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL&env=SUPABASE_URL,SUPABASE_SERVICE_KEY,VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY)
```
