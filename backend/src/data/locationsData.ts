export interface MultiLangName {
  id: string;
  en: string;
  mr: string;
  hi: string;
}

export interface VillageModel extends MultiLangName {}

export interface TalukaModel extends MultiLangName {
  villages: VillageModel[];
}

export interface DistrictModel extends MultiLangName {
  talukas: TalukaModel[];
}

export interface StateModel extends MultiLangName {
  districts: DistrictModel[];
}

export type AppLang = 'en' | 'mr' | 'hi';

export const ALL_STATES: MultiLangName[] = [
  { id: 'MH', en: 'Maharashtra', mr: 'महाराष्ट्र', hi: 'महाराष्ट्र' },
  { id: 'GJ', en: 'Gujarat', mr: 'गुजरात', hi: 'गुजरात' },
  { id: 'KA', en: 'Karnataka', mr: 'कर्नाटक', hi: 'कर्नाटक' },
  { id: 'MP', en: 'Madhya Pradesh', mr: 'मध्य प्रदेश', hi: 'मध्य प्रदेश' },
  { id: 'RJ', en: 'Rajasthan', mr: 'राजस्थान', hi: 'राजस्थान' },
  { id: 'AP', en: 'Andhra Pradesh', mr: 'आंध्र प्रदेश', hi: 'आंध्र प्रदेश' },
  { id: 'TS', en: 'Telangana', mr: 'तेलंगणा', hi: 'तेलंगाना' },
  { id: 'UP', en: 'Uttar Pradesh', mr: 'उत्तर प्रदेश', hi: 'उत्तर प्रदेश' },
  { id: 'PB', en: 'Punjab', mr: 'पंजाब', hi: 'पंजाब' },
  { id: 'HR', en: 'Haryana', mr: 'हरियाणा', hi: 'हरियाणा' },
  { id: 'BR', en: 'Bihar', mr: 'बिहार', hi: 'बिहार' },
  { id: 'TN', en: 'Tamil Nadu', mr: 'तमिळनाडू', hi: 'तमिलनाडु' },
  { id: 'KL', en: 'Kerala', mr: 'केरळ', hi: 'केरल' },
  { id: 'WB', en: 'West Bengal', mr: 'पश्चिम बंगाल', hi: 'पश्चिम बंगाल' },
  { id: 'OD', en: 'Odisha', mr: 'ओडिशा', hi: 'ओडिशा' },
  { id: 'AS', en: 'Assam', mr: 'आसाम', hi: 'असम' },
  { id: 'CG', en: 'Chhattisgarh', mr: 'छत्तीसगड', hi: 'छत्तीसगढ़' },
  { id: 'JH', en: 'Jharkhand', mr: 'झारखंड', hi: 'झारखंड' },
  { id: 'GA', en: 'Goa', mr: 'गोवा', hi: 'गोवा' },
  { id: 'HP', en: 'Himachal Pradesh', mr: 'हिमाचल प्रदेश', hi: 'हिमाचल प्रदेश' },
  { id: 'UK', en: 'Uttarakhand', mr: 'उत्तराखंड', hi: 'उत्तराखंड' },
];

/**
 * Complete Official Maharashtra 36 Districts and Talukas
 */
export const MAHARASHTRA_DISTRICTS: DistrictModel[] = [
  // 1. Ahilyanagar (Ahmednagar)
  {
    id: 'ahilyanagar',
    en: 'Ahilyanagar (Ahmednagar)',
    mr: 'अहिल्यानगर (अहमदनगर)',
    hi: 'अहिल्यानगर (अहमदनगर)',
    talukas: [
      { id: 'nagar', en: 'Nagar', mr: 'नगर', hi: 'नगर', villages: [{ id: 'bhingar', en: 'Bhingar', mr: 'भिंगार', hi: 'भिंगार' }, { id: 'nagardeole', en: 'Nagardeole', mr: 'नगरदेवळे', hi: 'नगरदेवले' }] },
      { id: 'shevgaon', en: 'Shevgaon', mr: 'शेवगाव', hi: 'शेवगांव', villages: [{ id: 'bodhegaon', en: 'Bodhegaon', mr: 'बोधेगाव', hi: 'बोधेगांव' }, { id: 'mungi', en: 'Mungi', mr: 'मुंगी', hi: 'मुंगी' }] },
      { id: 'pathardi', en: 'Pathardi', mr: 'पाथर्डी', hi: 'पाथर्डी', villages: [{ id: 'tisgaon', en: 'Tisgaon', mr: 'तिसगाव', hi: 'तिसगांव' }, { id: 'mojoj', en: 'Mohoj', mr: 'मोहोnamed', hi: 'मोहोnamed' }] },
      { id: 'parner', en: 'Parner', mr: 'पारनेर', hi: 'पारनेर', villages: [
        { id: 'akkalwadi', en: 'Akkalwadi', mr: 'अक्कलवाडी', hi: 'अक्कलवाडी' },
        { id: 'alkuti', en: 'Alkuti', mr: 'आळकुटी', hi: 'आळकुटी' },
        { id: 'anantpur', en: 'Anantpur', mr: 'अनंतपूर', hi: 'अनंतपूर' },
        { id: 'apdhup', en: 'Apdhup', mr: 'आपधूप', hi: 'आपधूप' },
        { id: 'astagaon', en: 'Astagaon', mr: 'अस्तागाव', hi: 'अस्तागाव' },
        { id: 'baburdi', en: 'Baburdi', mr: 'बाबुर्डी', hi: 'बाबुर्डी' },
        { id: 'baburdi_bend', en: 'Baburdi Bend', mr: 'बाबुर्डी बेंद', hi: 'बाबुर्डी बेंद' },
        { id: 'batewadi', en: 'Batewadi', mr: 'बाटेवाडी', hi: 'बाटेवाडी' },
        { id: 'belwandi_p', en: 'Belwandi (Parner)', mr: 'बेलवंडी (पारनेर)', hi: 'बेलवंडी (पारनेर)' },
        { id: 'bhalwani_p', en: 'Bhalwani', mr: 'भालवणी', hi: 'भालवणी' },
        { id: 'bhondre', en: 'Bhondre', mr: 'भोंद्रे', hi: 'भोंद्रे' },
        { id: 'bhoyare_g', en: 'Bhoyare Gangarda', mr: 'भोयरे गांगर्डा', hi: 'भोयरे गांगर्डा' },
        { id: 'bhoyare_p', en: 'Bhoyare Pathar', mr: 'भोयरे पठार', hi: 'भोयरे पठार' },
        { id: 'bibamkhed', en: 'Bibamkhed', mr: 'बिबामखेड', hi: 'बिबामखेड' },
        { id: 'borghar', en: 'Borghar', mr: 'बोरघर', hi: 'बोरघर' },
        { id: 'bramhanwada', en: 'Bramhanwada', mr: 'ब्राह्मणवाडा', hi: 'ब्राह्मणवाडा' },
        { id: 'chikhali_p', en: 'Chikhali', mr: 'चिखली', hi: 'चिखली' },
        { id: 'chimbhale_p', en: 'Chimbhale', mr: 'चिंभळे', hi: 'चिंभळे' },
        { id: 'chincholi_p', en: 'Chincholi', mr: 'चिंचोली', hi: 'चिंचोली' },
        { id: 'dahiwad', en: 'Dahiwad', mr: 'दहिवाड', hi: 'दहिवाड' },
        { id: 'darodi', en: 'Darodi', mr: 'दारोडी', hi: 'दारोडी' },
        { id: 'dawalgaon', en: 'Dawalgaon', mr: 'दवळगाव', hi: 'दवळगाव' },
        { id: 'degaon', en: 'Degaon', mr: 'डेगाव', hi: 'डेगाव' },
        { id: 'deulgaon_siddhi', en: 'Deulgaon Siddhi', mr: 'देऊळगाव सिद्धी', hi: 'देऊळगाव सिद्धी' },
        { id: 'devalali', en: 'Devalali', mr: 'देवळाली', hi: 'देवळाली' },
        { id: 'dhoki_p', en: 'Dhoki', mr: 'ढोकी', hi: 'ढोकी' },
        { id: 'dhoki_pathar', en: 'Dhoki Pathar', mr: 'ढोकी पठार', hi: 'ढोकी पठार' },
        { id: 'dhotre_bk', en: 'Dhotre Budruk', mr: 'धोत्रे बुद्रुक', hi: 'धोत्रे बुद्रुक' },
        { id: 'dhotre_kh', en: 'Dhotre Khurd', mr: 'धोत्रे खुर्द', hi: 'धोत्रे खुर्द' },
        { id: 'ganore', en: 'Ganore', mr: 'गणोरे', hi: 'गणोरे' },
        { id: 'garkhed', en: 'Garkhed', mr: 'गारखेड', hi: 'गारखेड' },
        { id: 'gharkhed', en: 'Gharkhed', mr: 'घरखेड', hi: 'घरखेड' },
        { id: 'ghateshwar', en: 'Ghateshwar', mr: 'घाटेश्वर', hi: 'घाटेश्वर' },
        { id: 'gondegaon', en: 'Gondegaon', mr: 'गोंडेगाव', hi: 'गोंडेगाव' },
        { id: 'goregaon_p', en: 'Goregaon', mr: 'गोरेगाव', hi: 'गोरेगाव' },
        { id: 'hanga', en: 'Hanga', mr: 'हंगा', hi: 'हंगा' },
        { id: 'hangewadi', en: 'Hangewadi', mr: 'हंगेवाडी', hi: 'हंगेवाडी' },
        { id: 'hasnapur', en: 'Hasnapur', mr: 'हसनापूर', hi: 'हसनापूर' },
        { id: 'hatalkhed', en: 'Hatalkhed', mr: 'हातळखेड', hi: 'हातळखेड' },
        { id: 'hivare_korda', en: 'Hivare Korda', mr: 'हिवरे कोरडा', hi: 'हिवरे कोरडा' },
        { id: 'hivare_zare', en: 'Hivare Zare', mr: 'हिवरे झरे', hi: 'हिवरे झरे' },
        { id: 'jategaon', en: 'Jategaon', mr: 'जातेगाव', hi: 'जातेगाव' },
        { id: 'jawala_p', en: 'Jawala', mr: 'जवळा', hi: 'जवळा' },
        { id: 'kadus_p', en: 'Kadus', mr: 'कडूस', hi: 'कडूस' },
        { id: 'kakane', en: 'Kakane', mr: 'ककाने', hi: 'ककाने' },
        { id: 'kalas', en: 'Kalas', mr: 'कळस', hi: 'कळस' },
        { id: 'kanhur_pathar', en: 'Kanhur Pathar', mr: 'कान्हूर पठार', hi: 'कान्हूर पठार' },
        { id: 'kankewadi', en: 'Kankewadi', mr: 'कांकेवाडी', hi: 'कांकेवाडी' },
        { id: 'karandi', en: 'Karandi', mr: 'कारंडी', hi: 'कारंडी' },
        { id: 'karegaon', en: 'Karegaon', mr: 'कारेगाव', hi: 'कारेगाव' },
        { id: 'karjule_harya', en: 'Karjule Harya', mr: 'कर्जुले हर्या', hi: 'कर्जुले हर्या' },
        { id: 'karjule_mukhai', en: 'Karjule Mukhai', mr: 'कर्जुले मुकाई', hi: 'कर्जुले मुकाई' },
        { id: 'kasare', en: 'Kasare', mr: 'कासारे', hi: 'कासारे' },
        { id: 'katalwedhe', en: 'Katalwedhe', mr: 'कातळवेढे', hi: 'कातळवेढे' },
        { id: 'kautha', en: 'Kautha', mr: 'कौठा', hi: 'कौठा' },
        { id: 'kinhi_p', en: 'Kinhi', mr: 'किन्ही', hi: 'किन्ही' },
        { id: 'kohokadi', en: 'Kohokadi', mr: 'कोहोकडी', hi: 'कोहोकडी' },
        { id: 'koregaon_p', en: 'Koregaon', mr: 'कोरेगाव', hi: 'कोरेगाव' },
        { id: 'kurund', en: 'Kurund', mr: 'कुरुंद', hi: 'कुरुंद' },
        { id: 'lonihavali', en: 'Lonihavali', mr: 'लोणीहवेली', hi: 'लोणीहवेली' },
        { id: 'lonimawala', en: 'Lonimawala', mr: 'लोणीमावळा', hi: 'लोणीमावळा' },
        { id: 'mahadevdara', en: 'Mahadevdara', mr: 'महादेवदरा', hi: 'महादेवदरा' },
        { id: 'mandave_bk', en: 'Mandave Budruk', mr: 'मांडवे बुद्रुक', hi: 'मांडवे बुद्रुक' },
        { id: 'mandave_kh', en: 'Mandave Khurd', mr: 'मांडवे खुर्द', hi: 'मांडवे खुर्द' },
        { id: 'mangrul_p', en: 'Mangrul', mr: 'मंगरूळ', hi: 'मंगरूळ' },
        { id: 'maparewadi', en: 'Maparewadi', mr: 'मापारेवाडी', hi: 'मापारेवाडी' },
        { id: 'mhasane', en: 'Mhasane', mr: 'म्हासाणे', hi: 'म्हासाणे' },
        { id: 'morwadi', en: 'Morwadi', mr: 'मोरवाडी', hi: 'मोरवाडी' },
        { id: 'nandur_pathar', en: 'Nandur Pathar', mr: 'नांदूर पठार', hi: 'नांदूर पठार' },
        { id: 'nighoj', en: 'Nighoj', mr: 'निघोज', hi: 'निघोज' },
        { id: 'nimgaon_bhogi', en: 'Nimgaon Bhogi', mr: 'निमगाव भोगी', hi: 'निमगाव भोगी' },
        { id: 'nimgaon_dube', en: 'Nimgaon Dube', mr: 'निमगाव दुधे', hi: 'निमगाव दुधे' },
        { id: 'nimgaon_gangarda', en: 'Nimgaon Gangarda', mr: 'निमगाव गांगर्डा', hi: 'निमगाव गांगर्डा' },
        { id: 'nimgaon_khed', en: 'Nimgaon Khed', mr: 'निमगाव खेड', hi: 'निमगाव खेड' },
        { id: 'padali_alle', en: 'Padali Alle', mr: 'पडळी आळे', hi: 'पडळी आळे' },
        { id: 'padali_daryabai', en: 'Padali Daryabai', mr: 'पडळी दर्याबाई', hi: 'पडळी दर्याबाई' },
        { id: 'padali_kanhur', en: 'Padali Kanhur', mr: 'पडळी कान्हूर', hi: 'पडळी कान्हूर' },
        { id: 'padali_ranjangaon', en: 'Padali Ranjangaon', mr: 'पडळी रांजणगाव', hi: 'पडळी रांजणगाव' },
        { id: 'palashi', en: 'Palashi', mr: 'पळशी', hi: 'पळशी' },
        { id: 'palwe_bk', en: 'Palwe Budruk', mr: 'पळवे बुद्रुक', hi: 'पळवे बुद्रुक' },
        { id: 'palwe_kh', en: 'Palwe Khurd', mr: 'पळवे खुर्द', hi: 'पळवे खुर्द' },
        { id: 'panoli', en: 'Panoli', mr: 'पळोली', hi: 'पळोली' },
        { id: 'pargaon_p', en: 'Pargaon', mr: 'पारगाव', hi: 'पारगाव' },
        { id: 'parner_city', en: 'Parner (City/Gramin)', mr: 'पारनेर (शहर/ग्रामीण)', hi: 'पारनेर (शहर/ग्रामीण)' },
        { id: 'pimpalgaon_rotha', en: 'Pimpalgaon Rotha', mr: 'पिंपळगाव रोठा', hi: 'पिंपळगाव रोठा' },
        { id: 'pimpalgaon_turuk', en: 'Pimpalgaon Turuk', mr: 'पिंपळगाव तुरुक', hi: 'पिंपळगाव तुरुक' },
        { id: 'pimpalner_p', en: 'Pimpalner', mr: 'पिंपळनेर', hi: 'पिंपळनेर' },
        { id: 'pimpri_gavali', en: 'Pimpri Gavali', mr: 'पिंप्री गवळी', hi: 'पिंप्री गवळी' },
        { id: 'pimpri_jalsen', en: 'Pimpri Jalsen', mr: 'पिंप्री जलसेन', hi: 'पिंप्री जलसेन' },
        { id: 'pokhari', en: 'Pokhari', mr: 'पोखरी', hi: 'पोखरी' },
        { id: 'punewadi', en: 'Punewadi', mr: 'पुणेवाडी', hi: 'पुणेवाडी' },
        { id: 'ralegan_siddhi', en: 'Ralegan Siddhi', mr: 'राळेगण सिद्धी', hi: 'राळेगण सिद्धी' },
        { id: 'ralegan_therpal', en: 'Ralegan Therpal', mr: 'राळेगण थेरपाळ', hi: 'राळेगण थेरपाळ' },
        { id: 'rayate', en: 'Rayate', mr: 'रायते', hi: 'रायते' },
        { id: 'renavadi', en: 'Renavadi', mr: 'रेणावडी', hi: 'रेणावडी' },
        { id: 'rui_chhatrapati', en: 'Rui Chhatrapati', mr: 'रुई छत्रपती', hi: 'रुई छत्रपती' },
        { id: 'sangvi_surya', en: 'Sangvi Surya', mr: 'सांगवी सूर्या', hi: 'सांगवी सूर्या' },
        { id: 'sarola_advai', en: 'Sarola Advai', mr: 'सारोळा आडवाई', hi: 'सारोळा आडवाई' },
        { id: 'savalvihira', en: 'Savalvihira', mr: 'सावळविहिरा', hi: 'सावळविहिरा' },
        { id: 'savargaon_p', en: 'Savargaon', mr: 'सावरगाव', hi: 'सावरगाव' },
        { id: 'shirapur_p', en: 'Shirapur', mr: 'शिरापूर', hi: 'शिरापूर' },
        { id: 'shirasgaon_p', en: 'Shirasgaon', mr: 'शिरसगाव', hi: 'शिरसगाव' },
        { id: 'shobhavant', en: 'Shobhavant', mr: 'शोभावंत', hi: 'शोभावंत' },
        { id: 'supe_p', en: 'Supe (Parner)', mr: 'सुपे (पारनेर)', hi: 'सुपे (पारनेर)' },
        { id: 'takli_dhokeshwar', en: 'Takli Dhokeshwar', mr: 'टाकळी ढोकेश्वर', hi: 'टाकळी ढोकेश्वर' },
        { id: 'tarapoor', en: 'Tarapoor', mr: 'तारापूर', hi: 'तारापूर' },
        { id: 'tikhol', en: 'Tikhol', mr: 'तिखोल', hi: 'तिखोल' },
        { id: 'vadgaon_darya', en: 'Vadgaon Darya', mr: 'वडगाव दर्या', hi: 'वडगाव दर्या' },
        { id: 'vadgaon_gund', en: 'Vadgaon Gund', mr: 'वडगाव गुंड', hi: 'वडगाव गुंड' },
        { id: 'vadgaon_saval', en: 'Vadgaon Saval', mr: 'वडगाव सावळ', hi: 'वडगाव सावळ' },
        { id: 'vadner_p', en: 'Vadner', mr: 'वडनेर', hi: 'वडनेर' },
        { id: 'vadule', en: 'Vadule', mr: 'वडुले', hi: 'वडुले' },
        { id: 'vadzire', en: 'Vadzire', mr: 'वडझिरे', hi: 'वडझिरे' },
        { id: 'vasantgad_p', en: 'Vasantgad', mr: 'वसंतगड', hi: 'वसंतगड' },
        { id: 'vesare', en: 'Vesare', mr: 'वेसरे', hi: 'वेसरे' },
        { id: 'vikharn', en: 'Vikharn', mr: 'विखरण', hi: 'विखरण' },
        { id: 'walunj', en: 'Walunj', mr: 'वाळुंज', hi: 'वाळुंज' },
        { id: 'wasunde', en: 'Wasunde', mr: 'वासुंदे', hi: 'वासुंदे' },
        { id: 'yadavwadi', en: 'Yadavwadi', mr: 'यादववाडी', hi: 'यादववाडी' },
      ] },
      { id: 'sangamner', en: 'Sangamner', mr: 'संगमनेर', hi: 'संगमनेर', villages: [{ id: 'ashwi', en: 'Ashwi', mr: 'आश्वी', hi: 'आश्वी' }, { id: 'jorve', en: 'Jorve', mr: 'जोर्वे', hi: 'जोर्वे' }] },
      { id: 'kopargaon', en: 'Kopargaon', mr: 'कोपरगाव', hi: 'कोपरगांव', villages: [{ id: 'pohegaon', en: 'Pohegaon', mr: 'पोहेगाव', hi: 'पोहेगांव' }, { id: 'dhamori', en: 'Dhamori', mr: 'धामोरी', hi: 'धामोरी' }] },
      { id: 'akole', en: 'Akole', mr: 'अकोले', hi: 'अकोले', villages: [{ id: 'rajur', en: 'Rajur', mr: 'राजूर', hi: 'राजूर' }, { id: 'kotul', en: 'Kotul', mr: 'कोतुल', hi: 'कोतुल' }] },
      { id: 'shrirampur', en: 'Shrirampur', mr: 'श्रीरामपूर', hi: 'श्रीरामपुर', villages: [{ id: 'belapur', en: 'Belapur', mr: 'बेलापूर', hi: 'बेलापुर' }, { id: 'taklibhan', en: 'Taklibhan', mr: 'टाकळीभान', hi: 'टाकलीभान' }] },
      { id: 'nevasa', en: 'Nevasa', mr: 'नेवासा', hi: 'नेवासा', villages: [{ id: 'shani_shingnapur', en: 'Shani Shingnapur', mr: 'शनि शिंगणापूर', hi: 'शनि शिंगणापुर' }, { id: 'sonai', en: 'Sonai', mr: 'सोनाई', hi: 'सोनाई' }] },
      { id: 'rahata', en: 'Rahata', mr: 'राहाता', hi: 'राहाता', villages: [{ id: 'shirdi', en: 'Shirdi', mr: 'शिर्डी', hi: 'शिर्डी' }, { id: 'sakori', en: 'Sakori', mr: 'साकोरी', hi: 'साकोरी' }] },
      { id: 'rahuri', en: 'Rahuri', mr: 'राहुरी', hi: 'राहुरी', villages: [{ id: 'vambori', en: 'Vambori', mr: 'वांबोरी', hi: 'वांबोरी' }, { id: 'kolhar', en: 'Kolhar', mr: 'कोल्हार', hi: 'कोल्हार' }] },
      { id: 'shrigonda', en: 'Shrigonda', mr: 'श्रीगोंदा', hi: 'श्रीगोंदा', villages: [{ id: 'belwandi', en: 'Belwandi', mr: 'बेलवंडी', hi: 'बेलवंडी' }, { id: 'pedgaon', en: 'Pedgaon', mr: 'पेडगाव', hi: 'पेडगांव' }] },
      { id: 'karjat_a', en: 'Karjat', mr: 'कर्जत', hi: 'कर्जत', villages: [{ id: 'rashin', en: 'Rashin', mr: 'राशिन', hi: 'राशिन' }, { id: 'mirajgaon', en: 'Mirajgaon', mr: 'मिरजगाव', hi: 'मिरजगांव' }] },
      { id: 'jamkhed', en: 'Jamkhed', mr: 'जामखेड', hi: 'जामखेड', villages: [{ id: 'kharda', en: 'Kharda', mr: 'खर्डा', hi: 'खर्डा' }, { id: 'nanaj', en: 'Nanaj', mr: 'नान्नज', hi: 'नान्नज' }] },
    ],
  },

  // 2. Akola
  {
    id: 'akola',
    en: 'Akola',
    mr: 'अकोला',
    hi: 'अकोला',
    talukas: [
      { id: 'akola_t', en: 'Akola', mr: 'अकोला', hi: 'अकोला', villages: [{ id: 'borgaon_manju', en: 'Borgaon Manju', mr: 'बोरगाव मंजू', hi: 'बोरगांव मंजू' }, { id: 'kapshi', en: 'Kapshi', mr: 'कापशी', hi: 'कापशी' }] },
      { id: 'akot', en: 'Akot', mr: 'आकोट', hi: 'आकोट', villages: [{ id: 'hiwarkhed', en: 'Hiwarkhed', mr: 'हिवरखेड', hi: 'हिवरखेड' }, { id: 'panaj', en: 'Panaj', mr: 'पनाज', hi: 'पनाज' }] },
      { id: 'balapur', en: 'Balapur', mr: 'बाळापूर', hi: 'बालापुर', villages: [{ id: 'paras', en: 'Paras', mr: 'पारस', hi: 'पारस' }, { id: 'wadi', en: 'Wadi', mr: 'वाडी', hi: 'वाड़ी' }] },
      { id: 'barshitakli', en: 'Barshitakli', mr: 'बार्शीटाकळी', hi: 'बार्शीटाकली', villages: [{ id: 'pinjar', en: 'Pinjar', mr: 'पिंजर', hi: 'पिंजर' }, { id: 'mahan', en: 'Mahan', mr: 'महान', hi: 'महान' }] },
      { id: 'murtizapur', en: 'Murtizapur', mr: 'मूर्तिजापूर', hi: 'मूर्तिजापुर', villages: [{ id: 'mana', en: 'Mana', mr: 'माना', hi: 'माना' }, { id: 'hatgaon', en: 'Hatgaon', mr: 'हातगाव', hi: 'हातगांव' }] },
      { id: 'patur', en: 'Patur', mr: 'पातूर', hi: 'पातूर', villages: [{ id: 'shahbabu', en: 'Shahbabu', mr: 'शाहबाबू', hi: 'शाहबाबू' }, { id: 'sasangiri', en: 'Sasangiri', mr: 'सासनगिरी', hi: 'सासनगिरी' }] },
      { id: 'telhara', en: 'Telhara', mr: 'तेल्हारा', hi: 'तेल्हारा', villages: [{ id: 'adgaon', en: 'Adgaon', mr: 'आडगाव', hi: 'आडगांव' }, { id: 'pathardi_t', en: 'Pathardi', mr: 'पाथर्डी', hi: 'पाथर्डी' }] },
    ],
  },

  // 3. Amravati
  {
    id: 'amravati',
    en: 'Amravati',
    mr: 'अमरावती',
    hi: 'अमरावती',
    talukas: [
      { id: 'amravati_t', en: 'Amravati', mr: 'अमरावती', hi: 'अमरावती', villages: [{ id: 'badnera', en: 'Badnera Rural', mr: 'बडनेरा ग्रामीण', hi: 'बडनेरा' }, { id: 'walgaon', en: 'Walgaon', mr: 'वलगाव', hi: 'वलगांव' }] },
      { id: 'achalpur', en: 'Achalpur', mr: 'अचलपूर', hi: 'अचलपुर', villages: [{ id: 'paratwada', en: 'Paratwada', mr: 'परतवाडा', hi: 'परतवाड़ा' }, { id: 'pathrot', en: 'Pathrot', mr: 'पाथ्रोट', hi: 'पाथ्रोट' }] },
      { id: 'anjangaon_surji', en: 'Anjangaon-Surji', mr: 'अंजनगाव सुर्जी', hi: 'अंजनगांव सुर्जी', villages: [{ id: 'surji', en: 'Surji', mr: 'सुर्जी', hi: 'सुर्जी' }, { id: 'kapustalni', en: 'Kapustalni', mr: 'कापुसतळणी', hi: 'कापुसतलनी' }] },
      { id: 'chandur_bazar', en: 'Chandur Bazar', mr: 'चांदूर बाजार', hi: 'चांदूर बाजार', villages: [{ id: 'shirasgaon', en: 'Shirasgaon Kasba', mr: 'शिरसगाव कसबा', hi: 'शिरसगांव' }] },
      { id: 'chandur_railway', en: 'Chandur Railway', mr: 'चांदूर रेल्वे', hi: 'चांदूर रेलवे', villages: [{ id: 'dipori', en: 'Dipori', mr: 'दिपोरी', hi: 'दिपोरी' }] },
      { id: 'chikhaldara', en: 'Chikhaldara', mr: 'चिखलदरा', hi: 'चिखलदरा', villages: [{ id: 'katkumbh', en: 'Katkumbh', mr: 'काटकटकुंभ', hi: 'काटकटकुंभ' }] },
      { id: 'daryapur', en: 'Daryapur', mr: 'दर्यापूर', hi: 'दर्यापुर', villages: [{ id: 'yeoda', en: 'Yeoda', mr: 'येवदा', hi: 'येवदा' }] },
      { id: 'dhamangaon_railway', en: 'Dhamangaon Railway', mr: 'धामणगाव रेल्वे', hi: 'धामनगांव रेलवे', villages: [{ id: 'dattapur', en: 'Dattapur', mr: 'दत्तापूर', hi: 'दत्तापुर' }] },
      { id: 'dharni', en: 'Dharni', mr: 'धारणी', hi: 'धारणी', villages: [{ id: 'bairagarh', en: 'Bairagarh', mr: 'बैरागढ', hi: 'बैरागढ़' }] },
      { id: 'morshi', en: 'Morshi', mr: 'मोर्शी', hi: 'मोर्शी', villages: [{ id: 'nerpinglai', en: 'Ner Pinglai', mr: 'नेर पिंगळाई', hi: 'नेर पिंगलाई' }] },
      { id: 'nandgaon_khandeshwar', en: 'Nandgaon-Khandeshwar', mr: 'नांदगाव खंडेश्वर', hi: 'नांदगांव खंडेश्वर', villages: [{ id: 'khandeshwar', en: 'Khandeshwar', mr: 'खंडेश्वर', hi: 'खंडेश्वर' }] },
      { id: 'teosa', en: 'Teosa', mr: 'तिवसा', hi: 'तिवसा', villages: [{ id: 'kurha', en: 'Kurha', mr: 'कुऱ्हा', hi: 'कुल्हा' }] },
      { id: 'warud', en: 'Warud', mr: 'वरूड', hi: 'वरूड़', villages: [{ id: 'shendurjana_ghat', en: 'Shendurjana Ghat', mr: 'शेंदुरजना घाट', hi: 'शेंदुरजना घाट' }] },
    ],
  },

  // 4. Chhatrapati Sambhajinagar (Aurangabad)
  {
    id: 'chhatrapati_sambhajinagar',
    en: 'Chhatrapati Sambhajinagar',
    mr: 'छत्रपती संभाजीनगर (औरंगाबाद)',
    hi: 'छत्रपति संभाजीनगर (औरंगाबाद)',
    talukas: [
      { id: 'aurangabad_t', en: 'Aurangabad', mr: 'औरंगाबाद', hi: 'औरंगाबाद', villages: [{ id: 'shendra', en: 'Shendra', mr: 'शेंद्रा', hi: 'शेंद्रा' }, { id: 'chitegaon', en: 'Chitegaon', mr: 'चितेगाव', hi: 'चितेगांव' }] },
      { id: 'kannad', en: 'Kannad', mr: 'कन्नड', hi: 'कन्नड', villages: [{ id: 'pishor', en: 'Pishor', mr: 'पिशोर', hi: 'पिशोर' }] },
      { id: 'khuldabad', en: 'Khuldabad', mr: 'खुलताबाद', hi: 'खुलताबाद', villages: [{ id: 'verul', en: 'Ellora (Verul)', mr: 'वेरूळ', hi: 'वेरूल' }] },
      { id: 'phulambri', en: 'Phulambri', mr: 'फुलंब्री', hi: 'फुलंब्री', villages: [{ id: 'wanjarwada', en: 'Wanjarwada', mr: 'वांजरवाडा', hi: 'वांजरवाड़ा' }] },
      { id: 'sillod', en: 'Sillod', mr: 'सिल्लोड', hi: 'सिल्लोड', villages: [{ id: 'ajintha', en: 'Ajanta (Ajintha)', mr: 'अजिंठा', hi: 'अजिंठा' }] },
      { id: 'soygaon', en: 'Soygaon', mr: 'सोयगाव', hi: 'सोयगांव', villages: [{ id: 'fardapur', en: 'Fardapur', mr: 'फर्दपूर', hi: 'फर्दपुर' }] },
      { id: 'vaijapur', en: 'Vaijapur', mr: 'वैजापूर', hi: 'वैजापुर', villages: [{ id: 'rotegaon', en: 'Rotegaon', mr: 'रोटेगाव', hi: 'रोटेगांव' }] },
      { id: 'gangapur', en: 'Gangapur', mr: 'गंगापूर', hi: 'गंगापुर', villages: [{ id: 'lasur', en: 'Lasur Station', mr: 'लासूर स्टेशन', hi: 'लासुर' }] },
      { id: 'paithan', en: 'Paithan', mr: 'पैठण', hi: 'पैठण', villages: [{ id: 'bidkin', en: 'Bidkin', mr: 'बिडकीन', hi: 'बिडकीन' }, { id: 'apegaon', en: 'Apegaon', mr: 'आपेगाव', hi: 'आपेगांव' }] },
    ],
  },

  // 5. Beed
  {
    id: 'beed',
    en: 'Beed',
    mr: 'बीड',
    hi: 'बीड',
    talukas: [
      { id: 'beed_t', en: 'Beed', mr: 'बीड', hi: 'बीड', villages: [{ id: 'pendgaon', en: 'Pendgaon', mr: 'पेंडगाव', hi: 'पेंडगांव' }] },
      { id: 'ashti', en: 'Ashti', mr: 'आष्टी', hi: 'आष्टी', villages: [{ id: 'kada', en: 'Kada', mr: 'कडा', hi: 'कड़ा' }] },
      { id: 'georai', en: 'Georai', mr: 'गेवराई', hi: 'गेवराई', villages: [{ id: 'madalmohi', en: 'Madalmohi', mr: 'मादळमोही', hi: 'मादलमोही' }] },
      { id: 'kaij', en: 'Kaij', mr: 'केज', hi: 'केज', villages: [{ id: 'yevta', en: 'Yevta', mr: 'येवता', hi: 'येवता' }] },
      { id: 'majalgaon', en: 'Majalgaon', mr: 'माजलगाव', hi: 'माजलगांव', villages: [{ id: 'nitrud', en: 'Nitrud', mr: 'नित्रुड', hi: 'नित्रुड' }] },
      { id: 'manjlegaon', en: 'Manjlegaon', mr: 'मांजलेगाव', hi: 'मांजलेगांव', villages: [{ id: 'talkhed', en: 'Talkhed', mr: 'टाकळखेड', hi: 'टाकलखेड' }] },
      { id: 'parli', en: 'Parli', mr: 'परळी वैजनाथ', hi: 'परली', villages: [{ id: 'sirsaala', en: 'Sirsaala', mr: 'सिरसाळा', hi: 'सिरसाला' }] },
      { id: 'patoda', en: 'Patoda', mr: 'पाटोदा', hi: 'पाटोदा', villages: [{ id: 'amalner_b', en: 'Amalner', mr: 'अमळनेर', hi: 'अमलनेर' }] },
      { id: 'shirur_kasar', en: 'Shirur-Kasar', mr: 'शिरूर कासार', hi: 'शिरूर कासार', villages: [{ id: 'tarni', en: 'Tarni', mr: 'तरणी', hi: 'तरणी' }] },
      { id: 'dharur', en: 'Dharur', mr: 'धारूर', hi: 'धारूर', villages: [{ id: 'kille_dharur', en: 'Kille Dharur', mr: 'किल्ले धारूर', hi: 'किल्ले धारूर' }] },
      { id: 'wadwani', en: 'Wadwani', mr: 'वडवणी', hi: 'वडवणी', villages: [{ id: 'chinchwan', en: 'Chinchwan', mr: 'चिंचवण', hi: 'चिंचवण' }] },
      { id: 'ambajogai', en: 'Ambajogai', mr: 'अंबाजोगाई', hi: 'अंबाजोगाई', villages: [{ id: 'bardapur', en: 'Bardapur', mr: 'बरदापूर', hi: 'बरदापुर' }] },
    ],
  },

  // 6. Bhandara
  {
    id: 'bhandara',
    en: 'Bhandara',
    mr: 'भंडारा',
    hi: 'भंडारा',
    talukas: [
      { id: 'bhandara_t', en: 'Bhandara', mr: 'भंडारा', hi: 'भंडारा', villages: [{ id: 'kardi', en: 'Kardi', mr: 'कार्डी', hi: 'कार्डी' }] },
      { id: 'tumsar', en: 'Tumsar', mr: 'तुमसर', hi: 'तुमसर', villages: [{ id: 'sihora', en: 'Sihora', mr: 'सिहोरा', hi: 'सिहोरा' }] },
      { id: 'pauni', en: 'Pauni', mr: 'पवनी', hi: 'पवनी', villages: [{ id: 'adgyal', en: 'Adyal', mr: 'अड्याळ', hi: 'अड्याल' }] },
      { id: 'mohadi', en: 'Mohadi', mr: 'मोहाडी', hi: 'मोहाड़ी', villages: [{ id: 'andhalgaon', en: 'Andhalgaon', mr: 'आंधळगाव', hi: 'आंधलगांव' }] },
      { id: 'sakoli', en: 'Sakoli', mr: 'साकोली', hi: 'साकोली', villages: [{ id: 'sendurwafa', en: 'Sendurwafa', mr: 'सेंदूरवाफा', hi: 'सेंदूरवाफा' }] },
      { id: 'lakhani', en: 'Lakhani', mr: 'लाखांदूर', hi: 'लाखानी', villages: [{ id: 'pimpalgaon', en: 'Pimpalgaon', mr: 'पिंपळगाव', hi: 'पिंपलगांव' }] },
      { id: 'lakhandur', en: 'Lakhandur', mr: 'लाखांदूर', hi: 'लाखांदूर', villages: [{ id: 'khed_b', en: 'Khed', mr: 'खेड', hi: 'खेड' }] },
    ],
  },

  // 7. Buldhana
  {
    id: 'buldhana',
    en: 'Buldhana',
    mr: 'बुलढाणा',
    hi: 'बुलढाणा',
    talukas: [
      { id: 'buldhana_t', en: 'Buldhana', mr: 'बुलढाणा', hi: 'बुलढाणा', villages: [{ id: 'padli', en: 'Padli', mr: 'पादळी', hi: 'पादली' }] },
      { id: 'chikhli', en: 'Chikhli', mr: 'चिखली', hi: 'चिखली', villages: [{ id: 'undri', en: 'Undri', mr: 'उंड्री', hi: 'उंड्री' }] },
      { id: 'deulgaon_raja', en: 'Deulgaon Raja', mr: 'देऊळगाव राजा', hi: 'देऊलगांव राजा', villages: [{ id: 'sindkhed_r', en: 'Sindkhed', mr: 'सिंदखेड', hi: 'सिंदखेड' }] },
      { id: 'khamgaon', en: 'Khamgaon', mr: 'खामगाव', hi: 'खामगांव', villages: [{ id: 'jalamb', en: 'Jalamb', mr: 'जलंब', hi: 'जलंब' }] },
      { id: 'malkapur', en: 'Malkapur', mr: 'मलकापूर', hi: 'मलकापुर', villages: [{ id: 'dharangaon_m', en: 'Dharangaon', mr: 'धरणगाव', hi: 'धरणगांव' }] },
      { id: 'mehkar', en: 'Mehkar', mr: 'मेहकर', hi: 'मेहकर', villages: [{ id: 'janephal', en: 'Janephal', mr: 'जानेफळ', hi: 'जानेफल' }] },
      { id: 'motala', en: 'Motala', mr: 'मोताळा', hi: 'मोताला', villages: [{ id: 'dhamangaon_b', en: 'Dhamangaon', mr: 'धामणगाव', hi: 'धामनगांव' }] },
      { id: 'nandura', en: 'Nandura', mr: 'नांदुरा', hi: 'नांदुरा', villages: [{ id: 'wadner_n', en: 'Wadner', mr: 'वडनेर', hi: 'वडनेर' }] },
      { id: 'shegaon', en: 'Shegaon', mr: 'शेगाव', hi: 'शेगांव', villages: [{ id: 'jalgaon_s', en: 'Jalgaon', mr: 'जळगाव', hi: 'जलगांव' }] },
      { id: 'sindkhed_raja', en: 'Sindkhed Raja', mr: 'सिंदखेड राजा', hi: 'सिंदखेड राजा', villages: [{ id: 'kinhi', en: 'Kinhi', mr: 'किन्ही', hi: 'किन्ही' }] },
      { id: 'lonar', en: 'Lonar', mr: 'लोणार', hi: 'लोणार', villages: [{ id: 'sultanpur', en: 'Sultanpur', mr: 'सुलतानपूर', hi: 'सुल्तानपुर' }] },
      { id: 'jalgaon_jamod', en: 'Jalgaon Jamod', mr: 'जळगाव जामोद', hi: 'जलगांव जामोद', villages: [{ id: 'khandvi', en: 'Khandvi', mr: 'खांदवी', hi: 'खांदवी' }] },
      { id: 'sangrampur', en: 'Sangrampur', mr: 'संग्रामपूर', hi: 'संग्रामपुर', villages: [{ id: 'varvat', en: 'Varvat', mr: 'वरवट', hi: 'वरवट' }] },
    ],
  },

  // 8. Chandrapur
  {
    id: 'chandrapur',
    en: 'Chandrapur',
    mr: 'चंद्रपूर',
    hi: 'चंद्रपुर',
    talukas: [
      { id: 'chandrapur_t', en: 'Chandrapur', mr: 'चंद्रपूर', hi: 'चंद्रपुर', villages: [{ id: 'ghugus', en: 'Ghugus', mr: 'घुग्गुस', hi: 'घुग्गुस' }] },
      { id: 'ballarpur', en: 'Ballarpur', mr: 'बल्लारपूर', hi: 'बल्लारपुर', villages: [{ id: 'visapur', en: 'Visapur', mr: 'विसापूर', hi: 'विसापुर' }] },
      { id: 'bhadravati', en: 'Bhadravati', mr: 'भद्रावती', hi: 'भद्रावती', villages: [{ id: 'chandan_kheda', en: 'Chandankheda', mr: 'चंदनखेडा', hi: 'चंदनखेड़ा' }] },
      { id: 'brahmapuri', en: 'Brahmapuri', mr: 'ब्रह्मपुरी', hi: 'ब्रह्मपुरी', villages: [{ id: 'kurza', en: 'Kurza', mr: 'कुर्झा', hi: 'कुर्झा' }] },
      { id: 'chimur', en: 'Chimur', mr: 'चिमूर', hi: 'चिमूर', villages: [{ id: 'nerli', en: 'Nerli', mr: 'नेर्ली', hi: 'नेर्ली' }] },
      { id: 'gondpipri', en: 'Gondpipri', mr: 'गोंडपिपरी', hi: 'गोंडपिपरी', villages: [{ id: 'tohana', en: 'Tohana', mr: 'तोहाना', hi: 'तोहाना' }] },
      { id: 'jiwati', en: 'Jiwati', mr: 'जिवती', hi: 'जिवती', villages: [{ id: 'pataguda', en: 'Pataguda', mr: 'पाटागुडा', hi: 'पाटागुडा' }] },
      { id: 'korpana', en: 'Korpana', mr: 'कोरपना', hi: 'कोरपना', villages: [{ id: 'nanda', en: 'Nanda', mr: 'नांदा', hi: 'नांदा' }] },
      { id: 'mul', en: 'Mul', mr: 'मूल', hi: 'मूल', villages: [{ id: 'maroda', en: 'Maroda', mr: 'मारोडा', hi: 'मारोडा' }] },
      { id: 'nagbhid', en: 'Nagbhid', mr: 'नागभीड', hi: 'नागभीड', villages: [{ id: 'talodhi', en: 'Talodhi', mr: 'तळोधी', hi: 'तलोधी' }] },
      { id: 'pombhurna', en: 'Pombhurna', mr: 'पोंभुर्णा', hi: 'पोंभुर्णा', villages: [{ id: 'dongargaon_c', en: 'Dongargaon', mr: 'डोंगरगाव', hi: 'डोंगरगांव' }] },
      { id: 'rajura', en: 'Rajura', mr: 'राजुरा', hi: 'राजुरा', villages: [{ id: 'chincholi', en: 'Chincholi', mr: 'चिंचोली', hi: 'चिंचोली' }] },
      { id: 'saoli', en: 'Saoli', mr: 'सावली', hi: 'सावली', villages: [{ id: 'pathri_c', en: 'Pathri', mr: 'पाथरी', hi: 'पाथरी' }] },
      { id: 'sindewahi', en: 'Sindewahi', mr: 'सिंदेवाही', hi: 'सिंदेवाही', villages: [{ id: 'ratnapur', en: 'Ratnapur', mr: 'रत्नापूर', hi: 'रत्नापुर' }] },
      { id: 'warora', en: 'Warora', mr: 'वरोरा', hi: 'वरोरा', villages: [{ id: 'shegaon_bk', en: 'Shegaon BK', mr: 'शेगाव बु.', hi: 'शेगांव बु.' }] },
    ],
  },

  // 9. Dhule
  {
    id: 'dhule',
    en: 'Dhule',
    mr: 'धुळे',
    hi: 'धुले',
    talukas: [
      { id: 'dhule_t', en: 'Dhule', mr: 'धुळे', hi: 'धुले', villages: [{ id: 'songir', en: 'Songir', mr: 'सोनगीर', hi: 'सोनगीर' }, { id: 'kusumba', en: 'Kusumba', mr: 'कुसुंबा', hi: 'कुसुंबा' }] },
      { id: 'sakri', en: 'Sakri', mr: 'साक्री', hi: 'साक्री', villages: [{ id: 'pimpalner', en: 'Pimpalner', mr: 'पिंपळनेर', hi: 'पिंपलनेर' }] },
      { id: 'shirpur', en: 'Shirpur', mr: 'शिरपूर', hi: 'शिरपुर', villages: [{ id: 'thalner', en: 'Thalner', mr: 'थाळनेर', hi: 'थालनेर' }, { id: 'boradi', en: 'Boradi', mr: 'बोराडी', hi: 'बोराड़ी' }] },
      { id: 'shindkheda', en: 'Shindkheda', mr: 'शिंदखेडा', hi: 'शिंदखेड़ा', villages: [{ id: 'dondaicha', en: 'Dondaicha', mr: 'दोंडाईचा', hi: 'दोंडाईचा' }] },
    ],
  },

  // 10. Gadchiroli
  {
    id: 'gadchiroli',
    en: 'Gadchiroli',
    mr: 'गडचिरोली',
    hi: 'गडचिरोली',
    talukas: [
      { id: 'gadchiroli_t', en: 'Gadchiroli', mr: 'गडचिरोली', hi: 'गडचिरोली', villages: [{ id: 'porla', en: 'Porla', mr: 'पोरला', hi: 'पोरला' }] },
      { id: 'dhanora', en: 'Dhanora', mr: 'धानोरा', hi: 'धानोरा', villages: [{ id: 'chattigaon', en: 'Chattigaon', mr: 'चट्टीगाव', hi: 'चट्टीगांव' }] },
      { id: 'chamorshi', en: 'Chamorshi', mr: 'चामोर्शी', hi: 'चामोर्शी', villages: [{ id: 'ashti_g', en: 'Ashti', mr: 'आष्टी', hi: 'आष्टी' }] },
      { id: 'mulchera', en: 'Mulchera', mr: 'मूलचेरा', hi: 'मूलचेरा', villages: [{ id: 'lagam', en: 'Lagam', mr: 'लगम', hi: 'लगम' }] },
      { id: 'desaiganj', en: 'Desaiganj (Wadsa)', mr: 'देसाईगंज (वडसा)', hi: 'देसाईगंज', villages: [{ id: 'wadsa', en: 'Wadsa', mr: 'वडसा', hi: 'वडसा' }] },
      { id: 'armori', en: 'Armori', mr: 'आरमोरी', hi: 'आरमोरी', villages: [{ id: 'wairagad', en: 'Wairagad', mr: 'वैरागड', hi: 'वैरागढ़' }] },
      { id: 'kurkheda', en: 'Kurkheda', mr: 'कुरखेडा', hi: 'कुरखेड़ा', villages: [{ id: 'kadholi', en: 'Kadholi', mr: 'कढोली', hi: 'कढोली' }] },
      { id: 'korchi', en: 'Korchi', mr: 'कोरची', hi: 'कोरची', villages: [{ id: 'bedgaon', en: 'Bedgaon', mr: 'बेडगाव', hi: 'बेडगांव' }] },
      { id: 'aheri', en: 'Aheri', mr: 'अहेरी', hi: 'अहेरी', villages: [{ id: 'kamalapur', en: 'Kamalapur', mr: 'कमलापूर', hi: 'कमलापुर' }] },
      { id: 'etapalli', en: 'Etapalli', mr: 'एटापल्ली', hi: 'एटापल्ली', villages: [{ id: 'kasansur', en: 'Kasansur', mr: 'कसनसूर', hi: 'कसनसूर' }] },
      { id: 'bhamragad', en: 'Bhamragad', mr: 'भामरागड', hi: 'भामरागढ़', villages: [{ id: 'alapalli', en: 'Allapalli', mr: 'आल्लापल्ली', hi: 'आल्लापल्ली' }] },
      { id: 'sironcha', en: 'Sironcha', mr: 'सिरोंचा', hi: 'सिरोंचा', villages: [{ id: 'ankisa', en: 'Ankisa', mr: 'अंकिसा', hi: 'अंकिसा' }] },
    ],
  },

  // 11. Gondia
  {
    id: 'gondia',
    en: 'Gondia',
    mr: 'गोंदिया',
    hi: 'गोंदिया',
    talukas: [
      { id: 'gondia_t', en: 'Gondia', mr: 'गोंदिया', hi: 'गोंदिया', villages: [{ id: 'kudwa', en: 'Kudwa', mr: 'कुडवा', hi: 'कुडवा' }] },
      { id: 'amgaon', en: 'Amgaon', mr: 'आमगाव', hi: 'आमगांव', villages: [{ id: 'padampur', en: 'Padampur', mr: 'पदमापूर', hi: 'पदमापुर' }] },
      { id: 'arjuni_morgaon', en: 'Arjuni Morgaon', mr: 'अर्जुनी मोरगाव', hi: 'अर्जुनी मोरगांव', villages: [{ id: 'navegaon_bandh', en: 'Navegaon Bandh', mr: 'नवेगाव बांध', hi: 'नवेगांव बांध' }] },
      { id: 'deori', en: 'Deori', mr: 'देवरी', hi: 'देवरी', villages: [{ id: 'chichgarh', en: 'Chichgarh', mr: 'चिचगड', hi: 'चिचगढ़' }] },
      { id: 'goregaon_g', en: 'Goregaon', mr: 'गोरेगाव', hi: 'गोरेगांव', villages: [{ id: 'murtizapur_g', en: 'Murtizapur', mr: 'मूर्तिजापूर', hi: 'मूर्तिजापुर' }] },
      { id: 'sadak_arjuni', en: 'Sadak Arjuni', mr: 'सडक अर्जुनी', hi: 'सड़क अर्जुनी', villages: [{ id: 'kohmara', en: 'Kohmara', mr: 'कोहमारा', hi: 'कोहमारा' }] },
      { id: 'salekasa', en: 'Salekasa', mr: 'सालेकसा', hi: 'सालेकसा', villages: [{ id: 'darekasa', en: 'Darekasa', mr: 'दरेकसा', hi: 'दरेकसा' }] },
      { id: 'tirora', en: 'Tirora', mr: 'तिरोडा', hi: 'तिरोड़ा', villages: [{ id: 'kachewani', en: 'Kachewani', mr: 'काचेवानी', hi: 'काचेवानी' }] },
    ],
  },

  // 12. Hingoli
  {
    id: 'hingoli',
    en: 'Hingoli',
    mr: 'हिंगोली',
    hi: 'हिंगोली',
    talukas: [
      { id: 'hingoli_t', en: 'Hingoli', mr: 'हिंगोली', hi: 'हिंगोली', villages: [{ id: 'narsi_namdev', en: 'Narsi Namdev', mr: 'नरसी नामदेव', hi: 'नरसी नामदेव' }] },
      { id: 'basmat', en: 'Basmat', mr: 'वसमत', hi: 'बसमत', villages: [{ id: 'kurunda', en: 'Kurunda', mr: 'कुरुंदा', hi: 'कुरुंदा' }] },
      { id: 'kalamnuri', en: 'Kalamnuri', mr: 'कळमनुरी', hi: 'कलमनुरी', villages: [{ id: 'akhada_balapur', en: 'Akhada Balapur', mr: 'आखाडा बाळापूर', hi: 'आखाड़ा बालापुर' }] },
      { id: 'sengaon', en: 'Sengaon', mr: 'सेनगाव', hi: 'सेनगांव', villages: [{ id: 'goregaon_h', en: 'Goregaon', mr: 'गोरेगाव', hi: 'गोरेगांव' }] },
      { id: 'aundha_nagnath', en: 'Aundha Nagnath', mr: 'औंढा नागनाथ', hi: 'औंढा नागनाथ', villages: [{ id: 'aundha', en: 'Aundha', mr: 'औंढा', hi: 'औंढा' }] },
    ],
  },

  // 13. Jalgaon
  {
    id: 'jalgaon',
    en: 'Jalgaon',
    mr: 'जळगाव',
    hi: 'जलगांव',
    talukas: [
      { id: 'jalgaon_t', en: 'Jalgaon', mr: 'जळगाव', hi: 'जलगांव', villages: [{ id: 'asoda', en: 'Asoda', mr: 'आसोदा', hi: 'आसोदा' }] },
      { id: 'bhusawal', en: 'Bhusawal', mr: 'भुसावळ', hi: 'भुसावल', villages: [{ id: 'varangaon', en: 'Varangaon', mr: 'वरणगाव', hi: 'वरणगांव' }] },
      { id: 'jamner', en: 'Jamner', mr: 'जामनेर', hi: 'जामनेर', villages: [{ id: 'pahur', en: 'Pahur', mr: 'पहूर', hi: 'पहूर' }] },
      { id: 'yawal', en: 'Yawal', mr: 'यावल', hi: 'यावल', villages: [{ id: 'faijpur', en: 'Faizpur', mr: 'फैजपूर', hi: 'फैजपुर' }] },
      { id: 'bodwad', en: 'Bodwad', mr: 'बोधवड', hi: 'बोधवड', villages: [{ id: 'nadgaon', en: 'Nadgaon', mr: 'नाडगाव', hi: 'नाडगांव' }] },
      { id: 'muktainagar', en: 'Muktainagar', mr: 'मुक्ताईनगर', hi: 'मुक्ताईनगर', villages: [{ id: 'kothali', en: 'Kothali', mr: 'कोथळी', hi: 'कोथली' }] },
      { id: 'raver', en: 'Raver', mr: 'रावेर', hi: 'रावेर', villages: [{ id: 'savda', en: 'Savda', mr: 'सावदा', hi: 'सावदा' }] },
      { id: 'chalisgaon', en: 'Chalisgaon', mr: 'चाळीसगाव', hi: 'चालीसगांव', villages: [{ id: 'mehunsare', en: 'Mehunbare', mr: 'मेहुणबारे', hi: 'मेहुनबारे' }] },
      { id: 'bhadgaon', en: 'Bhadgaon', mr: 'भडगाव', hi: 'भडगांव', villages: [{ id: 'kajgaon', en: 'Kajgaon', mr: 'काजगाव', hi: 'काजगांव' }] },
      { id: 'pachora', en: 'Pachora', mr: 'पाचोरा', hi: 'पाचोरा', villages: [{ id: 'nagar_deola', en: 'Nagardeola', mr: 'नगरदेवळा', hi: 'नगरदेवला' }] },
      { id: 'dharangaon', en: 'Dharangaon', mr: 'धरणगाव', hi: 'धरणगांव', villages: [{ id: 'paldhi', en: 'Paldhi', mr: 'पाळधी', hi: 'पालधी' }] },
      { id: 'erandol', en: 'Erandol', mr: 'एरंडोल', hi: 'एरंडोल', villages: [{ id: 'kasoda', en: 'Kasoda', mr: 'कासोदा', hi: 'कासोदा' }] },
      { id: 'parola', en: 'Parola', mr: 'पारोळा', hi: 'पारोला', villages: [{ id: 'tamsewadi', en: 'Tamsewadi', mr: 'तामसवाडी', hi: 'तामसवाड़ी' }] },
      { id: 'amalner', en: 'Amalner', mr: 'अमळनेर', hi: 'अमलनेर', villages: [{ id: 'marwad', en: 'Marwad', mr: 'मारवड', hi: 'मारवड' }] },
      { id: 'chopda', en: 'Chopda', mr: 'चोपडा', hi: 'चोपड़ा', villages: [{ id: 'adawad', en: 'Adawad', mr: 'अडावद', hi: 'अड़ावद' }] },
    ],
  },

  // 14. Jalna
  {
    id: 'jalna',
    en: 'Jalna',
    mr: 'जालना',
    hi: 'जालना',
    talukas: [
      { id: 'jalna_t', en: 'Jalna', mr: 'जालना', hi: 'जालना', villages: [{ id: 'sewli', en: 'Sewli', mr: 'सेवली', hi: 'सेवली' }] },
      { id: 'ambad', en: 'Ambad', mr: 'अंबड', hi: 'अंबड', villages: [{ id: 'dahiwali', en: 'Dahigavhan', mr: 'दहिगव्हाण', hi: 'दहिगव्हाण' }] },
      { id: 'bhokardan', en: 'Bhokardan', mr: 'भोकरदन', hi: 'भोकरदन', villages: [{ id: 'hasnabad', en: 'Hasnabad', mr: 'हसनाबाद', hi: 'हसनाबाद' }] },
      { id: 'badnapur', en: 'Badnapur', mr: 'बदनापूर', hi: 'बदनापुर', villages: [{ id: 'roshangaon', en: 'Roshangaon', mr: 'रोशनगाव', hi: 'रोशनगांव' }] },
      { id: 'ghansawangi', en: 'Ghansawangi', mr: 'घनसावंगी', hi: 'घनसावंगी', villages: [{ id: 'kumbhar_pimpalgaon', en: 'Kumbhar Pimpalgaon', mr: 'कुंभार पिंपळगाव', hi: 'कुंभार पिंपलगांव' }] },
      { id: 'jafrabad', en: 'Jafrabad', mr: 'जाफ्राबाद', hi: 'जाफराबाद', villages: [{ id: 'tembhurni_j', en: 'Tembhurni', mr: 'टेंभुर्णी', hi: 'टेंभुर्णी' }] },
      { id: 'mantha', en: 'Mantha', mr: 'मंठा', hi: 'मंठा', villages: [{ id: 'talni', en: 'Talni', mr: 'तळणी', hi: 'तलनी' }] },
      { id: 'partur', en: 'Partur', mr: 'परतूर', hi: 'परतूर', villages: [{ id: 'watur', en: 'Watur', mr: 'वाटूर', hi: 'वाटूर' }] },
    ],
  },

  // 15. Kolhapur
  {
    id: 'kolhapur',
    en: 'Kolhapur',
    mr: 'कोल्हापूर',
    hi: 'कोल्हापुर',
    talukas: [
      { id: 'karvir', en: 'Karvir', mr: 'करवीर', hi: 'करवीर', villages: [{ id: 'uchgaon', en: 'Uchgaon', mr: 'उचगाव', hi: 'उचगांव' }, { id: 'vadanage', en: 'Vadanage', mr: 'वडणगे', hi: 'वडणगे' }] },
      { id: 'panhala', en: 'Panhala', mr: 'पन्हाळा', hi: 'पन्हाला', villages: [{ id: 'kodoli', en: 'Kodoli', mr: 'कोडोली', hi: 'कोडोली' }] },
      { id: 'shahuwadi', en: 'Shahuwadi', mr: 'शाहूवाडी', hi: 'शाहूवाड़ी', villages: [{ id: 'malkapur_k', en: 'Malkapur', mr: 'मलकापूर', hi: 'मलकापुर' }] },
      { id: 'kagal', en: 'Kagal', mr: 'कागल', hi: 'कागल', villages: [{ id: 'senapati_kapshi', en: 'Senapati Kapshi', mr: 'सेनापती कापशी', hi: 'सेनापति कापशी' }] },
      { id: 'hatkanangale', en: 'Hatkanangale', mr: 'हातकणंगले', hi: 'हातकणंगले', villages: [{ id: 'hupari', en: 'Hupari', mr: 'हुपरी', hi: 'हुपरी' }, { id: 'shiroli', en: 'Shiroli', mr: 'शिरोली', hi: 'शिरोली' }] },
      { id: 'shirol', en: 'Shirol', mr: 'शिरोळ', hi: 'शिरोल', villages: [{ id: 'jaysingpur', en: 'Jaysingpur', mr: 'जयसिंगपूर', hi: 'जयसिंगपुर' }, { id: 'kurundwad', en: 'Kurundwad', mr: 'कुरुंदवाड', hi: 'कुरुंदवाड' }] },
      { id: 'radhanagari', en: 'Radhanagari', mr: 'राधानगरी', hi: 'राधानगरी', villages: [{ id: 'tarale', en: 'Tarale', mr: 'तारळे', hi: 'तारले' }] },
      { id: 'gaganbawada', en: 'Gaganbawada', mr: 'गगनबावडा', hi: 'गगनबावड़ा', villages: [{ id: 'bawada', en: 'Bawada', mr: 'बावडा', hi: 'बावड़ा' }] },
      { id: 'bhudargad', en: 'Bhudargad', mr: 'भुदरगड (गारगोटी)', hi: 'भुदरगढ़', villages: [{ id: 'gargoti', en: 'Gargoti', mr: 'गारगोटी', hi: 'गारगोटी' }] },
      { id: 'ajra', en: 'Ajra', mr: 'आजरा', hi: 'आजरा', villages: [{ id: 'utur', en: 'Utur', mr: 'उत्तूर', hi: 'उत्तूर' }] },
      { id: 'chandgad', en: 'Chandgad', mr: 'चंदगड', hi: 'चंदगढ़', villages: [{ id: 'shinoli', en: 'Shinoli', mr: 'शिनोळी', hi: 'शिनोली' }] },
    ],
  },

  // 16. Latur
  {
    id: 'latur',
    en: 'Latur',
    mr: 'लातूर',
    hi: 'लातुर',
    talukas: [
      { id: 'latur_t', en: 'Latur', mr: 'लातूर', hi: 'लातुर', villages: [{ id: 'murud_l', en: 'Murud', mr: 'मुरुड', hi: 'मुरुड' }, { id: 'babhulgaon_l', en: 'Babhulgaon', mr: 'बाभळगाव', hi: 'बाभलगांव' }] },
      { id: 'ausa', en: 'Ausa', mr: 'औसा', hi: 'औसा', villages: [{ id: 'lamjana', en: 'Lamjana', mr: 'लामजना', hi: 'लामजना' }] },
      { id: 'nilanga', en: 'Nilanga', mr: 'निलंगा', hi: 'निलंगा', villages: [{ id: 'aurad_s', en: 'Aurad Shahajani', mr: 'औरद शहाजानी', hi: 'औरद शहाजानी' }] },
      { id: 'udgir', en: 'Udgir', mr: 'उदगीर', hi: 'उदगीर', villages: [{ id: 'her', en: 'Her', mr: 'हेर', hi: 'हेर' }] },
      { id: 'ahmedpur', en: 'Ahmedpur', mr: 'अहमदपूर', hi: 'अहमदपुर', villages: [{ id: 'kingaon', en: 'Kingaon', mr: 'किनगाव', hi: 'किनगांव' }] },
      { id: 'chakur', en: 'Chakur', mr: 'चाकूर', hi: 'चाकूर', villages: [{ id: 'nalegaon', en: 'Nalegaon', mr: 'नाळेगाव', hi: 'नालेगांव' }] },
      { id: 'deoni', en: 'Deoni', mr: 'देवणी', hi: 'देवनी', villages: [{ id: 'walandi', en: 'Walandi', mr: 'वलंडी', hi: 'वलंडी' }] },
      { id: 'jalkot', en: 'Jalkot', mr: 'जळकोट', hi: 'जलकोट', villages: [{ id: 'dhamangaon_j', en: 'Dhamangaon', mr: 'धामणगाव', hi: 'धामनगांव' }] },
      { id: 'renapur', en: 'Renapur', mr: 'रेणापूर', hi: 'रेणापुर', villages: [{ id: 'panchgaon', en: 'Panchgaon', mr: 'पाचगाव', hi: 'पांचगांव' }] },
      { id: 'shirur_anantpal', en: 'Shirur-Anantpal', mr: 'शिरूर अनंतपाळ', hi: 'शिरूर अनंतपाल', villages: [{ id: 'sakol', en: 'Sakol', mr: 'सकोळ', hi: 'सकोल' }] },
    ],
  },

  // 17. Mumbai City
  {
    id: 'mumbai_city',
    en: 'Mumbai City',
    mr: 'मुंबई शहर',
    hi: 'मुंबई शहर',
    talukas: [
      { id: 'mumbai_admin', en: 'Mumbai City Administrative Areas', mr: 'मुंबई शहर प्रशासकीय क्षेत्र', hi: 'मुंबई शहर प्रशासनिक क्षेत्र', villages: [{ id: 'fort', en: 'Fort / Colaba', mr: 'फोर्ट / कुलाबा', hi: 'फोर्ट / कोलाबा' }, { id: 'dadar', en: 'Dadar / Matunga', mr: 'दादर / माटुंगा', hi: 'दादर / माटुंगा' }] },
    ],
  },

  // 18. Mumbai Suburban
  {
    id: 'mumbai_suburban',
    en: 'Mumbai Suburban',
    mr: 'मुंबई उपनगर',
    hi: 'मुंबई उपनगर',
    talukas: [
      { id: 'andheri', en: 'Andheri', mr: 'अंधेरी', hi: 'अंधेरी', villages: [{ id: 'andheri_west', en: 'Andheri West', mr: 'अंधेरी पश्चिम', hi: 'अंधेरी पश्चिम' }, { id: 'vile_parle', en: 'Vile Parle', mr: 'विलेपार्ले', hi: 'विलेपार्ले' }] },
      { id: 'borivali', en: 'Borivali', mr: 'बोरिवली', hi: 'बोरिवली', villages: [{ id: 'kandivali', en: 'Kandivali', mr: 'कांदिवली', hi: 'कांदिवली' }, { id: 'dahisar', en: 'Dahisar', mr: 'दहिसर', hi: 'दहिसर' }] },
      { id: 'kurla', en: 'Kurla', mr: 'कुर्ला', hi: 'कुर्ला', villages: [{ id: 'ghatkopar', en: 'Ghatkopar', mr: 'घाटकोपर', hi: 'घाटकोपर' }, { id: 'chembur', en: 'Chembur', mr: 'चेंबर', hi: 'चेंबूर' }] },
    ],
  },

  // 19. Nagpur
  {
    id: 'nagpur',
    en: 'Nagpur',
    mr: 'नागपूर',
    hi: 'नागपुर',
    talukas: [
      { id: 'nagpur_urban', en: 'Nagpur Urban', mr: 'नागपूर शहर', hi: 'नागपुर शहर', villages: [{ id: 'sitabuldi', en: 'Sitabuldi', mr: 'सीताबर्डी', hi: 'सीताबर्डी' }] },
      { id: 'nagpur_rural', en: 'Nagpur Rural', mr: 'नागपूर ग्रामीण', hi: 'नागपुर ग्रामीण', villages: [{ id: 'waddhamna', en: 'Waddhamna', mr: 'वडधमणा', hi: 'वडधमना' }] },
      { id: 'kamptee', en: 'Kamptee', mr: 'कामठी', hi: 'कामठी', villages: [{ id: 'kandri', en: 'Kandri', mr: 'कांद्री', hi: 'कांद्री' }] },
      { id: 'hingna', en: 'Hingna', mr: 'हिंगणा', hi: 'हिंगना', villages: [{ id: 'kanhan', en: 'Kanhan', mr: 'कन्हान', hi: 'कन्हान' }] },
      { id: 'katol', en: 'Katol', mr: 'काटोल', hi: 'काटोल', villages: [{ id: 'paradsinga', en: 'Paradsinga', mr: 'पारडसिंगा', hi: 'पारडसिंगा' }] },
      { id: 'narkhed', en: 'Narkhed', mr: 'नरखेड', hi: 'नरखेड', villages: [{ id: 'mowad', en: 'Mowad', mr: 'मोवाड', hi: 'मोवाड' }] },
      { id: 'ramtek', en: 'Ramtek', mr: 'रामटेक', hi: 'रामटेक', villages: [{ id: 'mansar', en: 'Mansar', mr: 'मनसर', hi: 'मनसर' }] },
      { id: 'saoner', en: 'Saoner', mr: 'सावनेर', hi: 'सावनेर', villages: [{ id: 'kelod', en: 'Kelod', mr: 'केळोद', hi: 'केलोद' }] },
      { id: 'kalmeshwar', en: 'Kalmeshwar', mr: 'कळमेश्वर', hi: 'कलमेश्वर', villages: [{ id: 'brahmani', en: 'Brahmani', mr: 'ब्राह्मणी', hi: 'ब्राह्मणी' }] },
      { id: 'parseoni', en: 'Parseoni', mr: 'पारशिवनी', hi: 'पारशिवनी', villages: [{ id: 'nayakund', en: 'Nayakund', mr: 'नयाकुंड', hi: 'नयाकुंड' }] },
      { id: 'umred', en: 'Umred', mr: 'उमरेड', hi: 'उमरेड', villages: [{ id: 'sirsi', en: 'Sirsi', mr: 'सिरसी', hi: 'सिरसी' }] },
      { id: 'kuhi', en: 'Kuhi', mr: 'कुही', hi: 'कुही', villages: [{ id: 'mandhal', en: 'Mandhal', mr: 'मांढळ', hi: 'मांढल' }] },
      { id: 'bhiwapur', en: 'Bhiwapur', mr: 'भिवापूर', hi: 'भिवापुर', villages: [{ id: 'nand', en: 'Nand', mr: 'नांद', hi: 'नांद' }] },
    ],
  },

  // 20. Nanded
  {
    id: 'nanded',
    en: 'Nanded',
    mr: 'नांदेड',
    hi: 'नांदेड',
    talukas: [
      { id: 'nanded_t', en: 'Nanded', mr: 'नांदेड', hi: 'नांदेड', villages: [{ id: 'vishnupuri', en: 'Vishnupuri', mr: 'विष्णुपुरी', hi: 'विष्णुपुरी' }] },
      { id: 'ardhapur', en: 'Ardhapur', mr: 'अर्धापूर', hi: 'अर्धापुर', villages: [{ id: 'dabhade', en: 'Dabhade', mr: 'दाभाडे', hi: 'दाभाडे' }] },
      { id: 'biloli', en: 'Biloli', mr: 'बिलोली', hi: 'बिलोली', villages: [{ id: 'kundalwadi', en: 'Kundalwadi', mr: 'कुंडलवाडी', hi: 'कुंडलवाड़ी' }] },
      { id: 'deglur', en: 'Deglur', mr: 'देगलूर', hi: 'देगलूर', villages: [{ id: 'shahapur_n', en: 'Shahapur', mr: 'शहापूर', hi: 'शहापुर' }] },
      { id: 'dharmabad', en: 'Dharmabad', mr: 'धर्माबाद', hi: 'धर्माबाद', villages: [{ id: 'karkheli', en: 'Karkheli', mr: 'करखेली', hi: 'करखेली' }] },
      { id: 'hadgaon', en: 'Hadgaon', mr: 'हदगाव', hi: 'हदगांव', villages: [{ id: 'tamsa', en: 'Tamsa', mr: 'तामसा', hi: 'तामसा' }] },
      { id: 'himayatnagar', en: 'Himayatnagar', mr: 'हिमायतनगर', hi: 'हिमायतनगर', villages: [{ id: 'saraswati', en: 'Saraswati', mr: 'सरस्वती', hi: 'सरस्वती' }] },
      { id: 'kandhar', en: 'Kandhar', mr: 'कंधार', hi: 'कंधार', villages: [{ id: 'kurula', en: 'Kurula', mr: 'कुरुळा', hi: 'कुरुला' }] },
      { id: 'kinwat', en: 'Kinwat', mr: 'किनवट', hi: 'किनवट', villages: [{ id: 'islapur', en: 'Islapur', mr: 'इस्लापूर', hi: 'इस्लापुर' }] },
      { id: 'loha', en: 'Loha', mr: 'लोहा', hi: 'लोहा', villages: [{ id: 'malakoli', en: 'Malakoli', mr: 'माळाकोळी', hi: 'मालाकोली' }] },
      { id: 'mahur', en: 'Mahur', mr: 'माहूर', hi: 'माहूर', villages: [{ id: 'vanjarwadi', en: 'Vanjarwadi', mr: 'वांजरावाडी', hi: 'वांजरावाड़ी' }] },
      { id: 'mudkhed', en: 'Mudkhed', mr: 'मुदखेड', hi: 'मुदखेड', villages: [{ id: 'mugat', en: 'Mugat', mr: 'मुगट', hi: 'मुगट' }] },
      { id: 'mukhed', en: 'Mukhed', mr: 'मुखेड', hi: 'मुखेड', villages: [{ id: 'jahoor', en: 'Jahoor', mr: 'जहूर', hi: 'जहूर' }] },
      { id: 'naigaon', en: 'Naigaon (Khairgaon)', mr: 'नायगाव (खैरगाव)', hi: 'नायगांव', villages: [{ id: 'khairgaon', en: 'Khairgaon', mr: 'खैरगाव', hi: 'खैरगांव' }] },
      { id: 'umri', en: 'Umri', mr: 'उमरी', hi: 'उमरी', villages: [{ id: 'golegaon_u', en: 'Golegaon', mr: 'गोळेगाव', hi: 'गोलेगांव' }] },
    ],
  },

  // 21. Nandurbar
  {
    id: 'nandurbar',
    en: 'Nandurbar',
    mr: 'नंदुरबार',
    hi: 'नंदुरबार',
    talukas: [
      { id: 'nandurbar_t', en: 'Nandurbar', mr: 'नंदुरबार', hi: 'नंदुरबार', villages: [{ id: 'khandbara', en: 'Khandbara', mr: 'खांडबारा', hi: 'खांडबारा' }] },
      { id: 'navapur', en: 'Navapur', mr: 'नवापूर', hi: 'नवापुर', villages: [{ id: 'visarwadi', en: 'Visarwadi', mr: 'विसरवाडी', hi: 'विसरवाड़ी' }] },
      { id: 'shahada', en: 'Shahada', mr: 'शहादा', hi: 'शहादा', villages: [{ id: 'prakasha', en: 'Prakasha', mr: 'प्रकाशा', hi: 'प्रकाशा' }] },
      { id: 'taloda', en: 'Taloda', mr: 'तळोदा', hi: 'तलोदा', villages: [{ id: 'borad', en: 'Borad', mr: 'बोराड', hi: 'बोराड' }] },
      { id: 'akrani', en: 'Akrani (Dhadgaon)', mr: 'अक्राणी (धडगाव)', hi: 'धड़गांव', villages: [{ id: 'dhadgaon', en: 'Dhadgaon', mr: 'धडगाव', hi: 'धड़गांव' }] },
      { id: 'akkalkuwa', en: 'Akkalkuwa', mr: 'अक्कलकुवा', hi: 'अक्कलकुवा', villages: [{ id: 'molgi', en: 'Molgi', mr: 'मोलगी', hi: 'मोलगी' }] },
    ],
  },

  // 22. Nashik
  {
    id: 'nashik',
    en: 'Nashik',
    mr: 'नाशिक',
    hi: 'नाशिक',
    talukas: [
      { id: 'nashik_t', en: 'Nashik', mr: 'नाशिक', hi: 'नाशिक', villages: [{ id: 'satpur', en: 'Satpur', mr: 'सातपूर', hi: 'सातपुर' }, { id: 'deolali', en: 'Deolali', mr: 'देवळाली', hi: 'देवलाली' }] },
      { id: 'dindori', en: 'Dindori', mr: 'दिंडोरी', hi: 'दिंडोरी', villages: [{ id: 'vani', en: 'Vani', mr: 'वणी', hi: 'वणी' }] },
      { id: 'igatpuri', en: 'Igatpuri', mr: 'इगतपुरी', hi: 'इगतपुरी', villages: [{ id: 'ghoti', en: 'Ghoti', mr: 'घोटील', hi: 'घोटी' }] },
      { id: 'kalwan', en: 'Kalwan', mr: 'कळवण', hi: 'कलवण', villages: [{ id: 'abhona', en: 'Abhona', mr: 'अभONA', hi: 'अभोना' }] },
      { id: 'malegaon', en: 'Malegaon', mr: 'मालेगाव', hi: 'मालेगांव', villages: [{ id: 'wadner_m', en: 'Wadner', mr: 'वडनेर', hi: 'वडनेर' }] },
      { id: 'nandgaon', en: 'Nandgaon', mr: 'नांदगाव', hi: 'नांदगांव', villages: [{ id: 'manmad', en: 'Manmad', mr: 'मनमाड', hi: 'मनमाड' }] },
      { id: 'niphad', en: 'Niphad', mr: 'निफाड', hi: 'निफाड', villages: [{ id: 'pimpalgaon_b', en: 'Pimpalgaon Baswant', mr: 'पिंपळगाव बसवंत', hi: 'पिंपलगांव बसवंत' }, { id: 'lasalgaon', en: 'Lasalgaon', mr: 'लासलगाव', hi: 'लासलगांव' }] },
      { id: 'peth', en: 'Peth', mr: 'पेठ', hi: 'पेठ', villages: [{ id: 'jogmodi', en: 'Jogmodi', mr: 'जोगमोडी', hi: 'जोगमोड़ी' }] },
      { id: 'sinnar', en: 'Sinnar', mr: 'सिन्नर', hi: 'सिन्नर', villages: [{ id: 'musalgaon', en: 'Musalgaon', mr: 'मुसळगाव', hi: 'मुसलगांव' }] },
      { id: 'surgana', en: 'Surgana', mr: 'सुरगाणा', hi: 'सुरगाना', villages: [{ id: 'borgaon_s', en: 'Borgaon', mr: 'बोरगाव', hi: 'बोरगांव' }] },
      { id: 'trimbakeshwar', en: 'Trimbakeshwar', mr: 'त्र्यंबकेश्वर', hi: 'त्र्यंबकेश्वर', villages: [{ id: 'anjenari', en: 'Anjaneri', mr: 'अंजनेरी', hi: 'अंजनेरी' }] },
      { id: 'chandwad', en: 'Chandwad', mr: 'चांदवड', hi: 'चांदवड', villages: [{ id: 'vadner_bhairao', en: 'Vadner Bhairao', mr: 'वडनेर भैरव', hi: 'वडनेर भैरव' }] },
      { id: 'deola', en: 'Deola', mr: 'देवळा', hi: 'देवला', villages: [{ id: 'meshi', en: 'Meshi', mr: 'मेशी', hi: 'मेशी' }] },
      { id: 'yeola', en: 'Yeola', mr: 'येवला', hi: 'येवला', villages: [{ id: 'andarsul', en: 'Andarsul', mr: 'अंदरसूल', hi: 'अंदरसूल' }] },
    ],
  },

  // 23. Dharashiv (Osmanabad)
  {
    id: 'dharashiv',
    en: 'Dharashiv (Osmanabad)',
    mr: 'धाराशिव (उस्मानाबाद)',
    hi: 'धाराशिव (उस्मानाबाद)',
    talukas: [
      { id: 'dharashiv_t', en: 'Dharashiv', mr: 'धाराशिव', hi: 'धाराशिव', villages: [{ id: 'ter', en: 'Ter', mr: 'तेर', hi: 'तेर' }] },
      { id: 'tuljapur', en: 'Tuljapur', mr: 'तुळजापूर', hi: 'तुलजापुर', villages: [{ id: 'naldurg', en: 'Naldurg', mr: 'नळदुर्ग', hi: 'नलदुर्ग' }] },
      { id: 'omerga', en: 'Omerga', mr: 'उमरगा', hi: 'उमरगा', villages: [{ id: 'murum', en: 'Murum', mr: 'मुरुम', hi: 'मुरुम' }] },
      { id: 'kalamb_d', en: 'Kalamb', mr: 'कळंब', hi: 'कलंब', villages: [{ id: 'dhoki', en: 'Dhoki', mr: 'ढोकी', hi: 'ढोकी' }] },
      { id: 'bhoom', en: 'Bhoom', mr: 'भूम', hi: 'भूम', villages: [{ id: 'walwad', en: 'Walwad', mr: 'वालवड', hi: 'वालवड' }] },
      { id: 'paranda', en: 'Paranda', mr: 'परांडा', hi: 'परांडा', villages: [{ id: 'anala', en: 'Anala', mr: 'आनाळा', hi: 'आनाला' }] },
      { id: 'lohara', en: 'Lohara', mr: 'लोहारा', hi: 'लोहारा', villages: [{ id: 'kanegav', en: 'Kanegaon', mr: 'काणेगाव', hi: 'कानेगांव' }] },
      { id: 'vashi', en: 'Vashi', mr: 'वाशी', hi: 'वाशी', villages: [{ id: 'terkheda', en: 'Terkheda', mr: 'तेरखेडा', hi: 'तेरखेड़ा' }] },
    ],
  },

  // 24. Palghar
  {
    id: 'palghar',
    en: 'Palghar',
    mr: 'पालघर',
    hi: 'पालघर',
    talukas: [
      { id: 'palghar_t', en: 'Palghar', mr: 'पालघर', hi: 'पालघर', villages: [{ id: 'boisar', en: 'Boisar', mr: 'बोईसर', hi: 'बोईसर' }, { id: 'manor', en: 'Manor', mr: 'मनोर', hi: 'मनोर' }] },
      { id: 'dahanu', en: 'Dahanu', mr: 'डहाणू', hi: 'डहाणू', villages: [{ id: 'bordi', en: 'Bordi', mr: 'बोर्डी', hi: 'बोर्डी' }, { id: 'kasa', en: 'Kasa', mr: 'कासा', hi: 'कासा' }] },
      { id: 'jawhar', en: 'Jawhar', mr: 'जव्हार', hi: 'जव्हार', villages: [{ id: 'sakur', en: 'Sakur', mr: 'साकूर', hi: 'साकूर' }] },
      { id: 'mokhada', en: 'Mokhada', mr: 'मोखाडा', hi: 'मोखाड़ा', villages: [{ id: 'khodala', en: 'Khodala', mr: 'खोडाळा', hi: 'खोडाला' }] },
      { id: 'talasari', en: 'Talasari', mr: 'तलासरी', hi: 'तलासरी', villages: [{ id: 'sutra', en: 'Sutrakar', mr: 'सुत्राकार', hi: 'सुत्राकार' }] },
      { id: 'vasai', en: 'Vasai', mr: 'वसई', hi: 'वसई', villages: [{ id: 'virar', en: 'Virar', mr: 'विरार', hi: 'विरार' }] },
      { id: 'vikramgad', en: 'Vikramgad', mr: 'विक्रमगड', hi: 'विक्रमगढ़', villages: [{ id: 'alonde', en: 'Alonde', mr: 'आलोंडे', hi: 'आलोंडे' }] },
      { id: 'wada', en: 'Wada', mr: 'वाडा', hi: 'वाडा', villages: [{ id: 'kudus', en: 'Kudus', mr: 'कुडूस', hi: 'कुडूस' }] },
    ],
  },

  // 25. Parbhani
  {
    id: 'parbhani',
    en: 'Parbhani',
    mr: 'परभणी',
    hi: 'परभणी',
    talukas: [
      { id: 'parbhani_t', en: 'Parbhani', mr: 'परभणी', hi: 'परभणी', villages: [{ id: 'pingli', en: 'Pingli', mr: 'पिंगळी', hi: 'पिंगली' }] },
      { id: 'gangakhed', en: 'Gangakhed', mr: 'गंगाखेड', hi: 'गंगाखेड', villages: [{ id: 'ranisawargaon', en: 'Ranisawargaon', mr: 'राणीसावरगाव', hi: 'रानीसावरगांव' }] },
      { id: 'jintur', en: 'Jintur', mr: 'जिंतूर', hi: 'जिंतूर', villages: [{ id: 'bori', en: 'Bori', mr: 'बोरी', hi: 'बोरी' }] },
      { id: 'manwath', en: 'Manwath', mr: 'मानवत', hi: 'मानवत', villages: [{ id: 'kholgad', en: 'Kholgad', mr: 'खोलगड', hi: 'खोलगढ़' }] },
      { id: 'palam', en: 'Palam', mr: 'पालम', hi: 'पालम', villages: [{ id: 'banwas', en: 'Banwas', mr: 'बनवस', hi: 'बनवस' }] },
      { id: 'pathri', en: 'Pathri', mr: 'पाथरी', hi: 'पाथरी', villages: [{ id: 'hade', en: 'Hadi', mr: 'हादी', hi: 'हादी' }] },
      { id: 'purna', en: 'Purna', mr: 'पूर्णा', hi: 'पूर्णा', villages: [{ id: 'tadkalas', en: 'Tadkalas', mr: 'ताडकळस', hi: 'ताडकलस' }] },
      { id: 'sonpeth', en: 'Sonpeth', mr: 'सोनपेठ', hi: 'सोनपेठ', villages: [{ id: 'vadgaon_s', en: 'Vadgaon', mr: 'वडगाव', hi: 'वडगांव' }] },
      { id: 'selu', en: 'Selu', mr: 'सेलू', hi: 'सेलू', villages: [{ id: 'walur', en: 'Walur', mr: 'वालूर', hi: 'वालूर' }] },
    ],
  },

  // 26. Pune
  {
    id: 'pune',
    en: 'Pune',
    mr: 'पुणे',
    hi: 'पुणे',
    talukas: [
      { id: 'pune_city', en: 'Pune City', mr: 'पुणे शहर', hi: 'पुणे शहर', villages: [{ id: 'kothrud', en: 'Kothrud', mr: 'कोथरूड', hi: 'कोथरूड' }, { id: 'hadapsar', en: 'Hadapsar', mr: 'हडपसर', hi: 'हड़पसर' }] },
      { id: 'pimpri_chinchwad', en: 'Pimpri-Chinchwad', mr: 'पिंपरी-चिंचवड', hi: 'पिंपरी-चिंचवड', villages: [{ id: 'bhosari', en: 'Bhosari', mr: 'भोसरी', hi: 'भोसरी' }, { id: 'wakad', en: 'Wakad', mr: 'वाकड', hi: 'वाकड' }] },
      { id: 'haveli', en: 'Haveli', mr: 'हवेली', hi: 'हवेली', villages: [{ id: 'wagholi', en: 'Wagholi', mr: 'वाघोली', hi: 'वाघोली' }, { id: 'uruli_kanchan', en: 'Uruli Kanchan', mr: 'उरुळी कांचन', hi: 'उरुली कांचन' }] },
      { id: 'maval', en: 'Maval', mr: 'मावळ', hi: 'मावल', villages: [{ id: 'talegaon_d', en: 'Talegaon Dabhade', mr: 'तळेगाव दाभाडे', hi: 'तलेगांव दाभाड़े' }, { id: 'lonavala', en: 'Lonavala Rural', mr: 'लोणावळा ग्रामीण', hi: 'लोनावला' }] },
      { id: 'mulshi', en: 'Mulshi', mr: 'मुळशी', hi: 'मुलशी', villages: [{ id: 'paud', en: 'Paud', mr: 'पौड', hi: 'पौड' }, { id: 'pirangut', en: 'Pirangut', mr: 'पिरंगुट', hi: 'पिरंगुट' }] },
      { id: 'shirur', en: 'Shirur', mr: 'शिरूर', hi: 'शिरूर', villages: [{ id: 'ranjangaon', en: 'Ranjangaon', mr: 'रांजणगाव', hi: 'रांजणगांव' }, { id: 'shikrapur', en: 'Shikrapur', mr: 'शिक्रापूर', hi: 'शिक्रापुर' }] },
      { id: 'baramati', en: 'Baramati', mr: 'बारामती', hi: 'बारामती', villages: [{ id: 'malegaon_bk', en: 'Malegaon Budruk', mr: 'माळेगाव बुद्रुक', hi: 'मालेगांव बुद्रुक' }, { id: 'supe', en: 'Supe', mr: 'सुपे', hi: 'सुपे' }, { id: 'pimpali', en: 'Pimpali', mr: 'पिंपळी', hi: 'पिंपली' }] },
      { id: 'daund', en: 'Daund', mr: 'दौंड', hi: 'दौंड', villages: [{ id: 'patas', en: 'Patas', mr: 'पाटस', hi: 'पाटस' }, { id: 'kedgaon', en: 'Kedgaon', mr: 'केडगाव', hi: 'केडगांव' }] },
      { id: 'indapur', en: 'Indapur', mr: 'इंदापूर', hi: 'इंदापुर', villages: [{ id: 'nimgaon_ketki', en: 'Nimgaon Ketki', mr: 'निमगाव केतकी', hi: 'निमगांव केतकी' }, { id: 'bawada', en: 'Bawada', mr: 'बावडा', hi: 'बावड़ा' }] },
      { id: 'bhor', en: 'Bhor', mr: 'भोर', hi: 'भोर', villages: [{ id: 'nasrapur', en: 'Nasrapur', mr: 'नसरापूर', hi: 'नसरापुर' }] },
      { id: 'velhe', en: 'Velhe (Rajgad)', mr: 'वेल्हे (राजगड)', hi: 'वेल्हे', villages: [{ id: 'velhe_b', en: 'Velhe BK', mr: 'वेल्हे बु.', hi: 'वेल्हे बु.' }] },
      { id: 'purandar', en: 'Purandar', mr: 'पुरंदर (सासवड)', hi: 'पुरंदर', villages: [{ id: 'saswad', en: 'Saswad', mr: 'सासवड', hi: 'सासवड' }, { id: 'jejuri', en: 'Jejuri', mr: 'जेजुरी', hi: 'जेजुरी' }] },
      { id: 'khed', en: 'Khed', mr: 'खेड (राजगुरुनगर)', hi: 'खेड', villages: [{ id: 'chakan', en: 'Chakan', mr: 'चाकण', hi: 'चाकण' }, { id: 'alandi', en: 'Alandi', mr: 'आळंदी', hi: 'आलंदी' }] },
      { id: 'junnar', en: 'Junnar', mr: 'जुन्नर', hi: 'जुन्नर', villages: [{ id: 'narayangaon', en: 'Narayangaon', mr: 'नारायणगाव', hi: 'नारायणगांव' }, { id: 'alephata', en: 'Alephata', mr: 'आळेफाटा', hi: 'आलेफाटा' }] },
      { id: 'ambegaon', en: 'Ambegaon', mr: 'आंबेगाव (मंचर)', hi: 'आंबेगांव', villages: [{ id: 'manchar', en: 'Manchar', mr: 'मंचर', hi: 'मंचर' }, { id: 'ghodegaon', en: 'Ghodegaon', mr: 'घोडेगाव', hi: 'घोडेगांव' }] },
    ],
  },

  // 27. Raigad
  {
    id: 'raigad',
    en: 'Raigad',
    mr: 'रायगड',
    hi: 'रायगढ़',
    talukas: [
      { id: 'alibag', en: 'Alibag', mr: 'अलिबाग', hi: 'अलिबाग', villages: [{ id: 'revdanda', en: 'Revdanda', mr: 'रेवदंडा', hi: 'रेवदंडा' }] },
      { id: 'murud', en: 'Murud', mr: 'मुरुड', hi: 'मुरुड', villages: [{ id: 'janjira', en: 'Murud Janjira', mr: 'मुरुड जंजिरा', hi: 'मुरुड जंजीरा' }] },
      { id: 'panvel', en: 'Panvel', mr: 'पनवेल', hi: 'पनवेल', villages: [{ id: 'palaspe', en: 'Palaspe', mr: 'पळस्पे', hi: 'पलस्पे' }] },
      { id: 'uran', en: 'Uran', mr: 'उरण', hi: 'उरण', villages: [{ id: 'jasai', en: 'Jasai', mr: 'जसई', hi: 'जसई' }] },
      { id: 'karjat_r', en: 'Karjat', mr: 'कर्जत', hi: 'कर्जत', villages: [{ id: 'neral', en: 'Neral', mr: 'नेरळ', hi: 'नेरल' }] },
      { id: 'khalapur', en: 'Khalapur', mr: 'खालापूर', hi: 'खालापुर', villages: [{ id: 'khopoli', en: 'Khopoli', mr: 'खोपोली', hi: 'खोपोली' }] },
      { id: 'mangaon', en: 'Mangaon', mr: 'माणगाव', hi: 'माणगांव', villages: [{ id: 'goregaon_r', en: 'Goregaon', mr: 'गोरेगाव', hi: 'गोरेगांव' }] },
      { id: 'tala', en: 'Tala', mr: 'तळा', hi: 'तळा', villages: [{ id: 'tala_v', en: 'Tala Rural', mr: 'तळा ग्रामीण', hi: 'तळा' }] },
      { id: 'roha', en: 'Roha', mr: 'रोहा', hi: 'रोहा', villages: [{ id: 'nagothane', en: 'Nagothane', mr: 'नागोठणे', hi: 'नागोठने' }] },
      { id: 'sudhagad', en: 'Sudhagad (Pali)', mr: 'सुधागड (पाली)', hi: 'पाली', villages: [{ id: 'pali', en: 'Pali', mr: 'पाली', hi: 'पाली' }] },
      { id: 'mahad', en: 'Mahad', mr: 'महाड', hi: 'महाड', villages: [{ id: 'birwadi', en: 'Birwadi', mr: 'बिरवाडी', hi: 'बिरवाड़ी' }] },
      { id: 'poladpur', en: 'Poladpur', mr: 'पोलादपूर', hi: 'पोलादपुर', villages: [{ id: 'kapade', en: 'Kapade', mr: 'कपडे', hi: 'कपड़े' }] },
      { id: 'shrivardhan', en: 'Shrivardhan', mr: 'श्रीवर्धन', hi: 'श्रीवर्धन', villages: [{ id: 'harihareshwar', en: 'Harihareshwar', mr: 'हरिहरेश्वर', hi: 'हरिहरेश्वर' }] },
      { id: 'mhasla', en: 'Mhasla', mr: 'म्हसळा', hi: 'म्हसला', villages: [{ id: 'khamgaon_r', en: 'Khamgaon', mr: 'खामगाव', hi: 'खामगांव' }] },
    ],
  },

  // 28. Ratnagiri
  {
    id: 'ratnagiri',
    en: 'Ratnagiri',
    mr: 'रत्नागिरी',
    hi: 'रत्नागिरी',
    talukas: [
      { id: 'ratnagiri_t', en: 'Ratnagiri', mr: 'रत्नागिरी', hi: 'रत्नागिरी', villages: [{ id: 'pawas', en: 'Pawas', mr: 'पावस', hi: 'पावस' }] },
      { id: 'sangameshwar', en: 'Sangameshwar', mr: 'संगमेश्वर', hi: 'संगमेश्वर', villages: [{ id: 'devrukh', en: 'Devrukh', mr: 'देवरुख', hi: 'देवरुख' }] },
      { id: 'lanja', en: 'Lanja', mr: 'लांजा', hi: 'लांजा', villages: [{ id: 'kante', en: 'Kante', mr: 'कांटे', hi: 'कांटे' }] },
      { id: 'rajapur', en: 'Rajapur', mr: 'राजापूर', hi: 'राजापुर', villages: [{ id: 'jaitapur', en: 'Jaitapur', mr: 'जैतापूर', hi: 'जैतापुर' }] },
      { id: 'chiplun', en: 'Chiplun', mr: 'चिपळूण', hi: 'चिपलूण', villages: [{ id: 'khed_r', en: 'Khed', mr: 'खेड', hi: 'खेड' }, { id: 'sawarda', en: 'Sawarde', mr: 'सावर्डे', hi: 'सावर्डे' }] },
      { id: 'guhagar', en: 'Guhagar', mr: 'गुहागर', hi: 'गुहागर', villages: [{ id: 'hedvi', en: 'Hedvi', mr: 'हेडवी', hi: 'हेडवी' }] },
      { id: 'dapoli', en: 'Dapoli', mr: 'दापोली', hi: 'दापोली', villages: [{ id: 'anjarle', en: 'Anjarle', mr: 'आंजर्ले', hi: 'आंजर्ले' }] },
      { id: 'mandangad', en: 'Mandangad', mr: 'मंडणगड', hi: 'मंडनगढ़', villages: [{ id: 'mhapral', en: 'Mhapral', mr: 'म्हाप्रळ', hi: 'म्हाप्रल' }] },
      { id: 'khed_rtn', en: 'Khed', mr: 'खेड', hi: 'खेड', villages: [{ id: 'bharna_naka', en: 'Bharna Naka', mr: 'भरणा नाका', hi: 'भरणा नाका' }] },
    ],
  },

  // 29. Sangli
  {
    id: 'sangli',
    en: 'Sangli',
    mr: 'सांगली',
    hi: 'सांगली',
    talukas: [
      { id: 'miraj', en: 'Miraj', mr: 'मिरज', hi: 'मिरज', villages: [{ id: 'kupwad', en: 'Kupwad', mr: 'कुपवाड', hi: 'कुपवाड' }, { id: 'mhaisal', en: 'Mhaisal', mr: 'म्हैसाळ', hi: 'म्हैसाल' }] },
      { id: 'tasgaon', en: 'Tasgaon', mr: 'तासगाव', hi: 'तासगांव', villages: [{ id: 'savarde', en: 'Savarde', mr: 'सावर्डे', hi: 'सावर्डे' }] },
      { id: 'khanapur', en: 'Khanapur (Vita)', mr: 'खानापूर (विटा)', hi: 'विटा', villages: [{ id: 'vita', en: 'Vita', mr: 'विटा', hi: 'विटा' }] },
      { id: 'atpadi', en: 'Atpadi', mr: 'आटपाडी', hi: 'आटपाडी', villages: [{ id: 'diganchi', en: 'Diganchi', mr: 'दिघंची', hi: 'दिघंची' }] },
      { id: 'kavathe_mahankal', en: 'Kavathe-Mahankal', mr: 'कवठे महांकाळ', hi: 'कवठे महांकाल', villages: [{ id: 'dhalgaon', en: 'Dhalgaon', mr: 'ढालगाव', hi: 'ढालगांव' }] },
      { id: 'jat', en: 'Jat', mr: 'जत', hi: 'जत', villages: [{ id: 'sankh', en: 'Sankh', mr: 'संख', hi: 'संख' }] },
      { id: 'shirala', en: 'Shirala', mr: 'शिराळा', hi: 'शिराला', villages: [{ id: 'kokrud', en: 'Kokrud', mr: 'कोकरुड', hi: 'कोकरुड' }] },
      { id: 'walwa', en: 'Walwa (Islampur)', mr: 'वाळवा (इस्लामपूर)', hi: 'इस्लामपुर', villages: [{ id: 'islampur', en: 'Islampur', mr: 'इस्लामपूर', hi: 'इस्लामपुर' }, { id: 'ashta', en: 'Ashta', mr: 'आष्टा', hi: 'आष्टा' }] },
      { id: 'palus', en: 'Palus', mr: 'पलूस', hi: 'पलूस', villages: [{ id: 'bhilawadi', en: 'Bhilawadi', mr: 'भिलवडी', hi: 'भिलवड़ी' }] },
      { id: 'kadegaon', en: 'Kadegaon', mr: 'कडेगाव', hi: 'कडेगांव', villages: [{ id: 'shirgaon_k', en: 'Shirgaon', mr: 'शिरगाव', hi: 'शिरगांव' }] },
    ],
  },

  // 30. Satara
  {
    id: 'satara',
    en: 'Satara',
    mr: 'सातारा',
    hi: 'सातारा',
    talukas: [
      { id: 'satara_t', en: 'Satara', mr: 'सातारा', hi: 'सातारा', villages: [{ id: 'khed_s', en: 'Khed', mr: 'खेड', hi: 'खेड' }] },
      { id: 'jaoli', en: 'Jaoli (Medha)', mr: 'जावळी (मेढा)', hi: 'मेढा', villages: [{ id: 'medha', en: 'Medha', mr: 'मेढा', hi: 'मेढा' }] },
      { id: 'khandala', en: 'Khandala (Shirwal)', mr: 'खंडाळा (शिरवळ)', hi: 'शिरवल', villages: [{ id: 'shirwal', en: 'Shirwal', mr: 'शिरवळ', hi: 'शिरवल' }] },
      { id: 'koregaon', en: 'Koregaon', mr: 'कोरेगाव', hi: 'कोरेगांव', villages: [{ id: 'pimpode', en: 'Pimpode Budruk', mr: 'पिंपोडे बु.', hi: 'पिंपोडे बु.' }] },
      { id: 'wai', en: 'Wai', mr: 'वाई', hi: 'वाई', villages: [{ id: 'bhuinj', en: 'Bhuinj', mr: 'भुईंज', hi: 'भुईंज' }] },
      { id: 'mahabaleshwar', en: 'Mahabaleshwar', mr: 'महाबळेश्वर', hi: 'महाबलेश्वर', villages: [{ id: 'panchgani', en: 'Panchgani', mr: 'पाचगणी', hi: 'पांचगणी' }] },
      { id: 'phaltan', en: 'Phaltan', mr: 'फलटण', hi: 'फलटण', villages: [{ id: 'taradgaon', en: 'Taradgaon', mr: 'तरडगाव', hi: 'तरड़गांव' }] },
      { id: 'man', en: 'Man (Dahiwadi)', mr: 'माण (दहीवडी)', hi: 'दहीवड़ी', villages: [{ id: 'mhaswad', en: 'Mhaswad', mr: 'म्हसवड', hi: 'म्हसवड' }] },
      { id: 'khatav', en: 'Khatav (Vaduj)', mr: 'खटाव (वडूज)', hi: 'वडूज', villages: [{ id: 'vaduj', en: 'Vaduj', mr: 'वडूज', hi: 'वडूज' }, { id: 'pusegaon', en: 'Pusegaon', mr: 'पुसेगाव', hi: 'पुसेगांव' }] },
      { id: 'karad', en: 'Karad', mr: 'कराड', hi: 'कराड', villages: [{ id: 'umbraj', en: 'Umbraj', mr: 'उंब्रज', hi: 'उंब्रज' }, { id: 'masur', en: 'Masur', mr: 'मसूर', hi: 'मसूर' }] },
      { id: 'patan', en: 'Patan', mr: 'पाटण', hi: 'पाटण', villages: [{ id: 'koynanagar', en: 'Koynanagar', mr: 'कोयनानगर', hi: 'कोयनानगर' }] },
    ],
  },

  // 31. Sindhudurg
  {
    id: 'sindhudurg',
    en: 'Sindhudurg',
    mr: 'सिंधुदुर्ग',
    hi: 'सिंधुदुर्ग',
    talukas: [
      { id: 'devgad', en: 'Devgad', mr: 'देवगड', hi: 'देवगढ़', villages: [{ id: 'mithbav', en: 'Mithbav', mr: 'मिठबाव', hi: 'मिठबाव' }] },
      { id: 'vaibhavwadi', en: 'Vaibhavwadi', mr: 'वैभववाडी', hi: 'वैभववाड़ी', villages: [{ id: 'bhuibavda', en: 'Bhuibavda', mr: 'भुईबावडा', hi: 'भुईबावड़ा' }] },
      { id: 'kankavli', en: 'Kankavli', mr: 'कणकवली', hi: 'कनकवली', villages: [{ id: 'osargaon', en: 'Osargaon', mr: 'ओसरगाव', hi: 'ओसरगांव' }] },
      { id: 'malvan', en: 'Malvan', mr: 'मालवण', hi: 'मालवण', villages: [{ id: 'tarkarli', en: 'Tarkarli', mr: 'तारकर्ली', hi: 'तारकर्ली' }] },
      { id: 'sawantwadi', en: 'Sawantwadi', mr: 'सावंतवाडी', hi: 'सावंतवाड़ी', villages: [{ id: 'amboli', en: 'Amboli', mr: 'आंबोली', hi: 'आंबोली' }] },
      { id: 'vengurla', en: 'Vengurla', mr: 'वेंगुर्ला', hi: 'वेंगुर्ला', villages: [{ id: 'shiroda', en: 'Shiroda', mr: 'शिरोडा', hi: 'शिरोडा' }] },
      { id: 'kudal', en: 'Kudal', mr: 'कुडाळ', hi: 'कुडाल', villages: [{ id: 'zarap', en: 'Zarap', mr: 'झाराप', hi: 'झाराप' }] },
      { id: 'dodamarg', en: 'Dodamarg', mr: 'दोडामार्ग', hi: 'दोडामार्ग', villages: [{ id: 'bhedshi', en: 'Bhedshi', mr: 'भेदशी', hi: 'भेदशी' }] },
    ],
  },

  // 32. Solapur
  {
    id: 'solapur',
    en: 'Solapur',
    mr: 'सोलापूर',
    hi: 'सोलापुर',
    talukas: [
      { id: 'solapur_north', en: 'Solapur North', mr: 'उत्तर सोलापूर', hi: 'उत्तर सोलापुर', villages: [{ id: 'kegaon', en: 'Kegaon', mr: 'केगाव', hi: 'केगांव' }] },
      { id: 'solapur_south', en: 'Solapur South', mr: 'दक्षिण सोलापूर', hi: 'दक्षिण सोलापुर', villages: [{ id: 'mandrup', en: 'Mandrup', mr: 'मंद्रुप', hi: 'मंद्रुप' }] },
      { id: 'barshi', en: 'Barshi', mr: 'बार्शी', hi: 'बार्शी', villages: [{ id: 'vairag', en: 'Vairag', mr: 'वैराग', hi: 'वैराग' }] },
      { id: 'akkalkot', en: 'Akkalkot', mr: 'अक्कलकोट', hi: 'अक्कलकोट', villages: [{ id: 'maindargi', en: 'Maindargi', mr: 'मैंदर्गी', hi: 'मैंदर्गी' }] },
      { id: 'madha', en: 'Madha', mr: 'माढा', hi: 'माढा', villages: [{ id: 'kurduwadi', en: 'Kurduwadi', mr: 'कुर्डुवाडी', hi: 'कुर्डुवाड़ी' }] },
      { id: 'karmala', en: 'Karmala', mr: 'करमाळा', hi: 'करमाला', villages: [{ id: 'jeur', en: 'Jeur', mr: 'जेऊर', hi: 'जेऊर' }] },
      { id: 'pandharpur', en: 'Pandharpur', mr: 'पंढरपूर', hi: 'पंढरपुर', villages: [{ id: 'bhalwani', en: 'Bhalwani', mr: 'भालवणी', hi: 'भालवणी' }, { id: 'kasegaon_p', en: 'Kasegaon', mr: 'कासेगाव', hi: 'कासेगांव' }] },
      { id: 'mohol', en: 'Mohol', mr: 'मोहोळ', hi: 'मोहोळ', villages: [{ id: 'angam', en: 'Angar', mr: 'अनगर', hi: 'अनगर' }] },
      { id: 'malshiras', en: 'Malshiras', mr: 'माळशिरस', hi: 'मालशिरस', villages: [{ id: 'akluj', en: 'Akluj', mr: 'अकलूज', hi: 'अकलूज' }, { id: 'natepute', en: 'Natepute', mr: 'नातेपुते', hi: 'नातेपुते' }] },
      { id: 'sangole', en: 'Sangole', mr: 'सांगोला', hi: 'सांगोला', villages: [{ id: 'nazar', en: 'Nazare', mr: 'नाझरे', hi: 'नाझरे' }] },
      { id: 'mangalvedhe', en: 'Mangalvedhe', mr: 'मंगळवेढा', hi: 'मंगलवेढ़ा', villages: [{ id: 'marwade', en: 'Marwade', mr: 'मरवडे', hi: 'मरवड़े' }] },
    ],
  },

  // 33. Thane
  {
    id: 'thane',
    en: 'Thane',
    mr: 'ठाणे',
    hi: 'ठाणे',
    talukas: [
      { id: 'thane_t', en: 'Thane', mr: 'ठाणे', hi: 'ठाणे', villages: [{ id: 'ghodbunder', en: 'Ghodbunder', mr: 'घोडबंदर', hi: 'घोडबंदर' }] },
      { id: 'kalyan', en: 'Kalyan', mr: 'कल्याण', hi: 'कल्याण', villages: [{ id: 'titwala', en: 'Titwala', mr: 'टिटवाळा', hi: 'टिटवाला' }] },
      { id: 'bhiwandi', en: 'Bhiwandi', mr: 'भिवंडी', hi: 'भिवंडी', villages: [{ id: 'padgha', en: 'Padgha', mr: 'पडघा', hi: 'पडघा' }] },
      { id: 'murbad', en: 'Murbad', mr: 'मुरबाड', hi: 'मुरबाड', villages: [{ id: 'saralgaon', en: 'Saralgaon', mr: 'सरळगाव', hi: 'सरलगांव' }] },
      { id: 'shahapur', en: 'Shahapur', mr: 'शहापूर', hi: 'शहापुर', villages: [{ id: 'asangaon', en: 'Asangaon', mr: 'आसनगाव', hi: 'आसनगांव' }] },
      { id: 'ulhasnagar', en: 'Ulhasnagar', mr: 'उल्हासनगर', hi: 'उल्हासनगर', villages: [{ id: 'camp_4', en: 'Camp 4', mr: 'कॅम्प ४', hi: 'कैम्प ४' }] },
      { id: 'ambarnath', en: 'Ambarnath', mr: 'अंबरनाथ', hi: 'अंबरनाथ', villages: [{ id: 'badlapur', en: 'Badlapur Rural', mr: 'बदलापूर ग्रामीण', hi: 'बदलापुर' }] },
    ],
  },

  // 34. Wardha
  {
    id: 'wardha',
    en: 'Wardha',
    mr: 'वर्धा',
    hi: 'वर्धा',
    talukas: [
      { id: 'wardha_t', en: 'Wardha', mr: 'वर्धा', hi: 'वर्धा', villages: [{ id: 'sewagram', en: 'Sewagram', mr: 'सेवाग्राम', hi: 'सेवाग्राम' }] },
      { id: 'arvi', en: 'Arvi', mr: 'आर्वी', hi: 'आर्वी', villages: [{ id: 'rohna', en: 'Rohna', mr: 'रोहणा', hi: 'रोहणा' }] },
      { id: 'ashti_w', en: 'Ashti', mr: 'आष्टी', hi: 'आष्टी', villages: [{ id: 'sahoor', en: 'Sahoor', mr: 'साहूर', hi: 'साहूर' }] },
      { id: 'deoli', en: 'Deoli', mr: 'देवळी', hi: 'देवली', villages: [{ id: 'andori', en: 'Andori', mr: 'आंदोरी', hi: 'आंदोरी' }] },
      { id: 'hinganghat', en: 'Hinganghat', mr: 'हिंगणघाट', hi: 'हिंगणघाट', villages: [{ id: 'wadner_w', en: 'Wadner', mr: 'वडनेर', hi: 'वडनेर' }] },
      { id: 'karanja_w', en: 'Karanja (Ghadge)', mr: 'कारंजा (घाडगे)', hi: 'कारंजा', villages: [{ id: 'sarwadi', en: 'Sarwadi', mr: 'सारवाडी', hi: 'सारवाड़ी' }] },
      { id: 'samudrapur', en: 'Samudrapur', mr: 'समुद्रपूर', hi: 'समुद्रपुर', villages: [{ id: 'girad', en: 'Girad', mr: 'गिरड', hi: 'गिरड' }] },
      { id: 'seloo', en: 'Seloo', mr: 'सेलूस', hi: 'सेलू', villages: [{ id: 'relegaon', en: 'Relegaon', mr: 'रेळेगाव', hi: 'रेलेगांव' }] },
    ],
  },

  // 35. Washim
  {
    id: 'washim',
    en: 'Washim',
    mr: 'वाशिम',
    hi: 'वाशिम',
    talukas: [
      { id: 'washim_t', en: 'Washim', mr: 'वाशिम', hi: 'वाशिम', villages: [{ id: 'anasing', en: 'Ansing', mr: 'आनसिंग', hi: 'आनसिंग' }] },
      { id: 'malegaon_w', en: 'Malegaon', mr: 'मालेगाव', hi: 'मालेगांव', villages: [{ id: 'shirpur_j', en: 'Shirpur Jain', mr: 'शिरपूर जैन', hi: 'शिरपुर जैन' }] },
      { id: 'mangrulpir', en: 'Mangrulpir', mr: 'मंगरुळपीर', hi: 'मंगरुलपीर', villages: [{ id: 'shaili', en: 'Shelu Bazar', mr: 'शेलू बाजार', hi: 'शेलू बाजार' }] },
      { id: 'manora', en: 'Manora', mr: 'मनोरा', hi: 'मनोरा', villages: [{ id: 'injar', en: 'Inzori', mr: 'इंझोरी', hi: 'इंझोरी' }] },
      { id: 'risod', en: 'Risod', mr: 'रिसोड', hi: 'रिसोड', villages: [{ id: 'kekan_umra', en: 'Kekan Umra', mr: 'केकतउमरा', hi: 'केकतउमरा' }] },
      { id: 'karanja_washim', en: 'Karanja (Lad)', mr: 'कारंजा (लाड)', hi: 'कारंजा (लाड)', villages: [{ id: 'poha', en: 'Poha', mr: 'पोहा', hi: 'पोहा' }] },
    ],
  },

  // 36. Yavatmal
  {
    id: 'yavatmal',
    en: 'Yavatmal',
    mr: 'यवतमाळ',
    hi: 'यवतमाल',
    talukas: [
      { id: 'yavatmal_t', en: 'Yavatmal', mr: 'यवतमाळ', hi: 'यवतमाल', villages: [{ id: 'lohata', en: 'Lohara', mr: 'लोहारा', hi: 'लोहारा' }] },
      { id: 'arni', en: 'Arni', mr: 'आरणी', hi: 'आरणी', villages: [{ id: 'jawala', en: 'Jawala', mr: 'जवळा', hi: 'जवला' }] },
      { id: 'babhulgaon', en: 'Babhulgaon', mr: 'बाभूळगाव', hi: 'बाभूलगांव', villages: [{ id: 'sarati', en: 'Sarati', mr: 'सराटी', hi: 'सराटी' }] },
      { id: 'kalamb_y', en: 'Kalamb', mr: 'कळंब', hi: 'कलंब', villages: [{ id: 'kharda_y', en: 'Kharda', mr: 'खर्डा', hi: 'खर्डा' }] },
      { id: 'darwha', en: 'Darwha', mr: 'दारव्हा', hi: 'दारव्हा', villages: [{ id: 'ladkhed', en: 'Ladkhed', mr: 'लाडखेड', hi: 'लाडखेड' }] },
      { id: 'digras', en: 'Digras', mr: 'दिग्रस', hi: 'दिग्रस', villages: [{ id: 'kalgaon', en: 'Kalgaon', mr: 'काळगाव', hi: 'कालगांव' }] },
      { id: 'ner', en: 'Ner (Parsopant)', mr: 'नेर (नवाबपूर)', hi: 'नेर', villages: [{ id: 'udapur', en: 'Udapur', mr: 'उदापूर', hi: 'उदापुर' }] },
      { id: 'pusad', en: 'Pusad', mr: 'पुसद', hi: 'पुसद', villages: [{ id: 'fulsawangi', en: 'Fulsawangi', mr: 'फुलसावंगी', hi: 'फुलसावंगी' }] },
      { id: 'umarkhed', en: 'Umarkhed', mr: 'उमरखेड', hi: 'उमरखेड', villages: [{ id: 'vidul', en: 'Vidul', mr: 'विदूर', hi: 'विदूर' }] },
      { id: 'mahagaon', en: 'Mahagaon', mr: 'महागाव', hi: 'महागांव', villages: [{ id: 'gunj', en: 'Gunj', mr: 'गुंज', hi: 'गुंज' }] },
      { id: 'kelapur', en: 'Kelapur (Pandharkawada)', mr: 'केळापूर (पांढरकवडा)', hi: 'केलापुर', villages: [{ id: 'pandharkawada', en: 'Pandharkawada', mr: 'पांढरकवडा', hi: 'पांढरकवडा' }] },
      { id: 'ralegaon', en: 'Ralegaon', mr: 'राळेगाव', hi: 'रालेगांव', villages: [{ id: 'zari_r', en: 'Zari', mr: 'झरी', hi: 'झरी' }] },
      { id: 'ghatanji', en: 'Ghatanji', mr: 'घाटंजी', hi: 'घाटंजी', villages: [{ id: 'parwa', en: 'Parwa', mr: 'पारवा', hi: 'पारवा' }] },
      { id: 'wani', en: 'Wani', mr: 'वणी', hi: 'वणी', villages: [{ id: 'bhalar', en: 'Bhalar', mr: 'भालार', hi: 'भालार' }] },
      { id: 'maregaon', en: 'Maregaon', mr: 'मारेगाव', hi: 'मारेगांव', villages: [{ id: 'botoni', en: 'Botoni', mr: 'बोटोणी', hi: 'बोटोनी' }] },
      { id: 'zari_jamani', en: 'Zari-Jamani', mr: 'झरी जामणी', hi: 'झरी जामनी', villages: [{ id: 'mukutban', en: 'Mukutban', mr: 'मुकुटबन', hi: 'मुकुटबन' }] },
    ],
  },
];

// Helper functions for multilingual cascading dropdowns

export function getStatesList(lang: AppLang): { id: string; name: string }[] {
  return ALL_STATES.map((s) => ({
    id: s.id,
    name: s[lang] || s.en,
  }));
}

export function getDistrictsList(stateId: string, lang: AppLang): { id: string; name: string }[] {
  if (stateId === 'MH') {
    return MAHARASHTRA_DISTRICTS.map((d) => ({
      id: d.id,
      name: d[lang] || d.en,
    }));
  }
  // Generic fallback for other states
  return [
    { id: 'dist_central', name: lang === 'mr' ? 'मध्यवर्ती जिल्हा' : lang === 'hi' ? 'केंद्रीय जिला' : 'Central District' },
    { id: 'dist_north', name: lang === 'mr' ? 'उत्तर जिल्हा' : lang === 'hi' ? 'उत्तर जिला' : 'North District' },
    { id: 'dist_south', name: lang === 'mr' ? 'दक्षिण जिल्हा' : lang === 'hi' ? 'दक्षिण जिला' : 'South District' },
  ];
}

export function getTalukasList(stateId: string, districtId: string, lang: AppLang): { id: string; name: string }[] {
  if (stateId === 'MH') {
    const dist = MAHARASHTRA_DISTRICTS.find((d) => d.id === districtId);
    if (dist && dist.talukas) {
      return dist.talukas.map((t) => ({
        id: t.id,
        name: t[lang] || t.en,
      }));
    }
  }
  return [
    { id: 'taluka_main', name: lang === 'mr' ? 'मुख्य तालुका' : lang === 'hi' ? 'मुख्य तालुका' : 'Main Taluka' },
    { id: 'taluka_rural', name: lang === 'mr' ? 'ग्रामीण तालुका' : lang === 'hi' ? 'ग्रामीण तालुका' : 'Rural Taluka' },
  ];
}

export function getVillagesList(
  stateId: string,
  districtId: string,
  talukaId: string,
  lang: AppLang
): { id: string; name: string }[] {
  if (stateId === 'MH') {
    const dist = MAHARASHTRA_DISTRICTS.find((d) => d.id === districtId);
    if (dist) {
      const taluka = dist.talukas.find((t) => t.id === talukaId);
      if (taluka && taluka.villages && taluka.villages.length > 0) {
        return taluka.villages.map((v) => ({
          id: v.id,
          name: v[lang] || v.en,
        }));
      }
    }
  }
  return [
    { id: 'village_1', name: lang === 'mr' ? 'गाव १' : lang === 'hi' ? 'गांव १' : 'Village 1' },
    { id: 'village_2', name: lang === 'mr' ? 'गाव २' : lang === 'hi' ? 'गांव २' : 'Village 2' },
  ];
}
