
import { ThemeCategory_Legacy, LegacyTheme } from '../theme-types';

export const musicCategory: ThemeCategory_Legacy = {
  category: "MUSIC",
  themes: [
    { id: "rock", name: "Rock" },
    { id: "opera", name: "Opera" },
    { id: "symphonic", name: "Symphonic" },
    { id: "classical", name: "Classical" },
    { id: "pop", name: "Pop" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

export const gamesCategory: ThemeCategory_Legacy = {
  category: "GAMES",
  themes: [
    { id: "board-games", name: "Board Games" },
    { id: "card-games", name: "Card Games" },
    { id: "chess", name: "Chess" },
    { id: "video-games", name: "Video Games" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

export const literatureCategory: ThemeCategory_Legacy = {
  category: "LITERATURE",
  themes: [
    { id: "poetry", name: "Poetry" },
    { id: "novels", name: "Novels" },
    { id: "short-stories", name: "Short Stories" },
    { id: "book-clubs", name: "Book Clubs" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};
