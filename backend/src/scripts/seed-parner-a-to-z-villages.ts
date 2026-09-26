import { prisma } from '../services/prisma.service';

/**
 * Complete Official A to Z Villages of Parner Taluka (Ahilyanagar / Ahmednagar District)
 */
export const PARNER_A_TO_Z_VILLAGES: Array<{ en: string; mr: string }> = [
  // A
  { en: 'Akkalkotwadi', mr: 'अक्कलकोटवाडी' },
  { en: 'Alkuti', mr: 'आळकुटी' },
  { en: 'Anantpur', mr: 'अनंतपूर' },
  { en: 'Apdhup', mr: 'आपधूप' },
  { en: 'Astagaon', mr: 'अस्तागाव' },
  { en: 'Asthi', mr: 'आष्टी' },

  // B
  { en: 'Baburdi', mr: 'बाबुर्डी' },
  { en: 'Baburdi Bend', mr: 'बाबुर्डी बेंद' },
  { en: 'Bhalwani', mr: 'भालवणी' },
  { en: 'Bhondre', mr: 'भोंद्रे' },
  { en: 'Bhoyare Gangarda', mr: 'भोयरे गांगर्डा' },
  { en: 'Bhoyare Pathar', mr: 'भोयरे पठार' },
  { en: 'Bibamkhed', mr: 'बिबामखेड' },
  { en: 'Borghar', mr: 'बोरघर' },
  { en: 'Bramhanwada', mr: 'ब्राह्मणवाडा' },

  // C
  { en: 'Chikhali', mr: 'चिखली' },
  { en: 'Chimbhale', mr: 'चिंभळे' },
  { en: 'Chincholi', mr: 'चिंचोली' },

  // D
  { en: 'Dahiwad', mr: 'दहिवाड' },
  { en: 'Darodi', mr: 'दारोडी' },
  { en: 'Dawalgaon', mr: 'दवळगाव' },
  { en: 'Degaon', mr: 'डेगाव' },
  { en: 'Deulgaon Siddhi', mr: 'देऊळगाव सिद्धी' },
  { en: 'Devalali', mr: 'देवळाली' },
  { en: 'Dhoki', mr: 'ढोकी' },
  { en: 'Dhoki Pathar', mr: 'ढोकी पठार' },
  { en: 'Dhotre Budruk', mr: 'धोत्रे बुद्रुक' },
  { en: 'Dhotre Khurd', mr: 'धोत्रे खुर्द' },

  // G
  { en: 'Ganore', mr: 'गणोरे' },
  { en: 'Garkhed', mr: 'गारखेड' },
  { en: 'Ghateshwar', mr: 'घाटेश्वर' },
  { en: 'Gondegaon', mr: 'गोंडेगाव' },
  { en: 'Goregaon', mr: 'गोरेगाव' },

  // H
  { en: 'Hanga', mr: 'हंगा' },
  { en: 'Hangewadi', mr: 'हंगेवाडी' },
  { en: 'Hasnapur', mr: 'हसनापूर' },
  { en: 'Hivare Korda', mr: 'हिवरे कोरडा' },
  { en: 'Hivare Zare', mr: 'हिवरे झरे' },

  // J
  { en: 'Jategaon', mr: 'जातेगाव' },
  { en: 'Jawala', mr: 'जवळा' },

  // K
  { en: 'Kadus', mr: 'कडूस' },
  { en: 'Kakane', mr: 'ककाने' },
  { en: 'Kalas', mr: 'कळस' },
  { en: 'Kanhur Pathar', mr: 'कान्हूर पठार' },
  { en: 'Kankewadi', mr: 'कांकेवाडी' },
  { en: 'Karandi', mr: 'कारंडी' },
  { en: 'Karegaon', mr: 'कारेगाव' },
  { en: 'Karjule Harya', mr: 'कर्जुले हर्या' },
  { en: 'Karjule Mukhai', mr: 'कर्जुले मु Bart' },
  { en: 'Kasare', mr: 'कासारे' },
  { en: 'Katalwedhe', mr: 'कातळवेढे' },
  { en: 'Kautha', mr: 'कौठा' },
  { en: 'Kinhi', mr: 'किन्ही' },
  { en: 'Kohokadi', mr: 'कोहोकडी' },
  { en: 'Koregaon', mr: 'कोरेगाव' },
  { en: 'Kurund', mr: 'कुरुंद' },

  // L
  { en: 'Lonihavali', mr: 'लोणीहवेली' },
  { en: 'Lonimawala', mr: 'लोणीमावळा' },

  // M
  { en: 'Mandave Budruk', mr: 'मांडवे बुद्रुक' },
  { en: 'Mandave Khurd', mr: 'मांडवे खुर्द' },
  { en: 'Mangrul', mr: 'मंगरूळ' },
  { en: 'Maparewadi', mr: 'मापारेवाडी' },
  { en: 'Mhasane', mr: 'म्हासाणे' },
  { en: 'Morwadi', mr: 'मोरवाडी' },

  // N
  { en: 'Nandur Pathar', mr: 'नांदूर पठार' },
  { en: 'Nighoj', mr: 'निघोज' },
  { en: 'Nimgaon Bhogi', mr: 'निमगाव भोगी' },
  { en: 'Nimgaon Dube', mr: 'निमगाव दुधे' },
  { en: 'Nimgaon Gangarda', mr: 'निमगाव गांगर्डा' },
  { en: 'Nimgaon Khed', mr: 'निमगाव खेड' },

  // P
  { en: 'Padali Alle', mr: 'पडळी आळे' },
  { en: 'Padali Daryabai', mr: 'पडळी दर्याबाई' },
  { en: 'Padali Kanhur', mr: 'पडळी कान्हूर' },
  { en: 'Padali Ranjangaon', mr: 'पडळी रांजणगाव' },
  { en: 'Palashi', mr: 'पळशी' },
  { en: 'Palwe Budruk', mr: 'पळवे बुद्रुक' },
  { en: 'Palwe Khurd', mr: 'पळवे खुर्द' },
  { en: 'Panoli', mr: 'पळोली' },
  { en: 'Parner (Gramin)', mr: 'पारनेर (ग्रामीण)' },
  { en: 'Pimpalgaon Rotha', mr: 'पिंपळगाव रोठा' },
  { en: 'Pimpalgaon Turuk', mr: 'पिंपळगाव तुरुक' },
  { en: 'Pimpalner', mr: 'पिंपळनेर' },
  { en: 'Pimpri Gavali', mr: 'पिंप्री गवळी' },
  { en: 'Pimpri Jalsen', mr: 'पिंप्री जलसेन' },
  { en: 'Pokhari', mr: 'पोखरी' },
  { en: 'Punewadi', mr: 'पुणेवाडी' },

  // R
  { en: 'Ralegan Siddhi', mr: 'राळेगण सिद्धी' },
  { en: 'Ralegan Therpal', mr: 'राळेगण थेरपाळ' },
  { en: 'Rayate', mr: 'रायते' },
  { en: 'Renavadi', mr: 'रेणावडी' },
  { en: 'Rui Chhatrapati', mr: 'रुई छत्रपती' },

  // S
  { en: 'Sangvi Surya', mr: 'सांगवी सूर्या' },
  { en: 'Sarola Advai', mr: 'सारोळा आडवाई' },
  { en: 'Savalvihira', mr: 'सावळविहिरा' },
  { en: 'Savargaon', mr: 'सावरगाव' },
  { en: 'Shirapur', mr: 'शिरापूर' },
  { en: 'Shirasgaon', mr: 'शिरसगाव' },
  { en: 'Shobhavant', mr: 'शोभावंत' },
  { en: 'Supe (Parner)', mr: 'सुपे (पारनेर)' },

  // T
  { en: 'Takli Dhokeshwar', mr: 'टाकळी ढोकेश्वर' },
  { en: 'Tarapoor', mr: 'तारापूर' },
  { en: 'Tikhol', mr: 'तिखोल' },

  // V & W
  { en: 'Vadgaon Darya', mr: 'वडगाव दर्या' },
  { en: 'Vadgaon Gund', mr: 'वडगाव गुंड' },
  { en: 'Vadgaon Saval', mr: 'वडगाव सावळ' },
  { en: 'Vadner', mr: 'वडनेर' },
  { en: 'Vadule', mr: 'वडुले' },
  { en: 'Vadzire', mr: 'वडझिरे' },
  { en: 'Vasantgad', mr: 'वसंतगड' },
  { en: 'Vesare', mr: 'वेसरे' },
  { en: 'Vikharn', mr: 'विखरण' },
  { en: 'Walunj', mr: 'वाळुंज' },
  { en: 'Wasunde', mr: 'वासुंदे' },

  // Y
  { en: 'Yadavwadi', mr: 'यादववाडी' },
];

export async function seedParnerVillages() {
  console.log('🚀 Seeding Full A to Z Villages for Parner Taluka...');

  // Find Parner taluka
  const parner = await prisma.taluka.findFirst({
    where: {
      OR: [
        { nameEn: { contains: 'Parner', mode: 'insensitive' } },
        { nameMr: { contains: 'पारनेर' } },
      ],
    },
  });

  if (!parner) {
    console.error('❌ Parner taluka not found in database!');
    return;
  }

  console.log(`📌 Found Parner Taluka (ID: ${parner.id})`);

  // Remove old synthetic records for Parner
  await prisma.village.deleteMany({
    where: { talukaId: parner.id },
  });

  // Insert complete A-Z villages
  const records = PARNER_A_TO_Z_VILLAGES.map((v, idx) => ({
    code: `${parner.code}_az_${idx + 1}`,
    talukaId: parner.id,
    nameEn: v.en,
    nameMr: v.mr,
    nameHi: v.mr,
  }));

  const inserted = await prisma.village.createMany({
    data: records,
    skipDuplicates: true,
  });

  console.log(`✅ Successfully seeded all ${inserted.count} Parner villages from A to Z in Neon PostgreSQL!`);
}

if (require.main === module) {
  seedParnerVillages()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error('❌ Error seeding Parner villages:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
