
import { ThemeCategory_Legacy, LegacyTheme, ThemeSubcategory_Legacy } from '../theme-types';

export const foodAndDrinksCategory: ThemeCategory_Legacy = {
  category: "FOODS & DRINKS",
  subcategories: [
    {
      name: "Culinary",
      id: "culinary",
      level: 2,
      children: [
        {
          id: "world-cuisines",
          name: "World Cuisines",
          level: 3,
          children: [
            { id: "spain", name: "Spain" },
            { id: "france", name: "France" },
            { id: "italy", name: "Italian" },
            { id: "add-other", name: "Add other", isAddOption: true }
          ]
        },
        {
          id: "cuisine-learning",
          name: "Cuisine Learning", 
          level: 3,
          children: [
            { id: "meat", name: "Meat" },
            { id: "fish", name: "Fish" },
            { id: "seafood", name: "Seafood" },
            { id: "add-other", name: "Add other", isAddOption: true }
          ]
        }
      ]
    } as ThemeSubcategory_Legacy,
    {
      name: "Drinks",
      id: "drinks",
      level: 2,
      children: [
        { id: "wine", name: "Wine" },
        { id: "beer", name: "Beer" },
        { id: "cocktails", name: "Cocktails" },
        { id: "spirits", name: "Spirits" },
        { id: "add-other", name: "Add other", isAddOption: true }
      ] as LegacyTheme[]
    } as ThemeSubcategory_Legacy
  ]
};
