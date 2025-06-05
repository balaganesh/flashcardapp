
import { FlashcardSet } from '../types';
import { LOCAL_STORAGE_USERNAME_KEY, LOCAL_STORAGE_SETS_KEY } from '../constants';

export const storageService = {
  getUserName: (): string | null => {
    return localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
  },

  setUserName: (name: string): void => {
    localStorage.setItem(LOCAL_STORAGE_USERNAME_KEY, name);
  },

  getFlashcardSets: (): FlashcardSet[] => {
    const setsJson = localStorage.getItem(LOCAL_STORAGE_SETS_KEY);
    return setsJson ? JSON.parse(setsJson) : [];
  },

  saveFlashcardSets: (sets: FlashcardSet[]): void => {
    localStorage.setItem(LOCAL_STORAGE_SETS_KEY, JSON.stringify(sets));
  },

  addFlashcardSet: (newSet: FlashcardSet): FlashcardSet[] => {
    const sets = storageService.getFlashcardSets();
    const updatedSets = [...sets, newSet];
    storageService.saveFlashcardSets(updatedSets);
    return updatedSets;
  },

  updateFlashcardSet: (updatedSet: FlashcardSet): FlashcardSet[] => {
    let sets = storageService.getFlashcardSets();
    sets = sets.map(s => s.id === updatedSet.id ? updatedSet : s);
    storageService.saveFlashcardSets(sets);
    return sets;
  },

  deleteFlashcardSet: (setId: string): FlashcardSet[] => {
    let sets = storageService.getFlashcardSets();
    sets = sets.filter(s => s.id !== setId);
    storageService.saveFlashcardSets(sets);
    return sets;
  },
};
    