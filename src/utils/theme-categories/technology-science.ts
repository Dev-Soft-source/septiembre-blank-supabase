
import { ThemeCategory_Legacy, LegacyTheme } from '../theme-types';

export const technologyCategory: ThemeCategory_Legacy = {
  category: "TECHNOLOGY",
  themes: [
    { id: "digital", name: "Digital" },
    { id: "innovation", name: "Innovation" },
    { id: "smart-home", name: "Smart Home" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

export const sciencesCategory: ThemeCategory_Legacy = {
  category: "SCIENCES",
  themes: [
    { id: "astronomy", name: "Astronomy" },
    { id: "biology", name: "Biology" },
    { id: "physics", name: "Physics" },
    { id: "chemistry", name: "Chemistry" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};
