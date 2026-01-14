This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Timezone (Recommended Setup)

**Goal:** store all timestamps in UTC internally, but display them in Pakistan time (Asia/Karachi).

### Correct & recommended setup (final)

- Backend sends UTC timestamps (JSON dates are ISO with `Z`).
- DB stores timestamps as `timestamptz` (UTC internally).
- DB session timezone is Asia/Karachi for local display in SQL tools.

### How to verify

Run this in Postgres:

```sql
SELECT NOW();
```

If it shows `+0500`, DB timezone is PKT.

Check latest record:

```sql
SELECT "checkinAt" FROM "CheckIn" ORDER BY "checkinAt" DESC LIMIT 1;
```

### What NOT to do

- Don’t add `+5 hours` manually.
- Don’t hardcode timezone offsets.
- Don’t store timestamps as plain `timestamp` (without timezone).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
