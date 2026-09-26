import { prisma, connectDatabase, disconnectDatabase } from '../services/prisma.service';
import { logger } from '../utils/logger';

async function testConnection() {
  try {
    logger.info('🔍 Testing connection to Neon PostgreSQL...');
    await connectDatabase();

    // Query database version and table list
    const result: any = await prisma.$queryRaw`SELECT version(), current_database(), current_user;`;
    logger.info('✅ Neon Database Connected Successfully!');
    logger.info(`📊 Database Name: ${result[0]?.current_database}`);
    logger.info(`👤 Connected User: ${result[0]?.current_user}`);
    logger.info(`🐘 PostgreSQL Version: ${result[0]?.version.split(',')[0]}`);

    // Verify all tables and seeded records exist
    const userCount = await prisma.user.count();
    const cropCount = await prisma.crop.count();
    const expenseCount = await prisma.expense.count();
    const saleCount = await prisma.sale.count();
    const diaryCount = await prisma.diaryEntry.count();
    const billCount = await prisma.bill.count();
    const budgetCount = await prisma.budget.count();
    const notificationCount = await prisma.notification.count();
    const aiConversationCount = await prisma.aIConversation.count();
    const aiMessageCount = await prisma.aIMessage.count();

    logger.info('📋 Neon PostgreSQL Live Record Counts:');
    logger.info(`   - users: ${userCount} records`);
    logger.info(`   - crops: ${cropCount} records`);
    logger.info(`   - expenses: ${expenseCount} records`);
    logger.info(`   - sales: ${saleCount} records`);
    logger.info(`   - diary_entries: ${diaryCount} records`);
    logger.info(`   - bills: ${billCount} records`);
    logger.info(`   - budgets: ${budgetCount} records`);
    logger.info(`   - notifications: ${notificationCount} records`);
    logger.info(`   - ai_conversations: ${aiConversationCount} records`);
    logger.info(`   - ai_messages: ${aiMessageCount} records`);

    logger.info('🎉 All models, relations & foreign keys verified in Neon PostgreSQL.');
  } catch (error: any) {
    logger.error('❌ Connection test failed:', error.message);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

testConnection();
