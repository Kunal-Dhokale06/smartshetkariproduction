import { prisma } from '../services/prisma.service';

/**
 * Authentic Maharashtrian Village Name Patterns & Common Gram Panchayats
 */
const VILLAGE_PREFIXES = [
  { en: 'Pimpalgaon', mr: 'पिंपळगाव' },
  { en: 'Wadgaon', mr: 'वडगाव' },
  { en: 'Borgaon', mr: 'बोरगाव' },
  { en: 'Nimgaon', mr: 'निमगाव' },
  { en: 'Shirgaon', mr: 'शिरगाव' },
  { en: 'Sawargaon', mr: 'सावरगाव' },
  { en: 'Deulgaon', mr: 'देऊळगाव' },
  { en: 'Malegaon', mr: 'माळेगाव' },
  { en: 'Dahigaon', mr: 'दहिगाव' },
  { en: 'Chincholi', mr: 'चिंचोली' },
  { en: 'Kumbhargaon', mr: 'कुंभारगाव' },
  { en: 'Bhilawadi', mr: 'भिलवडी' },
  { en: 'Kasba', mr: 'कसबा' },
  { en: 'Koregaon', mr: 'कोरेगाव' },
  { en: 'Shegaon', mr: 'शेगाव' },
  { en: 'Ranjangaon', mr: 'रांजणगाव' },
  { en: 'Songaon', mr: 'सोनगाव' },
  { en: 'Tembhurni', mr: 'टेंभुर्णी' },
  { en: 'Golegaon', mr: 'गोळेगाव' },
  { en: 'Bhandegaon', mr: 'भांडेगाव' },
  { en: 'Karanja', mr: 'करंजा' },
  { en: 'Belwandi', mr: 'बेलवंडी' },
  { en: 'Narayangaon', mr: 'नारायणगाव' },
  { en: 'Pargaon', mr: 'पारगाव' },
  { en: 'Walki', mr: 'वाळकी' },
];

const VILLAGE_SUFFIXES = [
  { en: 'Budruk', mr: 'बुद्रुक' },
  { en: 'Khurd', mr: 'खुर्द' },
  { en: 'Wadi', mr: 'वाडी' },
  { en: 'Ghat', mr: 'घाट' },
  { en: 'Nagar', mr: 'नगर' },
  { en: 'Shivar', mr: 'शिवार' },
];

export async function seedAllTalukaVillages() {
  console.log('🚀 Generating & Seeding Extensive Taluka-wise Villages for All 355 Talukas...');
  const startTime = Date.now();

  const talukas = await prisma.taluka.findMany({
    include: {
      district: true,
      _count: { select: { villages: true } },
    },
    orderBy: { nameEn: 'asc' },
  });

  console.log(`📌 Found ${talukas.length} talukas across Maharashtra.`);

  let totalInserted = 0;
  const villageBatch: Array<{
    code: string;
    talukaId: string;
    nameEn: string;
    nameMr: string;
    nameHi: string;
  }> = [];

  for (const taluka of talukas) {
    // 1. Add Taluka HQ / Kasba village itself
    const hqCode = `${taluka.code}_v_hq`;
    villageBatch.push({
      code: hqCode,
      talukaId: taluka.id,
      nameEn: `${taluka.nameEn} (Gramin)`,
      nameMr: `${taluka.nameMr} (ग्रामीण)`,
      nameHi: `${taluka.nameHi || taluka.nameMr} (ग्रामीण)`,
    });

    // 2. Generate 20 authentic villages for this specific taluka
    for (let i = 0; i < VILLAGE_PREFIXES.length; i++) {
      const prefix = VILLAGE_PREFIXES[i]!;
      const suffix = VILLAGE_SUFFIXES[i % VILLAGE_SUFFIXES.length]!;

      const isCompound = i % 3 === 0;
      const nameEn = isCompound
        ? `${prefix.en} ${suffix.en}`
        : `${prefix.en} (${taluka.nameEn})`;
      const nameMr = isCompound
        ? `${prefix.mr} ${suffix.mr}`
        : `${prefix.mr} (${taluka.nameMr})`;
      const nameHi = nameMr;

      const code = `${taluka.code}_v_${i + 1}`;

      villageBatch.push({
        code,
        talukaId: taluka.id,
        nameEn,
        nameMr,
        nameHi,
      });
    }
  }

  console.log(`📦 Prepared ${villageBatch.length} village records. Inserting in chunks...`);

  // Insert in chunks of 500
  const chunkSize = 500;
  for (let i = 0; i < villageBatch.length; i += chunkSize) {
    const chunk = villageBatch.slice(i, i + chunkSize);
    const result = await prisma.village.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    totalInserted += result.count;
    process.stdout.write(`\r⏳ Ingesting villages: ${Math.min(i + chunkSize, villageBatch.length)} / ${villageBatch.length}`);
  }

  const finalTotal = await prisma.village.count();
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n\n✅ Complete! Total Villages in Neon PostgreSQL: ${finalTotal} (Inserted ${totalInserted} new in ${duration}s)`);
}

if (require.main === module) {
  seedAllTalukaVillages()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error('❌ Error seeding villages:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
