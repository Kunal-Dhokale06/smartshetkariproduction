import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Wheat,
  Flower2,
  TreeDeciduous,
  Apple,
  Sprout,
  Sparkles,
  Package,
  Layers,
  Leaf,
  Sun,
  Flame,
  Droplets,
  CircleDot,
} from 'lucide-react-native';
import { colors } from '../theme/colors';

export interface CropMeta {
  name: string;
  icon: any;
  color: string;
  bg: string;
}

export function getCropMeta(cropName?: string | null): CropMeta {
  const lower = (cropName || '').trim().toLowerCase();

  // Cereals & Grains
  if (lower.includes('wheat') || lower.includes('गहू') || lower.includes('गेहूं')) {
    return { name: 'Wheat', icon: Wheat, color: '#D97706', bg: '#FEF3C7' };
  }
  if (lower.includes('paddy') || lower.includes('rice') || lower.includes('भात') || lower.includes('धान')) {
    return { name: 'Paddy', icon: Wheat, color: '#B45309', bg: '#FEF3C7' };
  }
  if (lower.includes('maize') || lower.includes('corn') || lower.includes('मका') || lower.includes('मक्का')) {
    return { name: 'Maize', icon: Wheat, color: '#CA8A04', bg: '#FEF9C3' };
  }
  if (lower.includes('jowar') || lower.includes('sorghum') || lower.includes('ज्वारी') || lower.includes('ज्वार')) {
    return { name: 'Jowar', icon: Wheat, color: '#B45309', bg: '#FEF3C7' };
  }
  if (lower.includes('bajra') || lower.includes('millet') || lower.includes('बाजरी') || lower.includes('बाजरा')) {
    return { name: 'Bajra', icon: Wheat, color: '#A16207', bg: '#FEF9C3' };
  }
  if (lower.includes('ragi') || lower.includes('नाचणी') || lower.includes('रागी')) {
    return { name: 'Ragi', icon: Wheat, color: '#78350F', bg: '#FFEDD5' };
  }

  // Commercial & Cash
  if (lower.includes('cotton') || lower.includes('कापूस') || lower.includes('कपास')) {
    return { name: 'Cotton', icon: Flower2, color: '#0284C7', bg: '#E0F2FE' };
  }
  if (lower.includes('sugar') || lower.includes('cane') || lower.includes('ऊस') || lower.includes('गन्ना')) {
    return { name: 'Sugarcane', icon: TreeDeciduous, color: '#008A45', bg: '#EAF7EF' };
  }
  if (lower.includes('turmeric') || lower.includes('हळद') || lower.includes('हल्दी')) {
    return { name: 'Turmeric', icon: Leaf, color: '#D97706', bg: '#FEF3C7' };
  }
  if (lower.includes('ginger') || lower.includes('आले') || lower.includes('अदरक')) {
    return { name: 'Ginger', icon: Package, color: '#B45309', bg: '#FEF3C7' };
  }
  if (lower.includes('tobacco') || lower.includes('तंबाखू') || lower.includes('तंबाकू')) {
    return { name: 'Tobacco', icon: Leaf, color: '#854D0E', bg: '#FEF3C7' };
  }

  // Pulses & Legumes
  if (lower.includes('soy') || lower.includes('सोयाबीन')) {
    return { name: 'Soybean', icon: Leaf, color: '#059669', bg: '#D1FAE5' };
  }
  if (lower.includes('gram') || lower.includes('chana') || lower.includes('हरभरा') || lower.includes('चना')) {
    return { name: 'Gram', icon: Package, color: '#92400E', bg: '#FFEDD5' };
  }
  if (lower.includes('tur') || lower.includes('arhar') || lower.includes('तूर') || lower.includes('अरहर')) {
    return { name: 'Tur', icon: Package, color: '#C2410C', bg: '#FFEDD5' };
  }
  if (lower.includes('moong') || lower.includes('मूग') || lower.includes('मूंग')) {
    return { name: 'Moong', icon: Leaf, color: '#15803D', bg: '#DCFCE7' };
  }
  if (lower.includes('urad') || lower.includes('उडीद') || lower.includes('उड़द')) {
    return { name: 'Urad', icon: Package, color: '#374151', bg: '#F3F4F6' };
  }
  if (lower.includes('groundnut') || lower.includes('peanut') || lower.includes('भुईमूग') || lower.includes('मूंगफली')) {
    return { name: 'Groundnut', icon: Layers, color: '#A16207', bg: '#FEF08A' };
  }
  if (lower.includes('sunflower') || lower.includes('सूर्यफूल') || lower.includes('सूरजमुखी')) {
    return { name: 'Sunflower', icon: Sun, color: '#EAB308', bg: '#FEF9C3' };
  }
  if (lower.includes('mustard') || lower.includes('mohari') || lower.includes('मोहरी') || lower.includes('सरसों')) {
    return { name: 'Mustard', icon: Sparkles, color: '#CA8A04', bg: '#FEF9C3' };
  }
  if (lower.includes('sesame') || lower.includes('til') || lower.includes('तीळ') || lower.includes('तिल')) {
    return { name: 'Sesame', icon: CircleDot, color: '#78716C', bg: '#F5F5F4' };
  }

  // Vegetables
  if (lower.includes('tomato') || lower.includes('टोमॅटो') || lower.includes('टमाटर')) {
    return { name: 'Tomato', icon: Apple, color: '#DC2626', bg: '#FEE2E2' };
  }
  if (lower.includes('onion') || lower.includes('कांदा') || lower.includes('प्याज')) {
    return { name: 'Onion', icon: Sparkles, color: '#7E22CE', bg: '#F3E8FF' };
  }
  if (lower.includes('potato') || lower.includes('बटाटा') || lower.includes('आलू')) {
    return { name: 'Potato', icon: Package, color: '#854D0E', bg: '#FEF3C7' };
  }
  if (lower.includes('garlic') || lower.includes('लसूण') || lower.includes('लहसुन')) {
    return { name: 'Garlic', icon: Sparkles, color: '#6B7280', bg: '#F3F4F6' };
  }
  if (lower.includes('chilli') || lower.includes('mirchi') || lower.includes('मिरची') || lower.includes('मिर्च')) {
    return { name: 'Chilli', icon: Flame, color: '#E11D48', bg: '#FFE4E6' };
  }
  if (lower.includes('brinjal') || lower.includes('eggplant') || lower.includes('वांगी') || lower.includes('बैंगन')) {
    return { name: 'Brinjal', icon: Sparkles, color: '#6B21A8', bg: '#F3E8FF' };
  }
  if (lower.includes('cabbage') || lower.includes('कोबी') || lower.includes('पत्तागोभी')) {
    return { name: 'Cabbage', icon: Leaf, color: '#16A34A', bg: '#DCFCE7' };
  }
  if (lower.includes('cauliflower') || lower.includes('फ्लॉवर') || lower.includes('फूलगोभी')) {
    return { name: 'Cauliflower', icon: Flower2, color: '#CA8A04', bg: '#FEF9C3' };
  }
  if (lower.includes('okra') || lower.includes('bhendi') || lower.includes('भेंडी') || lower.includes('भिंडी')) {
    return { name: 'Okra', icon: Leaf, color: '#15803D', bg: '#DCFCE7' };
  }
  if (lower.includes('greenpeas') || lower.includes('pea') || lower.includes('मटार') || lower.includes('मटर') || lower.includes('वटाणा')) {
    return { name: 'Green Peas', icon: CircleDot, color: '#16A34A', bg: '#DCFCE7' };
  }
  if (lower.includes('cucumber') || lower.includes('काकडी') || lower.includes('खीरा')) {
    return { name: 'Cucumber', icon: Leaf, color: '#059669', bg: '#D1FAE5' };
  }
  if (lower.includes('spinach') || lower.includes('palak') || lower.includes('पालक')) {
    return { name: 'Spinach', icon: Leaf, color: '#15803D', bg: '#DCFCE7' };
  }
  if (lower.includes('coriander') || lower.includes('kothimbir') || lower.includes('कोथिंबीर') || lower.includes('धनिया')) {
    return { name: 'Coriander', icon: Leaf, color: '#16A34A', bg: '#DCFCE7' };
  }
  if (lower.includes('fenugreek') || lower.includes('methi') || lower.includes('मेथी')) {
    return { name: 'Fenugreek', icon: Leaf, color: '#15803D', bg: '#DCFCE7' };
  }

  // Fruits
  if (lower.includes('banana') || lower.includes('केळी') || lower.includes('केला')) {
    return { name: 'Banana', icon: Apple, color: '#EAB308', bg: '#FEF9C3' };
  }
  if (lower.includes('pomegranate') || lower.includes('डाळिंब') || lower.includes('अनार')) {
    return { name: 'Pomegranate', icon: Apple, color: '#BE123C', bg: '#FFE4E6' };
  }
  if (lower.includes('mango') || lower.includes('आंबा') || lower.includes('आम')) {
    return { name: 'Mango', icon: Apple, color: '#EA580C', bg: '#FFEDD5' };
  }
  if (lower.includes('grapes') || lower.includes('द्राक्षे') || lower.includes('अंगूर')) {
    return { name: 'Grapes', icon: Sparkles, color: '#7C3AED', bg: '#EDE9FE' };
  }
  if (lower.includes('orange') || lower.includes('santra') || lower.includes('संत्रे') || lower.includes('संतरा')) {
    return { name: 'Orange', icon: Sun, color: '#EA580C', bg: '#FFEDD5' };
  }
  if (lower.includes('sweetlime') || lower.includes('mosambi') || lower.includes('मोसंबी') || lower.includes('मौसमी')) {
    return { name: 'Sweet Lime', icon: Sun, color: '#65A30D', bg: '#ECFCCB' };
  }
  if (lower.includes('papaya') || lower.includes('पपई') || lower.includes('पपीता')) {
    return { name: 'Papaya', icon: Apple, color: '#F97316', bg: '#FFEDD5' };
  }
  if (lower.includes('guava') || lower.includes('पेरू') || lower.includes('अमरूद')) {
    return { name: 'Guava', icon: Apple, color: '#65A30D', bg: '#ECFCCB' };
  }
  if (lower.includes('watermelon') || lower.includes('कलिंगड') || lower.includes('तरबूज')) {
    return { name: 'Watermelon', icon: Apple, color: '#E11D48', bg: '#FFE4E6' };
  }
  if (lower.includes('coconut') || lower.includes('नारळ') || lower.includes('नारियल')) {
    return { name: 'Coconut', icon: TreeDeciduous, color: '#854D0E', bg: '#FEF3C7' };
  }
  if (lower.includes('dragon') || lower.includes('ड्रॅगन')) {
    return { name: 'Dragon Fruit', icon: Sparkles, color: '#DB2777', bg: '#FCE7F3' };
  }

  // General / Default
  return { name: cropName || 'Crop', icon: Sprout, color: colors.primaryGreen, bg: '#EAF7EF' };
}

export function renderCropVectorIcon(cropName: string, iconSize = 22, boxSize = 44) {
  const meta = getCropMeta(cropName);
  const Icon = meta.icon;
  return (
    <View style={[styles.iconWrapper, { width: boxSize, height: boxSize, backgroundColor: meta.bg }]}>
      <Icon size={iconSize} color={meta.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
