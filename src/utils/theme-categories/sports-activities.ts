
import { ThemeCategory_Legacy, LegacyTheme } from '../theme-types';

export const sportsCategory: ThemeCategory_Legacy = {
  category: "SPORTS",
  themes: [
    { id: "golf", name: "Golf" },
    { id: "tennis", name: "Tennis" },
    { id: "swimming", name: "Swimming" },
    { id: "diving", name: "Diving" },
    { id: "yoga", name: "Yoga" },
    { id: "fitness", name: "Fitness" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};

export const danceCategory: ThemeCategory_Legacy = {
  category: "DANCE",
  themes: [
    { id: "ballroom", name: "Ballroom" },
    { id: "latin", name: "Latin" },
    { id: "contemporary", name: "Contemporary" },
    { id: "traditional", name: "Traditional" },
    { id: "add-other", name: "Add other", isAddOption: true }
  ] as LegacyTheme[]
};
