if (process.env.NEXT_PUBLIC_BUILD !== 'prod') {
  console.log('[next-sitemap] Skipping sitemap generation in non-production build');
  process.exit(0);
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://mistcase.app',
  generateRobotsTxt: true, // (optional)
}
