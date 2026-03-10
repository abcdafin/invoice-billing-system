const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'test@example.com';
  const newPassword = 'password123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    console.log('Password for ' + email + ' has been reset to: ' + newPassword);
  } else {
    console.log('User test@example.com not found. Let me check what users exist.');
    const users = await prisma.user.findMany({ select: { email: true } });
    console.log('Found users: ' + users.map(u => u.email).join(', '));
  }
}
resetPassword().then(() => prisma.$disconnect()).catch(console.error);
