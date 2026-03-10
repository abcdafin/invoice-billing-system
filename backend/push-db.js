require('dotenv').config();
const { execSync } = require('child_process');

try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('Database pushed successfully');
} catch (err) {
  console.error('Failed to push database', err.message);
}
