
import { ThemeCategory_Legacy, LegacyTheme } from '../theme-types';

export const languagesCategory: ThemeCategory_Legacy = {
  category: "LANGUAGES",
  subcategories: [
    {
      name: "Practice",
      themes: [
        { id: "english-practice", name: "English" },
        { id: "spanish-practice", name: "Spanish" },
        { id: "french-practice", name: "French" },
        { id: "german-practice", name: "German" },
        { id: "chinese-practice", name: "Chinese" },
        { id: "japanese-practice", name: "Japanese" },
        { id: "add-other-practice", name: "Add other", isAddOption: true }
      ] as LegacyTheme[]
    },
    {
      name: "Learning",
      themes: [
        { id: "english-learning", name: "English" },
        { id: "spanish-learning", name: "Spanish" },
        { id: "french-learning", name: "French" },
        { id: "german-learning", name: "German" },
        { id: "chinese-learning", name: "Chinese" },
        { id: "japanese-learning", name: "Japanese" },
        { id: "add-other-learning", name: "Add other", isAddOption: true }
      ] as LegacyTheme[]
    }
  ]
};
