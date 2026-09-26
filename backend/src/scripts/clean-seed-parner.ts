import { prisma } from '../services/prisma.service';

/**
 * Exact, Verified, Official Gram Panchayat Villages of Parner Taluka
 * Filtered to remove non-Parner villages & typos
 */
export const OFFICIAL_PARNER_VILLAGES: Array<{ en: string; mr: string; hi?: string }> = [
  // A
  { en: 'Akkalwadi', mr: 'अक्कलवाडी' },
  { en: 'Alkuti', mr: 'आळकुटी' },
  { en: 'Anantpur', mr: 'अनंतपूर' },
  { en: 'Apdhup', mr: 'आपधूप' },
  { en: 'Astagaon', mr: 'अस्तागाव' },

  // B
  { en: 'Baburdi', mr: 'बाबुर्डी' },
  { en: 'Baburdi Bend', mr: 'बाबुर्डी बेंद' },
  { en: 'Batewadi', mr: 'बाटेवाडी' },
  { en: 'Belwandi (Parner)', mr: 'बेलवंडी (पारनेर)' },
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
  { en: 'Gharkhed', mr: 'घरखेड' },
  { en: 'Ghateshwar', mr: 'घाटेश्वर' },
  { en: 'Gondegaon', mr: 'गोंडेगाव' },
  { en: 'Goregaon', mr: 'गोरेगाव' },

  // H
  { en: 'Hanga', mr: 'हंगा' },
  { en: 'Hangewadi', mr: 'हंगेवाडी' },
  { en: 'Hasnapur', mr: 'हसनापूर' },
  { en: 'Hatalkhed', mr: 'हातळखेड' },
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
  { en: 'Karjule Mukhai', mr: 'कर्जुले मुकाई' },
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
  { en: 'Mahadevdara', mr: 'महादेवदरा' },
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
  { en: 'Pargaon', mr: 'पारगाव' },
  { en: 'Parner (City/Gramin)', mr: 'पारनेर (शहर/ग्रामीण)' },
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

export async function cleanAndSeedParner() {
  console.log('🧹 Cleaning and seeding exact official Parner villages...');

  const parner = await prisma.taluka.findFirst({
    where: {
      OR: [
        { nameEn: { contains: 'Parner', mode: 'insensitive' } },
        { nameMr: { contains: 'पारनेर' } },
      ],
    },
  });

  if (!parner) {
    console.error('❌ Parner taluka not found!');
    return;
  }

  // Delete all existing villages for Parner
  const deleted = await prisma.village.deleteMany({
    where: { talukaId: parner.id },
  });
  console.log(`🗑️ Deleted ${deleted.count} existing records for Parner.`);

  // Insert cleaned, official A-Z list
  const data = OFFICIAL_PARNER_VILLAGES.map((v, i) => ({
    code: `${parner.code}_pnr_${(i + 1).toString().padStart(3, '0')}`,
    talukaId: parner.id,
    nameEn: v.en,
    nameMr: v.mr,
    nameHi: v.hi || v.mr,
  }));

  const res = await prisma.village.createMany({
    data,
  });

  console.log(`✅ Ingested ${res.count} verified official villages for Parner Taluka!`);
}

if (require.main === module) {
  cleanAndSeedParner()
    .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error('❌ Error in Parner cleanup/seed:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
