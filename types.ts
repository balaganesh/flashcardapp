
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: string;
  name: string;
  cards: Flashcard[];
}

export enum StudyView {
  Welcome,
  MainMenu,
  SetManagement,
  SingleCardStudy,
  MultipleCardMatch,
  Settings,
}

export interface StudyCard extends Flashcard {
  status: 'unseen' | 'wrong' | 'correct';
}

export interface MatchCard {
  id: string;
  content: string;
  type: 'question' | 'answer';
  originalCardId: string;
  isMatched: boolean;
}
    