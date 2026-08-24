import { PrismaClient, CropStatus, CropSeason, ExpenseCategory, PaymentMode, PaymentStatus, NoteSource, NotificationType, MessageSender } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding on Neon PostgreSQL...');

  // Clean up any existing data in order of foreign key dependencies
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.diaryEntry.deleteMany();
  await prisma.sale.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Primary Farmer User with Hashed Password
  const hashedPassword = await hashPassword('Farmer@123');
  const user = await prisma.user.create({
    data: {
      phone: '+919876543210',
      password: hashedPassword,
      name: 'Kunal Deshmukh',
      email: 'kunal.deshmukh@farm.in',
      village: 'Khadakawadi',
      taluka: 'Ambegaon',
      district: 'Pune',
      state: 'Maharashtra',
      landArea: 7.0,
      landAreaUnit: 'Acre',
      language: 'mr',
      isVerified: true,
    },
  });

  console.log(`👤 Created farmer user: ${user.name} (${user.id})`);

  // 2. Create Crops for this user
  const wheat = await prisma.crop.create({
    data: {
      userId: user.id,
      name: 'Wheat',
      variety: 'Lokwan',
      sowingDate: new Date('2026-01-10'),
      expectedHarvestDate: new Date('2026-04-15'),
      area: 2.0,
      areaUnit: 'Acre',
      season: CropSeason.RABI,
      status: CropStatus.GROWING,
      iconName: 'wheat',
      notes: 'Planted on plot A near canal. High yielding certified seeds.',
    },
  });

  const cotton = await prisma.crop.create({
    data: {
      userId: user.id,
      name: 'Cotton',
      variety: 'Bt Cotton (Bollgard II)',
      sowingDate: new Date('2025-12-05'),
      expectedHarvestDate: new Date('2026-05-20'),
      area: 1.5,
      areaUnit: 'Acre',
      season: CropSeason.KHARIF,
      status: CropStatus.GROWING,
      iconName: 'flower-2',
      notes: 'Drip irrigation connected. Pest scouting scheduled weekly.',
    },
  });

  const sugarcane = await prisma.crop.create({
    data: {
      userId: user.id,
      name: 'Sugarcane',
      variety: 'CO 86032 (Nira)',
      sowingDate: new Date('2025-11-15'),
      expectedHarvestDate: new Date('2026-11-15'),
      area: 3.0,
      areaUnit: 'Acre',
      season: CropSeason.YEAR_ROUND,
      status: CropStatus.GROWING,
      iconName: 'tree-deciduous',
      notes: 'Perennial crop. Contract with local sugar mill.',
    },
  });

  const tomato = await prisma.crop.create({
    data: {
      userId: user.id,
      name: 'Tomato',
      variety: 'Abhinav Hybrid',
      sowingDate: new Date('2026-02-01'),
      actualHarvestDate: new Date('2026-05-10'),
      area: 0.5,
      areaUnit: 'Acre',
      season: CropSeason.ZAID,
      status: CropStatus.HARVESTED,
      iconName: 'apple',
      notes: 'Sold at Narayangaon wholesale market.',
    },
  });

  console.log('🌾 Created 4 initial crops.');

  // 3. Create Bill / Receipt
  const bill = await prisma.bill.create({
    data: {
      userId: user.id,
      invoiceNumber: 'INV-2026-2456',
      vendorName: 'SHREE AGRO CENTER',
      vendorPhone: '+919822012345',
      vendorAddress: '123, Market Yard, Pune - 411037',
      totalAmount: 2000.0,
      billDate: new Date('2026-05-14'),
      imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
      rawOcrText: 'SHREE AGRO CENTER INVOICE DAP 1450 Urea 300 Pesticide 250 Total 2000',
    },
  });

  // 4. Create Farm Expenses
  await prisma.expense.createMany({
    data: [
      {
        userId: user.id,
        cropId: wheat.id,
        cropName: 'Wheat',
        billId: bill.id,
        title: 'Fertilizer (DAP 50kg)',
        amount: 1450.0,
        category: ExpenseCategory.FERTILIZER,
        paymentMode: PaymentMode.UPI,
        date: new Date('2026-05-14'),
        vendorName: 'Shree Agro Center',
        notes: 'Applied during first tillering stage.',
      },
      {
        userId: user.id,
        cropId: cotton.id,
        cropName: 'Cotton',
        title: 'Hybrid Cotton Seeds (2 Bags)',
        amount: 850.0,
        category: ExpenseCategory.SEEDS,
        paymentMode: PaymentMode.CASH,
        date: new Date('2026-05-12'),
        vendorName: 'Kisan Krishi Kendra',
      },
      {
        userId: user.id,
        cropId: cotton.id,
        cropName: 'Cotton',
        title: 'Bio-Pesticide (Neem Oil extract)',
        amount: 250.0,
        category: ExpenseCategory.PESTICIDE,
        paymentMode: PaymentMode.CASH,
        date: new Date('2026-05-10'),
        vendorName: 'Shree Agro Center',
      },
      {
        userId: user.id,
        cropId: sugarcane.id,
        cropName: 'Sugarcane',
        title: 'Intercultural Labor Charges (Weeding)',
        amount: 2000.0,
        category: ExpenseCategory.LABOR,
        paymentMode: PaymentMode.CASH,
        date: new Date('2026-05-08'),
        notes: '4 laborers for 1 day weeding work.',
      },
      {
        userId: user.id,
        cropId: wheat.id,
        cropName: 'Wheat',
        title: 'Electric Motor Irrigation Bill',
        amount: 600.0,
        category: ExpenseCategory.IRRIGATION,
        paymentMode: PaymentMode.BANK_TRANSFER,
        date: new Date('2026-05-05'),
      },
    ],
  });

  console.log('💳 Created 5 farm expenses.');

  // 5. Create Harvest Sales
  await prisma.sale.createMany({
    data: [
      {
        userId: user.id,
        cropId: wheat.id,
        cropName: 'Wheat',
        quantity: 20.0,
        unit: 'Quintal',
        pricePerUnit: 2400.0,
        totalAmount: 48000.0,
        marketName: 'Pune APMC Market',
        buyerName: 'National Agro Traders',
        paymentStatus: PaymentStatus.PAID,
        date: new Date('2026-05-15'),
        notes: 'Grade A premium quality Lokwan wheat.',
      },
      {
        userId: user.id,
        cropId: tomato.id,
        cropName: 'Tomato',
        quantity: 40.0,
        unit: 'Crate',
        pricePerUnit: 800.0,
        totalAmount: 32000.0,
        marketName: 'Narayangaon Tomato Market',
        buyerName: 'Fresh Veggies Co.',
        paymentStatus: PaymentStatus.PAID,
        date: new Date('2026-05-12'),
      },
      {
        userId: user.id,
        cropId: cotton.id,
        cropName: 'Cotton',
        quantity: 8.0,
        unit: 'Quintal',
        pricePerUnit: 6500.0,
        totalAmount: 52000.0,
        marketName: 'Baramati Cotton APMC',
        buyerName: 'Maharashtra Cotton Federation',
        paymentStatus: PaymentStatus.PAID,
        date: new Date('2026-05-01'),
      },
    ],
  });

  console.log('💰 Created 3 harvest sales records.');

  // 6. Create Diary Notes
  await prisma.diaryEntry.createMany({
    data: [
      {
        userId: user.id,
        cropId: wheat.id,
        cropName: 'Wheat',
        title: 'Fertilizer Application',
        content: 'Applied 2 bags of DAP fertilizer in Wheat field near well. Soil moisture is optimal after light morning irrigation.',
        date: new Date('2026-05-14'),
        source: NoteSource.TEXT,
        tags: ['Fertilizer', 'Wheat', 'Irrigation'],
      },
      {
        userId: user.id,
        cropId: cotton.id,
        cropName: 'Cotton',
        title: 'Pest Scouting & Spraying',
        content: 'Scouted cotton leaves for whitefly and aphids. Sprayed bio-pesticide mix in evening hours to prevent infestation.',
        date: new Date('2026-05-10'),
        source: NoteSource.VOICE,
        tags: ['PestControl', 'Cotton'],
      },
    ],
  });

  console.log('📖 Created 2 diary entries.');

  // 7. Create Seasonal Budget
  await prisma.budget.create({
    data: {
      userId: user.id,
      season: CropSeason.KHARIF,
      year: 2026,
      totalBudget: 50000.0,
      fertilizerAlloc: 15000.0,
      seedsAlloc: 10000.0,
      pesticideAlloc: 5000.0,
      laborAlloc: 12000.0,
      machineryAlloc: 5000.0,
      irrigationAlloc: 3000.0,
      notes: 'Seasonal operational budget for upcoming Kharif 2026.',
    },
  });

  console.log('📊 Created seasonal budget.');

  // 8. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        title: 'Weather Alert for Pune',
        message: 'Thunderstorm with moderate rainfall expected in next 24-48 hours. Secure harvested crops.',
        type: NotificationType.WEATHER,
        isRead: false,
        data: { district: 'Pune', rainProb: 80 },
      },
      {
        userId: user.id,
        title: 'Mandi Price Increase',
        message: 'Wheat prices rose by ₹50/Quintal to ₹2,450 at Pune APMC today.',
        type: NotificationType.MARKET_RATE,
        isRead: true,
        data: { commodity: 'Wheat', mandi: 'Pune', rate: 2450 },
      },
    ],
  });

  console.log('🔔 Created notifications.');

  // 9. Create AI Advisory Conversation
  const conversation = await prisma.aIConversation.create({
    data: {
      userId: user.id,
      title: 'Cotton Pest Diagnosis & Weather Plan',
      language: 'mr',
    },
  });

  await prisma.aIMessage.createMany({
    data: [
      {
        conversationId: conversation.id,
        sender: MessageSender.USER,
        content: 'माझ्या कापसाच्या पानांवर पांढरे ठिपके दिसत आहेत, काय उपाय करावा?',
        intent: 'disease_diagnosis',
      },
      {
        conversationId: conversation.id,
        sender: MessageSender.ASSISTANT,
        content: 'कापसावरील पांढरे ठिपके पांढऱ्या माशीचा (Whitefly) प्रादुर्भाव दर्शवतात. उपाययोजना: १) ५% निंबोळी अर्क फवारा. २) तीव्र प्रादुर्भाव असल्यास ॲसिटामिप्रिड २०% SP ५ ग्रॅम प्रति १० लिटर पाण्यात मिसळून फवारा.',
        intent: 'disease_diagnosis_remedy',
      },
    ],
  });

  console.log('🤖 Created AI advisory conversation and messages.');
  console.log('✨ Database seeding finished successfully on Neon PostgreSQL!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
