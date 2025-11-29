# Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/digital-twin-mcp)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel**:
   - Go to https://vercel.com
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   Add these in Vercel project settings:
   ```
   UPSTASH_VECTOR_REST_URL=your_upstash_url
   UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
   GROQ_API_KEY=your_groq_key
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your MCP server will be live!

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## Post-Deployment

### Update Claude Desktop Configuration

Once deployed, update your Claude Desktop config with the production URL:

```json
{
  "mcpServers": {
    "digital-twin-production": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://your-app.vercel.app/api/mcp"]
    }
  }
}
```

### Test Your Deployment

```bash
# Test the endpoint
curl -X POST https://your-app.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{"action":"health"}'
```

## Environment Variables

Required environment variables for production:

- `UPSTASH_VECTOR_REST_URL`: Your Upstash Vector database URL
- `UPSTASH_VECTOR_REST_TOKEN`: Your Upstash Vector access token
- `GROQ_API_KEY`: Your Groq API key

## Troubleshooting

**Build Errors:**
- Run `npm run build` locally first
- Check all environment variables are set
- Verify TypeScript has no errors

**Runtime Errors:**
- Check Vercel function logs in dashboard
- Verify API keys are correct
- Test endpoints locally first

**MCP Connection Issues:**
- Ensure server responds at `/api/mcp`
- Check CORS settings if needed
- Verify Claude Desktop configuration
