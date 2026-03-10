const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in proper relational order
  await prisma.payment.deleteMany({});
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.recurringRule.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.client.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating Admin User...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create Demo Test User to own the data
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test Administrator',
      password: hashedPassword,
    },
  });

  console.log('Creating Clients...');
  const clients = await Promise.all([
    prisma.client.create({ data: { userId: testUser.id, name: 'PT Maju Bersama', email: 'finance@majubersama.co.id', phone: '+62-812-9988-7766', address: 'Jl. Jend. Sudirman Kav 21', city: 'Jakarta', country: 'Indonesia' } }),
    prisma.client.create({ data: { userId: testUser.id, name: 'CV Karya Cipta', email: 'tagihan@karyacipta.id', phone: '+62-811-3344-5566', address: 'Komp. Ruko Rungkut Megah Raya', city: 'Surabaya', country: 'Indonesia' } }),
    prisma.client.create({ data: { userId: testUser.id, name: 'Nusantara Global Tech', email: 'accounts@nusantaratech.com', phone: '+62-815-1122-3344', address: 'Gedung Sate Lt. 3, Jl. Diponegoro', city: 'Bandung', country: 'Indonesia' } }),
    prisma.client.create({ data: { userId: testUser.id, name: 'Sentosa Jaya Abadi', email: 'billing@sentosajaya.co.id', phone: '+62-857-4455-6677', address: 'Jl. Malioboro No. 45', city: 'Yogyakarta', country: 'Indonesia' } }),
    prisma.client.create({ data: { userId: testUser.id, name: 'Bali Surya Dewata', email: 'admin@balisurya.co.id', phone: '+62-819-8877-6655', address: 'Jl. Sunset Road Blok C2', city: 'Denpasar', country: 'Indonesia' } })
  ]);

  console.log('Creating Products...');
  const products = await Promise.all([
    prisma.product.create({ data: { userId: testUser.id, name: 'Web Development / hr', description: 'Full-stack development services (Node.js/React)', price: 1500000, unit: 'hrs', sku: 'SRV-WEB-001', category: 'Software Development' } }),
    prisma.product.create({ data: { userId: testUser.id, name: 'UI/UX Design / hr', description: 'User interface and experience design mockup creation', price: 1200000, unit: 'hrs', sku: 'SRV-DSG-002', category: 'Creative Design' } }),
    prisma.product.create({ data: { userId: testUser.id, name: 'SEO Optimization', description: 'Monthly search engine optimization reporting', price: 5000000, unit: 'month', sku: 'MKT-SEO-001', category: 'Marketing' } }),
    prisma.product.create({ data: { userId: testUser.id, name: 'Server Maintenance', description: 'Monthly cloud infrastructure upkeep & AWS Management', price: 3500000, unit: 'month', sku: 'INF-MNT-004', category: 'Infrastructure' } }),
    prisma.product.create({ data: { userId: testUser.id, name: 'Content Strategy', description: 'Content marketing planning & strategy generation', price: 2500000, unit: 'campaign', sku: 'MKT-CNT-002', category: 'Marketing' } }),
    prisma.product.create({ data: { userId: testUser.id, name: 'Cloud Migration', description: 'One-off Cloud Migration Services to Google Cloud', price: 15000000, unit: 'project', sku: 'INF-MIG-005', category: 'Infrastructure' } })
  ]);

  console.log('Creating Invoices and Payments...');
  
  // Helper to generate random dates within last 6 months
  const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Generate 25 invoices with varying statuses
  const invoiceStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'PARTIAL'];
  
  for (let i = 0; i < 25; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const status = invoiceStatuses[Math.floor(Math.random() * invoiceStatuses.length)];
    const issueDate = randomDate(sixMonthsAgo, new Date());
    
    let dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30); // Net 30

    // Ensure overdue invoices actually have past due dates
    if (status === 'OVERDUE' && dueDate > new Date()) {
       dueDate = new Date();
       dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 15 + 1));
    }

    // Pick 1 to 4 random products for this invoice
    const numItems = Math.floor(Math.random() * 4) + 1;
    const selectedProducts = [];
    for (let j = 0; j < numItems; j++) {
       selectedProducts.push(products[Math.floor(Math.random() * products.length)]);
    }

    let invoiceTotal = 0;
    const invoiceItemsData = selectedProducts.map(p => {
       const qty = Math.floor(Math.random() * 40) + 5;
       const total = p.price * qty;
       invoiceTotal += total;
       return {
         productId: p.id,
         description: p.name,
         quantity: qty,
         unitPrice: p.price,
         subtotal: total
       };
    });

    const taxAmount = invoiceTotal * 0.11; // 11% tax
    const totalAmount = invoiceTotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        userId: testUser.id,
        clientId: client.id,
        status: status,
        issueDate: issueDate,
        dueDate: dueDate,
        subtotal: invoiceTotal,
        taxAmount: taxAmount, 
        total: totalAmount,
        notes: 'Thank you for your business. Please process payment within 30 days.',
        terms: 'Net 30. Late fees apply 5% per month.',
        items: {
          create: invoiceItemsData
        }
      }
    });

    // If PAID, generate full payment
    if (status === 'PAID') {
       await prisma.payment.create({
         data: {
           invoiceId: invoice.id,
           amount: totalAmount,
           paymentMethod: ['BANK_TRANSFER', 'CREDIT_CARD', 'CASH'][Math.floor(Math.random() * 3)],
           paymentDate: new Date(issueDate.getTime() + (Math.random() * 10 * 24 * 60 * 60 * 1000)), // Paid within 10 days
           reference: `RC-${Math.floor(Math.random() * 1000000)}`
         }
       });
    } else if (status === 'PARTIAL') {
       // Partial payment logic
       await prisma.payment.create({
         data: {
           invoiceId: invoice.id,
           amount: totalAmount / 2, // Half paid
           paymentMethod: 'BANK_TRANSFER',
           paymentDate: new Date(issueDate.getTime() + (Math.random() * 5 * 24 * 60 * 60 * 1000)),
           reference: `PART-${Math.floor(Math.random() * 1000000)}`
         }
       });
    }
  }

  console.log('Mock database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
