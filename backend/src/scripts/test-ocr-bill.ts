/**
 * End-to-End Test for OCR Bill Processing, Upload, and Save
 */
import { prisma } from '../services/prisma.service';
import { parseBillText } from '../services/ocr.service';

async function testBillProcessing() {
  console.log('--- TEST: OCR Text Parser ---');
  
  const sampleBillText = `
    SHREE AGRO CHEMICALS & FERTILIZERS
    Shop No. 12, Market Yard, Pune - 411037
    Phone: 9876543210
    
    TAX INVOICE
    Invoice No: INV-2024-8891
    Date: 15/05/2024
    
    Item Description          Qty    Rate      Amount
    DAP Fertilizer (50kg)     2      1450.00   2900.00
    Urea Bag (45kg)           3       300.00    900.00
    Pesticide Spray (1 Ltr)   1       450.00    450.00
    
    Grand Total: 4250.00
    Thank you! Visit again.
  `;

  const parsed = parseBillText(sampleBillText);
  console.log('Extracted Vendor:', parsed.vendorName);
  console.log('Extracted Bill No:', parsed.invoiceNumber);
  console.log('Extracted Date:', parsed.billDate);
  console.log('Extracted Total:', parsed.totalAmount);
  console.log('Extracted Items Count:', parsed.items.length);
  console.log('Items:', JSON.stringify(parsed.items, null, 2));

  if (
    parsed.vendorName &&
    parsed.vendorName.includes('SHREE AGRO') &&
    parsed.totalAmount === 4250 &&
    parsed.items.length === 3
  ) {
    console.log('✅ OCR Text Parser Verification Passed!');
  } else {
    console.error('❌ OCR Text Parser Verification Failed!');
    process.exit(1);
  }

  // Verify Database Bill Table Connection
  console.log('\n--- TEST: Database Bill Table Read/Write ---');
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('⚠️ No user found for bill test, skipping DB insertion');
    return;
  }

  const testBill = await prisma.bill.create({
    data: {
      userId: user.id,
      vendorName: parsed.vendorName || 'Test Vendor',
      invoiceNumber: parsed.invoiceNumber,
      totalAmount: parsed.totalAmount,
      billDate: parsed.billDate ? new Date(parsed.billDate) : new Date(),
      rawOcrText: parsed.rawText,
      status: 'VERIFIED',
    },
  });
  console.log('Created Test Bill ID:', testBill.id);

  const testExpense = await prisma.expense.create({
    data: {
      userId: user.id,
      billId: testBill.id,
      title: `${testBill.vendorName} (Bill #${testBill.invoiceNumber})`,
      amount: testBill.totalAmount,
      category: 'FERTILIZER',
      cropName: 'Sugarcane',
      date: testBill.billDate,
      vendorName: testBill.vendorName,
    },
  });
  console.log('Created Linked Expense ID:', testExpense.id);

  // Clean up test records
  await prisma.expense.delete({ where: { id: testExpense.id } });
  await prisma.bill.delete({ where: { id: testBill.id } });
  console.log('✅ Bill & Expense DB Integration Cleaned Up and Verified!');
}

testBillProcessing()
  .then(() => {
    console.log('\n🎉 ALL OCR & BILL TESTS PASSED!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
