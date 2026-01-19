# Deploying HackGreenwich Portal to Railway

This guide provides step-by-step instructions for deploying your HackGreenwich portal to Railway.

## Why Railway?

Railway is perfect for this application because:
- ✅ Supports long-running Node.js servers (unlike Vercel's serverless limitations)
- ✅ Simple deployment from GitHub
- ✅ Automatic HTTPS and custom domains
- ✅ Free tier: $5 credit/month (enough for development)
- ✅ Easy environment variable management
- ✅ Built-in PostgreSQL if needed (though we use Supabase)

## Prerequisites

- A Railway account (sign up at https://railway.app)
- Your code pushed to GitHub
- Your Supabase credentials

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login" and sign in with GitHub
3. Authorize Railway to access your repositories

## Step 2: Create New Project

1. Click "New Project" on Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your `hackgreenwich-portal` repository
4. Railway will automatically detect it's a Node.js project

## Step 3: Configure Environment Variables

Click on your project, then go to "Variables" tab and add:

```
SUPABASE_URL=https://hecfjejcnjhsxnfprcwf.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
VITE_SUPABASE_URL=https://hecfjejcnjhsxnfprcwf.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=production
PORT=3000
```

**Important**: Replace the Supabase keys with your actual credentials.

## Step 4: Deploy

1. Railway will automatically start building and deploying
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, Railway will provide you with a URL like `https://hackgreenwich-portal-production.up.railway.app`

## Step 5: Configure Supabase Redirect URLs

After deployment, update your Supabase settings:

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update:
   - **Site URL**: `https://your-app.up.railway.app`
   - **Redirect URLs**: Add `https://your-app.up.railway.app/**`
4. Click "Save"

## Step 6: Set Up Custom Domain (Optional)

### Using Railway's Domain

Railway automatically provides a domain. To customize it:

1. Go to your project settings
2. Click "Settings" → "Domains"
3. Click "Generate Domain" for a custom subdomain

### Using Your Own Domain

1. Go to "Settings" → "Domains"
2. Click "Custom Domain"
3. Enter your domain (e.g., `hackgreenwich.org`)
4. Add the CNAME record to your DNS provider:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: The value Railway provides
5. Wait for DNS propagation (can take up to 48 hours)

## Step 7: Enable Automatic Deployments

Railway automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update portal"
git push origin main
```

Railway will automatically rebuild and redeploy.

## Monitoring and Logs

### View Logs

1. Go to your project on Railway
2. Click on the "Deployments" tab
3. Click on any deployment to see logs
4. Use the search bar to filter logs

### Monitor Performance

1. Go to "Metrics" tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

## Troubleshooting

### Build Fails

**Error**: `pnpm: command not found`

**Solution**: Railway should auto-detect pnpm from `package.json`. If not, the `nixpacks.toml` file ensures pnpm is installed.

---

**Error**: `Cannot find module 'dist/index.js'`

**Solution**: Ensure the build script in `package.json` is correct:
```json
"build": "vite build && esbuild server/_core/index-supabase.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js"
```

### Deployment Succeeds but App Shows 404

**Problem**: The app builds but doesn't start correctly.

**Solution**: Check that:
1. `package.json` has the correct start script: `"start": "NODE_ENV=production node dist/index.js"`
2. Environment variables are set correctly in Railway
3. The PORT variable is set to 3000 (or Railway's default)

### Supabase Connection Errors

**Error**: "Invalid API key" or "Missing credentials"

**Solution**:
1. Verify environment variables are set correctly in Railway
2. Make sure there are no extra spaces in the keys
3. Regenerate Supabase keys if needed and update Railway

### Database Connection Issues

**Problem**: "Cannot connect to Supabase"

**Solution**:
1. Check Supabase project is active (not paused)
2. Verify the SUPABASE_URL is correct
3. Ensure Row Level Security policies allow access

### App Crashes After Deployment

1. Go to "Deployments" → Click on failed deployment
2. Check the logs for error messages
3. Common issues:
   - Missing environment variables
   - Database connection failures
   - Port binding issues

## Scaling

### Increase Resources

If your app needs more power:

1. Go to "Settings" → "Resources"
2. Upgrade your plan for more:
   - CPU
   - Memory
   - Concurrent connections

### Horizontal Scaling

Railway supports multiple instances:

1. Go to "Settings" → "Scaling"
2. Increase the number of replicas
3. Railway automatically load balances

## Cost Management

### Free Tier

- $5 credit per month
- Enough for development and small hackathons
- Automatically pauses after 30 days of inactivity

### Paid Plans

- **Hobby**: $5/month + usage
- **Pro**: $20/month + usage
- Pay only for what you use

### Monitor Usage

1. Go to "Usage" tab
2. View current month's usage
3. Set up billing alerts

## Environment Management

### Multiple Environments

Create separate environments for development and production:

1. Create a new project for staging
2. Connect the same GitHub repo
3. Use different environment variables
4. Deploy from a different branch (e.g., `develop`)

## Backup and Rollback

### Rollback to Previous Deployment

1. Go to "Deployments"
2. Find a previous successful deployment
3. Click "..." → "Redeploy"

### Backup Environment Variables

1. Go to "Variables" tab
2. Click "..." → "Download as .env"
3. Store securely (DO NOT commit to Git)

## Security Best Practices

1. **Never commit** `.env` files to Git
2. Use Railway's environment variables for all secrets
3. Rotate Supabase keys periodically
4. Enable Supabase Row Level Security (RLS)
5. Set up rate limiting if needed
6. Use HTTPS only (Railway provides this automatically)

## Performance Optimization

### Enable Caching

Add caching headers in your Express app:

```typescript
app.use((req, res, next) => {
  if (req.path.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});
```

### Monitor Build Times

- Keep dependencies minimal
- Use `pnpm` for faster installs
- Enable build caching (Railway does this automatically)

### Optimize Bundle Size

The build warns if chunks are > 500 KB. To optimize:

1. Use dynamic imports for large components
2. Split vendor chunks in `vite.config.ts`
3. Remove unused dependencies

## CI/CD Integration

Railway automatically deploys on push, but you can add GitHub Actions for additional checks:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: pnpm install
      - run: pnpm test
      - run: pnpm check
```

## Health Checks

Railway automatically monitors your app. To add custom health checks:

```typescript
// Add to server/_core/index-supabase.ts
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

## Database Migrations

If you need to run migrations on deployment:

1. Add a migration script to `package.json`:
   ```json
   "migrate": "drizzle-kit generate && drizzle-kit migrate"
   ```

2. Update the build command in Railway:
   - Go to "Settings" → "Build Command"
   - Set to: `pnpm build && pnpm migrate`

## Support and Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app
- **Supabase Docs**: https://supabase.com/docs

## Comparison: Railway vs Other Platforms

| Feature | Railway | Vercel | Render | Fly.io |
|---------|---------|--------|--------|--------|
| Long-running servers | ✅ Yes | ❌ No (serverless only) | ✅ Yes | ✅ Yes |
| Free tier | $5/month credit | Yes (limited) | 750 hrs/month | 3 VMs free |
| Custom domains | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| Auto HTTPS | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| GitHub integration | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Ease of use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Best for | Full-stack apps | Static + serverless | Full-stack apps | Global edge apps |

## Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Supabase redirect URLs updated with Railway domain
- [ ] Custom domain configured (if applicable)
- [ ] Email verification disabled or configured in Supabase
- [ ] Row Level Security policies enabled and tested
- [ ] All tests passing (`pnpm test`)
- [ ] TypeScript compilation successful (`pnpm check`)
- [ ] Test all authentication flows (signup, signin, logout)
- [ ] Test all major features (teams, resources, announcements)
- [ ] Check mobile responsiveness
- [ ] Verify all links work correctly
- [ ] Set up monitoring and alerts
- [ ] Backup environment variables

---

**Congratulations!** Your HackGreenwich portal is now live on Railway! 🎉

## Quick Deploy Button (Optional)

Add this to your README.md for one-click deployment:

```markdown
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USERNAME/hackgreenwich-portal)
```

## Next Steps

1. **Monitor your deployment** - Check logs and metrics regularly
2. **Set up alerts** - Get notified of errors or downtime
3. **Optimize performance** - Use Railway's metrics to identify bottlenecks
4. **Scale as needed** - Upgrade resources when your hackathon grows
