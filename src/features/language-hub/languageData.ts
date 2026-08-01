export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface NounMetadata {
  word: string;
  article: 'der' | 'die' | 'das';
  gender: 'masculine' | 'feminine' | 'neuter';
  noteEn?: string;
  noteDe?: string;
}

export interface EssentialPhrase {
  category: 'greetings' | 'basics' | 'travel' | 'social' | 'idioms' | 'advanced';
  level: CefrLevel;
  phrase: string;
  pronunciation: string;
  en: string;
  de: string;
  nouns?: NounMetadata[];
}

export interface DailyProverb {
  phrase: string;
  pronunciation: string;
  en: string;
  de: string;
  literal: string;
  level: CefrLevel;
  nouns?: NounMetadata[];
}

export interface GrammarTip {
  titleEn: string;
  titleDe: string;
  tipEn: string;
  tipDe: string;
  example?: string;
  level: CefrLevel;
}

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
  essentialPhrases: EssentialPhrase[];
  trivia: {
    en: string;
    de: string;
  };
  dailyPhrases: DailyProverb[];
  grammarTip?: GrammarTip;
  grammarTips?: GrammarTip[];
}

export function getAvailableDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export const TOP_33_LANGUAGES: LanguageInfo[] = [
  {
    id: 'german',
    nameEn: 'German',
    nameDe: 'Deutsch',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speakers: '135M',
    family: 'Germanic',
    script: 'Latin (Ä,Ö,Ü,ß)',
    regions: 'DACH Region',
    greeting: { phrase: 'Hallo! Wie geht es Ihnen?', pronunciation: 'hah-loh vee gayt es ee-nen', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht es Ihnen?' },
    essentialPhrases: [
      // A1 Level
      { category: 'greetings', level: 'A1', phrase: 'Guten Morgen', pronunciation: 'goo-ten mor-gen', en: 'Good morning', de: 'Guten Morgen', nouns: [{ word: 'Morgen', article: 'der', gender: 'masculine' }] },
      { category: 'greetings', level: 'A1', phrase: 'Guten Abend', pronunciation: 'goo-ten ah-bent', en: 'Good evening', de: 'Guten Abend', nouns: [{ word: 'Abend', article: 'der', gender: 'masculine' }] },
      { category: 'basics', level: 'A1', phrase: 'Vielen Dank', pronunciation: 'fee-len dank', en: 'Thank you very much', de: 'Vielen Dank', nouns: [{ word: 'Dank', article: 'der', gender: 'masculine' }] },
      { category: 'basics', level: 'A1', phrase: 'Entschuldigung', pronunciation: 'ent-shool-dee-goong', en: 'Excuse me', de: 'Entschuldigung', nouns: [{ word: 'Entschuldigung', article: 'die', gender: 'feminine' }] },
      { category: 'basics', level: 'A1', phrase: 'Ich heiße...', pronunciation: 'ikh hy-seh', en: 'My name is...', de: 'Ich heiße...' },

      // A2 Level
      { category: 'travel', level: 'A2', phrase: 'Wo ist der Bahnhof?', pronunciation: 'voh ist dair bahn-hof', en: 'Where is the station?', de: 'Wo ist der Bahnhof?', nouns: [{ word: 'Bahnhof', article: 'der', gender: 'masculine' }] },
      { category: 'travel', level: 'A2', phrase: 'Wie viel kostet das?', pronunciation: 'vee feel kos-tet das', en: 'How much does this cost?', de: 'Wie viel kostet das?' },
      { category: 'social', level: 'A2', phrase: 'Schön, Sie kennenzulernen', pronunciation: 'shuhn zee ken-nen-tzoo-lair-nen', en: 'Nice to meet you', de: 'Schön, Sie kennenzulernen' },
      { category: 'social', level: 'A2', phrase: 'Ich hätte gerne einen Kaffee', pronunciation: 'ikh het-teh gair-neh ey-nen kaf-fee', en: 'I would like a coffee', de: 'Ich hätte gerne einen Kaffee', nouns: [{ word: 'Kaffee', article: 'der', gender: 'masculine', noteEn: 'Accusative case: einen Kaffee', noteDe: 'Akkusativ: einen Kaffee' }] },

      // B1 Level
      { category: 'social', level: 'B1', phrase: 'Ich lerne seit sechs Monaten Deutsch', pronunciation: 'ikh lair-neh zayt zeks moh-nah-ten doytsh', en: 'I have been learning German for six months', de: 'Ich lerne seit sechs Monaten Deutsch', nouns: [{ word: 'Monaten', article: 'der', gender: 'masculine', noteEn: 'Plural dative of der Monat', noteDe: 'Dativ Plural von der Monat' }] },
      { category: 'social', level: 'B1', phrase: 'Könnten Sie das bitte wiederholen?', pronunciation: 'kuhn-ten zee das beet-teh vee-dair-hoh-len', en: 'Could you please repeat that?', de: 'Könnten Sie das bitte wiederholen?' },
      { category: 'travel', level: 'B1', phrase: 'Wissen Sie, ob der Zug pünktlich ist?', pronunciation: 'vis-sen zee op dair tsoog puenkt-likh ist', en: 'Do you know if the train is on time?', de: 'Wissen Sie, ob der Zug pünktlich ist?', nouns: [{ word: 'Zug', article: 'der', gender: 'masculine' }] },
      { category: 'basics', level: 'B1', phrase: 'Ich verstehe den Zusammenhang nicht', pronunciation: 'ikh fair-shtay-eh den tzoo-zam-men-hang', en: 'I do not understand the context', de: 'Ich verstehe den Zusammenhang nicht', nouns: [{ word: 'Zusammenhang', article: 'der', gender: 'masculine', noteEn: 'Accusative case: den Zusammenhang', noteDe: 'Akkusativ: den Zusammenhang' }] },

      // B2 Level
      { category: 'social', level: 'B2', phrase: 'Meiner Meinung nach ist das sehr wichtig', pronunciation: 'my-ner my-noong nakh ist das zair vikh-tikh', en: 'In my opinion that is very important', de: 'Meiner Meinung nach ist das sehr wichtig', nouns: [{ word: 'Meinung', article: 'die', gender: 'feminine', noteEn: 'Dative case: meiner Meinung', noteDe: 'Dativ: meiner Meinung' }] },
      { category: 'advanced', level: 'B2', phrase: 'Es kommt ganz darauf an', pronunciation: 'es kohmt gantz dah-rawf an', en: 'It depends entirely on the situation', de: 'Es kommt ganz darauf an' },
      { category: 'advanced', level: 'B2', phrase: 'Wir sollten alle Optionen abwägen', pronunciation: 'veer zohl-ten al-leh op-tsyoh-nen ap-vay-gen', en: 'We should weigh all options', de: 'Wir sollten alle Optionen abwägen', nouns: [{ word: 'Optionen', article: 'die', gender: 'feminine', noteEn: 'Plural of die Option', noteDe: 'Plural von die Option' }] },
      { category: 'social', level: 'B2', phrase: 'Ich schätze Ihre ehrliche Rückmeldung sehr', pronunciation: 'ikh shet-tzeh ee-reh air-lee-kheh roek-mel-doong', en: 'I greatly appreciate your honest feedback', de: 'Ich schätze Ihre ehrliche Rückmeldung sehr', nouns: [{ word: 'Rückmeldung', article: 'die', gender: 'feminine' }] },

      // C1 Level
      { category: 'advanced', level: 'C1', phrase: 'Man sollte nicht alles auf eine Karte setzen', pronunciation: 'man zohl-teh nikht al-les owf ey-neh kar-teh zet-zen', en: 'Don’t put all eggs in one basket', de: 'Man sollte nicht alles auf eine Karte setzen', nouns: [{ word: 'Karte', article: 'die', gender: 'feminine', noteEn: 'Accusative case: eine Karte', noteDe: 'Akkusativ: eine Karte' }] },
      { category: 'advanced', level: 'C1', phrase: 'Das steht völlig außer Frage', pronunciation: 'das shtayt fuhl-likh ow-ser frah-geh', en: 'That is completely out of the question', de: 'Das steht völlig außer Frage', nouns: [{ word: 'Frage', article: 'die', gender: 'feminine', noteEn: 'Dative case: außer Frage', noteDe: 'Dativ: außer Frage' }] },
      { category: 'advanced', level: 'C1', phrase: 'Unter diesen Umständen ist das verständlich', pronunciation: 'oon-ter dee-zen oom-shten-den ist fair-shten-likh', en: 'Under these circumstances that is understandable', de: 'Unter diesen Umständen ist das verständlich', nouns: [{ word: 'Umständen', article: 'der', gender: 'masculine', noteEn: 'Plural dative of der Umstand', noteDe: 'Dativ Plural von der Umstand' }] },
      { category: 'advanced', level: 'C1', phrase: 'Es gilt, eine nachhaltige Lösung zu finden', pronunciation: 'es geelt ey-neh naakh-hal-tee-geh luh-soong', en: 'The goal is to find a sustainable solution', de: 'Es gilt, eine nachhaltige Lösung zu finden', nouns: [{ word: 'Lösung', article: 'die', gender: 'feminine', noteEn: 'Accusative case: eine Lösung', noteDe: 'Akkusativ: eine Lösung' }] },

      // C2 Level
      { category: 'advanced', level: 'C2', phrase: 'Der Apfel fällt nicht weit vom Stamm', pronunciation: 'dair ap-fel felt nikht vyt fohm shtam', en: 'The apple doesn’t fall far from the tree', de: 'Der Apfel fällt nicht weit vom Stamm', nouns: [{ word: 'Apfel', article: 'der', gender: 'masculine' }, { word: 'Stamm', article: 'der', gender: 'masculine', noteEn: 'Dative contraction: vom (von dem) Stamm', noteDe: 'Dativ-Kombination: vom Stamm' }] },
      { category: 'advanced', level: 'C2', phrase: 'In der Kürze liegt die Würze', pronunciation: 'een dair kuer-tzeh leegt dee wuer-tzeh', en: 'Brevity is the soul of wit', de: 'In der Kürze liegt die Würze', nouns: [{ word: 'Kürze', article: 'die', gender: 'feminine', noteEn: 'Dative case: in der Kürze', noteDe: 'Dativ: in der Kürze' }, { word: 'Würze', article: 'die', gender: 'feminine' }] },
      { category: 'advanced', level: 'C2', phrase: 'Was du heute kannst besorgen, das verschiebe nicht auf morgen', pronunciation: 'vas doo hoy-teh kanst beh-zor-gen fair-shee-beh', en: 'Never put off till tomorrow what you can do today', de: 'Was du heute kannst besorgen, das verschiebe nicht auf morgen' },
      { category: 'advanced', level: 'C2', phrase: 'Da liegt der Hund begraben', pronunciation: 'dah leegt dair hoond beh-grah-ben', en: 'That is the crux of the matter', de: 'Da liegt der Hund begraben', nouns: [{ word: 'Hund', article: 'der', gender: 'masculine' }] }
    ],
    trivia: { en: 'Famous for compound words and regional dialects.', de: 'Berühmt für zusammengesetzte Wörter und Dialekte.' },
    dailyPhrases: [
      { phrase: 'Übung macht den Meister', pronunciation: 'oo-boong makht dain my-stair', en: 'Practice makes perfect', de: 'Übung macht den Meister', literal: 'Practice makes master', level: 'A2' },
      { phrase: 'Morgenstund hat Gold im Mund', pronunciation: 'mor-gen-shtoond hat gohlt im moond', en: 'Early bird catches the worm', de: 'Morgenstund hat Gold im Mund', literal: 'Morning hour has gold in mouth', level: 'B1' },
      { phrase: 'Aller Anfang ist schwer', pronunciation: 'al-ler an-fang ist shwair', en: 'Every beginning is hard', de: 'Aller Anfang ist schwer', literal: 'All beginning is hard', level: 'B2' }
    ],
    grammarTips: [
      {
        titleEn: 'Case Signals & Accusative Nouns',
        titleDe: 'Fall-Signale & Akkusativ-Nomen',
        tipEn: 'Masculine nouns change "der" to "den" in the accusative case (direct object). Hover over dotted words in phrases to check dictionary articles & case notes!',
        tipDe: 'Maskuline Nomen ändern "der" zu "den" im Akkusativ (direktes Objekt). Fahren Sie mit der Maus über gepunktete Wörter für Artikel!',
        example: 'der Zusammenhang → den Zusammenhang',
        level: 'B1'
      },
      {
        titleEn: 'Dative Case Prepositions',
        titleDe: 'Dativ-Präpositionen (Aus, bei, mit...)',
        tipEn: 'The prepositions "aus, bei, mit, nach, seit, von, zu" ALWAYS take the dative case.',
        tipDe: 'Die Präpositionen "aus, bei, mit, nach, seit, von, zu" verlangen IMMER den Dativ.',
        example: 'mit dem Zug / nach der Schule',
        level: 'B1'
      },
      {
        titleEn: 'Two-Way Prepositions (Wechselpräpositionen)',
        titleDe: 'Wechselpräpositionen (in, an, auf...)',
        tipEn: 'Prepositions like "in, an, auf" use Accusative for movement/direction (Wohin?) and Dative for fixed location (Wo?).',
        tipDe: 'Wechselpräpositionen nutzen Akkusativ für Bewegung (Wohin?) und Dativ für Orte (Wo?).',
        example: 'in den Bahnhof (Akk) / im Bahnhof (Dat)',
        level: 'B2'
      },
      {
        titleEn: 'Modal Verbs & Verb Position',
        titleDe: 'Modalverben & Satzstellung',
        tipEn: 'Modal verbs (können, müssen, sollten) conjugate in second position and send the main verb to the very end in infinitive.',
        tipDe: 'Modalverben stehen an 2. Stelle und schicken das Vollverb im Infinitiv ans Satzende.',
        example: 'Wir sollten alle Optionen abwägen.',
        level: 'B2'
      }
    ]
  },
  {
    id: 'english',
    nameEn: 'English',
    nameDe: 'Englisch',
    nativeName: 'English',
    flag: '🇬🇧',
    speakers: '1.45B',
    family: 'Germanic',
    script: 'Latin',
    regions: 'UK, US, CA, AU, Global',
    greeting: { phrase: 'Hello! How are you?', pronunciation: 'hɛˈloʊ haʊ ɑːr juː', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht es dir?' },
    essentialPhrases: [
      // A1
      { category: 'greetings', level: 'A1', phrase: 'Good morning', pronunciation: 'ɡʊd ˈmɔːrnɪŋ', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'greetings', level: 'A1', phrase: 'Good evening', pronunciation: 'ɡʊd ˈiːvnɪŋ', en: 'Good evening', de: 'Guten Abend' },
      { category: 'basics', level: 'A1', phrase: 'Thank you very much', pronunciation: 'θæŋk juː ˈvɛri mʌtʃ', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', level: 'A1', phrase: 'Nice to meet you', pronunciation: 'naɪs tuː miːt juː', en: 'Nice to meet you', de: 'Schön, dich kennenzulernen' },

      // A2
      { category: 'travel', level: 'A2', phrase: 'Where is the nearest station?', pronunciation: 'wɛər ɪz ðə ˈnɪərɪst ˈsteɪʃən', en: 'Where is the nearest station?', de: 'Wo ist der nächste Bahnhof?' },
      { category: 'travel', level: 'A2', phrase: 'How much is a ticket to London?', pronunciation: 'haʊ mʌtʃ ɪz ə ˈtɪkɪt tuː ˈlʌndən', en: 'How much is a ticket to London?', de: 'Wie viel kostet eine Fahrkarte nach London?' },
      { category: 'social', level: 'A2', phrase: 'What do you like to do in your free time?', pronunciation: 'wɒt duː juː laɪk tuː duː', en: 'What do you like to do in your free time?', de: 'Was machst du gerne in deiner Freizeit?' },

      // B1
      { category: 'social', level: 'B1', phrase: 'I’d love to hear more about your work', pronunciation: 'aɪd lʌv tuː hɪər mɔːr əˈbaʊt jɔːr wɜːrk', en: 'I’d love to hear more about your work', de: 'Ich würde gerne mehr über deine Arbeit hören' },
      { category: 'basics', level: 'B1', phrase: 'Could you explain that in more detail?', pronunciation: 'kʊd juː ɪkˈspleɪn ðæt ɪn mɔːr ˈdiːteɪl', en: 'Could you explain that in more detail?', de: 'Könntest du das etwas genauer erklären?' },
      { category: 'travel', level: 'B1', phrase: 'Do you know if the flight is on time?', pronunciation: 'duː juː noʊ ɪf ðə flaɪt ɪz ɒn taɪm', en: 'Do you know if the flight is on time?', de: 'Weißt du, ob der Flug pünktlich ist?' },

      // B2
      { category: 'advanced', level: 'B2', phrase: 'It goes without saying', pronunciation: 'ɪt ɡoʊz wɪˈðaʊt ˈseɪɪŋ', en: 'It goes without saying', de: 'Das versteht sich von selbst' },
      { category: 'advanced', level: 'B2', phrase: 'On the flip side, we must consider the risk', pronunciation: 'ɒn ðə flɪp saɪd wiː mʌst kənˈsɪdər ðə rɪsk', en: 'On the flip side, we must consider the risk', de: 'Andererseits müssen wir das Risiko bedenken' },
      { category: 'social', level: 'B2', phrase: 'I strongly suggest we take a balanced approach', pronunciation: 'aɪ strɒŋli səˈdʒɛst wiː teɪk ə ˈbælənst', en: 'I strongly suggest we take a balanced approach', de: 'Ich schlage dringend ein ausgewogenes Vorgehen vor' },

      // C1
      { category: 'advanced', level: 'C1', phrase: 'To hit the nail on the head', pronunciation: 'tuː hɪt ðə neɪl ɒn ðə hɛd', en: 'To hit the nail on the head', de: 'Den Nagel auf den Kopf treffen' },
      { category: 'advanced', level: 'C1', phrase: 'A blessing in disguise', pronunciation: 'ə ˈblɛsɪŋ ɪn dɪsˈɡaɪz', en: 'A blessing in disguise', de: 'Ein Glück im Unglück' },
      { category: 'advanced', level: 'C1', phrase: 'We must read between the lines', pronunciation: 'wiː mʌst riːd bɪˈtwiːn ðə laɪnz', en: 'We must read between the lines', de: 'Wir müssen zwischen den Zeilen lesen' },

      // C2
      { category: 'advanced', level: 'C2', phrase: 'Every cloud has a silver lining', pronunciation: 'ˈɛvri klaʊd hæz ə ˈsɪlvər ˈlaɪnɪŋ', en: 'Every cloud has a silver lining', de: 'Jedes Unglück hat auch sein Gutes' },
      { category: 'advanced', level: 'C2', phrase: 'Actions speak louder than words', pronunciation: 'ˈækʃənz spiːk ˈlaʊdər ðæn wɜːdz', en: 'Actions speak louder than words', de: 'Taten sagen mehr als Worte' },
      { category: 'advanced', level: 'C2', phrase: 'The ball is in your court now', pronunciation: 'ðə bɔːl ɪz ɪn jɔːr kɔːrt naʊ', en: 'The ball is in your court now', de: 'Du bist jetzt am Zug' }
    ],
    trivia: { en: 'Lingua franca of international aviation, science, and technology.', de: 'Weltweite Verkehrssprache in Luftfahrt und IT.' },
    dailyPhrases: [
      { phrase: 'Break a leg!', pronunciation: 'breɪk ə leɡ', en: 'Good luck!', de: 'Viel Erfolg!', literal: 'Break a leg', level: 'B1' },
      { phrase: 'Bite the bullet', pronunciation: 'baɪt ðə ˈbʊlɪt', en: 'Face a difficult situation', de: 'In den sauren Apfel beißen', literal: 'Bite bullet', level: 'B2' },
      { phrase: 'Burn the midnight oil', pronunciation: 'bɜːrn ðə ˈmɪdnaɪt ɔɪl', en: 'Work late into night', de: 'Bis spät arbeiten', literal: 'Burn oil late', level: 'C1' }
    ]
  },
  {
    id: 'mandarin',
    nameEn: 'Mandarin Chinese',
    nameDe: 'Mandarin-Chinesisch',
    nativeName: '普通话 (Pǔtōnghuà)',
    flag: '🇨🇳',
    speakers: '1.12B',
    family: 'Sino-Tibetan',
    script: 'Simplified Characters',
    regions: 'China, Taiwan, SG',
    greeting: { phrase: '你好！(Nǐ hǎo!)', pronunciation: 'nee how', translationEn: 'Hello!', translationDe: 'Hallo!' },
    essentialPhrases: [
      // A1
      { category: 'greetings', level: 'A1', phrase: '早上好 (Zǎoshang hǎo)', pronunciation: 'dzow-shahng how', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: '谢谢 (Xièxie)', pronunciation: 'shyeh-shyeh', en: 'Thank you', de: 'Danke' },
      { category: 'basics', level: 'A1', phrase: '不客气 (Bú kèqi)', pronunciation: 'boo kuh-chee', en: 'You are welcome', de: 'Gern geschehen' },

      // A2
      { category: 'travel', level: 'A2', phrase: '洗手间在哪里？ (Xǐshǒujiān zài nǎli?)', pronunciation: 'shee-show-jyen dzye nah-lee', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'travel', level: 'A2', phrase: '这个多少钱？ (Zhège duōshao qián?)', pronunciation: 'juh-guh dwaw-shaow chyen', en: 'How much is this?', de: 'Wie viel kostet das?' },
      { category: 'social', level: 'A2', phrase: '很高兴认识你 (Hěn gāoxìng rènshi nǐ)', pronunciation: 'hun gow-shing ren-shee nee', en: 'Nice to meet you', de: 'Schön, dich kennenzulernen' },

      // B1
      { category: 'social', level: 'B1', phrase: '你在学中文吗？ (Nǐ zài xué Zhōngwén ma?)', pronunciation: 'nee dzye shweh zhoong-wen mah', en: 'Are you learning Chinese?', de: 'Lernst du Chinesisch?' },
      { category: 'social', level: 'B1', phrase: '我觉得这个很有意思 (Wǒ juéde zhège hěn yǒu yìsi)', pronunciation: 'waw jweh-duh juh-guh hun yow ee-see', en: 'I think this is very interesting', de: 'Ich finde das sehr interessant' },
      { category: 'travel', level: 'B1', phrase: '请问去高铁站怎么走？', pronunciation: 'cheeng wen chyoo gow-tyeh zhan', en: 'Excuse me, how to get to the bullet train station?', de: 'Entschuldigung, wie komme ich zum Hochgeschwindigkeitsbahnhof?' },

      // B2
      { category: 'advanced', level: 'B2', phrase: '熟能生巧 (Shú néng shēng qiǎo)', pronunciation: 'shoo neng sheng chyah-oh', en: 'Practice makes perfect', de: 'Übung macht den Meister' },
      { category: 'advanced', level: 'B2', phrase: '凡事都有两面性 (Fánshì dōu yǒu liǎngmiànxìng)', pronunciation: 'fahn-shee dow yow lyang-myen-shing', en: 'Everything has two sides', de: 'Alles hat zwei Seiten' },
      { category: 'social', level: 'B2', phrase: '保持联系 (Bǎochí liánxì)', pronunciation: 'bow-chee lyan-shee', en: 'Keep in touch', de: 'In Kontakt bleiben' },

      // C1
      { category: 'advanced', level: 'C1', phrase: '千里之行，始于足下 (Qiān lǐ zhī xíng)', pronunciation: 'chyen lee zhee shing', en: 'A journey of 1000 miles begins with 1 step', de: 'Eine Reise von 1000 Meilen beginnt mit 1. Schritt' },
      { category: 'advanced', level: 'C1', phrase: '吃一堑，长一智 (Chī yí qiàn, zhǎng yí zhì)', pronunciation: 'chee yee chyen, zhang yee zhee', en: 'Learn from your mistakes', de: 'Aus Schaden wird man klug' },
      { category: 'advanced', level: 'C1', phrase: '机不可失，时不再来', pronunciation: 'jee boo kuh shee', en: 'Opportunities should not be missed', de: 'Gelegenheiten muss man nutzen' },

      // C2
      { category: 'advanced', level: 'C2', phrase: '温故而知新 (Wēn gù ér zhī xīn)', pronunciation: 'wen goo ar zhee shin', en: 'Reviewing the past brings new knowledge', de: 'Altes auffrischen bringt neues Wissen' },
      { category: 'advanced', level: 'C2', phrase: '海内存知己，天涯若比邻', pronunciation: 'hi nay tsoon zhee-jee', en: 'A bosom friend afar brings distance near', de: 'Wahre Freunde sind sich nie fern' },
      { category: 'advanced', level: 'C2', phrase: '水滴石穿 (Shuǐ dī shí chuān)', pronunciation: 'shway dee shee chwan', en: 'Water drops pierce stone (Constant effort wins)', de: 'Steter Tropfen höhlt den Stein' }
    ],
    trivia: { en: 'Tonal language with 4 distinct tones.', de: 'Tonsprache mit 4 Haupttönen.' },
    dailyPhrases: [
      { phrase: '加油！(Jiāyóu!)', pronunciation: 'jyah-yoh', en: 'Keep going!', de: 'Gib dein Bestes!', literal: 'Add oil!', level: 'A1' },
      { phrase: '入乡随俗 (Rù xiāng suí sú)', pronunciation: 'roo shyahng swee soo', en: 'When in Rome do as Romans do', de: 'Andere Länder andere Sitten', literal: 'Enter village follow custom', level: 'B2' },
      { phrase: '百闻不如一见 (Bǎi wén bù rú yí jiàn)', pronunciation: 'bye wen boo roo yee jyen', en: 'Seeing once is better than hearing 100 times', de: 'Ein Bild sagt mehr als 1000 Worte', literal: '100 hears not as good as 1 see', level: 'C1' }
    ]
  },
  {
    id: 'spanish',
    nameEn: 'Spanish',
    nameDe: 'Spanisch',
    nativeName: 'Español',
    flag: '🇪🇸',
    speakers: '548M',
    family: 'Romance',
    script: 'Latin',
    regions: 'Spain & Latin America',
    greeting: { phrase: '¡Hola! ¿Cómo estás?', pronunciation: 'oh-lah koh-moh ehs-tahs', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht es dir?' },
    essentialPhrases: [
      // A1
      { category: 'greetings', level: 'A1', phrase: 'Buenos días', pronunciation: 'bweh-nohs dee-ahs', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Muchas gracias', pronunciation: 'moo-chahs grah-syahs', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', level: 'A1', phrase: 'Por favor', pronunciation: 'pohr fah-vohr', en: 'Please', de: 'Bitte' },

      // A2
      { category: 'travel', level: 'A2', phrase: '¿Dónde está el baño?', pronunciation: 'dohn-deh ehs-tah el bah-nyoh', en: 'Where is the bathroom?', de: 'Wo ist die Toilette?' },
      { category: 'travel', level: 'A2', phrase: '¿Cuánto cuesta esto?', pronunciation: 'kwahn-toh kwehs-tah ehs-toh', en: 'How much does this cost?', de: 'Wie viel kostet das?' },
      { category: 'social', level: 'A2', phrase: 'Mucho gusto en conocerte', pronunciation: 'moo-choh goos-toh', en: 'Nice to meet you', de: 'Schön dich kennenzulernen' },

      // B1
      { category: 'social', level: 'B1', phrase: '¿De dónde eres y a qué te dedicas?', pronunciation: 'deh dohn-deh eh-rehs', en: 'Where are you from and what do you do?', de: 'Woher kommst du und was arbeitest du?' },
      { category: 'social', level: 'B1', phrase: 'Me gustaría aprender más español', pronunciation: 'meh goos-tah-ree-ah', en: 'I would like to learn more Spanish', de: 'Ich möchte mehr Spanisch lernen' },
      { category: 'travel', level: 'B1', phrase: '¿Me puedes recomendar un buen restaurante?', pronunciation: 'meh pweh-des reh-koh-men-dahr', en: 'Can you recommend a good restaurant?', de: 'Kannst du ein gutes Restaurant empfehlen?' },

      // B2
      { category: 'advanced', level: 'B2', phrase: 'No hay mal que por bien no venga', pronunciation: 'noh eye mahl keh pohr byen noh vehn-gah', en: 'Every cloud has a silver lining', de: 'Jedes Unglück hat sein Gutes' },
      { category: 'advanced', level: 'B2', phrase: 'Desde mi punto de vista, es una buena oportunidad', pronunciation: 'dehs-deh mee poon-toh deh vees-tah', en: 'From my point of view it is a good opportunity', de: 'Aus meiner Sicht ist das eine gute Gelegenheit' },
      { category: 'social', level: 'B2', phrase: 'Vale la pena intentar cosas nuevas', pronunciation: 'vah-leh lah peh-nah', en: 'It is worth trying new things', de: 'Es lohnt sich, Neues zu versuchen' },

      // C1
      { category: 'advanced', level: 'C1', phrase: 'A caballo regalado no se le mira el diente', pronunciation: 'ah kah-bah-yoh reh-gah-lah-doh', en: 'Don’t look a gift horse in the mouth', de: 'Geschenktem Gaul schaut man nicht ins Maul' },
      { category: 'advanced', level: 'C1', phrase: 'Más vale tarde que nunca', pronunciation: 'mahs vah-leh tahr-deh keh noon-kah', en: 'Better late than never', de: 'Besser spät als nie' },
      { category: 'advanced', level: 'C1', phrase: 'Tomar la sartén por el mango', pronunciation: 'toh-mahr lah sahr-ten pohr el mahn-goh', en: 'Take full control of the situation', de: 'Das Heft in die Hand nehmen' },

      // C2
      { category: 'advanced', level: 'C2', phrase: 'Camarón que se duerme se lo lleva la corriente', pronunciation: 'kah-mah-rohn keh seh dwehr-meh', en: 'If you snooze you lose', de: 'Wer zu spät kommt den bestraft das Leben' },
      { category: 'advanced', level: 'C2', phrase: 'En boca cerrada no entran moscas', pronunciation: 'en boh-kah seh-rrah-dah noh en-trahn', en: 'Silence is golden', de: 'Reden ist Silber, Schweigen ist Gold' },
      { category: 'advanced', level: 'C2', phrase: 'Dar en el clavo', pronunciation: 'dahr en el klah-boh', en: 'Hit the nail right on the head', de: 'Den Nagel auf den Kopf treffen' }
    ],
    trivia: { en: 'Official language of 20 countries.', de: 'Amtssprache in 20 Ländern.' },
    dailyPhrases: [
      { phrase: 'Paso a paso se llega lejos', pronunciation: 'pah-soh ah pah-soh', en: 'Step by step one goes far', de: 'Schritt für Schritt kommt man weit', literal: 'Step by step reaches far', level: 'A2' },
      { phrase: 'A lo hecho, pecho', pronunciation: 'ah loh eh-choh peh-choh', en: 'What is done is done', de: 'Geschehenes lässt sich nicht ändern', literal: 'To what is done chest', level: 'B2' },
      { phrase: 'Al pan, pan, y al vino, vino', pronunciation: 'ahl pahn pahn ee ahl vee-noh vee-noh', en: 'Call a spade a spade', de: 'Dinge beim Namen nennen', literal: 'To bread bread to wine wine', level: 'C1' }
    ]
  },
  {
    id: 'hindi',
    nameEn: 'Hindi',
    nameDe: 'Hindi',
    nativeName: 'हिन्दी (Hindī)',
    flag: '🇮🇳',
    speakers: '602M',
    family: 'Indo-Aryan',
    script: 'Devanagari',
    regions: 'India, Nepal',
    greeting: { phrase: 'नमस्ते (Namaste)', pronunciation: 'nuh-mus-tay', translationEn: 'Hello / Greetings', translationDe: 'Hallo / Grüße' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'शुभ प्रभात (Shubh prabhat)', pronunciation: 'shoob pruh-bhaat', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'धन्यवाद (Dhanyavaad)', pronunciation: 'dhun-yuh-vaad', en: 'Thank you', de: 'Vielen Dank' },
      { category: 'basics', level: 'A1', phrase: 'आपसे मिलकर खुशी हुई', pronunciation: 'aap-say meel-kur khoo-shee hoo-ee', en: 'Pleased to meet you', de: 'Schön, Sie kennenzulernen' },

      { category: 'travel', level: 'A2', phrase: 'स्टेशन कहाँ है? (Station kahan hai?)', pronunciation: 'station kuh-haan hai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'travel', level: 'A2', phrase: 'यह कितने का है? (Yeh kitne ka hai?)', pronunciation: 'yeh kit-ney kaa hai', en: 'How much is this?', de: 'Wie viel kostet das?' },

      { category: 'social', level: 'B1', phrase: 'आप कैसे हैं? (Aap kaise hain?)', pronunciation: 'aap kai-say hain', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'social', level: 'B1', phrase: 'मैं हिंदी सीख रहा हूँ', pronunciation: 'main hindi seekh rahaa hoon', en: 'I am learning Hindi', de: 'Ich lerne Hindi' },

      { category: 'advanced', level: 'B2', phrase: 'अंत भला तो सब भला', pronunciation: 'unt bhu-laa toh sub bhu-laa', en: 'All’s well that ends well', de: 'Ende gut, alles gut' },
      { category: 'advanced', level: 'B2', phrase: 'हिम्मत मत हारो', pronunciation: 'him-mat mut haa-ro', en: 'Don’t lose heart', de: 'Gib den Mut nicht auf' },

      { category: 'advanced', level: 'C1', phrase: 'बूंद बूंद से घड़ा भरता है', pronunciation: 'boond boond say ghu-daa bhur-taa hai', en: 'Drop by drop fills the pot', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C1', phrase: 'सच्चाई की हमेशा जीत होती है', pronunciation: 'such-chaa-ee kee hum-ey-shaa jeet', en: 'Truth always triumphs', de: 'Wahrheit siegt immer' },

      { category: 'advanced', level: 'C2', phrase: 'जैसी करनी वैसी भरनी', pronunciation: 'jai-see kur-nee wai-see bhur-nee', en: 'As you sow so shall you reap', de: 'Wie man sät so erntet man' },
      { category: 'advanced', level: 'C2', phrase: 'दूर के ढोल सुहावने लगते हैं', pronunciation: 'door kay dhol soo-haa-vney', en: 'Grass is greener on the other side', de: 'Das Gras ist drüben immer grüner' }
    ],
    trivia: { en: 'Shares linguistic roots with Sanskrit.', de: 'Hat tiefe Wurzeln im Sanskrit.' },
    dailyPhrases: [
      { phrase: 'सब ठीक है (Sab theek hai)', pronunciation: 'sub theek hai', en: 'Everything is fine', de: 'Alles ist gut', literal: 'All is correct', level: 'A1' },
      { phrase: 'धीरे धीरे सब कुछ होता है', pronunciation: 'dhee-ray dhee-ray sub kooch ho-taa hai', en: 'Slowly everything happens', de: 'Gut Ding will Weile haben', literal: 'Slowly all occurs', level: 'B1' },
      { phrase: 'एकता में बल है (Ekta mein bal hai)', pronunciation: 'eyk-taa meyn bul hai', en: 'Unity is strength', de: 'Einigkeit macht stark', literal: 'In unity is strength', level: 'B2' }
    ]
  },
  {
    id: 'arabic',
    nameEn: 'Arabic',
    nameDe: 'Arabisch',
    nativeName: 'العربية (Al-ʿArabiyyah)',
    flag: '🇸🇦',
    speakers: '274M',
    family: 'Semitic',
    script: 'Arabic (RTL)',
    regions: 'Middle East & North Africa',
    greeting: { phrase: 'مرحبا! (Marhaban!)', pronunciation: 'mar-ha-ban', translationEn: 'Hello!', translationDe: 'Hallo!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'صباح الخير (Sabah al-khayr)', pronunciation: 'sa-baah al-khayr', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'شكرا جزيلا (Shukran jazeelan)', pronunciation: 'shoo-kran ja-zee-lan', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', level: 'A1', phrase: 'من فضلك (Min fadlik)', pronunciation: 'min fad-leek', en: 'Please', de: 'Bitte' },

      { category: 'travel', level: 'A2', phrase: 'أين المحطة؟ (Ayna al-mahatta?)', pronunciation: 'ay-na al-ma-hat-ta', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'travel', level: 'A2', phrase: 'كم ثمن هذا؟ (Kam thaman hadha?)', pronunciation: 'kam tha-man ha-dha', en: 'How much is this?', de: 'Wie viel kostet das?' },

      { category: 'social', level: 'B1', phrase: 'كيف حالك؟ (Kayfa haluk?)', pronunciation: 'kay-fa haa-look', en: 'How are you?', de: 'Wie geht es dir?' },
      { category: 'social', level: 'B1', phrase: 'أنا أتعلم اللغة العربية', pronunciation: 'ana a-ta-al-lam al-loo-gha', en: 'I am learning Arabic', de: 'Ich lerne Arabisch' },

      { category: 'advanced', level: 'B2', phrase: 'الوقت كالسيف (Al-waqtu kas-sayf)', pronunciation: 'al-waq-too kas-sayf', en: 'Time is like a sword', de: 'Zeit ist wie ein Schwert' },
      { category: 'advanced', level: 'B2', phrase: 'لكل مقام مقال', pronunciation: 'li-kool-lee ma-qaam ma-qaal', en: 'To every situation suitable words', de: 'Für jeden Anlass die passenden Worte' },

      { category: 'advanced', level: 'C1', phrase: 'رب ضارة نافعة (Rubba darratin nafi‘ah)', pronunciation: 'roob-ba dar-ra-tin na-fee-ah', en: 'A blessing in disguise', de: 'Ein Glück im Unglück' },
      { category: 'advanced', level: 'C1', phrase: 'العلم في الصغر كالنقش على الحجر', pronunciation: 'al-ilm fee as-si-ghar', en: 'Learning when young is like carving on stone', de: 'Was Hänschen nicht lernt lernt Hans nimmermehr' },

      { category: 'advanced', level: 'C2', phrase: 'من طلب العلا سهر الليالي', pronunciation: 'man ta-la-ba al-oo-la', en: 'He who seeks greatness stays up nights', de: 'Wer Geringes sucht schläft ruhlos' },
      { category: 'advanced', level: 'C2', phrase: 'تجاري الرياح بما لا تشتهي السفن', pronunciation: 'to-jaa-ree ar-ri-yaa-hoo', en: 'Winds blow counter to what ships desire', de: 'Es kommt oft anders als man denkt' }
    ],
    trivia: { en: 'Words build from 3-consonant roots.', de: 'Wörter entstehen aus 3-Konsonanten-Wurzeln.' },
    dailyPhrases: [
      { phrase: 'العلم نور (Al-ʿilmu nūr)', pronunciation: 'al-il-moo noor', en: 'Knowledge is light', de: 'Wissen ist Licht', literal: 'Knowledge is light', level: 'A1' },
      { phrase: 'الصبر مفتاح الفرج', pronunciation: 'as-sab-roo mif-taa-hoo', en: 'Patience is key to relief', de: 'Geduld ist der Schlüssel', literal: 'Patience is key', level: 'B2' },
      { phrase: 'اليد الواحدة لا تصفق', pronunciation: 'al-ya-doo al-waa-hee-da-too', en: 'One hand alone cannot clap', de: 'Gemeinsam ist man stark', literal: 'One hand no clap', level: 'C1' }
    ]
  },
  {
    id: 'french',
    nameEn: 'French',
    nameDe: 'Französisch',
    nativeName: 'Français',
    flag: '🇫🇷',
    speakers: '310M',
    family: 'Romance',
    script: 'Latin',
    regions: 'France, CA, West Africa',
    greeting: { phrase: 'Bonjour ! Comment allez-vous ?', pronunciation: 'boh-zhoor koh-mahn tah-lay voo', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht es Ihnen?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Bonne journée', pronunciation: 'bohn zhoor-nay', en: 'Have a good day', de: 'Einen schönen Tag' },
      { category: 'basics', level: 'A1', phrase: 'Merci beaucoup', pronunciation: 'mair-see boh-koo', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'basics', level: 'A1', phrase: 'Enchanté(e)', pronunciation: 'ahn-shahn-tay', en: 'Pleased to meet you', de: 'Sehr erfreut' },

      { category: 'travel', level: 'A2', phrase: 'Où est la gare ?', pronunciation: 'oo eh lah gar', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'travel', level: 'A2', phrase: 'Combien ça coûte ?', pronunciation: 'kohm-byan sah koot', en: 'How much does that cost?', de: 'Wie viel kostet das?' },

      { category: 'social', level: 'B1', phrase: 'J’apprends le français', pronunciation: 'zhah-prahn luh frahn-say', en: 'I am learning French', de: 'Ich lerne Französisch' },
      { category: 'social', level: 'B1', phrase: 'Pourriez-vous répéter s’il vous plaît ?', pronunciation: 'poo-ryay voo ray-pay-tay', en: 'Could you please repeat?', de: 'Könnten Sie das bitte wiederholen?' },

      { category: 'advanced', level: 'B2', phrase: 'Vouloir, c’est pouvoir', pronunciation: 'voo-lwahr say poo-vwahr', en: 'Where there’s a will there’s a way', de: 'Wo ein Wille ist ist ein Weg' },
      { category: 'advanced', level: 'B2', phrase: 'Ce n’est pas la mer à boire', pronunciation: 'suh nay pah lah mair', en: 'It is not an insurmountable task', de: 'Das ist keine Hexerei' },

      { category: 'advanced', level: 'C1', phrase: 'Petit à petit, l’oiseau fait son nid', pronunciation: 'puh-tee ah puh-tee lwah-zoh fay soh nee', en: 'Little by little bird builds nest', de: 'Schritt für Schritt ans Ziel' },
      { category: 'advanced', level: 'C1', phrase: 'Les grands esprits se rencontrent', pronunciation: 'lay grahn zhes-pree', en: 'Great minds think alike', de: 'Zwei Dumme ein Gedanke' },

      { category: 'advanced', level: 'C2', phrase: 'L’habit ne fait pas le moine', pronunciation: 'lah-bee nuh fay pah luh mwahn', en: 'Clothes do not make the man', de: 'Kleider machen keine Leute' },
      { category: 'advanced', level: 'C2', phrase: 'Qui sème le vent récolte la tempête', pronunciation: 'kee sem luh vahn ray-kolt', en: 'He who sows the wind reaps the storm', de: 'Wer Wind säht wird Sturm ernten' }
    ],
    trivia: { en: 'Official language of UN, EU, and IOC.', de: 'Amtssprache der UNO und EU.' },
    dailyPhrases: [
      { phrase: 'C’est la vie !', pronunciation: 'say lah vee', en: 'That’s life!', de: 'So ist das Leben!', literal: 'That is life', level: 'A1' },
      { phrase: 'Impossible n’est pas français', pronunciation: 'am-poh-seebl nay pah frahn-say', en: 'Nothing is impossible', de: 'Nichts ist unmöglich', literal: 'Impossible not French', level: 'B2' },
      { phrase: 'Qui cherche trouve', pronunciation: 'kee shairsh troov', en: 'He who seeks shall find', de: 'Wer sucht der findet', literal: 'Who seeks finds', level: 'C1' }
    ]
  },
  {
    id: 'bengali',
    nameEn: 'Bengali',
    nameDe: 'Bengalisch',
    nativeName: 'বাংলা (Bāṅlā)',
    flag: '🇧🇩',
    speakers: '273M',
    family: 'Indo-Aryan',
    script: 'Bengali',
    regions: 'Bangladesh, West Bengal',
    greeting: { phrase: 'নমস্কার (Nomoshkar)', pronunciation: 'noh-mosh-kar', translationEn: 'Hello', translationDe: 'Hallo' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'শুভ সকাল (Shubho shokal)', pronunciation: 'shoo-bho sho-kal', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'ধন্যবাদ (Dhonnobad)', pronunciation: 'dho-nno-bad', en: 'Thank you', de: 'Danke' },
      { category: 'travel', level: 'A2', phrase: 'স্টেশন কোথায়? (Station kothay?)', pronunciation: 'station koh-thay', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'আপনি কেমন আছেন? (Apni kemon achen?)', pronunciation: 'ap-nee ke-mon a-chen', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'একতাই বল (Ektai bol)', pronunciation: 'ek-tay bol', en: 'Unity is strength', de: 'Einigkeit macht stark' },
      { category: 'advanced', level: 'C1', phrase: 'যত ভাব তত লাভ', pronunciation: 'jo-to bhab to-to labh', en: 'The more you think the more you gain', de: 'Mehr Nachdenken bringt Gewinn' },
      { category: 'advanced', level: 'C2', phrase: 'কষ্ট বিনা কেষ্ট মেলে না', pronunciation: 'kosh-to bi-na kesh-to me-le na', en: 'No pain no gain', de: 'Ohne Fleiß kein Preis' }
    ],
    trivia: { en: 'Honored by International Mother Language Day.', de: 'Geehrt am Tag der Muttersprache.' },
    dailyPhrases: [
      { phrase: 'আস্তে আস্তে সব হয়', pronunciation: 'ash-te ash-te sob hoy', en: 'Slowly all happens', de: 'Gut Ding will Weile haben', literal: 'Slowly all occurs', level: 'A2' },
      { phrase: 'চেষ্টা কখনো বৃথা যায় না', pronunciation: 'ches-ta ko-kho-no bri-tha jay na', en: 'Effort never in vain', de: 'Anstrengung ist nie umsonst', literal: 'Effort never waste', level: 'B2' },
      { phrase: 'সময় কারো জন্য অপেক্ষা করে না', pronunciation: 'sho-moy ka-ro jon-yo', en: 'Time waits for no one', de: 'Zeit wartet auf niemanden', literal: 'Time waits for none', level: 'C1' }
    ]
  },
  {
    id: 'russian',
    nameEn: 'Russian',
    nameDe: 'Russisch',
    nativeName: 'Русский язык (Russkiy yazyk)',
    flag: '🇷🇺',
    speakers: '255M',
    family: 'Slavic',
    script: 'Cyrillic',
    regions: 'Russia, Central Asia, Eastern Europe',
    greeting: { phrase: 'Здравствуйте! (Zdravstvuyte!)', pronunciation: 'zdrahv-stvooy-tyeh', translationEn: 'Hello!', translationDe: 'Guten Tag!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Доброе утро (Dobroye utro)', pronunciation: 'doh-broh-yeh oo-troh', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Большое спасибо (Bolshoye spasibo)', pronunciation: 'bahl-shoy-eh spah-see-boh', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Где находится станция?', pronunciation: 'gdeh nah-kho-deet-syah stahn-tsee-yah', en: 'Where is the station?', de: 'Wo ist die Station?' },
      { category: 'social', level: 'B1', phrase: 'Как ваши дела? (Kak vashi dela?)', pronunciation: 'kahk vah-shee deh-lah', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'Век живи — век учись', pronunciation: 'vyek zhee-vee vyek oo-chees', en: 'Live and learn', de: 'Man lernt nie aus' },
      { category: 'advanced', level: 'C1', phrase: 'Тише едешь — дальше будешь', pronunciation: 'tee-sheh yeh-desh dahl-sheh boo-desh', en: 'Slow and steady wins race', de: 'Eile mit Weile' },
      { category: 'advanced', level: 'C2', phrase: 'Без труда не вытащишь и рыбку из пруда', pronunciation: 'byez troo-dah nyye vy-tah-shcheesh', en: 'No pain no gain', de: 'Ohne Fleiß kein Preis' }
    ],
    trivia: { en: 'Mandatory for astronaut training on the ISS.', de: 'Pflicht für Astronauten auf der ISS.' },
    dailyPhrases: [
      { phrase: 'Повторение — мать учения', pronunciation: 'pohv-toh-reh-nee-yeh', en: 'Repetition is mother of learning', de: 'Wiederholung ist Mutter der Weisheit', literal: 'Repetition mother of learning', level: 'A2' },
      { phrase: 'Семь раз отмерь, один раз отрежь', pronunciation: 'syem rahz oht-myer', en: 'Measure 7 times, cut once', de: 'Erst wägen, dann wagen', literal: 'Measure 7 times cut 1', level: 'B2' },
      { phrase: 'Терпение и труд всё перетрут', pronunciation: 'tyer-peh-nee-yeh ee trood', en: 'Patience and effort conquer all', de: 'Geduld bringt Erfolg', literal: 'Patience labor grind all', level: 'C1' }
    ]
  },
  {
    id: 'portuguese',
    nameEn: 'Portuguese',
    nameDe: 'Portugiesisch',
    nativeName: 'Português',
    flag: '🇵🇹',
    speakers: '260M',
    family: 'Romance',
    script: 'Latin',
    regions: 'Brazil, Portugal, Angola',
    greeting: { phrase: 'Olá! Como vai?', pronunciation: 'oh-lah koh-moo vahy', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Bom dia', pronunciation: 'boh-ee dee-ah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Muito obrigado', pronunciation: 'mwee-too oh-bree-gah-doo', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Onde fica a estação?', pronunciation: 'ohn-dee fee-kah ah es-tah-sah-oo', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'Estou aprendendo português', pronunciation: 'es-toh ah-pren-den-doo', en: 'I am learning Portuguese', de: 'Ich lerne Portugiesisch' },
      { category: 'advanced', level: 'B2', phrase: 'Quem não arrisca, não petisca', pronunciation: 'keng now ah-rees-kah', en: 'Nothing ventured nothing gained', de: 'Wer nicht wagt der nicht gewinnt' },
      { category: 'advanced', level: 'C1', phrase: 'Água mole em pedra dura tanto bate até que fura', pronunciation: 'ah-gwah moh-lee', en: 'Persistence achieves the impossible', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C2', phrase: 'Há males que vêm para bem', pronunciation: 'ah mah-lehs keh veng', en: 'A blessing in disguise', de: 'Ein Glück im Unglück' }
    ],
    trivia: { en: 'Over 80% of native speakers reside in Brazil.', de: 'Über 80% der Muttersprachler leben in Brasilien.' },
    dailyPhrases: [
      { phrase: 'Tudo bem!', pronunciation: 'too-doo behng', en: 'All good!', de: 'Alles gut!', literal: 'All well', level: 'A1' },
      { phrase: 'Devagar se vai ao longe', pronunciation: 'deh-vah-gahr seh vahy', en: 'Slowly one goes far', de: 'Wer langsam geht kommt weit', literal: 'Slowly goes far', level: 'B2' },
      { phrase: 'Antes só do que mal acompanhado', pronunciation: 'ahn-tehs soh', en: 'Better alone than in bad company', de: 'Besser allein als schlecht begleitet', literal: 'Better alone than ill accompanied', level: 'C1' }
    ]
  },
  {
    id: 'urdu',
    nameEn: 'Urdu',
    nameDe: 'Urdu',
    nativeName: 'اردو (Urdū)',
    flag: '🇵🇰',
    speakers: '231M',
    family: 'Indo-Aryan',
    script: 'Nastaliq',
    regions: 'Pakistan, India',
    greeting: { phrase: 'السلام علیکم', pronunciation: 'uh-suh-laam-oo uyl-ai-koom', translationEn: 'Peace be upon you', translationDe: 'Friede sei mit dir' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'صبح بخیر (Subah ba-khair)', pronunciation: 'soo-bah bah-khair', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'بہت شکریہ (Bohat shukriya)', pronunciation: 'boh-hut shoo-kree-yuh', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'اسٹیشن کہاں ہے؟ (Station kahan hai?)', pronunciation: 'station kuh-haan hai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'آپ کا نام کیا ہے؟ (Aap ka naam kya hai?)', pronunciation: 'aap kaa naam kya hai', en: 'What is your name?', de: 'Wie heißen Sie?' },
      { category: 'advanced', level: 'B2', phrase: 'ہمت مرداں مدد خدا', pronunciation: 'himmat-e-mardan madad-e-khuda', en: 'God helps those who help themselves', de: 'Hilf dir selbst dann hilft dir Gott' },
      { category: 'advanced', level: 'C1', phrase: 'قطرہ قطرہ دریا بنتا ہے', pronunciation: 'qatra qatra darya banta hai', en: 'Drop by drop forms an ocean', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C2', phrase: 'تندرستی ہزار نعمت ہے', pronunciation: 'tandarusti hazar neemat hai', en: 'Health is a thousand blessings', de: 'Gesundheit ist das höchste Gut' }
    ],
    trivia: { en: 'Ghazal poetry is world-renowned for emotional depth.', de: 'Ghasel-Poesie ist weltberühmt für Tiefe.' },
    dailyPhrases: [
      { phrase: 'خوش آمدید (Khush aamdeed)', pronunciation: 'khoosh aam-deed', en: 'Welcome', de: 'Willkommen', literal: 'Happy arrival', level: 'A1' },
      { phrase: 'صبر کا پھل میٹھا ہوتا ہے', pronunciation: 'sabr ka phal meetha hota hai', en: 'Patience bears sweet fruit', de: 'Geduld bringt Rosen', literal: 'Patience fruit is sweet', level: 'B2' },
      { phrase: 'عمل سے زندگی بنتی ہے', pronunciation: 'amal se zindagi banti hai', en: 'Actions shape life', de: 'Taten formen das Leben', literal: 'Action makes life', level: 'C1' }
    ]
  },
  {
    id: 'indonesian',
    nameEn: 'Indonesian',
    nameDe: 'Indonesisch',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    speakers: '200M',
    family: 'Austronesian',
    script: 'Latin',
    regions: 'Indonesia',
    greeting: { phrase: 'Halo! Apa kabar?', pronunciation: 'ha-lo ah-pa ka-bar', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Selamat pagi', pronunciation: 'seh-lah-mat pah-gee', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Terima kasih banyak', pronunciation: 'teh-ree-mah kah-see', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Di mana stasiun?', pronunciation: 'dee mah-nah stah-see-oon', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'Saya sedang belajar bahasa Indonesia', pronunciation: 'sah-yah seh-dang beh-lah-jar', en: 'I am learning Indonesian', de: 'Ich lerne Indonesisch' },
      { category: 'advanced', level: 'B2', phrase: 'Berakit-rakit ke hulu, berenang-renang ke tepian', pronunciation: 'behr-ah-kit ke hoo-loo', en: 'No pain no gain', de: 'Erst die Arbeit dann das Vergnügen' },
      { category: 'advanced', level: 'C1', phrase: 'Bermimpi setinggi langit', pronunciation: 'behr-mim-pee seh-ting-gee lah-ngit', en: 'Aim for the stars', de: 'Greife nach den Sternen' },
      { category: 'advanced', level: 'C2', phrase: 'Dimana bumi dipijak, disitu langit dijunjung', pronunciation: 'dee-mah-nah boo-mee dee-pee-jak', en: 'When in Rome do as the Romans do', de: 'Andere Länder andere Sitten' }
    ],
    trivia: { en: 'No verb tenses or gendered pronouns.', de: 'Keine Zeitformen bei Verben oder Geschlechter.' },
    dailyPhrases: [
      { phrase: 'Sedikit-sedikit menjadi bukit', pronunciation: 'seh-dee-kit seh-dee-kit', en: 'Little by little creates a mountain', de: 'Kleinvieh macht auch Mist', literal: 'Little by little becomes mountain', level: 'A2' },
      { phrase: 'Tak ada gading yang tak retak', pronunciation: 'tak ah-dah gah-ding', en: 'Nobody is perfect', de: 'Niemand ist perfekt', literal: 'No ivory without cracks', level: 'B2' },
      { phrase: 'Hemat pangkal kaya', pronunciation: 'heh-mat pahng-kal kah-yah', en: 'Thrift is the root of wealth', de: 'Sparen bringt Reichtum', literal: 'Thrift root of rich', level: 'C1' }
    ]
  },
  {
    id: 'japanese',
    nameEn: 'Japanese',
    nameDe: 'Japanisch',
    nativeName: '日本語 (Nihongo)',
    flag: '🇯🇵',
    speakers: '125M',
    family: 'Japonic',
    script: 'Hiragana/Katakana/Kanji',
    regions: 'Japan',
    greeting: { phrase: 'こんにちは！ (Konnichiwa!)', pronunciation: 'kohn-nee-chee-wah', translationEn: 'Hello!', translationDe: 'Guten Tag!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'おはようございます (Ohayou gozaimasu)', pronunciation: 'oh-hah-yoh go-zah-ee-mahs', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'ありがとうございます (Arigatou gozaimasu)', pronunciation: 'ah-ree-gah-toh go-zah-ee-mahs', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: '駅はどこですか？ (Eki wa doko desu ka?)', pronunciation: 'eh-kee wah doh-koh des kah', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: '日本語を勉強しています (Nihongo wo benkyou shiteimasu)', pronunciation: 'nee-hon-go woh ben-kyoh shee-tay-mahs', en: 'I am studying Japanese', de: 'Ich lerne Japanisch' },
      { category: 'advanced', level: 'B2', phrase: '七転び八起き (Nanakorobi yaoki)', pronunciation: 'nah-nah-koh-roh-bee', en: 'Fall 7 times stand up 8', de: 'Hinfallen aufstehen weitergehen' },
      { category: 'advanced', level: 'C1', phrase: '継続は力なり (Keizoku wa chikara nari)', pronunciation: 'kay-zoh-koo wah chee-kah-rah', en: 'Continuity is strength', de: 'Ausdauer brings Stärke' },
      { category: 'advanced', level: 'C2', phrase: '花鳥風月 (Kachou fuugetsu)', pronunciation: 'kah-choh foo-geht-soo', en: 'Appreciating nature’s beauty', de: 'Die Schönheit der Natur schätzen' }
    ],
    trivia: { en: 'Combines 3 writing systems in a single sentence.', de: 'Kombiniert 3 Schriftsysteme in einem Satz.' },
    dailyPhrases: [
      { phrase: '一期一会 (Ichigo ichie)', pronunciation: 'ee-chee-go ee-chee-eh', en: 'Treasure unrepeatable encounters', de: 'Schätze jeden einmaligen Moment', literal: 'One time one meeting', level: 'B1' },
      { phrase: '石の上にも三年 (Ishi no ue ni mo sannen)', pronunciation: 'ee-shee noh oo-eh', en: 'Perseverance brings success', de: 'Ausdauer führt zum Ziel', literal: '3 years on stone', level: 'B2' },
      { phrase: '千里の道も一歩から', pronunciation: 'sen-ree noh mee-chee', en: 'Journey of 1000 miles starts with 1 step', de: 'Längster Weg beginnt mit 1. Schritt', literal: '1000 mile road starts with 1 step', level: 'C1' }
    ]
  },
  {
    id: 'nigerian_pidgin',
    nameEn: 'Nigerian Pidgin',
    nameDe: 'Nigerianisches Pidgin',
    nativeName: 'Naija / Pidgin',
    flag: '🇳🇬',
    speakers: '120M',
    family: 'English Creole',
    script: 'Latin',
    regions: 'Nigeria, West Africa',
    greeting: { phrase: 'How far? / How body?', pronunciation: 'how far / how boh-dee', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Good morning o!', pronunciation: 'good mor-nin oh', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Thank you well well', pronunciation: 'thank you well well', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Where d bus stop dey?', pronunciation: 'where de bus stop dey', en: 'Where is the bus stop?', de: 'Wo ist die Bushaltestelle?' },
      { category: 'social', level: 'B1', phrase: 'I dey learn Naija pidgin', pronunciation: 'ee dey learn nai-ja pid-gin', en: 'I am learning Nigerian Pidgin', de: 'Ich lerne Nigerianisches Pidgin' },
      { category: 'advanced', level: 'B2', phrase: 'No wahala at all', pronunciation: 'no wah-ha-lah at all', en: 'No trouble whatsoever', de: 'Überhaupt kein Problem' },
      { category: 'advanced', level: 'C1', phrase: 'Monkey dey work, baboon dey chop', pronunciation: 'mon-key dey work', en: 'One works while another benefits unfairly', de: 'Einer arbeitet, der andere erntet' },
      { category: 'advanced', level: 'C2', phrase: 'Water drop drop dey fill pot', pronunciation: 'wah-ter drop drop', en: 'Small efforts accumulate to big results', de: 'Kleinvieh macht auch Mist' }
    ],
    trivia: { en: 'Lingua franca connecting over 250 ethnic groups.', de: 'Verbindungssprache für 250 Ethnien.' },
    dailyPhrases: [
      { phrase: 'No condition is permanent', pronunciation: 'no con-di-shon is per-ma-nent', en: 'Things change for better', de: 'Alles verändert sich', literal: 'No condition permanent', level: 'A1' },
      { phrase: 'Slow and steady win race', pronunciation: 'slow and stea-dy', en: 'Patience leads to success', de: 'Geduld bringt Erfolg', literal: 'Slow wins race', level: 'B1' },
      { phrase: 'E go better', pronunciation: 'ee go bet-ter', en: 'Things will improve', de: 'Es wird besser werden', literal: 'It will be better', level: 'B2' }
    ]
  },
  {
    id: 'marathi',
    nameEn: 'Marathi',
    nameDe: 'Marathi',
    nativeName: 'मराठी (Marāṭhī)',
    flag: '🇮🇳',
    speakers: '99M',
    family: 'Indo-Aryan',
    script: 'Devanagari',
    regions: 'Maharashtra (Mumbai)',
    greeting: { phrase: 'नमस्कार! (Namaskar!)', pronunciation: 'nuh-mus-kaar', translationEn: 'Greetings', translationDe: 'Grüße' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'शुभ सकाळ (Shubh sakaal)', pronunciation: 'shoob suh-kaal', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'धन्यवाद (Dhanyavaad)', pronunciation: 'dhun-yuh-vaad', en: 'Thank you', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'स्टेशन कुठे आहे? (Station kuthe aahe?)', pronunciation: 'station koo-they aa-hey', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'तुम्ही कसे आहात? (Tumhi kase aahat?)', pronunciation: 'toom-hee kuh-say aa-haat', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'प्रयत्नांती परमेश्वर (Prayatnaanti Parameshwar)', pronunciation: 'pruh-yut-naan-tee', en: 'Through effort comes divine success', de: 'Durch Ausdauer ans Ziel' },
      { category: 'advanced', level: 'C1', phrase: 'थेंबे थेंबे तळे साचे (Thembe thembe tale sache)', pronunciation: 'them-bey them-bey', en: 'Drop by drop a lake accumulates', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C2', phrase: 'करावे तसे भरावे (Karave tase bharave)', pronunciation: 'kuh-raa-vey tuh-say', en: 'As you sow so shall you reap', de: 'Wie man sät so erntet man' }
    ],
    trivia: { en: 'Literary history spans over 1,000 years.', de: 'Literaturgeschichte über 1000 Jahre.' },
    dailyPhrases: [
      { phrase: 'प्रयत्नांती परमेश्वर', pronunciation: 'pruh-yut-naan-tee', en: 'Perseverance brings success', de: 'Ausdauer bringt Erfolg', literal: 'Effort brings God', level: 'B2' },
      { phrase: 'कष्टाचे फळ गोड असते', pronunciation: 'kush-taa-chey phal', en: 'Fruit of hard work is sweet', de: 'Fleiß wird belohnt', literal: 'Hard work fruit is sweet', level: 'B1' },
      { phrase: 'सत्यमेव जयते', pronunciation: 'sut-yuh-mey-vuh', en: 'Truth alone triumphs', de: 'Wahrheit siegt stets', literal: 'Truth alone wins', level: 'C1' }
    ]
  },
  {
    id: 'telugu',
    nameEn: 'Telugu',
    nameDe: 'Telugu',
    nativeName: 'తెలుగు (Telugu)',
    flag: '🇮🇳',
    speakers: '96M',
    family: 'Dravidian',
    script: 'Telugu',
    regions: 'Andhra & Telangana',
    greeting: { phrase: 'నమస్కారం! (Namaskaram!)', pronunciation: 'nuh-mus-kaa-rum', translationEn: 'Greetings', translationDe: 'Grüße' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'శుభోదయం (Shubhodayam)', pronunciation: 'shoo-bho-duh-yum', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'ధన్యవాదాలు (Dhanyavadalu)', pronunciation: 'dhun-yuh-vaa-daa-loo', en: 'Thank you', de: 'Danke' },
      { category: 'travel', level: 'A2', phrase: 'స్టేషన్ ఎక్కడ ఉంది? (Station ekkada undi?)', pronunciation: 'station ek-kuh-duh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?)', pronunciation: 'mee-roo eh-laa oon-naa-roo', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'కృషితో నాస్తి దుర్భオブジェクト', pronunciation: 'kroo-shee-tho naas-tee', en: 'Hard work removes all hardship', de: 'Harte Arbeit überwindet Not' },
      { category: 'advanced', level: 'C1', phrase: 'బిందువు బిందువు సింధువవుతుంది', pronunciation: 'been-doo-voo been-doo-voo', en: 'Drop by drop creates an ocean', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C2', phrase: 'మొక్కై వంగనిది మానై వంగునా', pronunciation: 'mok-kai vung-guh-nee-dee', en: 'What doesn’t bend as a sapling won’t bend as a tree', de: 'Was Hänschen nicht lernt lernt Hans nimmermehr' }
    ],
    trivia: { en: 'Every native word ends in a vowel sound.', de: 'Jedes einheimische Wort endet auf einen Vokal.' },
    dailyPhrases: [
      { phrase: 'కృషితో నాస్తి దుర్భక్షం', pronunciation: 'kroo-shee-tho', en: 'Hard work removes hardship', de: 'Arbeit überwindet Not', literal: 'With effort no famine', level: 'B2' },
      { phrase: 'సాధన చేయగా పనులు సులభమవుతాయి', pronunciation: 'saa-dhu-nuh chay-yuh-gaa', en: 'Practice makes tasks easy', de: 'Übung macht Dinge leicht', literal: 'Practice makes tasks easy', level: 'A2' },
      { phrase: 'నిజమే ఎప్పటికైనా గెలుస్తుంది', pronunciation: 'nee-juh-may', en: 'Truth triumphs eventually', de: 'Wahrheit siegt am Ende', literal: 'Truth wins eventually', level: 'C1' }
    ]
  },
  {
    id: 'turkish',
    nameEn: 'Turkish',
    nameDe: 'Türkisch',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    speakers: '88M',
    family: 'Turkic',
    script: 'Latin',
    regions: 'Turkey & Northern Cyprus',
    greeting: { phrase: 'Merhaba! Nasılsınız?', pronunciation: 'mair-hah-bah nah-suhl-suh-nuhz', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht es Ihnen?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Günaydın', pronunciation: 'goo-nahy-duhn', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Teşekkür ederim', pronunciation: 'teh-shehk-kyoor eh-deh-reem', en: 'Thank you', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'İstasyon nerede?', pronunciation: 'ees-tahs-yohn neh-reh-deh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'Türkçe öğreniyorum', pronunciation: 'tyoork-cheh uhg-reh-nee-yoh-room', en: 'I am learning Turkish', de: 'Ich lerne Türkisch' },
      { category: 'advanced', level: 'B2', phrase: 'Damlaya damlaya göl olur', pronunciation: 'dahm-lah-yah dahm-lah-yah', en: 'Drop by drop a lake forms', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C1', phrase: 'Tatlı dil yılanı deliğinden çıkarır', pronunciation: 'taht-luh deel yuh-lah-nuh', en: 'Sweet speech draws snakes out of holes', de: 'Freundliche Worte bewirken Wunder' },
      { category: 'advanced', level: 'C2', phrase: 'Emek olmadan yemek olmaz', pronunciation: 'eh-mehk ohl-mah-dahn', en: 'No meal without effort', de: 'Ohne Fleiß kein Preis' }
    ],
    trivia: { en: 'Agglutinative structure chaining suffixes.', de: 'Agglutinierende Struktur mit Endungen.' },
    dailyPhrases: [
      { phrase: 'Damlaya damlaya göl olur', pronunciation: 'dahm-lah-yah guhl oh-loor', en: 'Drop by drop a lake forms', de: 'Steter Tropfen höhlt den Stein', literal: 'Drop by drop becomes lake', level: 'A2' },
      { phrase: 'Aslan yattığı yerden belli olur', pronunciation: 'ahs-lahn yaht-tuh-ghuh', en: 'Environment reveals character', de: 'Der Apfel fällt nicht weit vom Stamm', literal: 'Lion known where it lies', level: 'B2' },
      { phrase: 'Güneş girmeyen eve doktor girer', pronunciation: 'gyoo-nesh geer-meh-yen', en: 'Sunlight keeps doctor away', de: 'Sonne brings Gesundheit', literal: 'Doctor enters home without sun', level: 'C1' }
    ]
  },
  {
    id: 'tamil',
    nameEn: 'Tamil',
    nameDe: 'Tamil',
    nativeName: 'தமிழ் (Tamiḻ)',
    flag: '🇮🇳',
    speakers: '86M',
    family: 'Dravidian',
    script: 'Tamil',
    regions: 'Tamil Nadu, LK, SG',
    greeting: { phrase: 'வணக்கம்! (Vanakkam!)', pronunciation: 'va-nak-kam', translationEn: 'Greetings', translationDe: 'Grüße' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'காலை வணக்கம் (Kaalai vanakkam)', pronunciation: 'kaa-lai va-nak-kam', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'மிக்க நன்றி (Mikka nandri)', pronunciation: 'mik-ka nan-dri', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'நிலையம் எங்கே? (Nilaiyam enge?)', pronunciation: 'ni-lai-yam en-ge', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', pronunciation: 'neeng-gal ep-di iru-kee-reer-gal', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'முயற்சி திருவினையாக்கும்', pronunciation: 'moo-yar-chi thi-ru-vi-nai', en: 'Effort brings prosperity', de: 'Anstrengung bringt Erfolg' },
      { category: 'advanced', level: 'C1', phrase: 'சித்திரமும் கைப்பழக்கம் செந்தமிழும் நாப்பழக்கம்', pronunciation: 'chith-thi-ra-mum', en: 'Art is skill of hand, Tamil is skill of tongue', de: 'Übung macht den Meister' },
      { category: 'advanced', level: 'C2', phrase: 'யாதும் ஊரே யாவரும் கேளிர்', pronunciation: 'yaa-dhum oo-ray', en: 'Every city is my home, all people are my kin', de: 'Die ganze Welt ist meine Heimat' }
    ],
    trivia: { en: 'Over 2,000 years of continuous literature.', de: 'Über 2000 Jahre kontinuierliche Literatur.' },
    dailyPhrases: [
      { phrase: 'முயற்சி திருவினையாக்கும்', pronunciation: 'moo-yar-chi', en: 'Effort brings prosperity', de: 'Anstrengung bringt Erfolg', literal: 'Effort creates wealth', level: 'B2' },
      { phrase: 'பொறுத்தார் பூமி ஆள்வார்', pronunciation: 'po-ruh-thaar', en: 'Patient ones will rule the earth', de: 'Geduld führt zur Macht', literal: 'Patient will rule earth', level: 'C1' },
      { phrase: 'அறிவே ஆற்றல்', pronunciation: 'a-ree-vay aat-ral', en: 'Knowledge is power', de: 'Wissen ist Macht', literal: 'Knowledge is power', level: 'A1' }
    ]
  },
  {
    id: 'cantonese',
    nameEn: 'Cantonese',
    nameDe: 'Kantonesisch',
    nativeName: '粵語 (Jyutjyu)',
    flag: '🇭🇰',
    speakers: '86M',
    family: 'Sino-Tibetan',
    script: 'Traditional Characters',
    regions: 'Hong Kong, Macao, Guangdong',
    greeting: { phrase: '你好！(Nei5 hou2!)', pronunciation: 'nay how', translationEn: 'Hello!', translationDe: 'Hallo!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: '早晨 (Zou2 san4)', pronunciation: 'zoh sun', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: '多謝 (Do1 ze6)', pronunciation: 'dor jeh', en: 'Thank you (gifts)', de: 'Danke (Geschenke)' },
      { category: 'travel', level: 'A2', phrase: '洗手間喺邊度？ (Sai2 sau2 gaan1 bin1 dou6?)', pronunciation: 'sy-saw-kaan bin-too', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', level: 'B1', phrase: '你識唔識講英文？ (Nei5 sik1 m4 sik1)', pronunciation: 'nay sik mm sik', en: 'Do you speak English?', de: 'Sprechen Sie Englisch?' },
      { category: 'advanced', level: 'B2', phrase: '世上無難事，只怕有心人', pronunciation: 'sai soeng mou naan si', en: 'Nothing in the world is difficult for a willing heart', de: 'Wo ein Wille ist ist ein Weg' },
      { category: 'advanced', level: 'C1', phrase: '積少成多 (Zik1 siu2 sing4 do1)', pronunciation: 'zik siu sing dor', en: 'Small amounts accumulate into much', de: 'Kleinvieh macht auch Mist' },
      { category: 'advanced', level: 'C2', phrase: '飲水思源 (Jam2 seoi2 si1 jyun4)', pronunciation: 'yum seui see yuen', en: 'When drinking water remember its source', de: 'Wurzeln nie vergessen' }
    ],
    trivia: { en: 'Preserves 6 to 9 distinct tones.', de: 'Bewahrt 6 bis 9 Töne.' },
    dailyPhrases: [
      { phrase: '飲茶 (Jam2 caa4)', pronunciation: 'yum cha', en: 'Enjoy tea & Dim Sum!', de: 'Tee trinken & Dim Sum!', literal: 'Drink tea', level: 'A1' },
      { phrase: '加油 (Gaa1 jau2)', pronunciation: 'gah yau', en: 'Keep going!', de: 'Gib dein Bestes!', literal: 'Add oil', level: 'A2' },
      { phrase: '路遙知馬力', pronunciation: 'lou jiu zi maa lik', en: 'Time reveals a true friend', de: 'Zeit zeigt wahre Freunde', literal: 'Long road tests horse strength', level: 'C1' }
    ]
  },
  {
    id: 'vietnamese',
    nameEn: 'Vietnamese',
    nameDe: 'Vietnamesisch',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    speakers: '85M',
    family: 'Austroasiatic',
    script: 'Latin (Diacritics)',
    regions: 'Vietnam',
    greeting: { phrase: 'Xin chào! Bạn khỏe không?', pronunciation: 'seen chow ban khweh khawng', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Chào buổi sáng', pronunciation: 'chow booy sahng', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Cảm ơn nhiều', pronunciation: 'kahm uhn nyew', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Nhà vệ sinh ở đâu?', pronunciation: 'nyah veh seen uh dow', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', level: 'B1', phrase: 'Tôi đang học tiếng Việt', pronunciation: 'toy dang hok tyeng vyet', en: 'I am learning Vietnamese', de: 'Ich lerne Vietnamesisch' },
      { category: 'advanced', level: 'B2', phrase: 'Có công mài sắt, có ngày nên kim', pronunciation: 'kaw kawng my sut', en: 'Perseverance turns iron into a needle', de: 'Geduld bringt Rosen' },
      { category: 'advanced', level: 'C1', phrase: 'Uống nước nhớ nguồn', pronunciation: 'woong nwuhk nyaw ngwon', en: 'When drinking water remember the source', de: 'Dankbar gegenüber Herkunft sein' },
      { category: 'advanced', level: 'C2', phrase: 'Đi một ngày đàng, học một sàng khôn', pronunciation: 'dee mot ngay dang', en: 'Traveling 1 day brings a basket of wisdom', de: 'Reisen bildet den Geist' }
    ],
    trivia: { en: 'Uses 6 distinct tones indicated by marks.', de: 'Nutzt 6 Töne mit Tonzeichen.' },
    dailyPhrases: [
      { phrase: 'Có công mài sắt, có ngày nên kim', pronunciation: 'kaw kawng my sut', en: 'Perseverance turns iron into a needle', de: 'Geduld bringt Rosen', literal: 'Grinding iron turns to needle', level: 'B2' },
      { phrase: 'Vạn sự khởi đầu nan', pronunciation: 'van soo khoy dow nan', en: 'Every beginning is hard', de: 'Aller Anfang ist schwer', literal: '10000 things start hard', level: 'B1' },
      { phrase: 'Cần cù bù thông minh', pronunciation: 'can coo boo thong meenh', en: 'Diligence compensates for talent', de: 'Fleiß schlägt Talent', literal: 'Diligence compensates intelligence', level: 'C1' }
    ]
  },
  {
    id: 'tagalog',
    nameEn: 'Tagalog / Filipino',
    nameDe: 'Tagalog / Filipino',
    nativeName: 'Wikang Tagalog',
    flag: '🇵🇭',
    speakers: '82M',
    family: 'Austronesian',
    script: 'Latin',
    regions: 'Philippines',
    greeting: { phrase: 'Kamusta ka?', pronunciation: 'kah-moos-tah kah', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Magandang umaga', pronunciation: 'mah-gahn-dahng oo-mah-gah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Maraming salamat', pronunciation: 'mah-rah-meeng sah-lah-mat', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Nasaan ang banyo?', pronunciation: 'nah-sah-ahn ahng bahn-yoh', en: 'Where is the bathroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', level: 'B1', phrase: 'Nagluluto ka ba?', pronunciation: 'nahg-loo-loo-toh kah bah', en: 'Do you cook?', de: 'Kochst du?' },
      { category: 'advanced', level: 'B2', phrase: 'Habang may buhay, may pag-asa', pronunciation: 'hah-bahng my boo-hay', en: 'While there is life there is hope', de: 'Solange Leben da ist ist Hoffnung' },
      { category: 'advanced', level: 'C1', phrase: 'Ang hindi lumingon sa pinanggalingan ay hindi makararating sa paroroonan', pronunciation: 'ang heen-dee loo-meeng-on', en: 'He who does not look back will not reach destination', de: 'Wurzeln nicht vergessen' },
      { category: 'advanced', level: 'C2', phrase: 'Aanhin pa ang damo kung patay na ang kabayo', pronunciation: 'ah-ahn-heen pah ang dah-moh', en: 'What good is grass if horse is dead (Belated help is useless)', de: 'Zu späte Hilfe nützt nichts' }
    ],
    trivia: { en: 'Richly blends Spanish & English loanwords.', de: 'Enthält spanische & englische Lehnwörter.' },
    dailyPhrases: [
      { phrase: 'Habang may buhay, may pag-asa', pronunciation: 'hah-bahng my boo-hay', en: 'While life exists hope exists', de: 'Solange Leben da ist gibt es Hoffnung', literal: 'While life hope exists', level: 'A2' },
      { phrase: 'Nasa diyos ang awa, nasa tao ang gawa', pronunciation: 'nah-sah dyos ang ah-wah', en: 'God shows mercy, human acts', de: 'Hilf dir selbst dann hilft dir Gott', literal: 'Mercy with God action with human', level: 'B2' },
      { phrase: 'Ang matapat na kaibigan, tunay na kayamanan', pronunciation: 'ang mah-tah-paht na kah-ee-bee-gan', en: 'A faithful friend is true wealth', de: 'Ein treuer Freund ist echter Schatz', literal: 'Faithful friend true wealth', level: 'C1' }
    ]
  },
  {
    id: 'punjabi',
    nameEn: 'Punjabi',
    nameDe: 'Pandschabi',
    nativeName: 'ਪੰਜਾਬੀ / پنجابی',
    flag: '🇵🇰',
    speakers: '113M',
    family: 'Indo-Aryan',
    script: 'Gurmukhi / Shahmukhi',
    regions: 'Punjab (PK & IN), CA, UK',
    greeting: { phrase: 'सत श्री अकाल (Sat Sri Akaal)', pronunciation: 'sut sree uh-kaal', translationEn: 'God is Eternal Truth', translationDe: 'Gott ist ewige Wahrheit' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'ਚੰਗਾ ਦਿਨ (Changa din)', pronunciation: 'chun-gaa din', en: 'Good day', de: 'Guten Tag' },
      { category: 'basics', level: 'A1', phrase: 'ਬਹੁਤ ਧੰਨਵਾਦ (Bohat dhanvaad)', pronunciation: 'boh-hut dhun-vaad', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ? (Station kitthe hai?)', pronunciation: 'station kit-the hai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'ਤੁਹਾਡਾ ਕੀ ਹਾਲ ਹੈ? (Tuhada ki haal hai?)', pronunciation: 'too-haa-daa kee haal hai', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'ਮਿਹਨਤ ਦਾ ਛੱਡੋ ਨਾ ਲੜ', pronunciation: 'meh-nut daa', en: 'Never give up hard work', de: 'Gib fleißige Arbeit nie auf' },
      { category: 'advanced', level: 'C1', phrase: 'ਹੌਲੀ ਹੌਲੀ ਮੰਜਿਲ ਮਿਲ ਹੀ ਜਾਂਦੀ ਹੈ', pronunciation: 'ho-lee ho-lee', en: 'Slowly slowly destination is reached', de: 'Schritt für Schritt ans Ziel' },
      { category: 'advanced', level: 'C2', phrase: 'ਜਿਹੋ ਜਿਹਾ ਬੀਜੋਗੇ ਉโห ਜਿਹਾ ਵੱਢੋਗੇ', pronunciation: 'jee-ho jee-haa', en: 'As you sow so shall you reap', de: 'Wie man sät so erntet man' }
    ],
    trivia: { en: 'Tonal Indo-European language.', de: 'Tonale indogermanische Sprache.' },
    dailyPhrases: [
      { phrase: 'Chardi Kala (ਚੜ੍ਹਦੀ ਕਲਾ)', pronunciation: 'char-dee ku-laa', en: 'Ever-rising optimism', de: 'Unerschütterlicher Optimismus', literal: 'Rising spirits', level: 'B1' },
      { phrase: 'ਮਿਹਨਤ ਦਾ ਫਲ ਮਿੱਠਾ ਹੁੰਦਾ ਹੈ', pronunciation: 'meh-nut daa phal', en: 'Fruit of labor is sweet', de: 'Fleiß wird belohnt', literal: 'Effort fruit sweet', level: 'B2' },
      { phrase: 'ਏਕਤਾ ਵਿੱਚ ਬਲ ਹੈ', pronunciation: 'eyk-taa vich bul hai', en: 'Unity is strength', de: 'Einigkeit macht stark', literal: 'In unity strength', level: 'C1' }
    ]
  },
  {
    id: 'korean',
    nameEn: 'Korean',
    nameDe: 'Koreanisch',
    nativeName: '한국어 (Hangugeo)',
    flag: '🇰🇷',
    speakers: '81M',
    family: 'Koreanic',
    script: 'Hangul',
    regions: 'South & North Korea',
    greeting: { phrase: '안녕하세요! (Annyeonghaseyo!)', pronunciation: 'ahn-nyeong-hah-seh-yoh', translationEn: 'Hello!', translationDe: 'Hallo!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: '좋은 아침입니다', pronunciation: 'joh-eun ah-cheem', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: '감사합니다 (Gamsahamnida)', pronunciation: 'gahm-sah-hahm-nee-dah', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: '화장실이 어디예요?', pronunciation: 'hwah-jahng-sheer-ee', en: 'Where is the restroom?', de: 'Wo ist die Toilette?' },
      { category: 'social', level: 'B1', phrase: '한국어를 공부하고 있어요', pronunciation: 'hahn-goo-geohr gong-boo-hah-goh', en: 'I am studying Korean', de: 'Ich lerne Koreanisch' },
      { category: 'advanced', level: 'B2', phrase: '고생 끝에 낙이 온다', pronunciation: 'goh-saeng kkeut-eh', en: 'Pleasure comes after hardship', de: 'Nach dem Regen kommt Sonne' },
      { category: 'advanced', level: 'C1', phrase: '티끌 모아 태산', pronunciation: 'teek-kkeul moh-ah', en: 'Gathering dust creates a mountain', de: 'Kleinvieh macht auch Mist' },
      { category: 'advanced', level: 'C2', phrase: '시작이 반이다', pronunciation: 'shee-jahg-ee bahn-ee-dah', en: 'Starting is half the battle', de: 'Frisch gewagt ist halb gewonnen' }
    ],
    trivia: { en: 'Hangul alphabet was created in 1443.', de: 'Hangul-Alphabet wurde 1443 entwickelt.' },
    dailyPhrases: [
      { phrase: '파이ティング! (Fighting!)', pronunciation: 'hwah-ee-teeng', en: 'You can do it!', de: 'Gib dein Bestes!', literal: 'Fighting!', level: 'A1' },
      { phrase: '우물을 파도 한 우물을 파라', pronunciation: 'oo-moor-eul pah-doh', en: 'Focus on 1 goal to succeed', de: 'Fokussiere auf 1 Ziel', literal: 'Dig 1 well', level: 'B2' },
      { phrase: '백지장도 맞들면 낫다', pronunciation: 'baek-jee-jahng-doh', en: 'Two heads better than one', de: 'Zwei Köpfe sind besser als 1', literal: 'Paper lighter together', level: 'C1' }
    ]
  },
  {
    id: 'persian',
    nameEn: 'Persian (Farsi)',
    nameDe: 'Persisch (Farsi)',
    nativeName: 'فارسی (Fārsī)',
    flag: '🇮🇷',
    speakers: '77M',
    family: 'Indo-Iranian',
    script: 'Perso-Arabic',
    regions: 'Iran, AF, TJ',
    greeting: { phrase: 'سلام! (Salām!)', pronunciation: 'sah-laam', translationEn: 'Hello!', translationDe: 'Hallo!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'صبح بخیر (Sobh bekheyr)', pronunciation: 'sobh beh-kheyr', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'خیلی ممنون (Kheyli mamnoon)', pronunciation: 'khey-lee mahm-noon', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'ایستگاه کجاست؟ (Istgah kojast?)', pronunciation: 'ees-gaah koh-jahst', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'حالت چطوره؟ (Halet chetore?)', pronunciation: 'haa-let cheh-toh-reh', en: 'How are you?', de: 'Wie geht’s dir?' },
      { category: 'advanced', level: 'B2', phrase: 'کار نیکی انجام دهید', pronunciation: 'kaar-e nee-kee', en: 'Do good deeds without expecting reward', de: 'Tue Gutes ohne Gegenleistung' },
      { category: 'advanced', level: 'C1', phrase: 'قطره قطره جمع گردد وانگهی دریا شود', pronunciation: 'qatreh qatreh jam gardad', en: 'Drop by drop creates an ocean', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C2', phrase: 'جوينده يابنده است', pronunciation: 'jooyandeh yabandeh ast', en: 'He who searches finds', de: 'Wer sucht der findet' }
    ],
    trivia: { en: 'Rumi & Hafez poetry spans over 1,000 years.', de: 'Rumi & Hafez Poesie über 1000 Jahre.' },
    dailyPhrases: [
      { phrase: 'خسته نباشید (Khaste nabashid)', pronunciation: 'khas-teh nah-baa-sheed', en: 'May you not be tired (Appreciation of work)', de: 'Anerkennung für geleistete Arbeit', literal: 'Don’t be tired', level: 'A2' },
      { phrase: 'گر صبر کنی ز غوره حلوا سازی', pronunciation: 'gar sabr koni', en: 'Patience turns sour grapes sweet', de: 'Geduld bringt Rosen', literal: 'Patience turns sour grape to halva', level: 'B2' },
      { phrase: 'کوه به کوه نمی‌رسه، آدم به آدم می‌رسه', pronunciation: 'kooh beh kooh', en: 'Mountains don’t meet but people do', de: 'Man sieht sich immer zweimal im Leben', literal: 'Mountain doesn’t reach mountain human reaches human', level: 'C1' }
    ]
  },
  {
    id: 'italian',
    nameEn: 'Italian',
    nameDe: 'Italienisch',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    speakers: '67M',
    family: 'Romance',
    script: 'Latin',
    regions: 'Italy, CH, SM',
    greeting: { phrase: 'Ciao! Come stai?', pronunciation: 'chow koh-meh sty', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht es dir?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Buongiorno', pronunciation: 'bwon-zhor-noh', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Grazie mille', pronunciation: 'graht-zyeh meel-leh', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Dov’è la stazione?', pronunciation: 'doh-veh lah stah-tsyoh-neh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'Sto imparando l’italiano', pronunciation: 'stoh eem-pah-rahn-doh', en: 'I am learning Italian', de: 'Ich lerne Italienisch' },
      { category: 'advanced', level: 'B2', phrase: 'Chi va piano, va sano e va lontano', pronunciation: 'kee vah pyah-noh', en: 'Slow and steady wins race', de: 'Gut Ding will Weile haben' },
      { category: 'advanced', level: 'C1', phrase: 'L’unione fa la forza', pronunciation: 'loo-nyoh-neh fah lah fohr-tsah', en: 'Unity is strength', de: 'Einigkeit macht stark' },
      { category: 'advanced', level: 'C2', phrase: 'Meglio tardi che mai', pronunciation: 'meh-lyoh tahr-dee keh my', en: 'Better late than never', de: 'Besser spät als nie' }
    ],
    trivia: { en: 'Language of international musical scores.', de: 'Sprache der Musiknoten.' },
    dailyPhrases: [
      { phrase: 'La dolce vita', pronunciation: 'lah dohl-cheh vee-tah', en: 'The sweet life', de: 'Das süße Leben', literal: 'The sweet life', level: 'A1' },
      { phrase: 'A caval donato non si guarda in bocca', pronunciation: 'ah kah-vahl doh-nah-toh', en: 'Don’t look gift horse in mouth', de: 'Geschenktem Gaul schaut man nicht ins Maul', literal: 'Don’t look gifted horse in mouth', level: 'B2' },
      { phrase: 'Tutto è bene quel che finisce bene', pronunciation: 'toot-toh eh beh-neh', en: 'All’s well that ends well', de: 'Ende gut alles gut', literal: 'All is well ending well', level: 'C1' }
    ]
  },
  {
    id: 'hausa',
    nameEn: 'Hausa',
    nameDe: 'Hausa',
    nativeName: 'Hausa / هَوُسَ',
    flag: '🇳🇬',
    speakers: '77M',
    family: 'Afroasiatic',
    script: 'Boko / Ajami',
    regions: 'Nigeria, Niger, West Africa',
    greeting: { phrase: 'Sannu! Ina kwana?', pronunciation: 'sahn-noo ee-nah kwah-nah', translationEn: 'Hello! Good morning', translationDe: 'Hallo! Guten Morgen' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Ina kwana', pronunciation: 'ee-nah kwah-nah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Nagode kwarai', pronunciation: 'nah-goh-deh kwah-ray', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Ina ne tashar?', pronunciation: 'ee-nah neh tah-shar', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'Ina jin hausa kadan', pronunciation: 'ee-nah jeen haw-sah kah-dan', en: 'I speak a little Hausa', de: 'Ich spreche ein wenig Hausa' },
      { category: 'advanced', level: 'B2', phrase: 'Sannu sannu bata hana zuwa', pronunciation: 'sahn-noo sahn-noo', en: 'Slow progress reaches destination', de: 'Langsamer Fortschritt führt ans Ziel' },
      { category: 'advanced', level: 'C1', phrase: 'Baki shiru maganin dafa kansa', pronunciation: 'bah-kee shee-roo', en: 'Silence is the best medicine', de: 'Schweigen ist die beste Arznei' },
      { category: 'advanced', level: 'C2', phrase: 'Hannu daya ba ya daukar nauyi', pronunciation: 'hahn-noo dah-yah', en: 'One hand cannot lift a heavy load alone', de: 'Gemeinsam schafft man mehr' }
    ],
    trivia: { en: 'Primary trade language across West Africa.', de: 'Handelssprache in Westafrika.' },
    dailyPhrases: [
      { phrase: 'Sannu sannu bata hana zuwa', pronunciation: 'sahn-noo sahn-noo', en: 'Slow progress reaches goal', de: 'Langsamer Fortschritt führt ans Ziel', literal: 'Slowly doesn’t stop arrival', level: 'B2' },
      { phrase: 'Aiki da kwazo yana kawo nasara', pronunciation: 'ay-kee dah kwah-zoh', en: 'Hard work brings victory', de: 'Harte Arbeit bringt Erfolg', literal: 'Work with energy brings victory', level: 'B1' },
      { phrase: 'Ilimi haske ne', pronunciation: 'ee-lee-mee hahs-keh neh', en: 'Knowledge is light', de: 'Wissen ist Licht', literal: 'Knowledge is light', level: 'A1' }
    ]
  },
  {
    id: 'javanese',
    nameEn: 'Javanese',
    nameDe: 'Javanisch',
    nativeName: 'Basa Jawa / ꦧꦱꦗꦮ',
    flag: '🇮🇩',
    speakers: '68M',
    family: 'Austronesian',
    script: 'Latin / Hanacaraka',
    regions: 'Java (Indonesia)',
    greeting: { phrase: 'Sugeng enjang! Piye kabare?', pronunciation: 'soo-geng en-jahng', translationEn: 'Good morning! How are you?', translationDe: 'Guten Morgen! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'Sugeng enjang', pronunciation: 'soo-geng en-jahng', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'Matur nuwun sanget', pronunciation: 'mah-toor noo-woon', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'Stasiun wonten pundi?', pronunciation: 'stah-see-oon won-ten poon-dee', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'Kula nembe sinau basa Jawa', pronunciation: 'koo-lah nem-beh see-naw', en: 'I am learning Javanese', de: 'Ich lerne Javanisch' },
      { category: 'advanced', level: 'B2', phrase: 'Alon-alon asal kelakon', pronunciation: 'ah-lon ah-lon ah-sal keh-lah-kon', en: 'Slowly but surely done', de: 'Langsam aber sicher ins Ziel' },
      { category: 'advanced', level: 'C1', phrase: 'Urip iku urup', pronunciation: 'oo-rip ee-koo oo-roop', en: 'Life should illuminate others', de: 'Das Leben soll anderen nützen' },
      { category: 'advanced', level: 'C2', phrase: 'Sura dira jayaningrat lebur dening pangastuti', pronunciation: 'soo-rah dee-rah', en: 'Violence & greed are overcome by wisdom & kindness', de: 'Weisheit siegt über Gewalt' }
    ],
    trivia: { en: 'Uses social speech levels (Ngoko & Krama).', de: 'Nutzt Höflichkeitsstufen (Ngoko & Krama).' },
    dailyPhrases: [
      { phrase: 'Alon-alon asal kelakon', pronunciation: 'ah-lon ah-lon', en: 'Slowly but surely done', de: 'Langsam aber sicher ins Ziel', literal: 'Slowly as long as done', level: 'A2' },
      { phrase: 'Urip iku urup', pronunciation: 'oo-rip ee-koo oo-roop', en: 'Life should shine for others', de: 'Leben soll nützen', literal: 'Life is light', level: 'B2' },
      { phrase: 'Jer basuki mawa beya', pronunciation: 'jer bah-soo-kee', en: 'Success requires sacrifice & effort', de: 'Ohne Fleiß kein Preis', literal: 'Success requires cost', level: 'C1' }
    ]
  },
  {
    id: 'egyptian_arabic',
    nameEn: 'Egyptian Arabic',
    nameDe: 'Ägyptisch-Arabisch',
    nativeName: 'عامية مصري (ʿĀmmiyya Maṣriyya)',
    flag: '🇪🇬',
    speakers: '75M',
    family: 'Semitic',
    script: 'Arabic',
    regions: 'Egypt',
    greeting: { phrase: 'إزيك؟ (Izayyak?)', pronunciation: 'iz-zay-yak', translationEn: 'How are you?', translationDe: 'Wie geht’s dir?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'صباح الخير (Sabah el-kheer)', pronunciation: 'sa-baah el-kheer', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'شكراً أوي (Shukran awi)', pronunciation: 'shook-ran ah-wee', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'فين المحطة؟ (Feen el-mahatta?)', pronunciation: 'feen el-ma-hat-ta', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'بتتكلم إنجليزي؟ (Bititkallim ingleezi?)', pronunciation: 'bee-tit-kal-lim', en: 'Do you speak English?', de: 'Sprechen Sie Englisch?' },
      { category: 'advanced', level: 'B2', phrase: 'كله تمام (Kullo tamam)', pronunciation: 'kool-loh ta-maam', en: 'Everything is great', de: 'Alles bestens' },
      { category: 'advanced', level: 'C1', phrase: 'الصبر جميل (Es-sabr gamil)', pronunciation: 'es-sabr ga-meel', en: 'Patience is beautiful', de: 'Geduld ist etwas Schönes' },
      { category: 'advanced', level: 'C2', phrase: 'الحركة بركة (El-haraka baraka)', pronunciation: 'el-ha-ra-ka ba-ra-ka', en: 'Movement brings blessings & success', de: 'Bewegung bringt Segen' }
    ],
    trivia: { en: 'Understood across the Arab world via cinema & music.', de: 'Dank Filmen & Musik überall bekannt.' },
    dailyPhrases: [
      { phrase: 'كله تمام (Kullo tamam)', pronunciation: 'kool-loh ta-maam', en: 'Everything is fine', de: 'Alles bestens', literal: 'All complete', level: 'A1' },
      { phrase: 'الصبر جميل (Es-sabr gamil)', pronunciation: 'es-sabr ga-meel', en: 'Patience is beautiful', de: 'Geduld bringt Segen', literal: 'Patience beautiful', level: 'B2' },
      { phrase: 'علىمهلك (Ala mehlak)', pronunciation: 'ala meh-lak', en: 'Take your time', de: 'Immer mit der Ruhe', literal: 'At your pace', level: 'A2' }
    ]
  },
  {
    id: 'gujarati',
    nameEn: 'Gujarati',
    nameDe: 'Gujarati',
    nativeName: 'ગુજરાતી (Gujarātī)',
    flag: '🇮🇳',
    speakers: '62M',
    family: 'Indo-Aryan',
    script: 'Gujarati',
    regions: 'Gujarat (India), UK, US',
    greeting: { phrase: 'કેમ છો? (Kem cho?)', pronunciation: 'kem choh', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'સુપ્રભાત (Suprabhat)', pronunciation: 'soo-pruh-bhaat', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'ખૂબ ખૂબ આભાર (Khoob khoob aabhar)', pronunciation: 'khoob khoob aa-bhaar', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'સ્ટેશન ક્યાં છે? (Station kyan che?)', pronunciation: 'station kyaan cheh', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'તમે કેમ છો? (Tame kem cho?)', pronunciation: 'tuh-mey kem choh', en: 'How are you?', de: 'Wie geht es Ihnen?' },
      { category: 'advanced', level: 'B2', phrase: 'ધીરજના ફળ મીઠા (Dhirajna phal meetha)', pronunciation: 'dhee-raj-naa phal', en: 'Fruit of patience is sweet', de: 'Geduld bringt Rosen' },
      { category: 'advanced', level: 'C1', phrase: 'ટીંપે ટીંપે સરોવર ભરાય (Timpe timpe sarovar bharay)', pronunciation: 'teem-pey teem-pey', en: 'Drop by drop a lake is filled', de: 'Steter Tropfen höhlt den Stein' },
      { category: 'advanced', level: 'C2', phrase: 'જેવું વાવશો તેવું લણશો (Jevu vavsho tevu lansho)', pronunciation: 'jay-voo vaav-shoh', en: 'As you sow so shall you reap', de: 'Wie man sät so erntet man' }
    ],
    trivia: { en: 'Mother tongue of Mahatma Gandhi.', de: 'Muttersprache von Mahatma Gandhi.' },
    dailyPhrases: [
      { phrase: 'આવજો (Aavjo)', pronunciation: 'aav-joh', en: 'Goodbye! (Come again soon)', de: 'Auf Wiedersehen!', literal: 'Come again', level: 'A1' },
      { phrase: 'ધીરજના ફળ મીઠા', pronunciation: 'dhee-raj-naa phal', en: 'Patience yields sweet fruit', de: 'Geduld bringt Rosen', literal: 'Patience fruit sweet', level: 'B2' },
      { phrase: 'મહેનત એ જ સફળતાની ચાવી છે', pronunciation: 'muh-heh-nut ay ja', en: 'Hard work is key to success', de: 'Fleiß ist der Schlüssel zum Erfolg', literal: 'Effort key to success', level: 'C1' }
    ]
  },
  {
    id: 'thai',
    nameEn: 'Thai',
    nameDe: 'Thailändisch',
    nativeName: 'ภาษาไทย (Phasa Thai)',
    flag: '🇹🇭',
    speakers: '61M',
    family: 'Kra-Dai',
    script: 'Thai',
    regions: 'Thailand',
    greeting: { phrase: 'สวัสดี (Sawatdee khrap/kha)', pronunciation: 'sah-wah-dee krahp', translationEn: 'Hello!', translationDe: 'Hallo!' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'อรุณสวัสดิ์ (Arun sawat)', pronunciation: 'ah-roon sah-wat', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'ขอบคุณมาก (Khob khun mak)', pronunciation: 'khob khoon mahk', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'สถานีอยู่ที่ไหน? (Sathani yoo theenai?)', pronunciation: 'sah-thaa-nee yoo tee-nai', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'คุณพูดภาษาอังกฤษได้ไหม? (Khun phoot phasa anggrit daimai?)', pronunciation: 'khoon phoot phasa', en: 'Do you speak English?', de: 'Sprechen Sie Englisch?' },
      { category: 'advanced', level: 'B2', phrase: 'ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น', pronunciation: 'khwam pha-ya-yam', en: 'Where there is effort there is success', de: 'Wo ein Wille ist ist ein Weg' },
      { category: 'advanced', level: 'C1', phrase: 'ระยะทางพิสูจน์ม้า กาลเวลาพิสูจน์คน', pronunciation: 'ra-ya thang phi-soot ma', en: 'Distance tests a horse, time tests a person', de: 'Zeit zeigt den Charakter' },
      { category: 'advanced', level: 'C2', phrase: 'น้ำขึ้นให้รีบตัก (Nam khuen hai reep tak)', pronunciation: 'nam khuen hai reep tak', en: 'Strike while iron is hot', de: 'Man muss das Eisen schmieden solange es heiß ist' }
    ],
    trivia: { en: 'Features 5 tones & 44 consonant characters.', de: 'Nutzt 5 Töne & 44 Konsonanten.' },
    dailyPhrases: [
      { phrase: 'ไม่เป็นไร (Mai pen rai)', pronunciation: 'my pen ry', en: 'No worries / It’s okay', de: 'Kein Problem / Macht nichts', literal: 'It is nothing', level: 'A1' },
      { phrase: 'ช้าๆ ได้พร้าเล่มงาม', pronunciation: 'cha cha dai phra', en: 'Slowly yields good results', de: 'Gut Ding will Weile haben', literal: 'Slowly gets fine blade', level: 'B2' },
      { phrase: 'ความพยายามอยู่ที่ไหน ความสำเร็จอยู่ที่นั่น', pronunciation: 'khwam pha-ya-yam', en: 'Effort brings success', de: 'Anstrengung bringt Erfolg', literal: 'Where effort there success', level: 'C1' }
    ]
  },
  {
    id: 'levantine_arabic',
    nameEn: 'Levantine Arabic',
    nameDe: 'Levantinisches Arabisch',
    nativeName: 'لهجة شامي (Lahja Shāmiyya)',
    flag: '🇱🇧',
    speakers: '44M',
    family: 'Semitic',
    script: 'Arabic',
    regions: 'Lebanon, Syria, JO, PS',
    greeting: { phrase: 'مرحبا! كيفك؟ (Marhaba! Kifak?)', pronunciation: 'mar-ha-ba kee-fak', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'صباح الخير (Sabah el-kher)', pronunciation: 'sa-baah el-kher', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'شكرا كتير (Shukran ktir)', pronunciation: 'shook-ran kteer', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'وين المحطة؟ (Wein el-mahatta?)', pronunciation: 'wayn el-ma-hat-ta', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'شو عم تعمل؟ (Shoo am ta‘mal?)', pronunciation: 'shoo am ta-mal', en: 'What are you doing?', de: 'Was machst du?' },
      { category: 'advanced', level: 'B2', phrase: 'يعطيك العافية (Ya‘teek el-‘afye)', pronunciation: 'ya-teek el-aa-fyeh', en: 'May God grant you health & strength', de: 'Möge Gott dir Gesundheit schenken' },
      { category: 'advanced', level: 'C1', phrase: 'من طلب العلا سهر الليالي', pronunciation: 'man ta-la-ba al-oo-la', en: 'He who seeks success works hard through night', de: 'Erfolg braucht Fleiß' },
      { category: 'advanced', level: 'C2', phrase: 'الصديق وقت الضيق', pronunciation: 'es-sadeeq waqt ed-deeq', en: 'A friend in need is a friend indeed', de: 'Wahre Freunde zeigen sich in der Not' }
    ],
    trivia: { en: 'Famous for musical rhythm in poetry.', de: 'Bekannt für musikalischen Rhythmus.' },
    dailyPhrases: [
      { phrase: 'يعطيك العافية (Ya‘teek el-‘afye)', pronunciation: 'ya-teek el-aa-fyeh', en: 'May God give you strength', de: 'Möge Gott dir Kraft geben', literal: 'Give you wellness', level: 'A2' },
      { phrase: 'كل شي تمام', pronunciation: 'kull shee tamam', en: 'Everything is fine', de: 'Alles in Ordnung', literal: 'All thing complete', level: 'A1' },
      { phrase: 'الصديق وقت الضيق', pronunciation: 'es-sadeeq waqt ed-deeq', en: 'Friend in need is friend indeed', de: 'Freunde zeigen sich in der Not', literal: 'Friend in time of trouble', level: 'C1' }
    ]
  },
  {
    id: 'amharic',
    nameEn: 'Amharic',
    nameDe: 'Amharisch',
    nativeName: 'አማርኛ (Amarñña)',
    flag: '🇪🇹',
    speakers: '57M',
    family: 'Semitic',
    script: 'Fidel / Ge’ez',
    regions: 'Ethiopia',
    greeting: { phrase: 'ሰላም! እንደምን ነህ? (Selam! Endemin neh?)', pronunciation: 'seh-lahm en-deh-meen neh', translationEn: 'Hello! How are you?', translationDe: 'Hallo! Wie geht’s?' },
    essentialPhrases: [
      { category: 'greetings', level: 'A1', phrase: 'እንደምን አደራችሁ (Endemin aderachu)', pronunciation: 'en-deh-meen ah-deh-rah', en: 'Good morning', de: 'Guten Morgen' },
      { category: 'basics', level: 'A1', phrase: 'በጣም አመሰግናለሁ (Betam ameseginalehu)', pronunciation: 'beh-tahm ah-meh-seh-gee-nah', en: 'Thank you very much', de: 'Vielen Dank' },
      { category: 'travel', level: 'A2', phrase: 'ማረፊያው የት ነው? (Marefiyaw yet new?)', pronunciation: 'mah-reh-fee-yaw yet new', en: 'Where is the station?', de: 'Wo ist der Bahnhof?' },
      { category: 'social', level: 'B1', phrase: 'አማርኛ ትችላለህ? (Amarñña tichilaleh?)', pronunciation: 'ah-mar-nya tee-chee-lah-leh', en: 'Do you speak Amharic?', de: 'Sprechen Sie Amharisch?' },
      { category: 'advanced', level: 'B2', phrase: 'ቀስ በቀስ እንቁላል በእግሩ ይሄዳል', pronunciation: 'kes be-kes en-ku-lal', en: 'Slowly an egg walks on legs (Patience works miracles)', de: 'Geduld führt zum Wunder' },
      { category: 'advanced', level: 'C1', phrase: 'አንድ ሰው ብቻውን ደስተኛ አይሆንም', pronunciation: 'and sew be-chaw-n', en: 'A person cannot be truly happy alone', de: 'Gemeinschaft bringt Glück' },
      { category: 'advanced', level: 'C2', phrase: 'ተስፋ የህይወት መሰረት ነው', pronunciation: 'tes-fa ye-hee-wet', en: 'Hope is the foundation of life', de: 'Hoffnung ist das Fundament des Lebens' }
    ],
    trivia: { en: 'Uses the Ge’ez abugida writing system.', de: 'Nutzt das Ge’ez-Silbenschrift-System.' },
    dailyPhrases: [
      { phrase: 'ቀስ በቀስ እንቁላል በእግሩ ይሄዳል', pronunciation: 'kes be-kes en-ku-lal', en: 'Slowly an egg walks on legs', de: 'Geduld führt zum Wunder', literal: 'Egg walks on legs', level: 'B2' },
      { phrase: 'ሰላም ሁኑ', pronunciation: 'seh-lahm hoo-noo', en: 'Stay in peace', de: 'Bleiben Sie in Frieden', literal: 'Be in peace', level: 'A1' },
      { phrase: 'እውቀት ሀብት ነው', pronunciation: 'ew-ket hab-t new', en: 'Knowledge is wealth', de: 'Wissen ist Reichtum', literal: 'Knowledge wealth is', level: 'C1' }
    ]
  }
];
