import React from 'react';
import { Language } from '../../types';
import { LanguageLearning } from './LanguageLearning';

interface DailyDuoQuestProps {
  language: Language;
}

export function DailyDuoQuest({ language }: DailyDuoQuestProps) {
  return <LanguageLearning language={language} />;
}

export default DailyDuoQuest;
