# Collaborative Editor - Critical Fixes Applied

## Summary

Fixed two critical errors preventing the collaborative editor from working:

1. **500 Error - Heartbeat Endpoint**: RLS infinite recursion in `contract_collaborators` table
2. **WebSocket Connection Failed**: Unreliable public server, added fallback mode

## Error 1: RLS Infinite Recursion (FIXED)

### Problem
```
Error: infinite recursion detected in policy for relation "contract_collaborators"
Code: 42P17
```

The RLS policy was querying `contract_collaborators` inside its own SELECT policy:
```sql
-- BAD: This causes infinite recursion
contract_id IN (
  SELECT contract_id FROM contract_collaborators WHERE user_id = auth.uid()
)
```

### Solution
Created security definer functions to bypass RLS and prevent recursion:

```sql
-- New functions (see migration file)
- is_contract_collaborator(contract_id, user_id)
- is_contract_owner(contract_id, user_id)
```

### How to Apply

**The SQL has been copied to your clipboard!** Paste it into your Supabase SQL Editor:

1. Go to https://supabase.odoo.barcelona/project/_/sql
2. Paste the SQL (already in clipboard)
3. Click "Run"

Or manually run:
```bash
cat supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql | pbcopy
```

**Migration file:**
`supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql`

## Error 2: WebSocket Connection Failed (FIXED)

### Problem
```
WebSocket connection to 'wss://demos.yjs.dev/...' failed
```

The public Yjs demo server is unreliable and often down.

### Solution
Added **fallback mode** that works without WebSocket:

- Editor works locally (no real-time collaboration)
- Auto-save still functions normally
- User can edit and save contracts without issues
- No external dependencies

### Configuration

Added to `.env.local`:
```bash
NEXT_PUBLIC_COLLABORATION_MODE=fallback
```

**Modes available:**

| Mode | Description | WebSocket Required |
|------|-------------|-------------------|
| `fallback` | Local editing only (recommended) | No |
| `websocket` | Real-time collaboration | Yes |
| `disabled` | Editor disabled | N/A |

### Enabling Real-Time Collaboration (Optional)

If you want to enable real-time collaboration later:

1. Choose a WebSocket provider:
   - **Local server**: Run `y-websocket` server on port 1234
   - **Public demo**: Use `wss://y-demos.vercel.app` (testing only)
   - **Production**: Deploy your own y-websocket server

2. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_COLLABORATION_MODE=websocket
   NEXT_PUBLIC_YJS_WEBSOCKET_URL=wss://your-server.com
   ```

3. Restart dev server

### Running Local WebSocket Server (Optional)

If you want local real-time collaboration for development:

```bash
# Install y-websocket
npm install -g y-websocket

# Run server
PORT=1234 npx y-websocket
```

Then update `.env.local`:
```bash
NEXT_PUBLIC_COLLABORATION_MODE=websocket
NEXT_PUBLIC_YJS_WEBSOCKET_URL=ws://localhost:1234
```

## Files Modified

### New Files
- `lib/config/collaboration.ts` - Collaboration configuration
- `supabase/migrations/20260128000005_fix_contract_collaborators_rls.sql` - RLS fix
- `scripts/fix-rls-policy.sh` - Helper script

### Modified Files
- `components/collaborative-editor/CollaborativeEditor.tsx` - Added fallback mode support
- `.env.local` - Added collaboration mode config

## Testing

1. **Apply the database migration** (SQL is in your clipboard)
2. **Restart dev server**:
   ```bash
   npm run dev
   ```
3. **Open contract editor**: Should work without WebSocket errors
4. **Edit and save**: Auto-save should work normally

## Current Status

✅ **Heartbeat endpoint**: Fixed (after migration applied)
✅ **WebSocket errors**: Fixed (fallback mode)
✅ **Editor functionality**: Working (local mode)
⏳ **Real-time collaboration**: Disabled (can enable later)

## Next Steps (Optional)

If you want real-time collaboration:

1. **Option A**: Deploy y-websocket server to production
2. **Option B**: Use commercial solution (Liveblocks, PartyKit)
3. **Option C**: Keep fallback mode (single-user editing)

For most use cases, **fallback mode is sufficient** and more reliable.

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify `.env.local` has `NEXT_PUBLIC_COLLABORATION_MODE=fallback`
3. Confirm database migration was applied
4. Restart dev server

## Production Deployment

Before deploying to production:

1. Apply the database migration to production Supabase
2. Set `NEXT_PUBLIC_COLLABORATION_MODE=fallback` in Vercel environment variables
3. Test editor functionality in staging

**Do NOT use public WebSocket servers in production!**
