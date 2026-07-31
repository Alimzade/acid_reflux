import React, { useState, useMemo, useEffect } from 'react';
import { Language } from '../../types';
import { TOP_33_LANGUAGES, LanguageInfo } from './languageData';
import './LanguageLearning.css';

interface LanguageLearningProps {
  language: Language;
}

export function LanguageLearning({ language }: LanguageLearningProps) {
  const isGerman = language === 'de';
  const [selectedId, setSelectedId] = useState<string>('german');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  // Filtered languages for dropdown / search
  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return TOP_33_LANGUAGES;
    const q = searchQuery.toLowerCase();
    return TOP_33_LANGUAGES.filter(lang => 
      lang.nameEn.toLowerCase().includes(q) ||
      lang.nameDe.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.regions.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const currentLang = useMemo(() => {
    return TOP_33_LANGUAGES.find(l => l.id === selectedId) || TOP_33_LANGUAGES[0];
  }, [selectedId]);

  // Reset flashcard when language changes
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [selectedId]);

  const speakText = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Map language id to BC47 tag
    const langMap: Record<string, string> = {
      english: 'en-US', mandarin: 'zh-CN', hindi: 'hi-IN', spanish: 'es-ES',
      arabic: 'ar-SA', french: 'fr-FR', bengali: 'bn-BD', russian: 'ru-RU',
      portuguese: 'pt-BR', urdu: 'ur-PK', indonesian: 'id-ID', german: 'de-DE',
      japanese: 'ja-JP', marathi: 'mr-IN', telugu: 'te-IN', turkish: 'tr-TR',
      tamil: 'ta-IN', cantonese: 'zh-HK', vietnamese: 'vi-VN', tagalog: 'tl-PH',
      punjabi: 'pa-IN', korean: 'ko-KR', persian: 'fa-IR', italian: 'it-IT',
      gujarati: 'gu-IN', thai: 'th-TH', amharic: 'am-ET'
    };

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[langCode] || 'en-US';
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsPlayingAudio(text);
    utterance.onend = () => setIsPlayingAudio(null);
    utterance.onerror = () => setIsPlayingAudio(null);

    window.speechSynthesis.speak(utterance);
  };

  const phrases = useMemo(() => {
    if (activeCategory === 'all') return currentLang.essentialPhrases;
    return currentLang.essentialPhrases.filter(p => p.category === activeCategory);
  }, [currentLang, activeCategory]);

  const selectRandomLanguage = () => {
    const nextIdx = Math.floor(Math.random() * TOP_33_LANGUAGES.length);
    setSelectedId(TOP_33_LANGUAGES[nextIdx].id);
  };

  const copy = isGerman ? {
    kicker: 'Weltweite Sprachen-Akademie',
    title: 'Sprachen-Lernzentrum',
    subtitle: 'Entdecken Sie die 33 meistgesprochenen Sprachen der Welt mit Ausdrücken, Phonetik und kulturellen Einblicken.',
    selectLabel: 'Wählen Sie eine Sprache aus (Top 33 weltweit):',
    searchPlaceholder: 'Sprache oder Region suchen...',
    randomBtn: '🎲 Zufällige Sprache',
    speakers: 'Sprecher weltweit',
    family: 'Sprachfamilie',
    script: 'Schriftsystem',
    regions: 'Hauptregionen',
    greetingSpotlight: '💡 Erste Begrüßung',
    phrasesTitle: '💬 Wichtige Ausdrücke & Redewendungen',
    all: 'Alle',
    greetings: 'Begrüßung',
    basics: 'Grundlagen',
    travel: 'Reise',
    social: 'Soziales',
    practiceTitle: '🎴 Interaktives Karteikarten-Training',
    flipCard: 'Klicken zum Umdrehen',
    nextCard: 'Nächste Karte ➔',
    prevCard: '← Vorherige Karte',
    showAnswer: 'Lösung anzeigen',
    triviaTitle: '✨ Kulturelle Besonderheit & Kulturwissen',
    proverbTitle: '📜 Spruch des Tages',
    literalMeaning: 'Wörtlich:',
    listenBtn: 'Anhören',
    playingText: 'Spielt...'
  } : {
    kicker: 'Global Language Academy',
    title: 'Language Learning Hub',
    subtitle: 'Explore the 33 most spoken languages in the world with essential phrases, phonetics, and cultural insights.',
    selectLabel: 'Select a Language (Top 33 Worldwide):',
    searchPlaceholder: 'Search language or region...',
    randomBtn: '🎲 Random Language',
    speakers: 'Global Speakers',
    family: 'Language Family',
    script: 'Writing Script',
    regions: 'Main Regions',
    greetingSpotlight: '💡 Essential Greeting',
    phrasesTitle: '💬 Key Expressions & Phrases',
    all: 'All',
    greetings: 'Greetings',
    basics: 'Basics',
    travel: 'Travel',
    social: 'Social',
    practiceTitle: '🎴 Interactive Flashcard Trainer',
    flipCard: 'Click to Flip',
    nextCard: 'Next Card ➔',
    prevCard: '← Prev Card',
    showAnswer: 'Reveal Meaning',
    triviaTitle: '✨ Cultural Trivia & Linguistic Insights',
    proverbTitle: '📜 Daily Phrase & Proverb',
    literalMeaning: 'Literal translation:',
    listenBtn: 'Listen',
    playingText: 'Playing...'
  };

  const currentFlashcard = currentLang.essentialPhrases[flashcardIndex] || currentLang.essentialPhrases[0];

  return (
    <div className="language-learning-container">
      {/* Header Section */}
      <header className="lang-header">
        <div>
          <span className="section-kicker">{copy.kicker}</span>
          <h1 className="lang-title">{copy.title}</h1>
          <p className="lang-subtitle">{copy.subtitle}</p>
        </div>
        <button 
          className="random-lang-btn" 
          onClick={selectRandomLanguage}
          title="Pick a random language to learn"
        >
          {copy.randomBtn}
        </button>
      </header>

      {/* Language Selection & Selector Bar */}
      <div className="lang-selector-card glass-card">
        <div className="selector-top-row">
          <label htmlFor="language-select" className="selector-label">
            {copy.selectLabel}
          </label>
          <div className="search-box-wrapper">
            <input 
              type="text" 
              className="lang-search-input"
              placeholder={copy.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <select 
          id="language-select"
          className="lang-dropdown"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {filteredLanguages.map((lang, index) => (
            <option key={lang.id} value={lang.id}>
              {index + 1}. {lang.flag} {isGerman ? lang.nameDe : lang.nameEn} ({lang.nativeName}) — {lang.speakers}
            </option>
          ))}
        </select>
      </div>

      {/* Language Overview Hero Grid */}
      <div className="lang-hero-grid">
        {/* Main Language Profile */}
        <div className="glass-card lang-profile-card">
          <div className="profile-header">
            <span className="lang-flag">{currentLang.flag}</span>
            <div>
              <h2>{isGerman ? currentLang.nameDe : currentLang.nameEn}</h2>
              <span className="native-name-badge">{currentLang.nativeName}</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-pill">
              <span className="stat-label">{copy.speakers}</span>
              <strong className="stat-value">{currentLang.speakers}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">{copy.family}</span>
              <strong className="stat-value">{currentLang.family}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">{copy.script}</span>
              <strong className="stat-value">{currentLang.script}</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">{copy.regions}</span>
              <strong className="stat-value">{currentLang.regions}</strong>
            </div>
          </div>
        </div>

        {/* Essential Greeting Spotlight */}
        <div className="glass-card greeting-spotlight-card">
          <span className="card-kicker">{copy.greetingSpotlight}</span>
          <div className="greeting-phrase-box">
            <h3 className="greeting-text">{currentLang.greeting.phrase}</h3>
            <p className="pronunciation">/ {currentLang.greeting.pronunciation} /</p>
            <p className="translation">
              {isGerman ? currentLang.greeting.translationDe : currentLang.greeting.translationEn}
            </p>
          </div>

          <button 
            className="audio-listen-btn"
            onClick={() => speakText(currentLang.greeting.phrase, currentLang.id)}
          >
            🔊 {isPlayingAudio === currentLang.greeting.phrase ? copy.playingText : copy.listenBtn}
          </button>
        </div>
      </div>

      {/* Main Content Layout: Phrases & Practice */}
      <div className="lang-main-layout">
        {/* Essential Expressions Section */}
        <div className="glass-card expressions-card">
          <div className="expressions-header">
            <h2>{copy.phrasesTitle}</h2>
            <div className="category-tabs">
              {(['all', 'greetings', 'basics', 'travel', 'social'] as const).map(cat => (
                <button
                  key={cat}
                  className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {copy[cat as keyof typeof copy]}
                </button>
              ))}
            </div>
          </div>

          <div className="phrases-grid">
            {phrases.map((item, i) => (
              <div key={i} className="phrase-card">
                <div className="phrase-card-top">
                  <span className="category-badge">{item.category}</span>
                  <button 
                    className="icon-speak-btn"
                    onClick={() => speakText(item.phrase, currentLang.id)}
                    title={copy.listenBtn}
                  >
                    🔊
                  </button>
                </div>
                <h4 className="phrase-text">{item.phrase}</h4>
                <span className="phrase-pronun">/ {item.pronunciation} /</span>
                <p className="phrase-trans">{isGerman ? item.de : item.en}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Cards: Flashcard Trainer & Proverb */}
        <div className="lang-side-column">
          {/* Flashcard Trainer */}
          <div className="glass-card flashcard-container">
            <h3>{copy.practiceTitle}</h3>
            <div 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  <span className="flashcard-hint">{copy.flipCard}</span>
                  <h4>{currentFlashcard.phrase}</h4>
                  <p className="pronun">/ {currentFlashcard.pronunciation} /</p>
                </div>
                <div className="flashcard-back">
                  <span className="flashcard-category">{currentFlashcard.category}</span>
                  <h4>{isGerman ? currentFlashcard.de : currentFlashcard.en}</h4>
                </div>
              </div>
            </div>

            <div className="flashcard-controls">
              <button 
                className="card-nav-btn"
                disabled={flashcardIndex === 0}
                onClick={() => {
                  setFlashcardIndex(prev => Math.max(0, prev - 1));
                  setIsFlipped(false);
                }}
              >
                {copy.prevCard}
              </button>

              <span className="card-counter">
                {flashcardIndex + 1} / {currentLang.essentialPhrases.length}
              </span>

              <button 
                className="card-nav-btn"
                disabled={flashcardIndex === currentLang.essentialPhrases.length - 1}
                onClick={() => {
                  setFlashcardIndex(prev => Math.min(currentLang.essentialPhrases.length - 1, prev + 1));
                  setIsFlipped(false);
                }}
              >
                {copy.nextCard}
              </button>
            </div>
          </div>

          {/* Daily Phrase & Proverb */}
          <div className="glass-card proverb-card">
            <h3>{copy.proverbTitle}</h3>
            <div className="proverb-content">
              <h4 className="proverb-phrase">{currentLang.dailyPhrase.phrase}</h4>
              <p className="pronun">/ {currentLang.dailyPhrase.pronunciation} /</p>
              <p className="proverb-meaning">
                <strong>Meaning:</strong> {isGerman ? currentLang.dailyPhrase.de : currentLang.dailyPhrase.en}
              </p>
              <p className="proverb-literal">
                <em>{copy.literalMeaning}</em> "{currentLang.dailyPhrase.literal}"
              </p>
            </div>
          </div>

          {/* Cultural Trivia Card */}
          <div className="glass-card trivia-card">
            <h3>{copy.triviaTitle}</h3>
            <p className="trivia-text">
              {isGerman ? currentLang.trivia.de : currentLang.trivia.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageLearning;
