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
```

## Build Settings

In Netlify dashboard, verify these settings:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node.js version**: 18.x (set in netlify.toml)

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