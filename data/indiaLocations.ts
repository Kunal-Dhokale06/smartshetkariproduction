// Complete India State → District → Taluka → Village hierarchy
// Focused on Maharashtra with full data; other states have their districts listed.

export interface TalukaData {
  name: string;
  villages: string[];
}

export interface DistrictData {
  name: string;
  talukas: TalukaData[];
}

export interface StateData {
  name: string;
  districts: DistrictData[];
}

export const INDIA_LOCATIONS: StateData[] = [
  {
    name: 'Maharashtra',
    districts: [
      {
        name: 'Pune',
        talukas: [
          { name: 'Haveli', villages: ['Wagholi', 'Lohegaon', 'Nanded', 'Sinhagad', 'Lavale', 'Baner', 'Sus', 'Kesnand', 'Koregaon Bhima', 'Uruli Kanchan'] },
          { name: 'Baramati', villages: ['Baramati', 'Pimpri BK', 'Malegaon BK', 'Mordad', 'Supe', 'Pargaon', 'Undawadi', 'Valha', 'Kadethan', 'Korhale BK'] },
          { name: 'Indapur', villages: ['Indapur', 'Nimgaon Ketki', 'Mhasoba', 'Kolawade', 'Bhilarewadi', 'Bori', 'Kumbhargaon', 'Dhaygudewadi', 'Pandharpur BK', 'Takli BK'] },
          { name: 'Junnar', villages: ['Junnar', 'Otur', 'Narayangaon', 'Arale', 'Manchar', 'Rajuri', 'Chakan', 'Alephata', 'Shirgaon', 'Ghodegaon'] },
          { name: 'Khed', villages: ['Rajgurunagar', 'Chakan', 'Talegaon Dabhade', 'Vadgaon Maval', 'Khed', 'Pimpalgaon BK', 'Moshi', 'Markal', 'Nhavi', 'Wada'] },
          { name: 'Maval', villages: ['Vadgaon Maval', 'Talegaon Dabhade', 'Kamshet', 'Dehu Road', 'Pavna Nagar', 'Shirgaon', 'Jambhe', 'Palse', 'Panmala', 'Kanhe'] },
          { name: 'Mulshi', villages: ['Paud', 'Lavasa', 'Pirangut', 'Bhugaon', 'Khadakwasla', 'Chandkhed', 'Nande', 'Hinjewadi', 'Wakad', 'Mhalunge'] },
          { name: 'Purandar', villages: ['Saswad', 'Jejuri', 'Dive', 'Narayanpur', 'Supe', 'Ashtapur', 'Ekhatpur', 'Nhavi', 'Bopdev Ghat', 'Pargaon'] },
          { name: 'Shirur', villages: ['Shirur', 'Ranjangaon', 'Shikrapur', 'Kedgaon', 'Wadki', 'Talegaon Dabhade', 'Pimpalgaon Raja', 'Khandoba', 'Khodad', 'Kasarsai'] },
          { name: 'Velhe', villages: ['Velhe', 'Bavdhan', 'Nasarapur', 'Bhor', 'Morgaon', 'Nangaon', 'Anewadi', 'Parchur', 'Hivare', 'Kanifnath'] },
        ],
      },
      {
        name: 'Nashik',
        talukas: [
          { name: 'Nashik', villages: ['Nashik Road', 'Satpur', 'Ambad', 'Deolali', 'Gangapur', 'Pathardi', 'Girnare', 'Ozar', 'Nandur Madhyameshwar', 'Makhmalabad'] },
          { name: 'Niphad', villages: ['Niphad', 'Vinchur', 'Pimpalgaon Baswant', 'Chandori', 'Lasalgaon', 'Vadner', 'Savargaon', 'Palkhed', 'Vikhran', 'Ankai'] },
          { name: 'Igatpuri', villages: ['Igatpuri', 'Ghoti', 'Vavi', 'Dhamangaon', 'Kasara', 'Tringalwadi', 'Khireshwar', 'Bhavali', 'Aaswali', 'Wavi'] },
          { name: 'Dindori', villages: ['Dindori', 'Vani', 'Chandwad', 'Nandgaon', 'Manmad', 'Yeola', 'Umrane', 'Lamkani', 'Vihitgaon', 'Kharvandi'] },
          { name: 'Malegaon', villages: ['Malegaon', 'Nandgaon', 'Deola', 'Satana', 'Surgana', 'Chandwad', 'Abhona', 'Rawale', 'Pimplas', 'Taharabad'] },
          { name: 'Sinnar', villages: ['Sinnar', 'Musalgaon', 'Shirdi Road', 'Saikheda', 'Pimpalner', 'Nandur', 'Konambe', 'Wadivarhe', 'Dhangar Wada', 'Rohile'] },
          { name: 'Baglan', villages: ['Satana', 'Dhule', 'Navapur', 'Pimpalner', 'Dondaicha', 'Shindkheda', 'Mulher', 'Taharabad', 'Deola', 'Chandwad'] },
          { name: 'Chandwad', villages: ['Chandwad', 'Vani', 'Nandgaon', 'Deola', 'Pimpri', 'Navapur', 'Satana', 'Ozar', 'Girnar', 'Palaskheda'] },
          { name: 'Yeola', villages: ['Yeola', 'Manmad', 'Nandgaon', 'Pimpalner', 'Eklahara', 'Ankai', 'Tanaki', 'Kopargaon', 'Deopur', 'Vichur'] },
          { name: 'Surgana', villages: ['Surgana', 'Peth', 'Harsul', 'Dahanu', 'Kalwan', 'Ambhora', 'Umbarthan', 'Kolher', 'Karanji', 'Amde'] },
        ],
      },
      {
        name: 'Aurangabad',
        talukas: [
          { name: 'Aurangabad', villages: ['Cidco', 'Garkheda', 'Mukundwadi', 'Paithan Road', 'Waluj', 'Chikhalthana', 'Satara', 'Bhavsinghpura', 'Kanchanwadi', 'Dongargaon'] },
          { name: 'Paithan', villages: ['Paithan', 'Narsapur', 'Waluj', 'Gangapur', 'Apegaon', 'Karmad', 'Waddha', 'Lasur', 'Birkin', 'Tembhi'] },
          { name: 'Gangapur', villages: ['Gangapur', 'Shendra', 'Chitegaon', 'Sawangi', 'Vitthalwadi', 'Shingnapur', 'Sakegaon', 'Wadgaon', 'Nevargaon', 'Taroda'] },
          { name: 'Vaijapur', villages: ['Vaijapur', 'Ladsawangi', 'Kauthe', 'Savargaon', 'Nagad', 'Lasur Station', 'Sillod', 'Dighi', 'Nandur Shingote', 'Kanheri'] },
          { name: 'Sillod', villages: ['Sillod', 'Borgaon', 'Dharur', 'Ajintha', 'Kannad', 'Soygaon', 'Taroda', 'Nimbhora', 'Borala', 'Sultanpur'] },
          { name: 'Kannad', villages: ['Kannad', 'Sillod', 'Ajintha', 'Lasur', 'Taka', 'Dhanegaon', 'Sultanpur', 'Pimpalgaon', 'Vihitgaon', 'Manur'] },
          { name: 'Soygaon', villages: ['Soygaon', 'Borala', 'Borgaon', 'Taka', 'Manur', 'Kannad', 'Pimparkheda', 'Soy', 'Devgaon', 'Nimba'] },
          { name: 'Khuldabad', villages: ['Khuldabad', 'Rauza', 'Ellora', 'Verul', 'Phardapur', 'Gaibinath', 'Poladpur', 'Mhasoba', 'Sule', 'Khokad'] },
        ],
      },
      {
        name: 'Nagpur',
        talukas: [
          { name: 'Nagpur Urban', villages: ['Gandhibagh', 'Dharampeth', 'Sadar', 'Ramdaspeth', 'Sitabuldi', 'Gokulpeth', 'Manewada', 'Wardha Road', 'Khamla', 'Pratapnagar'] },
          { name: 'Nagpur Rural', villages: ['Kapsi', 'Khapri', 'Bela', 'Borgaon', 'Waddhamna', 'Hudkeshwar', 'Wathoda', 'Bhandewadi', 'Tarodi', 'Nagalwadi'] },
          { name: 'Kamptee', villages: ['Kamptee', 'Khadki', 'Bhandara Road', 'Godhani', 'Neri', 'Chinchbhuvan', 'Gondkhairy', 'Hingna', 'Salai Godhani', 'Kuhi'] },
          { name: 'Katol', villages: ['Katol', 'Narkhed', 'Savner', 'Kalmeshwar', 'Parseoni', 'Ramtek', 'Mouda', 'Umred', 'Bhiwapur', 'Kuhi'] },
          { name: 'Umred', villages: ['Umred', 'Kalmeshwar', 'Parseoni', 'Ramtek', 'Mouda', 'Bhiwapur', 'Kuhi', 'Katol', 'Narkhed', 'Savner'] },
          { name: 'Ramtek', villages: ['Ramtek', 'Mouda', 'Parseoni', 'Bhiwapur', 'Kuhi', 'Savner', 'Katol', 'Narkhed', 'Kalmeshwar', 'Umred'] },
        ],
      },
      {
        name: 'Solapur',
        talukas: [
          { name: 'Solapur North', villages: ['Hotgi', 'Bormahal', 'Kurul', 'Shendri', 'Sangavi', 'Vadval', 'Hadalgaon', 'Landewadi', 'Kegaon', 'Akluj'] },
          { name: 'Solapur South', villages: ['Jeur', 'Degaon', 'Shelgi', 'Natepute', 'Velapur', 'Mandrup', 'Karhati', 'Bhigwan', 'Bhalwani', 'Mohol'] },
          { name: 'Barshi', villages: ['Barshi', 'Khupsarwadi', 'Mohol', 'Karmala', 'Madha', 'Akkalkot', 'Pandharpur', 'Sangola', 'Mangalvedhe', 'Malshiras'] },
          { name: 'Pandharpur', villages: ['Pandharpur', 'Sangola', 'Malshiras', 'Mangalvedhe', 'Karmala', 'Madha', 'Mohol', 'Barshi', 'Akkalkot', 'North Solapur'] },
          { name: 'Akkalkot', villages: ['Akkalkot', 'Karmala', 'Madha', 'Mohol', 'Barshi', 'Pandharpur', 'Sangola', 'Malshiras', 'Mangalvedhe', 'North Solapur'] },
          { name: 'Sangola', villages: ['Sangola', 'Pandharpur', 'Malshiras', 'Mangalvedhe', 'Karmala', 'Madha', 'Mohol', 'Barshi', 'Akkalkot', 'North Solapur'] },
        ],
      },
      {
        name: 'Kolhapur',
        talukas: [
          { name: 'Karvir', villages: ['Kolhapur', 'Shiroli', 'Kagal', 'Hatkanangale', 'Jaisingpur', 'Hupari', 'Jaysingpur', 'Kodoli', 'Nipani', 'Sangli'] },
          { name: 'Kagal', villages: ['Kagal', 'Hatkanangale', 'Jaisingpur', 'Hupari', 'Shiroli', 'Ichalkaranji', 'Nandani', 'Nagave', 'Yalgud', 'Bolwad'] },
          { name: 'Hatkanangale', villages: ['Hatkanangale', 'Jaisingpur', 'Hupari', 'Shiroli', 'Kagal', 'Ichalkaranji', 'Nandani', 'Nagave', 'Yalgud', 'Kodoli'] },
          { name: 'Shirol', villages: ['Shirol', 'Kurundwad', 'Jaysingpur', 'Hupari', 'Hatkanangale', 'Kagal', 'Ichalkaranji', 'Bhudargad', 'Gadhinglaj', 'Ajara'] },
          { name: 'Ajara', villages: ['Ajara', 'Gadhinglaj', 'Bhudargad', 'Chandgad', 'Shahuwadi', 'Panhala', 'Radhanagari', 'Bavada', 'Kagal', 'Hatkanangale'] },
          { name: 'Panhala', villages: ['Panhala', 'Radhanagari', 'Shahuwadi', 'Bavada', 'Gaganbawada', 'Karvir', 'Kagal', 'Hatkanangale', 'Shirol', 'Ajara'] },
        ],
      },
      {
        name: 'Sangli',
        talukas: [
          { name: 'Miraj', villages: ['Miraj', 'Sangli', 'Kupwad', 'Vikhale', 'Digraj', 'Mhasve', 'Kavathe Piran', 'Nerla', 'Belanki', 'Shirala'] },
          { name: 'Tasgaon', villages: ['Tasgaon', 'Kavathe Mahankal', 'Atpadi', 'Jat', 'Khanapur', 'Walwa', 'Shirala', 'Palus', 'Kadegaon', 'Miraj'] },
          { name: 'Walwa', villages: ['Walwa', 'Islampur', 'Shirala', 'Palus', 'Kadegaon', 'Miraj', 'Tasgaon', 'Kavathe Mahankal', 'Atpadi', 'Jat'] },
          { name: 'Jat', villages: ['Jat', 'Khanapur', 'Atpadi', 'Kavathe Mahankal', 'Tasgaon', 'Walwa', 'Shirala', 'Palus', 'Kadegaon', 'Miraj'] },
        ],
      },
      {
        name: 'Satara',
        talukas: [
          { name: 'Satara', villages: ['Satara', 'Medha', 'Umbraj', 'Pusegaon', 'Mhaswad', 'Koregaon', 'Khatav', 'Karad', 'Patan', 'Wai'] },
          { name: 'Karad', villages: ['Karad', 'Patan', 'Wai', 'Khandala', 'Mahabaleshwar', 'Javali', 'Koregaon', 'Khatav', 'Mhaswad', 'Man'] },
          { name: 'Wai', villages: ['Wai', 'Patan', 'Khandala', 'Mahabaleshwar', 'Javali', 'Karad', 'Koregaon', 'Khatav', 'Mhaswad', 'Man'] },
          { name: 'Patan', villages: ['Patan', 'Karad', 'Wai', 'Khandala', 'Mahabaleshwar', 'Javali', 'Koregaon', 'Khatav', 'Mhaswad', 'Man'] },
          { name: 'Mahabaleshwar', villages: ['Mahabaleshwar', 'Wai', 'Patan', 'Khandala', 'Javali', 'Karad', 'Koregaon', 'Khatav', 'Mhaswad', 'Man'] },
        ],
      },
      {
        name: 'Thane',
        talukas: [
          { name: 'Thane', villages: ['Thane', 'Ghansoli', 'Airoli', 'Kopar Khairane', 'Vashi', 'Belapur', 'Nerul', 'Panvel', 'Kharghar', 'Kamothe'] },
          { name: 'Kalyan', villages: ['Kalyan', 'Dombivali', 'Ulhasnagar', 'Ambernath', 'Badlapur', 'Titvala', 'Vangani', 'Shahapur', 'Murbad', 'Bhiwandi'] },
          { name: 'Bhiwandi', villages: ['Bhiwandi', 'Kalyan', 'Dombivali', 'Ulhasnagar', 'Ambernath', 'Badlapur', 'Titvala', 'Vangani', 'Shahapur', 'Murbad'] },
          { name: 'Shahapur', villages: ['Shahapur', 'Murbad', 'Bhiwandi', 'Kalyan', 'Ambernath', 'Badlapur', 'Titvala', 'Vangani', 'Dahanu', 'Palghar'] },
          { name: 'Murbad', villages: ['Murbad', 'Shahapur', 'Bhiwandi', 'Kalyan', 'Ambernath', 'Badlapur', 'Titvala', 'Vangani', 'Dahanu', 'Palghar'] },
        ],
      },
      {
        name: 'Ahmednagar',
        talukas: [
          { name: 'Ahmednagar', villages: ['Ahmednagar', 'Bhingar', 'Puntamba', 'Shrirampur', 'Rahuri', 'Newasa', 'Parner', 'Karjat', 'Shevgaon', 'Pathardi'] },
          { name: 'Shrirampur', villages: ['Shrirampur', 'Rahuri', 'Newasa', 'Kopargaon', 'Sangamner', 'Akole', 'Parner', 'Karjat', 'Shevgaon', 'Pathardi'] },
          { name: 'Kopargaon', villages: ['Kopargaon', 'Shirdi', 'Shrirampur', 'Rahuri', 'Newasa', 'Sangamner', 'Akole', 'Parner', 'Karjat', 'Shevgaon'] },
          { name: 'Sangamner', villages: ['Sangamner', 'Akole', 'Parner', 'Kopargaon', 'Shrirampur', 'Rahuri', 'Newasa', 'Karjat', 'Shevgaon', 'Pathardi'] },
          { name: 'Nagar', villages: ['Ahmednagar', 'Bhingar', 'Puntamba', 'Shrirampur', 'Rahuri', 'Newasa', 'Parner', 'Karjat', 'Shevgaon', 'Pathardi'] },
        ],
      },
      {
        name: 'Jalgaon',
        talukas: [
          { name: 'Jalgaon', villages: ['Jalgaon', 'Dharangaon', 'Bhusawal', 'Jamner', 'Yawal', 'Raver', 'Muktainagar', 'Edalabad', 'Bhadgaon', 'Chalisgaon'] },
          { name: 'Bhusawal', villages: ['Bhusawal', 'Jalgaon', 'Dharangaon', 'Jamner', 'Yawal', 'Raver', 'Muktainagar', 'Edalabad', 'Bhadgaon', 'Chalisgaon'] },
          { name: 'Chalisgaon', villages: ['Chalisgaon', 'Bhadgaon', 'Edalabad', 'Muktainagar', 'Raver', 'Yawal', 'Jamner', 'Bhusawal', 'Jalgaon', 'Dharangaon'] },
        ],
      },
      {
        name: 'Latur',
        talukas: [
          { name: 'Latur', villages: ['Latur', 'Ausa', 'Nilanga', 'Udgir', 'Renapur', 'Deoni', 'Jalkot', 'Shirur Anantpal', 'Chakur', 'Ahmadpur'] },
          { name: 'Udgir', villages: ['Udgir', 'Ausa', 'Nilanga', 'Latur', 'Renapur', 'Deoni', 'Jalkot', 'Shirur Anantpal', 'Chakur', 'Ahmadpur'] },
          { name: 'Nilanga', villages: ['Nilanga', 'Ausa', 'Udgir', 'Latur', 'Renapur', 'Deoni', 'Jalkot', 'Shirur Anantpal', 'Chakur', 'Ahmadpur'] },
        ],
      },
      {
        name: 'Nanded',
        talukas: [
          { name: 'Nanded', villages: ['Nanded', 'Ardhapur', 'Naigaon', 'Bhokar', 'Deglur', 'Biloli', 'Mukhed', 'Hadgaon', 'Kinwat', 'Loha'] },
          { name: 'Ardhapur', villages: ['Ardhapur', 'Nanded', 'Naigaon', 'Bhokar', 'Deglur', 'Biloli', 'Mukhed', 'Hadgaon', 'Kinwat', 'Loha'] },
          { name: 'Hadgaon', villages: ['Hadgaon', 'Kinwat', 'Loha', 'Mukhed', 'Nanded', 'Ardhapur', 'Naigaon', 'Bhokar', 'Deglur', 'Biloli'] },
        ],
      },
      {
        name: 'Osmanabad',
        talukas: [
          { name: 'Osmanabad', villages: ['Osmanabad', 'Tuljapur', 'Omerga', 'Washi', 'Paranda', 'Kalamb', 'Bhum', 'Lohara', 'Naldurg', 'Umarga'] },
          { name: 'Tuljapur', villages: ['Tuljapur', 'Osmanabad', 'Omerga', 'Washi', 'Paranda', 'Kalamb', 'Bhum', 'Lohara', 'Naldurg', 'Umarga'] },
        ],
      },
      {
        name: 'Amravati',
        talukas: [
          { name: 'Amravati', villages: ['Amravati', 'Achalpur', 'Daryapur', 'Anjangaon', 'Chandur Bazar', 'Warud', 'Morshi', 'Teosa', 'Bhatkuli', 'Nandgaon Khandeshwar'] },
          { name: 'Achalpur', villages: ['Achalpur', 'Amravati', 'Daryapur', 'Anjangaon', 'Chandur Bazar', 'Warud', 'Morshi', 'Teosa', 'Bhatkuli', 'Nandgaon Khandeshwar'] },
        ],
      },
      {
        name: 'Yavatmal',
        talukas: [
          { name: 'Yavatmal', villages: ['Yavatmal', 'Wani', 'Pusad', 'Umarkhed', 'Mahagaon', 'Kelapur', 'Ralegaon', 'Ghatanji', 'Digras', 'Darwha'] },
          { name: 'Wani', villages: ['Wani', 'Yavatmal', 'Pusad', 'Umarkhed', 'Mahagaon', 'Kelapur', 'Ralegaon', 'Ghatanji', 'Digras', 'Darwha'] },
        ],
      },
      {
        name: 'Buldana',
        talukas: [
          { name: 'Buldana', villages: ['Buldana', 'Malkapur', 'Khamgaon', 'Shegaon', 'Nandura', 'Chikhli', 'Jalgaon Jamod', 'Motala', 'Sindkhed Raja', 'Deulgaon Raja'] },
          { name: 'Malkapur', villages: ['Malkapur', 'Khamgaon', 'Shegaon', 'Nandura', 'Chikhli', 'Buldana', 'Jalgaon Jamod', 'Motala', 'Sindkhed Raja', 'Deulgaon Raja'] },
        ],
      },
      {
        name: 'Washim',
        talukas: [
          { name: 'Washim', villages: ['Washim', 'Risod', 'Manora', 'Karanja', 'Malegaon', 'Mangrulpir', 'Arni', 'Shirpur', 'Pachora', 'Amalner'] },
          { name: 'Risod', villages: ['Risod', 'Washim', 'Manora', 'Karanja', 'Malegaon', 'Mangrulpir', 'Arni', 'Shirpur', 'Pachora', 'Amalner'] },
        ],
      },
      {
        name: 'Hingoli',
        talukas: [
          { name: 'Hingoli', villages: ['Hingoli', 'Basmath', 'Senagonal', 'Aundha Nagnath', 'Sengaon', 'Kalamnuri', 'Nandapur', 'Wanoja', 'Tirveti', 'Kursundi'] },
          { name: 'Basmath', villages: ['Basmath', 'Hingoli', 'Senagonal', 'Aundha Nagnath', 'Sengaon', 'Kalamnuri', 'Nandapur', 'Wanoja', 'Tirveti', 'Kursundi'] },
        ],
      },
      {
        name: 'Parbhani',
        talukas: [
          { name: 'Parbhani', villages: ['Parbhani', 'Selu', 'Jintur', 'Gangakhed', 'Pathri', 'Sonpeth', 'Manwath', 'Purna', 'Palamshrinkhand', 'Pohazari'] },
          { name: 'Gangakhed', villages: ['Gangakhed', 'Selu', 'Jintur', 'Parbhani', 'Pathri', 'Sonpeth', 'Manwath', 'Purna', 'Palamshrinkhand', 'Pohazari'] },
        ],
      },
      {
        name: 'Beed',
        talukas: [
          { name: 'Beed', villages: ['Beed', 'Ambejogai', 'Ashti', 'Dharur', 'Georai', 'Kaij', 'Majalgaon', 'Parli', 'Patoda', 'Shirur Kashti'] },
          { name: 'Ambejogai', villages: ['Ambejogai', 'Beed', 'Ashti', 'Dharur', 'Georai', 'Kaij', 'Majalgaon', 'Parli', 'Patoda', 'Shirur Kashti'] },
        ],
      },
      {
        name: 'Dhule',
        talukas: [
          { name: 'Dhule', villages: ['Dhule', 'Shirpur', 'Shindkheda', 'Sakri', 'Sindkheda', 'Navapur', 'Pimpalner', 'Dondaicha', 'Nardana', 'Songir'] },
          { name: 'Shirpur', villages: ['Shirpur', 'Dhule', 'Shindkheda', 'Sakri', 'Sindkheda', 'Navapur', 'Pimpalner', 'Dondaicha', 'Nardana', 'Songir'] },
        ],
      },
      {
        name: 'Nandurbar',
        talukas: [
          { name: 'Nandurbar', villages: ['Nandurbar', 'Navapur', 'Akkalkuwa', 'Akrani', 'Taloda', 'Shahade', 'Dhadgaon', 'Molgi', 'Ranjali', 'Amali'] },
          { name: 'Navapur', villages: ['Navapur', 'Nandurbar', 'Akkalkuwa', 'Akrani', 'Taloda', 'Shahade', 'Dhadgaon', 'Molgi', 'Ranjali', 'Amali'] },
        ],
      },
      {
        name: 'Raigad',
        talukas: [
          { name: 'Alibag', villages: ['Alibag', 'Panvel', 'Uran', 'Pen', 'Karjat', 'Khopoli', 'Roha', 'Sudhagad', 'Mangaon', 'Tala'] },
          { name: 'Panvel', villages: ['Panvel', 'Alibag', 'Uran', 'Pen', 'Karjat', 'Khopoli', 'Roha', 'Sudhagad', 'Mangaon', 'Tala'] },
        ],
      },
      {
        name: 'Ratnagiri',
        talukas: [
          { name: 'Ratnagiri', villages: ['Ratnagiri', 'Chiplun', 'Guhaghar', 'Dapoli', 'Mandangad', 'Khed', 'Sangameshwar', 'Lanja', 'Rajapur', 'Devrukh'] },
          { name: 'Chiplun', villages: ['Chiplun', 'Ratnagiri', 'Guhaghar', 'Dapoli', 'Mandangad', 'Khed', 'Sangameshwar', 'Lanja', 'Rajapur', 'Devrukh'] },
        ],
      },
      {
        name: 'Sindhudurg',
        talukas: [
          { name: 'Kudal', villages: ['Kudal', 'Kankavli', 'Vaibhavwadi', 'Devgad', 'Malvan', 'Vengurla', 'Dodamarg', 'Sawantwadi', 'Deogad', 'Shiroda'] },
          { name: 'Sawantwadi', villages: ['Sawantwadi', 'Kudal', 'Kankavli', 'Vaibhavwadi', 'Devgad', 'Malvan', 'Vengurla', 'Dodamarg', 'Deogad', 'Shiroda'] },
        ],
      },
      {
        name: 'Wardha',
        talukas: [
          { name: 'Wardha', villages: ['Wardha', 'Hingnaghat', 'Sewagram', 'Arvi', 'Karanja', 'Deoli', 'Samudrapur', 'Pulgaon', 'Anji', 'Babhulgaon'] },
          { name: 'Hinganghat', villages: ['Hinganghat', 'Wardha', 'Sewagram', 'Arvi', 'Karanja', 'Deoli', 'Samudrapur', 'Pulgaon', 'Anji', 'Babhulgaon'] },
        ],
      },
      {
        name: 'Chandrapur',
        talukas: [
          { name: 'Chandrapur', villages: ['Chandrapur', 'Ballarpur', 'Warora', 'Chimur', 'Brahmapuri', 'Mul', 'Bhadravati', 'Nagbhid', 'Sindewahi', 'Gondpipri'] },
          { name: 'Warora', villages: ['Warora', 'Chandrapur', 'Ballarpur', 'Chimur', 'Brahmapuri', 'Mul', 'Bhadravati', 'Nagbhid', 'Sindewahi', 'Gondpipri'] },
        ],
      },
      {
        name: 'Gadchiroli',
        talukas: [
          { name: 'Gadchiroli', villages: ['Gadchiroli', 'Aheri', 'Etapalli', 'Sironcha', 'Dhanora', 'Armori', 'Chamurshi', 'Bhamragad', 'Kurkheda', 'Desaiganj'] },
          { name: 'Aheri', villages: ['Aheri', 'Gadchiroli', 'Etapalli', 'Sironcha', 'Dhanora', 'Armori', 'Chamurshi', 'Bhamragad', 'Kurkheda', 'Desaiganj'] },
        ],
      },
      {
        name: 'Gondia',
        talukas: [
          { name: 'Gondia', villages: ['Gondia', 'Tirora', 'Goregaon', 'Arjuni Morgaon', 'Amgaon', 'Deori', 'Sadak Arjuni', 'Salekasa', 'Bhandara', 'Tumsar'] },
          { name: 'Tirora', villages: ['Tirora', 'Gondia', 'Goregaon', 'Arjuni Morgaon', 'Amgaon', 'Deori', 'Sadak Arjuni', 'Salekasa', 'Bhandara', 'Tumsar'] },
        ],
      },
      {
        name: 'Bhandara',
        talukas: [
          { name: 'Bhandara', villages: ['Bhandara', 'Tumsar', 'Mohadi', 'Sakoli', 'Lakhani', 'Lakhandur', 'Pauni', 'Gondia', 'Tirora', 'Goregaon'] },
          { name: 'Tumsar', villages: ['Tumsar', 'Bhandara', 'Mohadi', 'Sakoli', 'Lakhani', 'Lakhandur', 'Pauni', 'Gondia', 'Tirora', 'Goregaon'] },
        ],
      },
      {
        name: 'Akola',
        talukas: [
          { name: 'Akola', villages: ['Akola', 'Akot', 'Telhara', 'Balapur', 'Patur', 'Murtijapur', 'Barshitakli', 'Washim', 'Manora', 'Risod'] },
          { name: 'Akot', villages: ['Akot', 'Akola', 'Telhara', 'Balapur', 'Patur', 'Murtijapur', 'Barshitakli', 'Washim', 'Manora', 'Risod'] },
        ],
      },
      {
        name: 'Mumbai City',
        talukas: [
          { name: 'Mumbai City', villages: ['Fort', 'Colaba', 'Churchgate', 'Mahim', 'Dadar', 'Matunga', 'Sion', 'Dharavi', 'Bandra', 'Kurla'] },
          { name: 'Mumbai Suburban', villages: ['Andheri', 'Bandra', 'Kandivali', 'Borivali', 'Malad', 'Goregaon', 'Jogeshwari', 'Ghatkopar', 'Mulund', 'Vikhroli'] },
        ],
      },
      {
        name: 'Palghar',
        talukas: [
          { name: 'Palghar', villages: ['Palghar', 'Vasai', 'Virar', 'Nalasopara', 'Boisar', 'Dahanu', 'Talasari', 'Jawhar', 'Mokhada', 'Vikramgad'] },
          { name: 'Vasai', villages: ['Vasai', 'Virar', 'Nalasopara', 'Palghar', 'Boisar', 'Dahanu', 'Talasari', 'Jawhar', 'Mokhada', 'Vikramgad'] },
        ],
      },
    ],
  },
  {
    name: 'Andhra Pradesh',
    districts: [
      { name: 'Visakhapatnam', talukas: [{ name: 'Visakhapatnam', villages: ['Visakhapatnam', 'Gajuwaka', 'Bheemunipatnam', 'Anakapalle', 'Paderu'] }] },
      { name: 'Vijayawada', talukas: [{ name: 'Vijayawada', villages: ['Vijayawada', 'Machilipatnam', 'Gudivada', 'Nuzvid', 'Nandigama'] }] },
      { name: 'Guntur', talukas: [{ name: 'Guntur', villages: ['Guntur', 'Narasaraopet', 'Bapatla', 'Tenali', 'Sattenapalle'] }] },
      { name: 'Tirupati', talukas: [{ name: 'Tirupati', villages: ['Tirupati', 'Chittoor', 'Madanapalle', 'Nagari', 'Puttur'] }] },
      { name: 'Nellore', talukas: [{ name: 'Nellore', villages: ['Nellore', 'Kavali', 'Gudur', 'Rapur', 'Sullurupeta'] }] },
    ],
  },
  {
    name: 'Telangana',
    districts: [
      { name: 'Hyderabad', talukas: [{ name: 'Hyderabad', villages: ['Hyderabad', 'Secunderabad', 'Gachibowli', 'Kukatpally', 'Uppal'] }] },
      { name: 'Warangal', talukas: [{ name: 'Warangal', villages: ['Warangal', 'Hanamkonda', 'Kazipet', 'Geesugonda', 'Parkal'] }] },
      { name: 'Karimnagar', talukas: [{ name: 'Karimnagar', villages: ['Karimnagar', 'Ramagundam', 'Peddapalli', 'Mancherial', 'Nirmal'] }] },
      { name: 'Nizamabad', talukas: [{ name: 'Nizamabad', villages: ['Nizamabad', 'Armoor', 'Bodhan', 'Kamareddy', 'Banswada'] }] },
      { name: 'Khammam', talukas: [{ name: 'Khammam', villages: ['Khammam', 'Kothagudem', 'Palvancha', 'Sattupalle', 'Wyra'] }] },
    ],
  },
  {
    name: 'Karnataka',
    districts: [
      { name: 'Bengaluru Urban', talukas: [{ name: 'Bengaluru', villages: ['Bengaluru', 'Yelahanka', 'Hesaraghatta', 'Krishnarajapuram', 'Anekal'] }] },
      { name: 'Mysuru', talukas: [{ name: 'Mysuru', villages: ['Mysuru', 'Nanjangud', 'T Narasipur', 'Hunsur', 'Periyapatna'] }] },
      { name: 'Belagavi', talukas: [{ name: 'Belagavi', villages: ['Belagavi', 'Khanapur', 'Gokak', 'Chikodi', 'Athani'] }] },
      { name: 'Dharwad', talukas: [{ name: 'Dharwad', villages: ['Dharwad', 'Hubli', 'Kalghatgi', 'Kundgol', 'Navalgund'] }] },
      { name: 'Vijayapura', talukas: [{ name: 'Vijayapura', villages: ['Vijayapura', 'Muddebihal', 'Basavan Bagewadi', 'Sindagi', 'Indi'] }] },
      { name: 'Ballari', talukas: [{ name: 'Ballari', villages: ['Ballari', 'Sandur', 'Siruguppa', 'Hosapete', 'Kudligi'] }] },
      { name: 'Raichur', talukas: [{ name: 'Raichur', villages: ['Raichur', 'Manvi', 'Devadurga', 'Sindhanur', 'Lingasugur'] }] },
      { name: 'Tumakuru', talukas: [{ name: 'Tumakuru', villages: ['Tumakuru', 'Tiptur', 'Sira', 'Gubbi', 'Turuvekere'] }] },
    ],
  },
  {
    name: 'Gujarat',
    districts: [
      { name: 'Ahmedabad', talukas: [{ name: 'Ahmedabad', villages: ['Ahmedabad', 'Dholka', 'Sanand', 'Dhandhuka', 'Bavla'] }] },
      { name: 'Surat', talukas: [{ name: 'Surat', villages: ['Surat', 'Bardoli', 'Mandvi', 'Kamrej', 'Olpad'] }] },
      { name: 'Vadodara', talukas: [{ name: 'Vadodara', villages: ['Vadodara', 'Padra', 'Dabhoi', 'Karjan', 'Savli'] }] },
      { name: 'Rajkot', talukas: [{ name: 'Rajkot', villages: ['Rajkot', 'Gondal', 'Jetpur', 'Upleta', 'Jamkandorna'] }] },
      { name: 'Anand', talukas: [{ name: 'Anand', villages: ['Anand', 'Khambhat', 'Petlad', 'Borsad', 'Umreth'] }] },
      { name: 'Gandhinagar', talukas: [{ name: 'Gandhinagar', villages: ['Gandhinagar', 'Kalol', 'Dehgam', 'Mansa', 'Vijapur'] }] },
      { name: 'Junagadh', talukas: [{ name: 'Junagadh', villages: ['Junagadh', 'Veraval', 'Patan', 'Bhesan', 'Keshod'] }] },
      { name: 'Bhavnagar', talukas: [{ name: 'Bhavnagar', villages: ['Bhavnagar', 'Sihor', 'Ghogha', 'Palitana', 'Gariadhar'] }] },
    ],
  },
  {
    name: 'Rajasthan',
    districts: [
      { name: 'Jaipur', talukas: [{ name: 'Jaipur', villages: ['Jaipur', 'Amer', 'Bassi', 'Chaksu', 'Dudu'] }] },
      { name: 'Jodhpur', talukas: [{ name: 'Jodhpur', villages: ['Jodhpur', 'Osian', 'Luni', 'Phalodi', 'Shergarh'] }] },
      { name: 'Udaipur', talukas: [{ name: 'Udaipur', villages: ['Udaipur', 'Vallabhnagar', 'Salumber', 'Girwa', 'Mavli'] }] },
      { name: 'Kota', talukas: [{ name: 'Kota', villages: ['Kota', 'Baran', 'Pipalda', 'Sangod', 'Ramganj Mandi'] }] },
      { name: 'Ajmer', talukas: [{ name: 'Ajmer', villages: ['Ajmer', 'Pushkar', 'Kishangarh', 'Masuda', 'Jawaja'] }] },
      { name: 'Bikaner', talukas: [{ name: 'Bikaner', villages: ['Bikaner', 'Nokha', 'Dungargarh', 'Lunkaransar', 'Kolayat'] }] },
      { name: 'Alwar', talukas: [{ name: 'Alwar', villages: ['Alwar', 'Bhiwadi', 'Rajgarh', 'Kishangarh Bas', 'Mundawar'] }] },
      { name: 'Sikar', talukas: [{ name: 'Sikar', villages: ['Sikar', 'Fatehpur', 'Sri Madhopur', 'Lachhmangarh', 'Neem Ka Thana'] }] },
    ],
  },
  {
    name: 'Madhya Pradesh',
    districts: [
      { name: 'Indore', talukas: [{ name: 'Indore', villages: ['Indore', 'Mhow', 'Sanwer', 'Depalpur', 'Hatod'] }] },
      { name: 'Bhopal', talukas: [{ name: 'Bhopal', villages: ['Bhopal', 'Berasia', 'Phanda', 'Huzur', 'Mandideep'] }] },
      { name: 'Jabalpur', talukas: [{ name: 'Jabalpur', villages: ['Jabalpur', 'Sihora', 'Panagar', 'Patan', 'Shahpura'] }] },
      { name: 'Gwalior', talukas: [{ name: 'Gwalior', villages: ['Gwalior', 'Bhitarwar', 'Gird', 'Morar', 'Dabra'] }] },
      { name: 'Ujjain', talukas: [{ name: 'Ujjain', villages: ['Ujjain', 'Nagda', 'Mahidpur', 'Tarana', 'Khachrod'] }] },
      { name: 'Ratlam', talukas: [{ name: 'Ratlam', villages: ['Ratlam', 'Jaora', 'Sailana', 'Alot', 'Piploda'] }] },
      { name: 'Dewas', talukas: [{ name: 'Dewas', villages: ['Dewas', 'Tonk Khurd', 'Bagli', 'Khategaon', 'Kannod'] }] },
      { name: 'Sagar', talukas: [{ name: 'Sagar', villages: ['Sagar', 'Banda', 'Rahatgarh', 'Shahgarh', 'Jaisinagar'] }] },
    ],
  },
  {
    name: 'Uttar Pradesh',
    districts: [
      { name: 'Lucknow', talukas: [{ name: 'Lucknow', villages: ['Lucknow', 'Chinhat', 'Sarojini Nagar', 'Malihabad', 'Bakshi Ka Talab'] }] },
      { name: 'Agra', talukas: [{ name: 'Agra', villages: ['Agra', 'Fatehabad', 'Kheragarh', 'Etmadpur', 'Akola'] }] },
      { name: 'Kanpur', talukas: [{ name: 'Kanpur', villages: ['Kanpur', 'Ghatampur', 'Bilhaur', 'Kalyanpur', 'Shivrajpur'] }] },
      { name: 'Varanasi', talukas: [{ name: 'Varanasi', villages: ['Varanasi', 'Pindra', 'Chiraigaon', 'Kashi Vidyapeeth', 'Sevapuri'] }] },
      { name: 'Allahabad', talukas: [{ name: 'Prayagraj', villages: ['Prayagraj', 'Manda', 'Shankargarh', 'Meja', 'Koraon'] }] },
      { name: 'Mathura', talukas: [{ name: 'Mathura', villages: ['Mathura', 'Vrindavan', 'Goverdhan', 'Baldeo', 'Chhata'] }] },
      { name: 'Meerut', talukas: [{ name: 'Meerut', villages: ['Meerut', 'Hapur', 'Sardhana', 'Mawana', 'Kithore'] }] },
      { name: 'Bareilly', talukas: [{ name: 'Bareilly', villages: ['Bareilly', 'Nawabganj', 'Faridpur', 'Meerganj', 'Aonla'] }] },
    ],
  },
  {
    name: 'Punjab',
    districts: [
      { name: 'Amritsar', talukas: [{ name: 'Amritsar', villages: ['Amritsar', 'Ajnala', 'Baba Bakala', 'Rayya', 'Tarsikka'] }] },
      { name: 'Ludhiana', talukas: [{ name: 'Ludhiana', villages: ['Ludhiana', 'Samrala', 'Raikot', 'Machhiwara', 'Khanna'] }] },
      { name: 'Jalandhar', talukas: [{ name: 'Jalandhar', villages: ['Jalandhar', 'Nakodar', 'Shahkot', 'Lohian Khas', 'Phillaur'] }] },
      { name: 'Patiala', talukas: [{ name: 'Patiala', villages: ['Patiala', 'Rajpura', 'Nabha', 'Samana', 'Patran'] }] },
      { name: 'Bathinda', talukas: [{ name: 'Bathinda', villages: ['Bathinda', 'Talwandi Sabo', 'Phul', 'Rampura Phul', 'Maur'] }] },
    ],
  },
  {
    name: 'Haryana',
    districts: [
      { name: 'Gurugram', talukas: [{ name: 'Gurugram', villages: ['Gurugram', 'Badshahpur', 'Pataudi', 'Sohna', 'Farukhnagar'] }] },
      { name: 'Faridabad', talukas: [{ name: 'Faridabad', villages: ['Faridabad', 'Ballabhgarh', 'Tigaon', 'Palwal', 'Hodal'] }] },
      { name: 'Ambala', talukas: [{ name: 'Ambala', villages: ['Ambala', 'Barara', 'Naraingarh', 'Mulana', 'Shahzadpur'] }] },
      { name: 'Hisar', talukas: [{ name: 'Hisar', villages: ['Hisar', 'Hansi', 'Barwala', 'Narnaund', 'Uklana'] }] },
      { name: 'Rohtak', talukas: [{ name: 'Rohtak', villages: ['Rohtak', 'Kalanaur', 'Lakhan Majra', 'Asthal Bohar', 'Sonipat'] }] },
    ],
  },
  {
    name: 'Bihar',
    districts: [
      { name: 'Patna', talukas: [{ name: 'Patna', villages: ['Patna', 'Patna Sahib', 'Bankipur', 'Phulwari', 'Maner'] }] },
      { name: 'Gaya', talukas: [{ name: 'Gaya', villages: ['Gaya', 'Bodh Gaya', 'Sherghati', 'Imamganj', 'Wazirganj'] }] },
      { name: 'Muzaffarpur', talukas: [{ name: 'Muzaffarpur', villages: ['Muzaffarpur', 'Kanti', 'Musahari', 'Sakra', 'Muraul'] }] },
      { name: 'Bhagalpur', talukas: [{ name: 'Bhagalpur', villages: ['Bhagalpur', 'Colgong', 'Sabour', 'Gopalpur', 'Pirpainti'] }] },
      { name: 'Darbhanga', talukas: [{ name: 'Darbhanga', villages: ['Darbhanga', 'Benipur', 'Jale', 'Biraul', 'Keoti'] }] },
    ],
  },
  {
    name: 'West Bengal',
    districts: [
      { name: 'Kolkata', talukas: [{ name: 'Kolkata', villages: ['Kolkata', 'Howrah', 'Salt Lake', 'New Town', 'Rajarhat'] }] },
      { name: 'North 24 Parganas', talukas: [{ name: 'Barasat', villages: ['Barasat', 'Habra', 'Bangaon', 'Basirhat', 'Deganga'] }] },
      { name: 'South 24 Parganas', talukas: [{ name: 'Alipurduar', villages: ['Baruipur', 'Diamond Harbour', 'Kakdwip', 'Namkhana', 'Gosaba'] }] },
      { name: 'Bardhaman', talukas: [{ name: 'Asansol', villages: ['Asansol', 'Durgapur', 'Raniganj', 'Kulti', 'Andal'] }] },
    ],
  },
  {
    name: 'Tamil Nadu',
    districts: [
      { name: 'Chennai', talukas: [{ name: 'Chennai', villages: ['Chennai', 'Ambattur', 'Avadi', 'Tambaram', 'Sholinganallur'] }] },
      { name: 'Coimbatore', talukas: [{ name: 'Coimbatore', villages: ['Coimbatore', 'Mettupalayam', 'Pollachi', 'Valparai', 'Sulur'] }] },
      { name: 'Madurai', talukas: [{ name: 'Madurai', villages: ['Madurai', 'Melur', 'Usilampatti', 'Vadipatti', 'Tirumangalam'] }] },
      { name: 'Salem', talukas: [{ name: 'Salem', villages: ['Salem', 'Omalur', 'Mettur', 'Edapadi', 'Gangavalli'] }] },
      { name: 'Tiruchirapalli', talukas: [{ name: 'Tiruchirapalli', villages: ['Tiruchirapalli', 'Lalgudi', 'Manachanallur', 'Musiri', 'Thottiyam'] }] },
    ],
  },
  {
    name: 'Kerala',
    districts: [
      { name: 'Thiruvananthapuram', talukas: [{ name: 'Thiruvananthapuram', villages: ['Thiruvananthapuram', 'Nedumangad', 'Varkala', 'Attingal', 'Chirayinkeezhu'] }] },
      { name: 'Ernakulam', talukas: [{ name: 'Ernakulam', villages: ['Ernakulam', 'Aluva', 'Kothamangalam', 'Muvattupuzha', 'Paravur'] }] },
      { name: 'Kozhikode', talukas: [{ name: 'Kozhikode', villages: ['Kozhikode', 'Vatakara', 'Koyilandy', 'Quilandy', 'Perambra'] }] },
      { name: 'Thrissur', talukas: [{ name: 'Thrissur', villages: ['Thrissur', 'Chalakudy', 'Kodungallur', 'Chavakkad', 'Kunnamkulam'] }] },
    ],
  },
  {
    name: 'Odisha',
    districts: [
      { name: 'Khurda', talukas: [{ name: 'Khurda', villages: ['Bhubaneswar', 'Khurda', 'Jatani', 'Begunia', 'Bolagarh'] }] },
      { name: 'Cuttack', talukas: [{ name: 'Cuttack', villages: ['Cuttack', 'Athagarh', 'Tigiria', 'Baramba', 'Banki'] }] },
      { name: 'Ganjam', talukas: [{ name: 'Ganjam', villages: ['Berhampur', 'Chhatrapur', 'Aska', 'Bhanjanagar', 'Digapahandi'] }] },
    ],
  },
  {
    name: 'Assam',
    districts: [
      { name: 'Kamrup Metropolitan', talukas: [{ name: 'Guwahati', villages: ['Guwahati', 'Dispur', 'Jalukbari', 'Sonapur', 'North Guwahati'] }] },
      { name: 'Dibrugarh', talukas: [{ name: 'Dibrugarh', villages: ['Dibrugarh', 'Moran', 'Lahowal', 'Khowang', 'Naharkatia'] }] },
      { name: 'Jorhat', talukas: [{ name: 'Jorhat', villages: ['Jorhat', 'Titabar', 'Mariani', 'Golaghat', 'Sibsagar'] }] },
    ],
  },
  {
    name: 'Jharkhand',
    districts: [
      { name: 'Ranchi', talukas: [{ name: 'Ranchi', villages: ['Ranchi', 'Mandar', 'Bundu', 'Tamar', 'Ormanjhi'] }] },
      { name: 'East Singhbhum', talukas: [{ name: 'Dhalbhum', villages: ['Jamshedpur', 'Jugsalai', 'Boram', 'Patamda', 'Potka'] }] },
    ],
  },
  {
    name: 'Chhattisgarh',
    districts: [
      { name: 'Raipur', talukas: [{ name: 'Raipur', villages: ['Raipur', 'Abhanpur', 'Dharsiwa', 'Arang', 'Tilda Newra'] }] },
      { name: 'Durg', talukas: [{ name: 'Durg', villages: ['Durg', 'Bhilai', 'Patan', 'Dhundhi', 'Balod'] }] },
    ],
  },
  {
    name: 'Himachal Pradesh',
    districts: [
      { name: 'Shimla', talukas: [{ name: 'Shimla', villages: ['Shimla', 'Theog', 'Rampur', 'Rohru', 'Chopal'] }] },
      { name: 'Kangra', talukas: [{ name: 'Dharamsala', villages: ['Dharamsala', 'Palampur', 'Baijnath', 'Nurpur', 'Jawali'] }] },
    ],
  },
  {
    name: 'Uttarakhand',
    districts: [
      { name: 'Dehradun', talukas: [{ name: 'Dehradun', villages: ['Dehradun', 'Vikasnagar', 'Doiwala', 'Chakrata', 'Rishikesh'] }] },
      { name: 'Haridwar', talukas: [{ name: 'Haridwar', villages: ['Haridwar', 'Roorkee', 'Laksar', 'Jwalapur', 'Bahadrabad'] }] },
    ],
  },
  {
    name: 'Goa',
    districts: [
      { name: 'North Goa', talukas: [{ name: 'Panaji', villages: ['Panaji', 'Mapusa', 'Calangute', 'Pernem', 'Bicholim'] }] },
      { name: 'South Goa', talukas: [{ name: 'Margao', villages: ['Margao', 'Mormugao', 'Sanvordem', 'Canacona', 'Sanguem'] }] },
    ],
  },
];

// Helper functions
export function getStates(): string[] {
  return INDIA_LOCATIONS.map((s) => s.name);
}

export function getDistricts(stateName: string): string[] {
  const state = INDIA_LOCATIONS.find((s) => s.name === stateName);
  return state ? state.districts.map((d) => d.name) : [];
}

export function getTalukas(stateName: string, districtName: string): string[] {
  const state = INDIA_LOCATIONS.find((s) => s.name === stateName);
  if (!state) return [];
  const district = state.districts.find((d) => d.name === districtName);
  return district ? district.talukas.map((t) => t.name) : [];
}

export function getVillages(stateName: string, districtName: string, talukaName: string): string[] {
  const state = INDIA_LOCATIONS.find((s) => s.name === stateName);
  if (!state) return [];
  const district = state.districts.find((d) => d.name === districtName);
  if (!district) return [];
  const taluka = district.talukas.find((t) => t.name === talukaName);
  return taluka ? taluka.villages : [];
}
