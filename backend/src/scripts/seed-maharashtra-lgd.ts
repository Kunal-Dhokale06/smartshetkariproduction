import { prisma } from '../services/prisma.service';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraMasterData';

export async function seedMaharashtraLGD() {
  console.log('🚀 Starting Maharashtra Official LGD Location Dataset Ingestion to Neon PostgreSQL...');

  const startTime = Date.now();
  let totalDistricts = 0;
  let totalTalukas = 0;
  let totalVillages = 0;

  for (let dIndex = 0; dIndex < MAHARASHTRA_DISTRICTS.length; dIndex++) {
    const d = MAHARASHTRA_DISTRICTS[dIndex];
    if (!d) continue;

    const distCode = String(460 + dIndex); // LGD district code pattern for MH

    const district = await prisma.district.upsert({
      where: { code: distCode },
      update: {
        nameEn: d.nameEn,
        nameMr: d.nameMr,
        nameHi: d.nameHi || d.nameMr,
        stateCode: 'MH',
      },
      create: {
        code: distCode,
        nameEn: d.nameEn,
        nameMr: d.nameMr,
        nameHi: d.nameHi || d.nameMr,
        stateCode: 'MH',
      },
    });
    totalDistricts++;

    if (d.talukas && d.talukas.length > 0) {
      for (let tIndex = 0; tIndex < d.talukas.length; tIndex++) {
        const t = d.talukas[tIndex];
        if (!t) continue;

        const talukaCode = `${distCode}_${tIndex + 1}`;

        const taluka = await prisma.taluka.upsert({
          where: { code: talukaCode },
          update: {
            nameEn: t.nameEn,
            nameMr: t.nameMr,
            nameHi: t.nameHi || t.nameMr,
            districtId: district.id,
          },
          create: {
            code: talukaCode,
            nameEn: t.nameEn,
            nameMr: t.nameMr,
            nameHi: t.nameHi || t.nameMr,
            districtId: district.id,
          },
        });
        totalTalukas++;

        if (t.villages && t.villages.length > 0) {
          const villageData = t.villages.map((v, vIndex) => ({
            code: `${talukaCode}_${vIndex + 1}`,
            talukaId: taluka.id,
            nameEn: v.nameEn,
            nameMr: v.nameMr,
            nameHi: v.nameHi || v.nameMr,
          }));

          const inserted = await prisma.village.createMany({
            data: villageData,
            skipDuplicates: true,
          });
          totalVillages += inserted.count;
        }
      }
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ LGD Ingestion Completed in ${duration}s!`);
  console.log(`📊 Total Ingested:`);
  console.log(`   - Districts: ${totalDistricts}`);
  console.log(`   - Talukas: ${totalTalukas}`);
  console.log(`   - Villages: ${totalVillages}`);
}

// Auto-run if executed directly
if (require.main === module) {
  seedMaharashtraLGD()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error('❌ Error during LGD ingestion:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
