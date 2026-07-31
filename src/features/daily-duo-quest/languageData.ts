export interface LanguageInfo {
  id: string;
  nameEn: string;
  nameDe: string;
  nativeName: string;
  flag: string;
  speakers: string;
  family: string;
  script: string;
  regions: string;
  greeting: {
    phrase: string;
    pronunciation: string;
    translationEn: string;
    translationDe: string;
  };
  essentialPhrases: {
    category: 'greetings' | 'basics' | 'travel' | 'social';
    phrase: string;
    pronunciation: string;
    en: string;
    de: string;
  }[];
  trivia: {
    en: string;
    de: string;
  };
  dailyPhrase: {
    phrase: string;
    pronunciation: string;
    en: string;
    de: string;
    literal: string;
  };
}

export const TOP_33_LANGUAGES: LanguageInfo[] = [
  {
    id: 'english',
    nameEn: 'English',
    nameDe: 'Englisch',
    nativeName: 'English',
    flag: '🇬🇧',
    speakers: '1.45 Billion',
    family: 'Indo-European / Germanic',
    script: 'Latin script',
    regions: 'UK, US, Canada, Australia, Global',
    greeting: {
      phrase: 'Hello! How are you?',
      pronunciation: 'hɛˈloʊ haʊ ɑːr juː',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Good morning', pronunciation: 'ɡʊd ˈmɔːrnɪŋ', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Thank you very much', pronunciation: 'θæŋk juː ˈvɛri mʌtʃ', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Excuse me / Sorry', pronunciation: 'ɪkˈskjuːz mi', en: 'Excuse me', de: 'Entschuldigung' },
      { category: 'travel', phrase: 'Where is the station?', pronunciation: 'wɛər ɪz ðə ˈsteɪʃən', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Nice to meet you', pronunciation: 'naɪs tuː miːt juː', en: 'Nice to meet you', de: 'Schön, dich kennenzulernen' }
    ],
    trivia: {
      en: 'English is the default global lingua franca of modern aviation, science, and computing.',
      de: 'Englisch ist die weltweite Verkehrssprache in Luftfahrt, Wissenschaft und Informatik.'
    },
    dailyPhrase: {
      phrase: 'Break a leg!',
      pronunciation: 'breɪk ə leɡ',
      en: 'Good luck!',
      de: 'Viel Erfolg! / Hals- und Beinbruch!',
      literal: 'Break a leg physically'
    }
  },
  {
    id: 'mandarin',
    nameEn: 'Mandarin Chinese',
    nameDe: 'Mandarin-Chinesisch',
    nativeName: '普通话 (Pǔtōnghuà)',
    flag: '🇨🇳',
    speakers: '1.12 Billion',
    family: 'Sino-Tibetan',
    script: 'Simplified Chinese characters (Hanzi)',
    regions: 'China, Taiwan, Singapore',
    greeting: {
      phrase: '你好！(Nǐ hǎo!)',
      pronunciation: 'nee how',
      translationEn: 'Hello!',
      translationDe: 'Hallo!'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: '早上好 (Zǎoshang hǎo)', pronunciation: 'dzow-shahng how', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: '谢谢 (Xièxie)', pronunciation: 'shyeh-shyeh', en: 'Thank you', de: 'Danke' },
      { category: 'basics', phrase: '对不起 (Duìbuqǐ)', pronunciation: 'dway-boo-chee', en: 'Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: '洗手间在哪里？ (Xǐshǒujiān zài nǎli?)', pronunciation: 'shee-show-jyen dzye nah-lee', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: '很高兴认识你 (Hěn gāoxìng rènshi nǐ)', pronunciation: 'hun gow-shing ren-shee nee', en: 'Nice to meet you', de: 'Freut mich, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Mandarin is a tonal language with 4 main tones. Changing tone changes word meaning completely!',
      de: 'Mandarin ist eine Tonsprache mit 4 Haupttönen. Tonänderungen verändern die Wortbedeutung vollständig!'
    },
    dailyPhrase: {
      phrase: '加油！(Jiāyóu!)',
      pronunciation: 'jyah-yoh',
      en: 'Keep going! / Come on!',
      de: 'Gib dein Bestes! / Weiter so!',
      literal: 'Add oil!'
    }
  },
  {
    id: 'hindi',
    nameEn: 'Hindi',
    nameDe: 'Hindi',
    nativeName: 'हिन्दी (Hindī)',
    flag: '🇮🇳',
    speakers: '602 Million',
    family: 'Indo-European / Indo-Aryan',
    script: 'Devanagari script',
    regions: 'India, Nepal',
    greeting: {
      phrase: 'नमस्ते (Namaste)',
      pronunciation: 'nuh-mus-tay',
      translationEn: 'Greetings / Hello',
      translationDe: 'Hallo / Grüße'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'शुभ प्रभात (Shubh prabhat)', pronunciation: 'shoob pruh-bhaat', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'धन्यवाद (Dhanyavaad)', pronunciation: 'dhun-yuh-vaad', en: 'Thank you', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'क्षमा करें (Kshama karein)', pronunciation: 'kshuh-maa kuh-rain', en: 'Excuse me / Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: 'स्टेशन कहाँ है? (Station kahan hai?)', pronunciation: 'station kuh-haan hai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'आपसे मिलकर खुशी हुई (Aap-se milkar khushi hui)', pronunciation: 'aap-say mil-kar khoo-shee hoo-ee', en: 'Pleased to meet you', de: 'Schön, Sie zu treffen' }
    ],
    trivia: {
      en: 'Hindi shares deep linguistic roots with Sanskrit, European languages, and Persian.',
      de: 'Hindi hat tiefe linguistische Wurzeln im Sanskrit, europäischen Sprachen und Persisch.'
    },
    dailyPhrase: {
      phrase: 'सब ठीक है (Sab theek hai)',
      pronunciation: 'sub theek hai',
      en: 'Everything is fine',
      de: 'Alles ist gut',
      literal: 'All is correct'
    }
  },
  {
    id: 'spanish',
    nameEn: 'Spanish',
    nameDe: 'Spanisch',
    nativeName: 'Español',
    flag: '🇪🇸',
    speakers: '548 Million',
    family: 'Indo-European / Romance',
    script: 'Latin script',
    regions: 'Spain, Latin America, US',
    greeting: {
      phrase: '¡Hola! ¿Cómo estás?',
      pronunciation: 'oh-lah koh-moh ehs-tahs',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Buenos días', pronunciation: 'bweh-nohs dee-ahs', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Muchas gracias', pronunciation: 'moo-chahs grah-syahs', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Por favor', pronunciation: 'pohr fah-vohr', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: '¿Dónde está el baño?', pronunciation: 'dohn-deh ehs-tah el bah-nyoh', en: 'Where is the bathroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: 'Mucho gusto', pronunciation: 'moo-choh goos-toh', en: 'Nice to meet you', de: 'Schön, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Spanish is the official language in 20 countries across Europe and the Americas.',
      de: 'Spanisch ist die Amtssprache in 20 Ländern in Europa und Amerika.'
    },
    dailyPhrase: {
      phrase: 'Paso a paso se llega lejos',
      pronunciation: 'pah-soh ah pah-soh seh yeh-gah leh-hohs',
      en: 'Step by step one goes far',
      de: 'Schritt für Schritt kommt man weit',
      literal: 'Step by step one reaches far'
    }
  },
  {
    id: 'arabic',
    nameEn: 'Modern Standard Arabic',
    nameDe: 'Hocharabisch',
    nativeName: 'العربية (Al-ʿArabiyyah)',
    flag: '🇸🇦',
    speakers: '274 Million',
    family: 'Afroasiatic / Semitic',
    script: 'Arabic abjad (right-to-left)',
    regions: 'Middle East, North Africa',
    greeting: {
      phrase: 'مرحبا! (Marhaban!) / السلام عليكم',
      pronunciation: 'mar-ha-ban / as-sa-laamu alaykum',
      translationEn: 'Hello! / Peace be upon you',
      translationDe: 'Hallo! / Friede sei mit dir'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'صباح الخير (Sabah al-khayr)', pronunciation: 'sa-baah al-khayr', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'شكرا جزيلا (Shukran jazeelan)', pronunciation: 'shoo-kran ja-zee-lan', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'من فضلك (Min fadlik)', pronunciation: 'min fad-lik', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'أين المحطة؟ (Ayna al-mahatta?)', pronunciation: 'ay-na al-ma-hat-ta', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'تشرفت بمعرفتك (Tasharraftu bi-ma‘rifatik)', pronunciation: 'ta-shar-raf-too bi-ma-ri-fa-tik', en: 'Pleased to meet you', de: 'Erfreut, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Arabic words build meaning using 3-letter consonant roots (e.g. K-T-B relates to writing).',
      de: 'Arabische Wörter bauen ihre Bedeutung aus 3-Konsonanten-Wurzeln auf (z. B. K-T-B für Schreiben).'
    },
    dailyPhrase: {
      phrase: 'العلم نور (Al-ʿilmu nūr)',
      pronunciation: 'al-il-moo noor',
      en: 'Knowledge is light',
      de: 'Wissen ist Licht',
      literal: 'Knowledge is light'
    }
  },
  {
    id: 'french',
    nameEn: 'French',
    nameDe: 'Französisch',
    nativeName: 'Français',
    flag: '🇫🇷',
    speakers: '310 Million',
    family: 'Indo-European / Romance',
    script: 'Latin script',
    regions: 'France, Canada, West Africa, Switzerland',
    greeting: {
      phrase: 'Bonjour ! Comment allez-vous ?',
      pronunciation: 'boh-zhoor koh-mahn tah-lay voo',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es Ihnen?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Bonne journée', pronunciation: 'bohn zhoor-nay', en: 'Have a good day', de: 'Einen schönen Tag' },
      { category: 'basics', phrase: 'Merci beaucoup', pronunciation: 'mair-see boh-koo', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'S’il vous plaît', pronunciation: 'seel voo play', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'Où est la gare ?', pronunciation: 'oo eh lah gar', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Enchanté(e)', pronunciation: 'ahn-shahn-tay', en: 'Delighted to meet you', de: 'Sehr erfreut' }
    ],
    trivia: {
      en: 'French is an official language of the United Nations, European Union, and International Olympic Committee.',
      de: 'Französisch ist eine offizielle Sprache der UNO, der EU und des IOC.'
    },
    dailyPhrase: {
      phrase: 'C’est la vie !',
      pronunciation: 'say lah vee',
      en: 'That’s life!',
      de: 'So ist das Leben!',
      literal: 'That is the life'
    }
  },
  {
    id: 'bengali',
    nameEn: 'Bengali',
    nameDe: 'Bengalisch',
    nativeName: 'বাংলা (Bāṅlā)',
    flag: '🇧🇩',
    speakers: '273 Million',
    family: 'Indo-European / Indo-Aryan',
    script: 'Bengali-Assamese script',
    regions: 'Bangladesh, West Bengal (India)',
    greeting: {
      phrase: 'নমস্কার / আসসালামু আলাইকুম (Nomoshkar / Assalamu alaikum)',
      pronunciation: 'noh-mosh-kar',
      translationEn: 'Hello / Greetings',
      translationDe: 'Hallo / Grüße'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'শুভ সকাল (Shubho shokal)', pronunciation: 'shoo-bho sho-kal', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'धन्यवाद (Dhonnobad)', pronunciation: 'dho-nno-bad', en: 'Thank you', de: 'Danke' },
      { category: 'basics', phrase: 'दया करे (Doya kore)', pronunciation: 'doh-ya koh-reh', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'স্টেশন কোথায়? (Station kothay?)', pronunciation: 'station koh-thay', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'আপনার সাথে দেখা হয়ে ভালো লাগলো', pronunciation: 'ap-nar sha-the de-kha ho-ye bha-lo lag-lo', en: 'Nice to meet you', de: 'Nett, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'International Mother Language Day (Feb 21) commemorates the Bengali Language Movement of 1952.',
      de: 'Der Internationale Tag der Muttersprache (21. Feb.) erinnert an die bengalische Sprachbewegung von 1952.'
    },
    dailyPhrase: {
      phrase: 'আস্তে আস্তে সব হয় (Aste aste sob hoy)',
      pronunciation: 'ash-te ash-te sob hoy',
      en: 'Slowly slowly, everything happens',
      de: 'Gut Ding will Weile haben',
      literal: 'Slowly slowly all happens'
    }
  },
  {
    id: 'russian',
    nameEn: 'Russian',
    nameDe: 'Russisch',
    nativeName: 'Русский язык (Russkiy yazyk)',
    flag: '🇷🇺',
    speakers: '255 Million',
    family: 'Indo-European / Slavic',
    script: 'Cyrillic script',
    regions: 'Russia, Central Asia, Eastern Europe',
    greeting: {
      phrase: 'Здравствуйте! (Zdravstvuyte!)',
      pronunciation: 'zdrahv-stvooy-tyeh',
      translationEn: 'Hello! (Formal)',
      translationDe: 'Guten Tag! (Formell)'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Доброе утро (Dobroye utro)', pronunciation: 'doh-broh-yeh oo-troh', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Большое спасибо (Bolshoye spasibo)', pronunciation: 'bahl-shoy-eh spah-see-boh', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Пожалуйста (Pozhaluysta)', pronunciation: 'pah-zhahl-stah', en: 'Please / You’re welcome', de: 'Bitte' },
      { category: 'travel', phrase: 'Где находится станция? (Gde nahoditsya stantsiya?)', pronunciation: 'gdeh nah-kho-deet-syah stahn-tsee-yah', en: 'Where is the station?', de: 'Wo ist die Station?' },
      { category: 'social', phrase: 'Приятно познакомиться (Priyatno poznakomistya)', pronunciation: 'pree-yaht-noh poh-znah-koh-meet-syah', en: 'Pleased to meet you', de: 'Schön, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Russian is one of the six official languages of the UN and mandatory for astronaut training on the ISS.',
      de: 'Russisch ist eine der 6 UN-Amtssprachen und Pflicht für Astronauten auf der ISS.'
    },
    dailyPhrase: {
      phrase: 'Повторение — мать учения (Povtoreniye — mat ucheniya)',
      pronunciation: 'pohv-toh-reh-nee-yeh maht oo-cheh-nee-yah',
      en: 'Repetition is the mother of learning',
      de: 'Wiederholung ist die Mutter der Weisheit',
      literal: 'Repetition is the mother of learning'
    }
  },
  {
    id: 'portuguese',
    nameEn: 'Portuguese',
    nameDe: 'Portugiesisch',
    nativeName: 'Português',
    flag: '🇵🇹',
    speakers: '260 Million',
    family: 'Indo-European / Romance',
    script: 'Latin script',
    regions: 'Brazil, Portugal, Angola, Mozambique',
    greeting: {
      phrase: 'Olá! Como vai?',
      pronunciation: 'oh-lah koh-moo vahy',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht’s?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Bom dia', pronunciation: 'boh-ee dee-ah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Muito obrigado / obrigada', pronunciation: 'mwee-too oh-bree-gah-doo', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Por favor', pronunciation: 'poor fah-voor', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'Onde fica a estação?', pronunciation: 'ohn-dee fee-kah ah es-tah-sah-oo', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Prazer em conhecê-lo(a)', pronunciation: 'prah-zair ehng koh-nyeh-seh-loo', en: 'Nice to meet you', de: 'Freut mich, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Over 80% of native Portuguese speakers live in Brazil, creating a vibrant musical and literary dialect.',
      de: 'Über 80 % der portugiesischen Muttersprachler leben in Brasilien.'
    },
    dailyPhrase: {
      phrase: 'Tudo bem!',
      pronunciation: 'too-doo behng',
      en: 'All good!',
      de: 'Alles gut!',
      literal: 'All well'
    }
  },
  {
    id: 'urdu',
    nameEn: 'Urdu',
    nameDe: 'Urdu',
    nativeName: 'اردو (Urdū)',
    flag: '🇵🇰',
    speakers: '231 Million',
    family: 'Indo-European / Indo-Aryan',
    script: 'Perso-Arabic script (Nastaliq style)',
    regions: 'Pakistan, India',
    greeting: {
      phrase: 'السلام علیکم (Assalamu Alaikum)',
      pronunciation: 'uh-suh-laam-oo uyl-ai-koom',
      translationEn: 'Peace be upon you',
      translationDe: 'Friede sei mit dir'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'صبح بخیر (Subah ba-khair)', pronunciation: 'soo-bah bah-khair', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'بہت شکریہ (Bohat shukriya)', pronunciation: 'boh-hut shoo-kree-yuh', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'برائے مہربانی (Barae meherbani)', pronunciation: 'bah-raay meh-her-baa-nee', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'اسٹیشن کہاں ہے؟ (Station kahan hai?)', pronunciation: 'station kuh-haan hai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'آپ سے مل کر خوشی ہوئی', pronunciation: 'aap say mil kar khoo-shee hoo-ee', en: 'Nice to meet you', de: 'Schön, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Urdu poetry (Ghazal) is famous globally for its melodic rhythm and deep philosophical elegance.',
      de: 'Urdu-Poesie (Ghasel) ist weltweit bekannt für ihre melodische Eleganz.'
    },
    dailyPhrase: {
      phrase: 'خوش آمدید (Khush aamdeed)',
      pronunciation: 'khoosh aam-deed',
      en: 'Welcome',
      de: 'Willkommen',
      literal: 'Happy arrival'
    }
  },
  {
    id: 'indonesian',
    nameEn: 'Indonesian',
    nameDe: 'Indonesisch',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    speakers: '200 Million',
    family: 'Austronesian / Malayo-Polynesian',
    script: 'Latin script',
    regions: 'Indonesia',
    greeting: {
      phrase: 'Halo! Apa kabar?',
      pronunciation: 'ha-lo ah-pa ka-bar',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Selamat pagi', pronunciation: 'seh-lah-mat pah-gee', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Terima kasih banyak', pronunciation: 'teh-ree-mah kah-see bah-nyak', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Sama-sama', pronunciation: 'sah-mah sah-mah', en: 'You’re welcome', de: 'Gerne geschehen' },
      { category: 'travel', phrase: 'Di mana stasiun?', pronunciation: 'dee mah-nah stah-see-oon', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Senang bertemu dengan Anda', pronunciation: 'seh-nang ber-teh-moo deng-an an-dah', en: 'Nice to meet you', de: 'Schön, Sie zu treffen' }
    ],
    trivia: {
      en: 'Indonesian has no grammatical verb tenses, gendered pronouns, or complex noun declensions!',
      de: 'Indonesisch hat keine Zeitformen bei Verben und keine grammatikalischen Geschlechter!'
    },
    dailyPhrase: {
      phrase: 'Sedikit-sedikit, lama-lama menjadi bukit',
      pronunciation: 'seh-dee-kit seh-dee-kit lah-mah lah-mah men-jah-dee boo-kit',
      en: 'Little by little, it becomes a mountain',
      de: 'Kleinvieh macht auch Mist',
      literal: 'Little by little over time becomes a mountain'
    }
  },
  {
    id: 'german',
    nameEn: 'German',
    nameDe: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speakers: '135 Million',
    family: 'Indo-European / Germanic',
    script: 'Latin script (with Ä, Ö, Ü, ß)',
    regions: 'Germany, Austria, Switzerland, Liechtenstein',
    greeting: {
      phrase: 'Hallo! Wie geht es Ihnen?',
      pronunciation: 'hah-loh vee gayt es ee-nen',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es Ihnen?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Guten Morgen', pronunciation: 'goo-ten mor-gen', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Vielen Dank', pronunciation: 'fee-len dank', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Entschuldigung', pronunciation: 'ent-shool-dee-goong', en: 'Excuse me / Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: 'Wo ist der Bahnhof?', pronunciation: 'voh ist dair bahn-hof', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Schön, Sie kennenzulernen', pronunciation: 'shuhn zee ken-nen-tzoo-lair-nen', en: 'Nice to meet you', de: 'Schön, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'German is famous for compound nouns like "Donaudampfschifffahrtsgesellschaftskapitän".',
      de: 'Deutsch ist berühmt für lange Zusammensetzungen wie "Donaudampfschifffahrtsgesellschaftskapitän".'
    },
    dailyPhrase: {
      phrase: 'Übung macht den Meister',
      pronunciation: 'oo-boong makht dain my-stair',
      en: 'Practice makes perfect',
      de: 'Übung macht den Meister',
      literal: 'Practice makes the master'
    }
  },
  {
    id: 'japanese',
    nameEn: 'Japanese',
    nameDe: 'Japanisch',
    nativeName: '日本語 (Nihongo)',
    flag: '🇯🇵',
    speakers: '125 Million',
    family: 'Japonic',
    script: 'Hiragana, Katakana, Kanji',
    regions: 'Japan',
    greeting: {
      phrase: 'こんにちは！ (Konnichiwa!)',
      pronunciation: 'kohn-nee-chee-wah',
      translationEn: 'Hello / Good afternoon',
      translationDe: 'Hallo / Guten Tag'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'おはようございます (Ohayou gozaimasu)', pronunciation: 'oh-hah-yoh go-zah-ee-mahs', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'ありがとうございます (Arigatou gozaimasu)', pronunciation: 'ah-ree-gah-toh go-zah-ee-mahs', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'すみません (Sumimasen)', pronunciation: 'soo-mee-mah-sen', en: 'Excuse me / Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: '駅はどこですか？ (Eki wa doko desu ka?)', pronunciation: 'eh-kee wah doh-koh des kah', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'はじめまして (Hajimemashite)', pronunciation: 'hah-jee-meh-mah-shee-teh', en: 'Nice to meet you', de: 'Schön, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Japanese combines 3 writing systems seamlessly in a single sentence: Hiragana, Katakana, and Kanji.',
      de: 'Japanisch kombiniert 3 Schriftsysteme nahtlos in einem einzigen Satz.'
    },
    dailyPhrase: {
      phrase: '一期一会 (Ichigo ichie)',
      pronunciation: 'ee-chee-go ee-chee-eh',
      en: 'Treasure every unrepeatable encounter',
      de: 'Schätze jeden einmaligen Moment',
      literal: 'One time, one meeting'
    }
  },
  {
    id: 'nigerian_pidgin',
    nameEn: 'Nigerian Pidgin',
    nameDe: 'Nigerianisches Pidgin',
    nativeName: 'Naija / Pidgin',
    flag: '🇳🇬',
    speakers: '120 Million',
    family: 'English-based Creole',
    script: 'Latin script',
    regions: 'Nigeria, West Africa',
    greeting: {
      phrase: 'How far? / How body?',
      pronunciation: 'how far / how boh-dee',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht’s?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Good morning o!', pronunciation: 'good mor-nin oh', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Thank you well well', pronunciation: 'thank you well well', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'No wahala', pronunciation: 'no wah-ha-lah', en: 'No problem', de: 'Kein Problem' },
      { category: 'travel', phrase: 'Where d bus stop dey?', pronunciation: 'where de bus stop dey', en: 'Where is the bus stop?', de: 'Wo ist die Bushaltestelle?' },
      { category: 'social', phrase: 'I dey happy to see you', pronunciation: 'ee dey hap-py to see you', en: 'Pleased to meet you', de: 'Schön, dich zu sehen' }
    ],
    trivia: {
      en: 'Nigerian Pidgin is a vibrant lingua franca connecting over 250 ethnic groups across West Africa.',
      de: 'Nigerianisches Pidgin verbindet über 250 ethnische Gruppen in Westafrika.'
    },
    dailyPhrase: {
      phrase: 'No condition is permanent',
      pronunciation: 'no con-di-shon is per-ma-nent',
      en: 'Things will change for the better',
      de: 'Alles verändert sich mit der Zeit',
      literal: 'No condition is permanent'
    }
  },
  {
    id: 'marathi',
    nameEn: 'Marathi',
    nameDe: 'Marathi',
    nativeName: 'मराठी (Marāṭhī)',
    flag: '🇮🇳',
    speakers: '99 Million',
    family: 'Indo-European / Indo-Aryan',
    script: 'Devanagari script',
    regions: 'Maharashtra (India / Mumbai)',
    greeting: {
      phrase: 'नमस्कार! (Namaskar!)',
      pronunciation: 'nuh-mus-kaar',
      translationEn: 'Greetings / Hello',
      translationDe: 'Hallo / Grüße'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'शुभ सकाळ (Shubh sakaal)', pronunciation: 'shoob suh-kaal', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'धन्यवाद (Dhanyavaad)', pronunciation: 'dhun-yuh-vaad', en: 'Thank you', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'कृपया (Krupaya)', pronunciation: 'kroo-puh-yaa', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'स्टेशन कुठे आहे? (Station kuthe aahe?)', pronunciation: 'station koo-they aa-hey', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'तुम्हाला भेटून आनंद झाला', pronunciation: 'toom-haa-laa bhe-toon aa-nund zhaa-laa', en: 'Nice to meet you', de: 'Freut mich, Sie zu treffen' }
    ],
    trivia: {
      en: 'Marathi has one of the oldest literatures among modern Indo-Aryan languages, dating back over 1000 years.',
      de: 'Marathi besitzt eine der ältesten Literaturen unter den indoarischen Sprachen (über 1000 Jahre).'
    },
    dailyPhrase: {
      phrase: 'प्रयत्नांती परमेश्वर (Prayatnaanti Parameshwar)',
      pronunciation: 'pruh-yut-naan-tee puh-rum-esh-wur',
      en: 'Through perseverance one reaches success',
      de: 'Durch Ausdauer erreicht man das Ziel',
      literal: 'At the end of effort is God'
    }
  },
  {
    id: 'telugu',
    nameEn: 'Telugu',
    nameDe: 'Telugu',
    nativeName: 'తెలుగు (Telugu)',
    flag: '🇮🇳',
    speakers: '96 Million',
    family: 'Dravidian',
    script: 'Telugu script',
    regions: 'Andhra Pradesh, Telangana (India)',
    greeting: {
      phrase: 'నమస్కారం! (Namaskaram!)',
      pronunciation: 'nuh-mus-kaa-rum',
      translationEn: 'Greetings / Hello',
      translationDe: 'Hallo / Grüße'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'శుభోదయం (Shubhodayam)', pronunciation: 'shoo-bho-duh-yum', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'ధన్యవాదాలు (Dhanyavadalu)', pronunciation: 'dhun-yuh-vaa-daa-loo', en: 'Thank you', de: 'Dankeschön' },
      { category: 'basics', phrase: 'దయచేసి (Dayachesi)', pronunciation: 'duh-yuh-chay-see', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'స్టేషన్ ఎక్కడ ఉంది? (Station ekkada undi?)', pronunciation: 'station ek-kuh-duh oon-dee', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'మిమ్మల్ని కలవడం సంతోషంగా ఉంది', pronunciation: 'mim-mul-nee kul-vuh-dum sun-toh-shung-gaa oon-dee', en: 'Pleased to meet you', de: 'Freut mich, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Telugu was nicknamed "Italian of the East" by 19th-century explorers because every word ends in a vowel.',
      de: 'Telugu wurde "Italienisch des Ostens" genannt, weil jedes Wort auf einen Vokal endet.'
    },
    dailyPhrase: {
      phrase: 'కృషితో నాస్తి దుర్భオブジェクト (Krushitho nasti durbhiksham)',
      pronunciation: 'kroo-shee-tho naas-tee door-bheek-shum',
      en: 'Hard work removes all hardship',
      de: 'Harte Arbeit überwindet alle Not',
      literal: 'With effort there is no famine'
    }
  },
  {
    id: 'turkish',
    nameEn: 'Turkish',
    nameDe: 'Türkisch',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    speakers: '88 Million',
    family: 'Turkic',
    script: 'Latin script',
    regions: 'Turkey, Northern Cyprus',
    greeting: {
      phrase: 'Merhaba! Nasılsınız?',
      pronunciation: 'mair-hah-bah nah-suhl-suh-nuhz',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es Ihnen?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Günaydın', pronunciation: 'goo-nahy-duhn', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Teşekkür ederim', pronunciation: 'teh-shehk-kyoor eh-deh-reem', en: 'Thank you', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Lütfen', pronunciation: 'loot-fen', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'İstasyon nerede?', pronunciation: 'ees-tahs-yohn neh-reh-deh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Tanıştığıma memnun oldum', pronunciation: 'tah-nuhsh-tuh-ghuh-mah mehm-noon ohl-doom', en: 'Nice to meet you', de: 'Schön, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Turkish uses agglutination — suffixing words to build complex meanings like "Afyonkarahisarlılaştırabildiklerimizdenmişsinizcesine".',
      de: 'Türkisch ist eine agglutinierende Sprache, die Endungen aneinanderfügt.'
    },
    dailyPhrase: {
      phrase: 'Damlaya damlaya göl olur',
      pronunciation: 'dahm-lah-yah dahm-lah-yah guhl oh-loor',
      en: 'Drop by drop a lake is formed',
      de: 'Steter Tropfen höhlt den Stein',
      literal: 'Drop by drop becomes a lake'
    }
  },
  {
    id: 'tamil',
    nameEn: 'Tamil',
    nameDe: 'Tamil',
    nativeName: 'தமிழ் (Tamiḻ)',
    flag: '🇮🇳',
    speakers: '86 Million',
    family: 'Dravidian',
    script: 'Tamil script',
    regions: 'Tamil Nadu (India), Sri Lanka, Singapore',
    greeting: {
      phrase: 'வணக்கம்! (Vanakkam!)',
      pronunciation: 'va-nak-kam',
      translationEn: 'Greetings / Hello',
      translationDe: 'Hallo / Grüße'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'காலை வணக்கம் (Kaalai vanakkam)', pronunciation: 'kaa-lai va-nak-kam', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'மிக்க நன்றி (Mikka nandri)', pronunciation: 'mik-ka nan-dri', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'தயவுசெய்து (Dhayavu seythu)', pronunciation: 'dha-ya-vu sey-thu', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'நிலையம் எங்கே? (Nilaiyam enge?)', pronunciation: 'ni-lai-yam en-ge', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'உங்களை சந்தித்ததில் மகிழ்ச்சி', pronunciation: 'ung-ga-lai san-dhit-tha-dhil ma-gizh-chi', en: 'Nice to meet you', de: 'Freut mich, Sie zu treffen' }
    ],
    trivia: {
      en: 'Tamil is recognized as one of the world’s longest-surviving classical languages, with literature over 2,000 years old.',
      de: 'Tamil gilt als eine der ältesten durchgehend gesprochenen klassischen Sprachen der Welt.'
    },
    dailyPhrase: {
      phrase: 'Muyaṟci thiruvinaiyaakkum (முயற்சி திருவினையாக்கும்)',
      pronunciation: 'moo-yar-chi thi-ru-vi-nai-yaa-kkum',
      en: 'Effort brings prosperity',
      de: 'Anstrengung bringt Erfolg',
      literal: 'Effort creates divine wealth'
    }
  },
  {
    id: 'cantonese',
    nameEn: 'Cantonese',
    nameDe: 'Kantonesisch',
    nativeName: '粵語 (Jyutjyu)',
    flag: '🇭🇰',
    speakers: '86 Million',
    family: 'Sino-Tibetan',
    script: 'Traditional Chinese characters',
    regions: 'Hong Kong, Macau, Guangdong (China)',
    greeting: {
      phrase: '你好！(Nei5 hou2!)',
      pronunciation: 'nay how',
      translationEn: 'Hello!',
      translationDe: 'Hallo!'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: '早晨 (Zou2 san4)', pronunciation: 'zoh sun', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: '多謝 (Do1 ze6)', pronunciation: 'dor jeh', en: 'Thank you (for gifts/help)', de: 'Vielen Dank' },
      { category: 'basics', phrase: '唔該 (M4 goi1)', pronunciation: 'mm goy', en: 'Please / Thank you (for service)', de: 'Bitte / Danke' },
      { category: 'travel', phrase: '洗手間喺邊度？ (Sai2 sau2 gaan1 hai2 bin1 dou6?)', pronunciation: 'sy-saw-kaan hy bin-too', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: '好高興認識你 (Hou2 gou1 hing3 jing6 sik1 nei5)', pronunciation: 'how ko-hing ying-sik nay', en: 'Nice to meet you', de: 'Freut mich, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Cantonese preserves 6 to 9 distinct tones, keeping ancient Middle Chinese pronunciations alive.',
      de: 'Kantonesisch bewahrt 6 bis 9 Töne und alte mittelchinesische Aussprachen.'
    },
    dailyPhrase: {
      phrase: '飲茶 (Jam2 caa4)',
      pronunciation: 'yum cha',
      en: 'Enjoy tea and Dim Sum together!',
      de: 'Tee trinken & Dim Sum genießen!',
      literal: 'Drink tea'
    }
  },
  {
    id: 'vietnamese',
    nameEn: 'Vietnamese',
    nameDe: 'Vietnamesisch',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    speakers: '85 Million',
    family: 'Austroasiatic',
    script: 'Latin script (Chữ Quốc ngữ with diacritics)',
    regions: 'Vietnam',
    greeting: {
      phrase: 'Xin chào! Bạn có khỏe không?',
      pronunciation: 'seen chow ban kaw khweh khawng',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Chào buổi sáng', pronunciation: 'chow booy sahng', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Cảm ơn nhiều', pronunciation: 'kahm uhn nyew', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Xin lỗi', pronunciation: 'seen loy', en: 'Excuse me / Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: 'Nhà vệ sinh ở đâu?', pronunciation: 'nyah veh seen uh dow', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: 'Rất vui được gặp bạn', pronunciation: 'rut vooy doo-uhk gap ban', en: 'Nice to meet you', de: 'Schön, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Vietnamese uses 6 distinct tones indicated by tone marks placed above or below vowels.',
      de: 'Vietnamesisch nutzt 6 Töne, die durch Tonzeichen über oder unter Vokalen angezeigt werden.'
    },
    dailyPhrase: {
      phrase: 'Có công mài sắt, có ngày nên kim',
      pronunciation: 'kaw kawng my sut kaw ngay nen keem',
      en: 'With effort, grinding iron turns into a needle (Perseverance pays off)',
      de: 'Geduld bringt Rosen',
      literal: 'Work at grinding iron, one day it becomes a needle'
    }
  },
  {
    id: 'tagalog',
    nameEn: 'Tagalog / Filipino',
    nameDe: 'Tagalog / Filipino',
    nativeName: 'Wikang Tagalog',
    flag: '🇵🇭',
    speakers: '82 Million',
    family: 'Austronesian / Malayo-Polynesian',
    script: 'Latin script',
    regions: 'Philippines',
    greeting: {
      phrase: 'Kamusta ka?',
      pronunciation: 'kah-moos-tah kah',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Magandang umaga', pronunciation: 'mah-gahn-dahng oo-mah-gah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Maraming salamat', pronunciation: 'mah-rah-meeng sah-lah-mat', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Pakiusap', pronunciation: 'pah-kee-oo-sahp', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'Nasaan ang banyo?', pronunciation: 'nah-sah-ahn ahng bahn-yoh', en: 'Where is the bathroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: 'Ikinagagalak kong makilala ka', pronunciation: 'ee-kee-nah-gah-gah-lahk kohng mah-kee-lah-lah kah', en: 'Pleased to meet you', de: 'Schön, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Tagalog has incorporated loanwords from Spanish, English, Malay, and Chinese over centuries of trade.',
      de: 'Tagalog enthält Lehnwörter aus dem Spanischen, Englischen, Malaiischen und Chinesischen.'
    },
    dailyPhrase: {
      phrase: 'Habang may buhay, may pag-asa',
      pronunciation: 'hah-bahng my boo-hay my pahg-ah-sah',
      en: 'While there is life, there is hope',
      de: 'Solange es Leben gibt, gibt es Hoffnung',
      literal: 'While there is life there is hope'
    }
  },
  {
    id: 'punjabi',
    nameEn: 'Punjabi',
    nameDe: 'Pandschabi',
    nativeName: 'ਪੰਜਾਬੀ / پنجابی',
    flag: '🇵🇰',
    speakers: '113 Million',
    family: 'Indo-European / Indo-Aryan',
    script: 'Gurmukhi (India) / Shahmukhi (Pakistan)',
    regions: 'Punjab (Pakistan & India), Canada, UK',
    greeting: {
      phrase: 'सत श्री अकाल / సత్ శ్రీ అకాల్ (Sat Sri Akaal)',
      pronunciation: 'sut sree uh-kaal',
      translationEn: 'God is Eternal Truth / Hello',
      translationDe: 'Gott ist ewige Wahrheit / Hallo'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'ਚੰਗਾ ਦਿਨ (Changa din)', pronunciation: 'chun-gaa din', en: 'Good day', de: 'Guten Tag' },
      { category: 'basics', phrase: 'ਬਹੁਤ ਧੰਨਵਾਦ (Bohat dhanvaad)', pronunciation: 'boh-hut dhun-vaad', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'ਕਿਰਪਾ ਕਰਕੇ (Kirpa karke)', pronunciation: 'keer-paa kar-kay', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ? (Station kitthe hai?)', pronunciation: 'station kit-the hai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ', pronunciation: 'too-haa-noo mil kay khoo-shee ho-ee', en: 'Nice to meet you', de: 'Schön, Sie zu treffen' }
    ],
    trivia: {
      en: 'Punjabi is a tonal Indo-European language, using pitch accents to distinguish meanings.',
      de: 'Pandschabi ist eine tonale indogermanische Sprache.'
    },
    dailyPhrase: {
      phrase: 'Chardi Kala (ਚੜ੍ਹਦੀ ਕਲਾ)',
      pronunciation: 'char-dee ku-laa',
      en: 'Ever-rising high spirits & optimism',
      de: 'Unerschütterlicher Optimismus',
      literal: 'Rising spirits'
    }
  },
  {
    id: 'wu_chinese',
    nameEn: 'Wu Chinese (Shanghainese)',
    nameDe: 'Wu-Chinesisch (Shanghaiesisch)',
    nativeName: '吴语 (Wúyǔ) / 沪语',
    flag: '🇨🇳',
    speakers: '82 Million',
    family: 'Sino-Tibetan',
    script: 'Simplified Chinese characters',
    regions: 'Shanghai, Zhejiang, Jiangsu (China)',
    greeting: {
      phrase: '侬好！(Nung ho!)',
      pronunciation: 'noong ho',
      translationEn: 'Hello!',
      translationDe: 'Hallo!'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: '早晨好 (Tza zang ho)', pronunciation: 'tza zahng ho', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: '谢谢侬 (Zhe zhe nung)', pronunciation: 'zhay zhay noong', en: 'Thank you', de: 'Danke' },
      { category: 'basics', phrase: '对勿起 (Tseh veh chi)', pronunciation: 'tseh veh chee', en: 'Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: '坑厕勒拉哪里？(Khang tshe leh la na li?)', pronunciation: 'khang tsheh leh lah nah lee', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: '欢喜认识侬 (Hoe shi zhen shi nung)', pronunciation: 'hoe shee zhen shee noong', en: 'Pleased to meet you', de: 'Freut mich, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Shanghainese is famed for its soft, melodic tone sandhi and distinct vowel sounds.',
      de: 'Shanghaiesisch ist berühmt für seine weiche, melodische Aussprache.'
    },
    dailyPhrase: {
      phrase: '慢慢来 (Man man lae)',
      pronunciation: 'mahn mahn lay',
      en: 'Take it easy / Take your time',
      de: 'Immer mit der Ruhe',
      literal: 'Come slowly'
    }
  },
  {
    id: 'korean',
    nameEn: 'Korean',
    nameDe: 'Koreanisch',
    nativeName: '한국어 (Hangugeo)',
    flag: '🇰🇷',
    speakers: '81 Million',
    family: 'Koreanic',
    script: 'Hangul alphabet',
    regions: 'South Korea, North Korea',
    greeting: {
      phrase: '안녕하세요! (Annyeonghaseyo!)',
      pronunciation: 'ahn-nyeong-hah-seh-yoh',
      translationEn: 'Hello! (Polite)',
      translationDe: 'Hallo! (Höflich)'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: '좋은 아침입니다 (Joheun achimimnida)', pronunciation: 'joh-eun ah-cheem-eem-nee-dah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: '감사합니다 (Gamsahamnida)', pronunciation: 'gahm-sah-hahm-nee-dah', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: '죄송합니다 (Joesonghamnida)', pronunciation: 'chweh-sohng-hahm-nee-dah', en: 'I am sorry', de: 'Es tut mir leid' },
      { category: 'travel', phrase: '화장실이 어디예요? (Hwajangsiri eodiyeyo?)', pronunciation: 'hwah-jahng-sheer-ee oh-dee-yeh-yoh', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', phrase: '만나서 반갑습니다 (Mannaseo bangapsemnida)', pronunciation: 'mahn-nah-seh-oh bahn-gahp-sehm-nee-dah', en: 'Nice to meet you', de: 'Schön, Sie zu treffen' }
    ],
    trivia: {
      en: 'Hangul was scientificially created in 1443 by King Sejong to mimic the shape of vocal organs during speech!',
      de: 'Hangul wurde 1443 von König Sejong wissenschaftlich entwickelt, um Sprechorgane nachzubilden.'
    },
    dailyPhrase: {
      phrase: '파이팅! (Fighting!) / 화이팅!',
      pronunciation: 'hwah-ee-teeng',
      en: 'You can do it! / Cheer up!',
      de: 'Viel Erfolg! / Weiter so!',
      literal: 'Fighting!'
    }
  },
  {
    id: 'persian',
    nameEn: 'Persian (Farsi)',
    nameDe: 'Persisch (Farsi)',
    nativeName: 'فارسی (Fārsī)',
    flag: '🇮🇷',
    speakers: '77 Million',
    family: 'Indo-European / Indo-Iranian',
    script: 'Perso-Arabic script',
    regions: 'Iran, Afghanistan (Dari), Tajikistan (Tajik)',
    greeting: {
      phrase: 'سلام! حال شما چطوره؟ (Salām! Hāl-e shomā chetore?)',
      pronunciation: 'sah-laam haal-eh shoh-maa cheh-toh-reh',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es Ihnen?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'صبح بخیر (Sobh bekheyr)', pronunciation: 'sobh beh-kheyr', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'خیلی ممنون (Kheyli mamnoon)', pronunciation: 'khey-lee mahm-noon', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'لطفا (Lotfan)', pronunciation: 'loht-fahn', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'ایستگاه کجاست؟ (Istgah kojast?)', pronunciation: 'ees-gaah koh-jahst', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'از دیدن شما خوشبختم (Az didan-e shoma khoshbakhtam)', pronunciation: 'az dee-dan-eh shoh-maa khohsh-bahkht-am', en: 'Nice to meet you', de: 'Erfreut, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Persian poetry by Rumi, Hafez, and Saadi has inspired universal classical literature for over a millennium.',
      de: 'Persische Poesie von Rumi und Hafez inspiriert die Weltliteratur seit über 1000 Jahren.'
    },
    dailyPhrase: {
      phrase: 'خسته نباشید (Khaste nabashid)',
      pronunciation: 'khas-teh nah-baa-sheed',
      en: 'May you not be tired (Polite appreciation of someone’s work)',
      de: 'Mögest du nicht ermüden (Anerkennung für Arbeit)',
      literal: 'Don’t be tired'
    }
  },
  {
    id: 'hausa',
    nameEn: 'Hausa',
    nameDe: 'Hausa',
    nativeName: 'Harshen Hausa / هَوُسَ',
    flag: '🇳🇬',
    speakers: '77 Million',
    family: 'Afroasiatic / Chadic',
    script: 'Latin script (Boko) / Arabic script (Ajami)',
    regions: 'Nigeria, Niger, West Africa',
    greeting: {
      phrase: 'Sannu! Ina kwana?',
      pronunciation: 'sahn-noo ee-nah kwah-nah',
      translationEn: 'Hello! How are you this morning?',
      translationDe: 'Hallo! Wie geht es dir heute Morgen?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Ina kwana', pronunciation: 'ee-nah kwah-nah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Nagode kwarai', pronunciation: 'nah-goh-deh kwah-ray', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Don Allah', pronunciation: 'dohn ahl-lah', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'Ina ne tashar?', pronunciation: 'ee-nah neh tah-shar', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Naji dadin saduwa da kai', pronunciation: 'nah-jee dah-deen sah-doo-wah dah kay', en: 'Nice to meet you', de: 'Schön, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Hausa is the primary trade language spoken across sub-Saharan West Africa.',
      de: 'Hausa ist die primäre Handelssprache in Westafrika südlich der Sahara.'
    },
    dailyPhrase: {
      phrase: 'Sannu sannu bata hana zuwa',
      pronunciation: 'sahn-noo sahn-noo bah-tah hah-nah zoo-wah',
      en: 'Slow progress doesn’t stop you from reaching your destination',
      de: 'Langsamer Fortschritt führt auch zum Ziel',
      literal: 'Slowly slowly doesn’t prevent arrival'
    }
  },
  {
    id: 'javanese',
    nameEn: 'Javanese',
    nameDe: 'Javanisch',
    nativeName: 'Basa Jawa / ꦧꦱꦗꦮ',
    flag: '🇮🇩',
    speakers: '68 Million',
    family: 'Austronesian / Malayo-Polynesian',
    script: 'Latin script / Hanacaraka script',
    regions: 'Java (Indonesia)',
    greeting: {
      phrase: 'Sugeng enjang! Piye kabare?',
      pronunciation: 'soo-geng en-jahng pee-yeh kah-bah-reh',
      translationEn: 'Good morning! How are you?',
      translationDe: 'Guten Morgen! Wie geht’s?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Sugeng enjang', pronunciation: 'soo-geng en-jahng', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Matur nuwun sanget', pronunciation: 'mah-toor noo-woon sah-nget', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Nyuwun sewu', pronunciation: 'nyoo-woon seh-woo', en: 'Excuse me', de: 'Entschuldigung' },
      { category: 'travel', phrase: 'Stasiun wonten pundi?', pronunciation: 'stah-see-oon won-ten poon-dee', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Remen kepanggih sampeyan', pronunciation: 'reh-men keh-pahng-geeh sam-peh-yan', en: 'Nice to meet you', de: 'Schön, Sie zu treffen' }
    ],
    trivia: {
      en: 'Javanese uses distinct honorific speech levels (Ngoko, Krama, Krama Inggil) depending on social context.',
      de: 'Javanisch nutzt je nach sozialem Kontext verschiedene Höflichkeitsstufen (Ngoko, Krama).'
    },
    dailyPhrase: {
      phrase: 'Alon-alon asal kelakon',
      pronunciation: 'ah-lon ah-lon ah-sal keh-lah-kon',
      en: 'Slowly but surely done',
      de: 'Langsam aber sicher ins Ziel',
      literal: 'Slowly as long as accomplished'
    }
  },
  {
    id: 'italian',
    nameEn: 'Italian',
    nameDe: 'Italienisch',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    speakers: '67 Million',
    family: 'Indo-European / Romance',
    script: 'Latin script',
    regions: 'Italy, Switzerland, San Marino',
    greeting: {
      phrase: 'Ciao! Come stai?',
      pronunciation: 'chow koh-meh sty',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'Buongiorno', pronunciation: 'bwon-zhor-noh', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'Grazie mille', pronunciation: 'graht-zyeh meel-leh', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'Per favore', pronunciation: 'pair fah-voh-reh', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'Dov’è la stazione?', pronunciation: 'doh-veh lah stah-tsyoh-neh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'Piacere di conoscerti', pronunciation: 'pyah-cheh-reh dee koh-noh-shair-tee', en: 'Nice to meet you', de: 'Freut mich, dich kennenzulernen' }
    ],
    trivia: {
      en: 'Italian is the international language of music scores (Allegro, Crescendo, Piano, Forte).',
      de: 'Italienisch ist die internationale Sprache der Musiknotation (Allegro, Crescendo, Forte).'
    },
    dailyPhrase: {
      phrase: 'La dolce vita',
      pronunciation: 'lah dohl-cheh vee-tah',
      en: 'The sweet life',
      de: 'Das süße Leben',
      literal: 'The sweet life'
    }
  },
  {
    id: 'egyptian_arabic',
    nameEn: 'Egyptian Arabic',
    nameDe: 'Ägyptisch-Arabisch',
    nativeName: 'عامية مصري (ʿĀmmiyya Maṣriyya)',
    flag: '🇪🇬',
    speakers: '75 Million',
    family: 'Afroasiatic / Semitic',
    script: 'Arabic script',
    regions: 'Egypt',
    greeting: {
      phrase: 'إزيك؟ (Izayyak?) / إزيكِ؟ (Izayyik?)',
      pronunciation: 'iz-zay-yak / iz-zay-yik',
      translationEn: 'How are you?',
      translationDe: 'Wie geht’s dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'صباح الخير (Sabah el-kheer)', pronunciation: 'sa-baah el-kheer', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'شكراً أوي (Shukran awi)', pronunciation: 'shook-ran ah-wee', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'من فضلك (Min fadlak)', pronunciation: 'min fad-lak', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'فين المحطة؟ (Feen el-mahatta?)', pronunciation: 'feen el-ma-hat-ta', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'فرصة سعيدة (Forsa sa‘eeda)', pronunciation: 'for-sa sa-ee-da', en: 'Pleased to meet you', de: 'Freut mich sehr' }
    ],
    trivia: {
      en: 'Egyptian Arabic is understood across the entire Arab world thanks to Egypt’s cinema and music heritage.',
      de: 'Ägyptisches Arabisch ist dank Ägyptens Filmen und Musik in der gesamten arabischen Welt verständlich.'
    },
    dailyPhrase: {
      phrase: 'کله تمام (Kullo tamam)',
      pronunciation: 'kool-loh ta-maam',
      en: 'Everything is great / all good',
      de: 'Alles bestens',
      literal: 'All complete'
    }
  },
  {
    id: 'gujarati',
    nameEn: 'Gujarati',
    nameDe: 'Gujarati',
    nativeName: 'ગુજરાતી (Gujarātī)',
    flag: '🇮🇳',
    speakers: '62 Million',
    family: 'Indo-European / Indo-Aryan',
    script: 'Gujarati script',
    regions: 'Gujarat (India), UK, East Africa, US',
    greeting: {
      phrase: 'કેમ છો? (Kem cho?)',
      pronunciation: 'kem choh',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht’s?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'સુપ્રભાત (Suprabhat)', pronunciation: 'soo-pruh-bhaat', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'ખૂબ ખૂબ આભાર (Khoob khoob aabhar)', pronunciation: 'khoob khoob aa-bhaar', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'મહેરબાની કરીને (Maherbani karine)', pronunciation: 'muh-her-baa-nee kuh-ree-ney', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'સ્ટેશન ક્યાં છે? (Station kyan che?)', pronunciation: 'station kyaan cheh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'તમને મળીને આનંદ થયો', pronunciation: 'tum-ney muh-ree-ney aa-nund thuh-yoh', en: 'Pleased to meet you', de: 'Schön, Sie zu treffen' }
    ],
    trivia: {
      en: 'Gujarati was the mother tongue of Mahatma Gandhi and Sardar Vallabhbhai Patel.',
      de: 'Gujarati war die Muttersprache von Mahatma Gandhi.'
    },
    dailyPhrase: {
      phrase: 'આવજો (Aavjo)',
      pronunciation: 'aav-joh',
      en: 'Goodbye! (Come again soon)',
      de: 'Auf Wiedersehen! (Komm bald wieder)',
      literal: 'Come again'
    }
  },
  {
    id: 'thai',
    nameEn: 'Thai',
    nameDe: 'Thailändisch',
    nativeName: 'ภาษาไทย (Phasa Thai)',
    flag: '🇹🇭',
    speakers: '61 Million',
    family: 'Kra-Dai',
    script: 'Thai script',
    regions: 'Thailand',
    greeting: {
      phrase: 'สวัสดี (Sawatdee khrap/kha)',
      pronunciation: 'sah-wah-dee krahp/kah',
      translationEn: 'Hello! (Polite)',
      translationDe: 'Hallo! (Höflich)'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'อรุณสวัสดิ์ (Arun sawat)', pronunciation: 'ah-roon sah-wat', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'ขอบคุณมาก (Khob khun mak)', pronunciation: 'khob khoon mahk', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'ขอโทษ (Kho thot)', pronunciation: 'khaw thoht', en: 'Excuse me / Sorry', de: 'Entschuldigung' },
      { category: 'travel', phrase: 'สถานีอยู่ที่ไหน? (Sathani yoo theenai?)', pronunciation: 'sah-thaa-nee yoo tee-nai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'ยินดีที่ได้รู้จัก (Yindee theedai roojak)', pronunciation: 'yeen-dee tee-dai roo-jak', en: 'Nice to meet you', de: 'Schön, Sie kennenzulernen' }
    ],
    trivia: {
      en: 'Thai has 5 tones and an alphabet with 44 consonants and 15 vowel symbols.',
      de: 'Thailändisch hat 5 Töne und ein Alphabet mit 44 Konsonanten.'
    },
    dailyPhrase: {
      phrase: 'ไม่เป็นไร (Mai pen rai)',
      pronunciation: 'my pen ry',
      en: 'No worries / You’re welcome / It’s okay',
      de: 'Kein Problem / Macht nichts',
      literal: 'It is nothing'
    }
  },
  {
    id: 'levantine_arabic',
    nameEn: 'Levantine Arabic',
    nameDe: 'Levantinisches Arabisch',
    nativeName: 'لهجة شامي (Lahja Shāmiyya)',
    flag: '🇱🇧',
    speakers: '44 Million',
    family: 'Afroasiatic / Semitic',
    script: 'Arabic script',
    regions: 'Lebanon, Syria, Jordan, Palestine',
    greeting: {
      phrase: 'مرحبا! كيفك؟ (Marhaba! Kifak/Kifik?)',
      pronunciation: 'mar-ha-ba kee-fak',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht’s?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'صباح الخير (Sabah el-kher)', pronunciation: 'sa-baah el-kher', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'شكرا كتير (Shukran ktir)', pronunciation: 'shook-ran kteer', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'من فضلك (Min fadlak)', pronunciation: 'min fad-lak', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'وين المحطة؟ (Wein el-mahatta?)', pronunciation: 'wayn el-ma-hat-ta', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'تشرفنا (Tsharrafna)', pronunciation: 'tshar-raf-na', en: 'Pleased to meet you', de: 'Sehr erfreut' }
    ],
    trivia: {
      en: 'Levantine Arabic is widely recognized and loved for its musical cadence in poetry and Levant folklore.',
      de: 'Levantinisches Arabisch ist bekannt für seinen musikalischen Rhythmus.'
    },
    dailyPhrase: {
      phrase: 'يعطيك العافية (Ya‘teek el-‘afye)',
      pronunciation: 'ya-teek el-aa-fyeh',
      en: 'May God grant you health & strength!',
      de: 'Möge Gott dir Gesundheit schenken!',
      literal: 'May He give you wellness'
    }
  },
  {
    id: 'amharic',
    nameEn: 'Amharic',
    nameDe: 'Amharisch',
    nativeName: 'አማርኛ (Amarñña)',
    flag: '🇪🇹',
    speakers: '57 Million',
    family: 'Afroasiatic / Semitic',
    script: 'Fidel / Ge’ez script',
    regions: 'Ethiopia',
    greeting: {
      phrase: 'ሰላም! እንደምን ነህ/ንሽ? (Selam! Endemin neh/nesh?)',
      pronunciation: 'seh-lahm en-deh-meen neh',
      translationEn: 'Hello! How are you?',
      translationDe: 'Hallo! Wie geht es dir?'
    },
    essentialPhrases: [
      { category: 'greetings', phrase: 'እንደምን አደራችሁ (Endemin aderachu)', pronunciation: 'en-deh-meen ah-deh-rah-choo', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', phrase: 'በጣም አመሰግናለሁ (Betam ameseginalehu)', pronunciation: 'beh-tahm ah-meh-seh-gee-nah-leh-hoo', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', phrase: 'እባክህ (Ebakeh)', pronunciation: 'eh-bah-keh', en: 'Please', de: 'Bitte' },
      { category: 'travel', phrase: 'ማረፊያው የት ነው? (Marefiyaw yet new?)', pronunciation: 'mah-reh-fee-yaw yet new', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', phrase: 'ስለተገናኘን ደስ ብሎኛል', pronunciation: 'seh-leh-teh-geh-nah-nyen des beh-loh-nyahl', en: 'Pleased to meet you', de: 'Freut mich, Sie zu treffen' }
    ],
    trivia: {
      en: 'Amharic uses the Ge’ez abugida, an ancient writing system where each character represents a consonant-vowel syllable combination.',
      de: 'Amharisch nutzt das Ge’ez-Silbenschrift-System.'
    },
    dailyPhrase: {
      phrase: 'ቀስ በቀስ እንቁላል በእግሩ ይሄዳል',
      pronunciation: 'kes be-kes en-ku-lal be-eg-roo ye-he-dal',
      en: 'Slowly slowly, an egg walks on its legs (Patience makes miracles)',
      de: 'Geduld führt zum Wunder',
      literal: 'Slowly slowly an egg walks on legs'
    }
  }
];
