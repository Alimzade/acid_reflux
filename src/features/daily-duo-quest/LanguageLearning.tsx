import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Language } from '../../types';
import { TOP_33_LANGUAGES, LanguageInfo, CefrLevel, getAvailableDates, DailyProverb } from './languageData';
import { IconChevronLeft, IconChevronRight } from '../../components/Icons';
import './LanguageLearning.css';

interface LanguageLearningProps {
  language: Language;
}

export function LanguageLearning({ language }: LanguageLearningProps) {
  const isGerman = language === 'de';
  const availableDates = useMemo(() => getAvailableDates(), []);
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]);
  const [selectedId, setSelectedId] = useState<string>('german');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [typeBuffer, setTypeBuffer] = useState<string>('');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOptionRef = useRef<HTMLButtonElement | null>(null);
  const bufferTimerRef = useRef<any>(null);

  // Auto-scroll selected option into view inside dropdown
  useEffect(() => {
    if (isDropdownOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedId, isDropdownOpen]);

  const currentDateIndex = availableDates.indexOf(selectedDate);
  const hasNewer = currentDateIndex > 0;
  const hasOlder = currentDateIndex < availableDates.length - 1;

  const handlePrevDate = () => {
    if (hasOlder) setSelectedDate(availableDates[currentDateIndex + 1]);
  };

  const handleNextDate = () => {
    if (hasNewer) setSelectedDate(availableDates[currentDateIndex - 1]);
  };

  const currentLang = useMemo(() => {
    return TOP_33_LANGUAGES.find(l => l.id === selectedId) || TOP_33_LANGUAGES[0];
  }, [selectedId]);

  // Determine daily phrase for the selected date deterministically using a unique date hash
  const currentDailyPhrase = useMemo<DailyProverb>(() => {
    const list = currentLang.dailyPhrases || [];
    if (!list.length) {
      return {
        phrase: currentLang.greeting.phrase,
        pronunciation: currentLang.greeting.pronunciation,
        en: currentLang.greeting.translationEn,
        de: currentLang.greeting.translationDe,
        literal: 'Greeting',
        level: 'A1'
      };
    }
    const dateSeed = selectedDate.split('-').reduce((acc, p) => acc * 31 + parseInt(p, 10), 0);
    const idx = Math.abs(dateSeed) % list.length;
    return list[idx];
  }, [currentLang, selectedDate]);

  // Direct keyboard type-ahead searching (No search box needed!)
  useEffect(() => {
    if (!isDropdownOpen) {
      setTypeBuffer('');
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const nextBuffer = (typeBuffer + e.key).toLowerCase();
        setTypeBuffer(nextBuffer);

        if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
        bufferTimerRef.current = setTimeout(() => setTypeBuffer(''), 1000);

        const match = TOP_33_LANGUAGES.find(lang => 
          lang.nameEn.toLowerCase().startsWith(nextBuffer) ||
          lang.nameDe.toLowerCase().startsWith(nextBuffer) ||
          lang.nativeName.toLowerCase().startsWith(nextBuffer)
        );

        if (match) {
          setSelectedId(match.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen, typeBuffer]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset flashcard when language, level, or date changes
  useEffect(() => {
    setFlashcardIndex(0);
    setIsFlipped(false);
  }, [selectedId, activeLevel, selectedDate]);

  const speakText = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

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

  // Calculate dateSeed for date-based daily module rotation
  const dateSeed = useMemo(() => {
    return selectedDate.split('-').reduce((acc, p) => acc * 31 + parseInt(p, 10), 0);
  }, [selectedDate]);

  const phrases = useMemo(() => {
    const rawFiltered = currentLang.essentialPhrases.filter(p => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const matchLvl = activeLevel === 'all' || p.level === activeLevel;
      return matchCat && matchLvl;
    });

    if (!rawFiltered.length) return [];
    const offset = Math.abs(dateSeed) % rawFiltered.length;
    return [...rawFiltered.slice(offset), ...rawFiltered.slice(0, offset)];
  }, [currentLang, activeCategory, activeLevel, dateSeed]);

  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const diffDays = Math.round((today.getTime() - d.getTime()) / (1000 * 3600 * 24));
    const locale = isGerman ? 'de-DE' : 'en-US';

    if (diffDays === 0) return `${isGerman ? 'Heute' : 'Today'} (${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })})`;
    if (diffDays === 1) return `${isGerman ? 'Gestern' : 'Yesterday'} (${d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })})`;
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  };

  const selectRandomLanguage = () => {
    const nextIdx = Math.floor(Math.random() * TOP_33_LANGUAGES.length);
    setSelectedId(TOP_33_LANGUAGES[nextIdx].id);
  };

  const copy = isGerman ? {
    kicker: 'Weltweite Sprachen-Akademie',
    title: 'Sprachen-Lernzentrum',
    subtitle: 'Entdecken Sie 33 meistgesprochene Sprachen nach CEFR-Niveau (A1–C2) mit Tages-Historie.',
    randomBtn: '🎲 Zufall',
    speakers: 'Sprecher',
    family: 'Familie',
    script: 'Schrift',
    regions: 'Regionen',
    phrasesTitle: '💬 Ausdrücke & Sätze',
    all: 'Alle',
    greetings: 'Begrüßung',
    basics: 'Grundlagen',
    travel: 'Reise',
    social: 'Soziales',
    practiceTitle: '🎴 Karteikarten-Trainer',
    flipCard: 'Klicken zum Umdrehen',
    nextCard: 'Nächste ➔',
    prevCard: '← Vorherige',
    triviaTitle: '✨ Kulturelles Wissen',
    proverbTitle: '📜 Spruch des Tages',
    literalMeaning: 'Wörtlich:',
    listenBtn: 'Anhören',
    playingText: 'Spielt...',
    levelFilterLabel: 'Niveau:',
    dateLabel: 'Datum:'
  } : {
    kicker: 'Global Language Academy',
    title: 'Language Learning Hub',
    subtitle: 'Explore 33 most spoken languages by CEFR level (A1–C2) with daily phrase rotations.',
    randomBtn: '🎲 Random',
    speakers: 'Speakers',
    family: 'Family',
    script: 'Script',
    regions: 'Regions',
    phrasesTitle: '💬 Expressions & Sentences',
    all: 'All',
    greetings: 'Greetings',
    basics: 'Basics',
    travel: 'Travel',
    social: 'Social',
    practiceTitle: '🎴 Flashcard Trainer',
    flipCard: 'Click to Flip',
    nextCard: 'Next ➔',
    prevCard: '← Prev',
    triviaTitle: '✨ Cultural Trivia',
    proverbTitle: '📜 Daily Proverb',
    literalMeaning: 'Literal translation:',
    listenBtn: 'Listen',
    playingText: 'Playing...',
    levelFilterLabel: 'Level:',
    dateLabel: 'Date:'
  };

  const currentFlashcard = phrases[flashcardIndex] || phrases[0] || {
    phrase: currentLang.greeting.phrase,
    pronunciation: currentLang.greeting.pronunciation,
    en: currentLang.greeting.translationEn,
    de: currentLang.greeting.translationDe,
    category: 'greetings',
    level: 'A1'
  };

  return (
    <div className="language-learning-container">
      {/* Header Section */}
      <header className="lang-header">
        <div>
          <span className="section-kicker">{copy.kicker}</span>
          <h1 className="lang-title">{copy.title}</h1>
          <p className="lang-subtitle">{copy.subtitle}</p>
        </div>
      </header>

      {/* Streamlined Custom Combobox Bar */}
      <div className="compact-lang-bar glass-card">
        <div className="compact-selector-row">
          {/* Custom Combobox Trigger */}
          <div className="custom-combobox-wrapper" ref={dropdownRef}>
            <button 
              type="button"
              className="combobox-trigger-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="trigger-flag">{currentLang.flag}</span>
              <span className="trigger-name">
                {isGerman ? currentLang.nameDe : currentLang.nameEn} ({currentLang.nativeName})
              </span>
              <span className="trigger-speakers">— {currentLang.speakers}</span>
              <span className="trigger-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
            </button>

            {/* Solid Dark Dropdown Overlay (No search box needed, direct keyboard type-ahead!) */}
            {isDropdownOpen && (
              <div className="combobox-dropdown-panel solid-dark-panel">
                {typeBuffer && (
                  <div className="type-ahead-indicator">
                    Typing: <strong>"{typeBuffer}"</strong>
                  </div>
                )}
                <div className="dropdown-options-list">
                  {TOP_33_LANGUAGES.map((lang, index) => (
                    <button
                      key={lang.id}
                      ref={lang.id === selectedId ? selectedOptionRef : null}
                      type="button"
                      className={`option-item ${lang.id === selectedId ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedId(lang.id);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="option-flag">{lang.flag}</span>
                      <span className="option-name">{index + 1}. {isGerman ? lang.nameDe : lang.nameEn}</span>
                      <span className="option-native">({lang.nativeName})</span>
                      <span className="option-speakers">{lang.speakers}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            className="compact-random-btn" 
            onClick={selectRandomLanguage}
            title="Pick a random language"
          >
            {copy.randomBtn}
          </button>
        </div>

        {/* Compact Inline Language Profile Summary */}
        <div className="compact-profile-summary">
          <div className="profile-badge-group">
            <span className="compact-flag">{currentLang.flag}</span>
            <span className="compact-name">{isGerman ? currentLang.nameDe : currentLang.nameEn}</span>
            <span className="compact-native-badge">{currentLang.nativeName}</span>
          </div>

          <div className="compact-info-pills">
            <span className="info-chip">👥 {currentLang.speakers}</span>
            <span className="info-chip">📜 {currentLang.script}</span>
            <span className="info-chip">🌳 {currentLang.family}</span>
            <span className="info-chip">🌍 {currentLang.regions}</span>
          </div>
        </div>
      </div>

      {/* Toolbar: CEFR Level Pills & Date Navigator Below Language Bar */}
      <div className="toolbar-row glass-card">
        {/* CEFR Level Filter Pills */}
        <div className="level-filter-group">
          <span className="toolbar-label">{copy.levelFilterLabel}</span>
          <div className="level-pills-row">
            {(['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map(lvl => (
              <button
                key={lvl}
                className={`level-pill level-${lvl.toLowerCase()} ${activeLevel === lvl ? 'active' : ''}`}
                onClick={() => setActiveLevel(lvl)}
              >
                {lvl === 'all' ? (isGerman ? 'Alle' : 'All') : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Date Navigator */}
        <div className="date-nav-group">
          <span className="toolbar-label">{copy.dateLabel}</span>
          <div className="date-nav-buttons">
            <button 
              type="button"
              className="date-step-btn"
              onClick={handlePrevDate}
              disabled={!hasOlder}
              title="Previous Day"
            >
              <IconChevronLeft size={16} />
            </button>

            <select
              className="date-select-dropdown"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {availableDates.map(dateStr => (
                <option key={dateStr} value={dateStr}>
                  {formatDateLabel(dateStr)}
                </option>
              ))}
            </select>

            <button 
              type="button"
              className="date-step-btn"
              onClick={handleNextDate}
              disabled={!hasNewer}
              title="Next Day"
            >
              <IconChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Expressions & Side Column */}
      <div className="lang-main-layout">
        {/* Expressions Grid */}
        <div className="glass-card expressions-card">
          <div className="expressions-header">
            <h2>{copy.phrasesTitle}</h2>
            <div className="category-tabs">
              {(['all', 'greetings', 'basics', 'travel', 'social', 'advanced'] as const).map(cat => (
                <button
                  key={cat}
                  className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {copy[cat as keyof typeof copy] || cat}
                </button>
              ))}
            </div>
          </div>

          <div className="phrases-grid">
            {phrases.map((item, i) => (
              <div key={i} className="phrase-card">
                <div className="phrase-card-top">
                  <span className={`cefr-badge badge-${item.level.toLowerCase()}`}>{item.level}</span>
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

        {/* Side Column: Flashcard Trainer, Daily Proverb, Cultural Trivia */}
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
                  <span className={`cefr-badge badge-${currentFlashcard.level.toLowerCase()}`}>{currentFlashcard.level}</span>
                  <h4>{currentFlashcard.phrase}</h4>
                  <p className="pronun">/ {currentFlashcard.pronunciation} /</p>
                </div>
                <div className="flashcard-back">
                  <span className="flashcard-hint">{copy.flipCard}</span>
                  <span className={`cefr-badge badge-${currentFlashcard.level.toLowerCase()}`}>{currentFlashcard.level}</span>
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
                {phrases.length > 0 ? flashcardIndex + 1 : 0} / {phrases.length}
              </span>

              <button 
                className="card-nav-btn"
                disabled={flashcardIndex >= phrases.length - 1}
                onClick={() => {
                  setFlashcardIndex(prev => Math.min(phrases.length - 1, prev + 1));
                  setIsFlipped(false);
                }}
              >
                {copy.nextCard}
              </button>
            </div>
          </div>

          {/* Daily Proverb (Rotates deterministically by Selected Date) */}
          <div className="glass-card proverb-card">
            <div className="proverb-header-row">
              <h3>{copy.proverbTitle}</h3>
              <span className={`cefr-badge badge-${currentDailyPhrase.level.toLowerCase()}`}>{currentDailyPhrase.level}</span>
            </div>
            <div className="proverb-content">
              <h4 className="proverb-phrase">{currentDailyPhrase.phrase}</h4>
              <p className="pronun">/ {currentDailyPhrase.pronunciation} /</p>
              <p className="proverb-meaning">
                <strong>Meaning:</strong> {isGerman ? currentDailyPhrase.de : currentDailyPhrase.en}
              </p>
              <p className="proverb-literal">
                <em>{copy.literalMeaning}</em> "{currentDailyPhrase.literal}"
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
