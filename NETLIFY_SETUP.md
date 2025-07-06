# Netlify Deployment Setup

## Files Added

The following configuration files have been added to fix the deployment issues:

### 1. `netlify.toml` (Root directory)
- Configures build settings, redirects, and headers
- Sets Node.js version to 18
- Configures SPA routing with proper redirects
- Adds security headers

### 2. `public/_redirects`
- Backup redirect rules for SPA routing
- Ensures all routes serve `index.html` for client-side routing

### 3. `public/_headers`
- Security and performance headers
- Cache control for static assets

## Environment Variables Setup

In your Netlify dashboard, you need to set the following environment variables:

### Go to: Site Settings > Environment Variables

**Required:**
```
VITE_API_NINJAS_KEY=your_actual_api_key_here
```

**Optional (with defaults):**
```
REACT_APP_API_TIMEOUT=10000
REACT_APP_RETRY_ATTEMPTS=3
REACT_APP_REFRESH_INTERVAL=900000
REACT_APP_MAP_HEIGHT=320
REACT_APP_MAX_COMPARISON=3
REACT_APP_ENABLE_EXPORT=true
REACT_APP_ENABLE_SHORTCUTS=true
REACT_APP_ENABLE_PWA=false
NODE_ENV=production
NODE_VERSION=22
NODE_OPTIONS="--max-old-space-size=4096"
```

## Build Settings

In Netlify dashboard, verify these settings:

- **Build command**: `npm install && npm run build`
- **Publish directory**: `dist`
- **Node.js version**: 22.x (set in netlify.toml)

## Getting API Keys

### API Ninjas (Primary - Free)
1. Visit: https://api.api-ninjas.com/
2. Sign up for free account
3. Get your API key from dashboard
4. Set as `VITE_API_NINJAS_KEY` in Netlify

### Note on API Usage
The app will work with mock data if no API key is provided, but for real COVID data:
- Set the `VITE_API_NINJAS_KEY` environment variable
- The app automatically falls back to mock data if the API fails

## Troubleshooting

### Common Issues:

1. **Deploy Preview Fails**
   - Check environment variables are set
   - Verify Node.js version compatibility

2. **Routing Issues (404 on refresh)**
   - Ensure `_redirects` file exists in dist folder
   - Check netlify.toml redirect rules

3. **Security Headers Not Applied**
   - Verify `_headers` file in dist folder
   - Check netlify.toml headers configuration

4. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Run `npm run build` locally to debug

### Deployment Verification

After deployment, check:
- [ ] Home page loads correctly
- [ ] Client-side routing works (no 404s)
- [ ] API data loads (or shows mock data)
- [ ] Security headers are present (check browser dev tools)

## Next Deployment

1. Commit the new configuration files
2. Push to your repository
3. Netlify will automatically redeploy
4. The failing checks should now pass

The deployment should now work correctly with proper SPA routing, security headers, and build configuration. 

## Build Process

1. **Dependencies Installation**: `npm install`
   - Installs all dependencies including devDependencies
   - Works reliably across different Node versions
   - Uses package-lock.json if available

2. **Build**: `npm run build`
   - Runs `vite build` to create production bundle
   - Outputs to `dist/` directory

## Common Issues & Solutions

### "vite: not found" Error
**Problem**: Vite command not available during build
**Solutions**:
1. **Dependencies**: Ensure `npm install` runs before build command
   - Build command should be: `npm install && npm run build`
   - Vite must be in devDependencies

2. **PATH Issue**: If dependencies are installed but vite still not found
   - Use `npx vite build` instead of `vite build` in package.json
   - This ensures locally installed vite is used

### "npm ci" Lock File Error
**Problem**: `npm ci` requires package-lock.json but can't find it
**Solution**: Use `npm install` instead
- More compatible across different environments
- Still uses package-lock.json if available

### Node Version Issues
**Problem**: Node version mismatch
**Solution**: Specify Node version in netlify.toml:
```toml
[build.environment]
  NODE_VERSION = "22"
```

### Memory Issues
**Problem**: Build fails due to memory constraints
**Solution**: Increase memory limit:
```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

## Security Headers

The configuration includes security headers for:
- XSS protection
- Content type sniffing prevention
- Frame options (prevents clickjacking)
- Referrer policy
- Permissions policy

## SPA Routing

Single Page Application routing is handled with:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This ensures all routes are served by the React app.

## Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Configure Build Settings**: Netlify should auto-detect settings from netlify.toml
3. **Deploy**: Trigger deployment manually or via git push
4. **Monitor**: Check build logs for any issues

## Verification

After deployment, verify:
- [ ] Site loads correctly
- [ ] All routes work (SPA routing)
- [ ] API calls function properly
- [ ] Security headers are applied
- [ ] Static assets are cached properly

## Support

For additional help:
- Check Netlify build logs for specific error messages
- Verify all dependencies are listed in package.json
- Ensure Node version compatibility
- Test build locally with `npm run build` 

## Updated Configuration:

1. **`netlify.toml`**:
   - Changed `NODE_VERSION = "22"` to match your Netlify build settings
   - This ensures consistency between your Netlify dashboard settings and the configuration file

2. **`NETLIFY_SETUP.md`**:
   - Updated all references from Node 18 to Node 22
   - Documentation now reflects the correct Node version

## Why This Matters:

- **Consistency**: Both your Netlify dashboard and `netlify.toml` now specify Node 22
- **No Conflicts**: Prevents any potential version conflicts during build
- **Latest Features**: Node 22 includes the latest performance improvements and features

## Current Build Configuration:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
  NODE_ENV = "production"
  NODE_OPTIONS = "--max-old-space-size=4096"
```

Your build should now use Node 22 consistently and the `vite: not found` error should be resolved. The configuration is now aligned with your Netlify settings! 