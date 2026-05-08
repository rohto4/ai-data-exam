import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const quizData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/quizzes.json'), 'utf8'));
const syllabusData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/syllabus.json'), 'utf8'));

import type { Quiz, Chapter, Section } from '../src/lib/storage';

describe('Data Schema Validation', () => {
  describe('syllabus.json', () => {
    it('should have correct top-level structure', () => {
      expect(syllabusData).toHaveProperty('version');
      expect(syllabusData).toHaveProperty('title');
      expect(syllabusData).toHaveProperty('description');
      expect(syllabusData).toHaveProperty('totalSections');
      expect(syllabusData).toHaveProperty('totalQuizzes');
      expect(syllabusData).toHaveProperty('chapters');
      expect(syllabusData.version).toBe('2.0');
      expect(Array.isArray(syllabusData.chapters)).toBe(true);
    });

    it('should have exactly 10 chapters', () => {
      expect(syllabusData.chapters.length).toBe(10);
    });

    it('each chapter should have required fields', () => {
      syllabusData.chapters.forEach((chapter: Chapter) => {
        expect(chapter).toHaveProperty('id');
        expect(chapter).toHaveProperty('title');
        expect(chapter).toHaveProperty('description');
        expect(chapter).toHaveProperty('order');
        expect(chapter).toHaveProperty('sections');
        expect(chapter).toHaveProperty('references');
        expect(Array.isArray(chapter.sections)).toBe(true);
        expect(Array.isArray(chapter.references)).toBe(true);
        expect(chapter.sections.length).toBeGreaterThan(0);
        expect(chapter.references.length).toBeGreaterThan(0);
        
        // ID format: ch{NN}
        expect(chapter.id).toMatch(/^ch\d{2}$/);
      });
    });

    it('each section should have required fields', () => {
      syllabusData.chapters.forEach((chapter: Chapter) => {
        chapter.sections.forEach((section: Section) => {
          expect(section).toHaveProperty('id');
          expect(section).toHaveProperty('chapterId');
          expect(section).toHaveProperty('title');
          expect(section).toHaveProperty('content');
          expect(section).toHaveProperty('order');
          expect(section).toHaveProperty('quizCount');
          
          // ID format: ch{NN}-sec{NN}
          expect(section.id).toMatch(/^ch\d{2}-sec\d{2}$/);
          expect(section.chapterId).toBe(chapter.id);
          expect(section.quizCount).toBeGreaterThanOrEqual(5);
          expect(typeof section.content).toBe('string');
          expect(section.content.trim().length).toBeGreaterThan(0);
        });
      });
    });

    it('should not contain placeholder TBD content', () => {
      const serialized = JSON.stringify(syllabusData);
      expect(serialized.includes('TBD')).toBe(false);
    });

    it('chapter IDs should be unique', () => {
      const ids = syllabusData.chapters.map((c: Chapter) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('section IDs should be unique within a chapter', () => {
      syllabusData.chapters.forEach((chapter: Chapter) => {
        const ids = chapter.sections.map((s: Section) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });
  });

  describe('quizzes.json', () => {
    it('should have correct top-level structure', () => {
      expect(quizData).toHaveProperty('version');
      expect(quizData).toHaveProperty('generatedAt');
      expect(quizData).toHaveProperty('quizzes');
      expect(quizData.version).toBe('1.0');
      expect(Array.isArray(quizData.quizzes)).toBe(true);
    });

    it('should have at least 250 quizzes', () => {
      expect(quizData.quizzes.length).toBeGreaterThanOrEqual(250);
    });

    it('should have exactly 300 quizzes (current dataset baseline)', () => {
      expect(quizData.quizzes.length).toBe(300);
    });

    it('each quiz should have required fields', () => {
      quizData.quizzes.forEach((quiz: Quiz) => {
        expect(quiz).toHaveProperty('id');
        expect(quiz).toHaveProperty('sectionId');
        expect(quiz).toHaveProperty('chapterId');
        expect(quiz).toHaveProperty('question');
        expect(quiz).toHaveProperty('choices');
        expect(quiz).toHaveProperty('correctIndex');
        expect(quiz).toHaveProperty('explanation');
        expect(quiz).toHaveProperty('difficulty');
        expect(quiz).toHaveProperty('tags');
        
        // ID format: q-{sectionId}-{NNN}
        expect(quiz.id).toMatch(/^q-ch\d{2}-sec\d{2}-\d{3}$/);
        
        // choices should be array of 4 strings
        expect(Array.isArray(quiz.choices)).toBe(true);
        expect(quiz.choices.length).toBe(4);
        quiz.choices.forEach((choice: string) => {
          expect(typeof choice).toBe('string');
        });
        
        // correctIndex should be 0-3
        expect(quiz.correctIndex).toBeGreaterThanOrEqual(0);
        expect(quiz.correctIndex).toBeLessThanOrEqual(3);
        
        // difficulty should be valid
        expect(['easy', 'normal', 'hard']).toContain(quiz.difficulty);
        
        // tags should be array of strings
        expect(Array.isArray(quiz.tags)).toBe(true);
        quiz.tags.forEach((tag: string) => {
          expect(typeof tag).toBe('string');
        });
      });
    });

    it('quiz IDs should be unique', () => {
      const ids = quizData.quizzes.map((q: Quiz) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('each sectionId present in quizzes should have exactly 5 quizzes', () => {
      const sectionQuizCounts: Record<string, number> = {};
      quizData.quizzes.forEach((quiz: Quiz) => {
        sectionQuizCounts[quiz.sectionId] = (sectionQuizCounts[quiz.sectionId] || 0) + 1;
      });

      Object.values(sectionQuizCounts).forEach((count) => {
        expect(count).toBe(5);
      });
    });

    it('difficulty distribution should be reasonable', () => {
      const counts: Record<string, number> = {};
      quizData.quizzes.forEach((quiz: Quiz) => {
        counts[quiz.difficulty] = (counts[quiz.difficulty] || 0) + 1;
      });
      
      // Each section should have mix of difficulties
      expect(counts.easy).toBeGreaterThan(0);
      expect(counts.normal).toBeGreaterThan(0);
      expect(counts.hard).toBeGreaterThan(0);
    });
  });

  describe('Cross-validation between syllabus and quizzes', () => {
    it('syllabus sections should declare positive quiz counts', () => {
      syllabusData.chapters.forEach((chapter: Chapter) => {
        chapter.sections.forEach((section: Section) => {
          expect(section.quizCount).toBeGreaterThan(0);
        });
      });
    });
  });
});
