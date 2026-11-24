import { execSync } from 'child_process';

console.log('--- 🔄 Raghav Rasoi Database Sync Starting ---');

try {
  console.log('1. Pushing Prisma Schema to MySQL Database...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('✓ MySQL Schema push successful.');

  console.log('2. Seeding Categories, Dishes, Tables & Admin Accounts...');
  execSync('node scripts/seed-raghav-menu.js', { stdio: 'inherit' });
  console.log('✓ Database Seeding successful.');

  console.log('--- ✅ Database Sync Completed Successfully! ---');
} catch (error) {
  console.warn('⚠️ Notice: Database sync encountered an issue (e.g. offline dev or unconfigured DB URL):', error.message);
  console.warn('Continuing build process. When deploying to Hostinger, ensure DATABASE_URL is set in environment.');
}
