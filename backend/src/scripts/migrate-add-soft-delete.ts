import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Running soft-delete migration for crops table...');
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE crops ADD COLUMN IF NOT EXISTS "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE`);
    console.log('Added isDeleted column');
  } catch (e: any) { console.log('isDeleted:', e.message); }
  
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE crops ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3)`);
    console.log('Added deletedAt column');
  } catch (e: any) { console.log('deletedAt:', e.message); }
  
  try {
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "crops_userId_isDeleted_idx" ON crops("userId", "isDeleted")`);
    console.log('Added index');
  } catch (e: any) { console.log('Index:', e.message); }

  const result: any[] = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'crops' AND column_name IN ('isDeleted', 'deletedAt')`;
  console.log('Verification:', result);
  console.log('Migration complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
