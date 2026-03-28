
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSection {
  id: string;
  title: string;
  emoji?: string; // Making emoji optional with the ? modifier
  questions: FaqItem[];
}
