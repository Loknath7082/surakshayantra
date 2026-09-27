
# Unit 10: User Sync Webhook

## Goal

Add the Clerk webhook at `app/api/webhooks/clerk/route.ts` that verifies the svix signature and creates a DB `User` row with role `CLIENT` on `user.created`. No other write path creates users.

## Design

- Public route — signature verification replaces auth/role checks. Envelope responses via `ApiResponse<T>`.
- Idempotent: `prisma.user.upsert` keyed on `clerkId`; concurrent duplicate deliveries handled via a P2002 fallback that runs *before* `handleApiError` (which maps P2002 → 409).
- Non-`user.created` events return 200 with an ignored marker. Malformed payloads (missing/invalid `type`, non-array `email_addresses`) return 400 `INVALID_PAYLOAD` — never a silent 200 or a 500.
- Primary email resolved by matching `primary_email_address_id` against `email_addresses[].id`. Missing, null, or undefined primary → 400.
- Node.js runtime. Route must NOT declare `export const runtime = 'edge'` — svix requires Node crypto.
- No UI, no styling changes.

## Implementation

### package.json
Add `svix@^1.40.0`.

### lib/env.ts
Add `CLERK_WEBHOOK_SECRET: z.string().min(1)`.

### .env.example
Add `CLERK_WEBHOOK_SECRET=` under Required.

### test/setup.ts (modify)
Add `process.env.CLERK_WEBHOOK_SECRET = 'whsec_test_dummy'`.

### app/api/webhooks/clerk/route.ts

Imports:
```ts
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { handleApiError } from '@/lib/api-error';
import type { ApiResponse } from '@/lib/api-response';
```

Event type:
```ts
type ClerkUserCreatedEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ id: string; email_address: string }>;
    primary_email_address_id: string | null | undefined;
  };
};
```

Local P2002 detector:
```ts
function isP2002(err: unknown): boolean {
  return (
    err instanceof Error &&
    err.name === 'PrismaClientKnownRequestError' &&
    'code' in err &&
    (err as { code?: string }).code === 'P2002'
  );
}
```

Handler skeleton:
```ts
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // steps 1-6
    // step 7: inner try/catch for P2002
    // return 200
  } catch (error) {
    return handleApiError(error);
  }
}
```

Order:
1. `const body = await request.text()`. If `!body.trim()` → 400 `INVALID_SIGNATURE`.
2. Read `svixId`, `svixTimestamp`, `svixSignature` from headers via `request.headers.get(...)` (each returns `string | null`). If any is `null` OR blank after `.trim()` → 400 `INVALID_SIGNATURE`.
3. `new Webhook(env.CLERK_WEBHOOK_SECRET).verify(body, { 'svix-id': svixId, 'svix-timestamp': svixTimestamp, 'svix-signature': svixSignature })` cast to `ClerkUserCreatedEvent`. Catch throws → 400 `INVALID_SIGNATURE`.
4. Payload shape guard:
```ts
if (
  !event.data ||
  typeof event.type !== 'string' ||
  !Array.isArray(event.data.email_addresses)
) {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, data: null, error: { message: 'Malformed payload', code: 'INVALID_PAYLOAD' } },
    { status: 400 },
  );
}
```
5. If `event.type !== 'user.created'` → `logger.info({ type: event.type }, 'Ignoring webhook event')` and return 200 `{ success: true, data: { ignored: true }, error: null }`.
6. Extraction:
```ts
const { id: clerkId, email_addresses, primary_email_address_id } = event.data;
const primary = email_addresses.find((e) => e.id === primary_email_address_id);
if (!primary_email_address_id || !primary) {
  return NextResponse.json<ApiResponse<null>>(
    { success: false, data: null, error: { message: 'Primary email missing', code: 'PRIMARY_EMAIL_MISSING' } },
    { status: 400 },
  );
}
const email = primary.email_address;
```
7. P2002-aware upsert (do NOT route P2002 through `handleApiError`):
```ts
let userId: string;
try {
  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId, email, role: 'CLIENT' },
    select: { id: true },
  });
  userId = user.id;
} catch (err) {
  if (isP2002(err)) {
    const existing = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
    if (!existing) throw err;
    userId = existing.id;
  } else {
    throw err;
  }
}
return NextResponse.json<ApiResponse<{ userId: string }>>(
  { success: true, data: { userId }, error: null },
  { status: 200 },
);
```
`update: {}` is intentional — Clerk retries must not overwrite manually-set roles or emails.

Unexpected errors propagate to the outer catch → `handleApiError`.

### app/api/webhooks/clerk/__tests__/route.test.ts

Vitest. Base mocks:
```ts
vi.mock('svix', () => ({
  Webhook: vi.fn().mockImplementation(() => ({
    verify: vi.fn().mockImplementation((body: string) => JSON.parse(body)),
  })),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: { user: { upsert: vi.fn(), findUnique: vi.fn() } },
}));
```

Per-test overrides / setups:
```ts
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

afterEach(() => { vi.restoreAllMocks(); });

// invalid signature:
vi.mocked(Webhook).mockImplementationOnce(() => ({
  verify: () => { throw new Error('Invalid signature'); },
}));

// happy path:
vi.mocked(prisma.user.upsert).mockResolvedValue({ id: 'user_123' });

// P2002 fallback:
vi.mocked(prisma.user.upsert).mockRejectedValueOnce(
  Object.assign(new Error('Unique constraint'), {
    name: 'PrismaClientKnownRequestError',
    code: 'P2002',
  }),
);
vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 'user_existing' });

// ignored event:
const infoSpy = vi.spyOn(logger, 'info');
```

Cases: valid `user.created` → 200 `data.userId`, upsert called with `role: 'CLIENT'` and `select: { id: true }`; missing svix header → 400 `INVALID_SIGNATURE`; whitespace-only body → 400 `INVALID_SIGNATURE`; invalid signature → 400 `INVALID_SIGNATURE`; `{"data": {}}` missing `type` → 400 `INVALID_PAYLOAD`; `{ "type": "user.created", "data": { "id": "x", "email_addresses": null } }` → 400 `INVALID_PAYLOAD`; `primary_email_address_id` null → 400 `PRIMARY_EMAIL_MISSING`; `email_addresses: []` → 400 `PRIMARY_EMAIL_MISSING`; non-`user.created` → 200 `data.ignored === true` and `logger.info` called; P2002 → `findUnique` called, 200 with existing id.

## Dependencies
`svix@^1.40.0`.

## Out of scope
- `user.updated`, `user.deleted`, other Clerk events.
- Role assignment beyond default `CLIENT`.
- Email-change handling.
- Persisting `svix-id` for idempotency.
- Real Clerk webhook integration tests.

## Verify when done
- [ ] `package.json` includes `svix@^1.40.0`; `lib/env.ts` validates `CLERK_WEBHOOK_SECRET`; `.env.example` lists it under Required; `test/setup.ts` sets it.
- [ ] Route imports `ApiResponse` type.
- [ ] Body read via `request.text()`; whitespace-only → 400 `INVALID_SIGNATURE`.
- [ ] Svix headers read via `request.headers.get(...)`; any `null` or blank after trim → 400 `INVALID_SIGNATURE`; verify throws → 400 `INVALID_SIGNATURE`.
- [ ] Payload shape guard rejects `!event.data`, non-string `event.type`, non-array `email_addresses` → 400 `INVALID_PAYLOAD`.
- [ ] Non-`user.created` → 200 `data.ignored === true` and `logger.info` called.
- [ ] `event` typed as `ClerkUserCreatedEvent`; no `as any`.
- [ ] Primary email resolved via `primary_email_address_id` ↔ `email_addresses[].id`; missing/null/undefined → 400 `PRIMARY_EMAIL_MISSING`.
- [ ] `prisma.user.upsert` uses `clerkId`, `update: {}`, `create` sets `role: 'CLIENT'`, `select: { id: true }`.
- [ ] P2002 via local `isP2002` (not `handleApiError`); fallback to `findUnique`; returns 200 with existing `userId`.
- [ ] Outer try/catch routes unexpected errors through `handleApiError`.
- [ ] Route does not declare `export const runtime = 'edge'`.
- [ ] Test file mocks both `svix` and `@/lib/prisma`; uses `vi.mocked(...)`; `afterEach(() => vi.restoreAllMocks())`; asserts logger via `vi.spyOn(logger, 'info')`.
- [ ] All Vitest cases pass under `vitest run`.
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build`, `vitest run` all pass.
- [ ] No files outside the plan created, edited, or deleted.
```

