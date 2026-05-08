import { describe, it, expect, beforeEach } from 'vitest';
import type { ProgressData, MistakeHistory, Settings } from '../lib/storage';

describe('Storage Types (Hello World)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('types are importable and basic values work', () => {
    const progress: ProgressData = {
      version: '1.0',
      completedSections: [],
      lastAccessedAt: new Date().toISOString(),
    };
    expect(progress.version).toBe('1.0');
    expect(progress.completedSections).toEqual([]);

    const history: MistakeHistory = {
      version: '1.0',
      mistakes: [],
    };
    expect(history.mistakes).toEqual([]);

    const settings: Settings = {
      version: '1.0',
      theme: 'light',
      quizDefaultCount: 0,
      randomizeChoices: false,
    };
    expect(settings.theme).toBe('light');

    const quiz: Quiz = {
      id: 'q-ch01-sec01-001',
      sectionId: 'ch01-sec01',
      chapterId: 'ch01',
      question: 'テスト問題',
      choices: ['選択肢A', '選択肢B', '選択肢C', '選択肢D'],
      correctIndex: 0,
      explanation: '解説テキスト',
      difficulty: 'easy',
      tags: ['test'],
    };
    expect(quiz.choices).toHaveLength(4);
  });

  it('LocalStorage is accessible', () => {
    localStorage.setItem('test-key', 'test-value');
    expect(localStorage.getItem('test-key')).toBe('test-value');
  });
});
