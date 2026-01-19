# Deploying HackGreenwich Portal to Vercel

This guide provides step-by-step instructions for deploying your HackGreenwich portal to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Your Supabase credentials (URL, Anon Key, Service Key)
- Git repository with your code (GitHub, GitLab, or Bitbucket)

## Step 1: Prepare Your Repository

1. Push your code to a Git repository (GitHub recommended):
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

Vercel should auto-detect the framework, but verify these settings:

- **Framework Preset**: Other
- **Build Command**: `pnpm build`
- **Output Directory**: `dist` (for server) and `dist/client` (for frontend)
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

# Database (if using external MySQL/TiDB)
DATABASE_URL=your_database_connection_string

# Node Environment
NODE_ENV=production
```

### How to get Supabase credentials:

1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** → use for `SUPABASE_URL` and `VITE_SUPABASE_URL`
   - **anon public** key → use for `VITE_SUPABASE_ANON_KEY`
   - **service_role** key → use for `SUPABASE_SERVICE_KEY`

## Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, Vercel will provide you with a URL like `https://hackgreenwich-portal.vercel.app`

## Step 6: Configure Custom Domain (Optional)

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `hackgreenwich.org`)
4. Follow Vercel's instructions to update your DNS records
5. Wait for DNS propagation (can take up to 48 hours)

## Step 7: Enable Automatic Deployments

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update portal"
git push origin main
```

Vercel will automatically build and deploy your changes.

## Troubleshooting

### Build Fails

**Error**: `Cannot find module 'dist/index.js'`

**Solution**: Ensure your `package.json` build script is:
```json
"build": "vite build && esbuild server/_core/index-supabase.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js"
```

### Environment Variables Not Working

1. Go to Vercel dashboard → Settings → Environment Variables
2. Verify all variables are set for "Production", "Preview", and "Development"
3. Redeploy the project

### Database Connection Issues

1. Verify your `DATABASE_URL` is correct
2. Ensure your database allows connections from Vercel's IP ranges
3. Check Supabase connection limits

### CORS Errors

If you see CORS errors:

1. Go to Supabase dashboard → Authentication → URL Configuration
2. Add your Vercel deployment URL to "Site URL"
3. Add your Vercel URL to "Redirect URLs"

## Performance Optimization

### Enable Vercel Analytics

1. Go to your project dashboard
2. Click "Analytics" tab
3. Enable "Web Analytics" for free performance monitoring

### Enable Edge Functions (Optional)

For faster global performance, consider using Vercel Edge Functions:

1. Update `vercel.json` (create if it doesn't exist):
```json
{
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
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
- TypeScript type checking
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

---

**Congratulations!** Your HackGreenwich portal is now live on Vercel! 🎉
