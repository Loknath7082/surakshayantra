# Unit 03: Database + Domain Models

## Goal

Set up Prisma with PostgreSQL, add `DATABASE_URL` validation to `lib/env.ts` using Zod, create `lib/prisma.ts` as a development global-caching singleton exported as `prisma`, define the `User`, `SecurityRequest`, `ContactSubmission`, `BlogPost`, and `CaseStudy` models with their enums in `prisma/schema.prisma`, and generate the initial migration `init-domain-models`. Content JSON for Blog Posts and Case Studies lives in Vercel Blob; PostgreSQL stores metadata and `contentPath` only.

## Design

- Backend/data-layer unit only. No UI, no API routes, no Clerk integration, no auth helpers, no seed data, no unrelated env vars.
- Vercel Blob is out of scope for this unit. This unit must not create `lib/blob.ts`, must not add `BLOB_READ_WRITE_TOKEN` to `lib/env.ts`, and must not import `@vercel/blob`.
- `prisma/schema.prisma` is the single source of truth for database enums.
- PostgreSQL is the datasource provider; connection string read from `env("DATABASE_URL")`.
- Prisma generator: `prisma-client-js`.
- All model IDs are `String @id @default(cuid())`.
- `User` is limited to `id`, `clerkId`, `email`, `role`, `createdAt`, `updatedAt` plus back-relations. No `name`, `company`, or `phone` fields.
- `BlogPost` and `CaseStudy` share a single content status enum (`ContentStatus`).
- `SecurityRequest` retains all 7 architecture-defined status values.
- `contentPath` is nullable on `BlogPost` and `CaseStudy`.
- `publishedAt` is nullable on `BlogPost` and `CaseStudy`, no default.
- All three foreign keys to `User` use `onDelete: Restrict`.
- Relations use explicit relation names.
- No additional indexes beyond primary keys and unique constraints.
- No binary data in PostgreSQL.

## Implementation

### Prisma + PostgreSQL

- Datasource block: provider `postgresql`, url `env("DATABASE_URL")`.
- Generator block: `prisma-client-js`.
- Schema file location: `prisma/schema.prisma`.

### Environment Validation

- Update `lib/env.ts` to validate `DATABASE_URL` using Zod.
- `DATABASE_URL` is a required string.
- Validate at module load and export a typed `env` object.
- Do not add `BLOB_READ_WRITE_TOKEN` or any other env var in this unit.
- `process.env.DATABASE_URL` must not be accessed outside `lib/env.ts`.

### Prisma Client

- Create `lib/prisma.ts`.
- Instantiate `PrismaClient`.
- Use the standard Next.js development global-caching singleton pattern to prevent multiple instances during hot reload.
- Export the client as `prisma`.

### Database Enums

Define exactly these three enums in `prisma/schema.prisma`:

- `UserRole`: `CLIENT`, `EMPLOYEE`, `ADMIN`
- `SecurityRequestStatus`: `PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `ContentStatus`: `DRAFT`, `PUBLISHED`

### User Model

| Field | Type | Nullable | Default | Unique |
|---|---|---|---|---|
| id | String | No | `@default(cuid())` | `@id` |
| clerkId | String | No | none | `@unique` |
| email | String | No | none | `@unique` |
| role | UserRole | No | `CLIENT` | No |
| createdAt | DateTime | No | `@default(now())` | No |
| updatedAt | DateTime | No | `@updatedAt` | No |

Back-relations (with explicit relation names):
- `requests` → `SecurityRequest[]`
- `posts` → `BlogPost[]`
- `caseStudies` → `CaseStudy[]`

No `name`, `company`, or `phone` fields.

### SecurityRequest Model

| Field | Type | Nullable | Default | Unique |
|---|---|---|---|---|
| id | String | No | `@default(cuid())` | `@id` |
| clientId | String | No | none | No |
| fullName | String | No | none | No |
| companyName | String | No | none | No |
| email | String | No | none | No |
| phone | String | Yes | none | No |
| serviceType | String | Yes | none | No |
| additionalDetails | String | Yes | none | No |
| status | SecurityRequestStatus | No | `PENDING` | No |
| createdAt | DateTime | No | `@default(now())` | No |
| updatedAt | DateTime | No | `@updatedAt` | No |

`clientId` is a foreign key to `User.id` with an explicit relation name and `onDelete: Restrict`.

`fullName` and `email` are stored on the SecurityRequest row as submitted request data and are not replaced by User fields.

### ContactSubmission Model

| Field | Type | Nullable | Default | Unique |
|---|---|---|---|---|
| id | String | No | `@default(cuid())` | `@id` |
| name | String | No | none | No |
| email | String | No | none | No |
| message | String | No | none | No |
| createdAt | DateTime | No | `@default(now())` | No |

No `updatedAt` field on this model.

### BlogPost Model

| Field | Type | Nullable | Default | Unique |
|---|---|---|---|---|
| id | String | No | `@default(cuid())` | `@id` |
| title | String | No | none | No |
| slug | String | No | none | `@unique` |
| contentPath | String | Yes | none | No |
| status | ContentStatus | No | `DRAFT` | No |
| authorId | String | No | none | No |
| publishedAt | DateTime | Yes | none | No |
| createdAt | DateTime | No | `@default(now())` | No |
| updatedAt | DateTime | No | `@updatedAt` | No |

`authorId` is a foreign key to `User.id` with an explicit relation name and `onDelete: Restrict`.

### CaseStudy Model

| Field | Type | Nullable | Default | Unique |
|---|---|---|---|---|
| id | String | No | `@default(cuid())` | `@id` |
| title | String | No | none | No |
| slug | String | No | none | `@unique` |
| contentPath | String | Yes | none | No |
| status | ContentStatus | No | `DRAFT` | No |
| authorId | String | No | none | No |
| publishedAt | DateTime | Yes | none | No |
| createdAt | DateTime | No | `@default(now())` | No |
| updatedAt | DateTime | No | `@updatedAt` | No |

`authorId` is a foreign key to `User.id` with an explicit relation name and `onDelete: Restrict`.

### Relations

- `SecurityRequest.clientId` → `User.id`, explicit relation name, `onDelete: Restrict`.
- `BlogPost.authorId` → `User.id`, explicit relation name, `onDelete: Restrict`.
- `CaseStudy.authorId` → `User.id`, explicit relation name, `onDelete: Restrict`.
- `User` declares back-relations: `requests`, `posts`, `caseStudies`.

No other relations are defined in this unit.

Indexes: none beyond primary keys and unique constraints.

### Initial Migration

- Generate and apply the initial migration with:
  - `npx prisma migrate dev --name init-domain-models`
- Migration must apply successfully against the configured PostgreSQL database.

## Dependencies

- `prisma` — Prisma CLI and migration tooling.
- `@prisma/client` — Prisma runtime client used by `lib/prisma.ts`.
- `zod` — `DATABASE_URL` validation in `lib/env.ts`.

Package versions: use the project's established pinned versions if they exist; otherwise use compatible current stable versions. Do not invent specific version numbers in this spec.

## Verify when done

- [ ] `prisma/schema.prisma` uses provider `postgresql` and url `env("DATABASE_URL")`.
- [ ] Prisma generator is `prisma-client-js`.
- [ ] `lib/env.ts` validates `DATABASE_URL` with Zod, exports a typed `env` object, and validates at module load.
- [ ] No other env var is added to `lib/env.ts` in this unit, including `BLOB_READ_WRITE_TOKEN`.
- [ ] `process.env.DATABASE_URL` is not accessed outside `lib/env.ts`.
- [ ] `lib/prisma.ts` uses the Next.js development global-caching singleton pattern.
- [ ] `lib/prisma.ts` exports the client as `prisma`.
- [ ] Enum `UserRole` exists with values `CLIENT`, `EMPLOYEE`, `ADMIN`.
- [ ] Enum `SecurityRequestStatus` exists with values `PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.
- [ ] Enum `ContentStatus` exists with values `DRAFT`, `PUBLISHED`.
- [ ] `User` fields: `id`, `clerkId`, `email`, `role`, `createdAt`, `updatedAt`, plus back-relations `requests`, `posts`, `caseStudies`.
- [ ] `User` does not contain `name`, `company`, or `phone`.
- [ ] `User.id` is `String @id @default(cuid())`.
- [ ] `User.clerkId` is `@unique`.
- [ ] `User.email` is `@unique`.
- [ ] `User.role` is `UserRole` with default `CLIENT`.
- [ ] `User.createdAt` uses `@default(now())`; `User.updatedAt` uses `@updatedAt`.
- [ ] `SecurityRequest` fields: `id`, `clientId`, `fullName`, `companyName`, `email`, `phone?`, `serviceType?`, `additionalDetails?`, `status`, `createdAt`, `updatedAt`.
- [ ] `SecurityRequest.id` is `String @id @default(cuid())`.
- [ ] `SecurityRequest.clientId` is a FK to `User.id` with explicit relation name and `onDelete: Restrict`.
- [ ] `SecurityRequest.phone`, `serviceType`, and `additionalDetails` are nullable.
- [ ] `SecurityRequest.status` is `SecurityRequestStatus` with default `PENDING`.
- [ ] `SecurityRequest.createdAt` uses `@default(now())`; `SecurityRequest.updatedAt` uses `@updatedAt`.
- [ ] `ContactSubmission` fields: `id`, `name`, `email`, `message`, `createdAt`.
- [ ] `ContactSubmission.id` is `String @id @default(cuid())`.
- [ ] `ContactSubmission` has no `updatedAt` field.
- [ ] `ContactSubmission.createdAt` uses `@default(now())`.
- [ ] `BlogPost` fields: `id`, `title`, `slug`, `contentPath?`, `status`, `authorId`, `publishedAt?`, `createdAt`, `updatedAt`.
- [ ] `BlogPost.id` is `String @id @default(cuid())`.
- [ ] `BlogPost.slug` is `@unique`.
- [ ] `BlogPost.contentPath` is nullable with no default.
- [ ] `BlogPost.status` is `ContentStatus` with default `DRAFT`.
- [ ] `BlogPost.authorId` is a FK to `User.id` with explicit relation name and `onDelete: Restrict`.
- [ ] `BlogPost.publishedAt` is nullable with no default.
- [ ] `BlogPost.createdAt` uses `@default(now())`; `BlogPost.updatedAt` uses `@updatedAt`.
- [ ] `CaseStudy` fields: `id`, `title`, `slug`, `contentPath?`, `status`, `authorId`, `publishedAt?`, `createdAt`, `updatedAt`.
- [ ] `CaseStudy.id` is `String @id @default(cuid())`.
- [ ] `CaseStudy.slug` is `@unique`.
- [ ] `CaseStudy.contentPath` is nullable with no default.
- [ ] `CaseStudy.status` is `ContentStatus` with default `DRAFT`.
- [ ] `CaseStudy.authorId` is a FK to `User.id` with explicit relation name and `onDelete: Restrict`.
- [ ] `CaseStudy.publishedAt` is nullable with no default.
- [ ] `CaseStudy.createdAt` uses `@default(now())`; `CaseStudy.updatedAt` uses `@updatedAt`.
- [ ] All three relations use explicit relation names.
- [ ] No indexes are added beyond primary keys and unique constraints.
- [ ] `lib/blob.ts` is not created in this unit.
- [ ] `@vercel/blob` is not installed or imported in this unit.
- [ ] No API routes, UI, Clerk integration, auth helpers, or seed data are added in this unit.
- [ ] Migration `init-domain-models` created and applied successfully via `npx prisma migrate dev --name init-domain-models`.
- [ ] No TypeScript errors (`npx tsc --noEmit` or `npm run typecheck`).
- [ ] `npm run build` passes.
