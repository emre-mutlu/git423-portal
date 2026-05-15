#!/bin/bash
set -e

npm run build

cat > .netlify/v1/functions/ssr/ssr.mjs <<'WRAPPER_EOF'
import { createHandler } from './.netlify/build/entry.mjs';
const baseHandler = createHandler({});
export default async function handler(request, context) {
  try {
    return await baseHandler(request, context);
  } catch (err) {
    return new Response(
      'DIAGNOSTIC ERROR\n\n' +
      'Message: ' + (err?.message || 'no message') + '\n\n' +
      'Stack:\n' + (err?.stack || 'no stack') + '\n\n' +
      'Context type: ' + typeof context + '\n' +
      'Context keys: ' + (context ? Object.keys(context).join(', ') : 'N/A'),
      { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } }
    );
  }
}
export const config = {
  includedFiles: ['**/*'],
  name: 'Astro SSR',
  nodeBundler: 'none',
  generator: '@astrojs/netlify@7.0.9',
  path: '/*',
  preferStatic: true,
};
WRAPPER_EOF

echo "Wrapper applied to .netlify/v1/functions/ssr/ssr.mjs"
