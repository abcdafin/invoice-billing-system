const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const users = await prisma.user.findMany();
  console.log('--- USERS ---');
  users.forEach(u => console.log(u.email, '| ID:', u.id));

  const clients = await prisma.client.count();
  const products = await prisma.product.count();
  const invoices = await prisma.invoice.count();
  const payments = await prisma.payment.count();

  console.log('\n--- COUNTS ---');
  console.log('Clients:', clients);
  console.log('Products:', products);
  console.log('Invoices:', invoices);
  console.log('Payments:', payments);

  console.log('\n--- SAMPLE CLIENT ---');
  const sampleClient = await prisma.client.findFirst();
  if (sampleClient) {
     console.log('Owned by userId:', sampleClient.userId);
  }
}

checkData().then(() => prisma.$disconnect()).catch(console.error);
