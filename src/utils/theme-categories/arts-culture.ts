
import { ThemeCategory_Legacy, LegacyTheme } from '../theme-types';

export const artCategory: ThemeCategory_Legacy = {
  category: "ART",
  themes: [
    { id: "painting", name: "Painting" },
    { id: "sculpture", name: "Sculpture" },
    { id: "photography", name: "Photography" },
    { id: "architecture", name: "Architecture" },
    { id: "design", name: "Design" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

export const cultureCategory: ThemeCategory_Legacy = {
  category: "CULTURE",
  themes: [
    { id: "history", name: "History" },
    { id: "museums", name: "Museums" },
    { id: "local-traditions", name: "Local Traditions" },
    { id: "festivals", name: "Festivals" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};
