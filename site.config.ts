export const siteConfig = {
  name: 'UpStore',
  description: 'Manage your files in cloud',

  siteUrl:
    (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' &&
      `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' &&
      `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`) ||
    `http://localhost:${process.env.PORT}`,
};
