# Why "importing too many Server Actions into one Client Component" causes problems

Server Actions are not plain functions once they cross the server/client boundary: Next.js
compiles each exported action from a `"use server"` module into a reference that gets
serialized and sent to the client so it can be called back on the server (an RPC-style
closure reference, similar in spirit to how `bind`-ed closures are serialized).

Practical consequences the user may be running into:

1. **Bundle/reference bloat**: every Server Action imported into a Client Component adds
   a client-side reference manifest entry. A file that re-exports many actions and is
   imported by a Client Component pulls in the whole module graph for all of them, even
   the ones not called on that page, inflating the client bundle and the action manifest.
2. **Build/runtime errors on some Next.js versions**: importing a large number of Server
   Actions from a single module into one Client Component has been a source of build
   errors or unexpected "used before defined" / serialization errors in the App Router,
   particularly when actions call each other or share closures within the same file.
   Splitting one action per file, and keeping each Client Component's import list narrow,
   avoids the module from acting as one giant server/client boundary crossing point.
3. **Tree-shaking**: bundlers can drop unused code more reliably when each action lives in
   its own module, since the Client Component only pulls in the reference it actually
   calls.

The practical fix (and what this skill applies) is:
- One Server Action per file, each with its own `"use server"` directive at the top.
- Client Components import only the specific actions they call, from their specific
  files, rather than importing many actions from one shared `actions.ts`.
- If a Client Component legitimately needs many actions, prefer grouping by verb-folder
  barrel files (`get/index.ts`, `post/index.ts`, ...) over one flat `actions.ts`, so no
  single module re-exports the entire domain's actions.

If the user cites a specific numeric limit or exact error message, treat their report as
authoritative for their Next.js version — don't override it with a made-up universal
number — and just make sure the resulting import statements stay under whatever threshold
they observed.