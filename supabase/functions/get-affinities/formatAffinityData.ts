
interface Theme {
  id: string;
  name: string;
  description?: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface AffinityData {
  themes: Theme[];
  categories: Category[];
}

export function formatAffinityData(data: AffinityData) {
  const { themes, categories } = data;

  // Group themes by category
  const categorizedThemes = categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    themes: themes.filter(theme => theme.category_id === category.id)
  }));

  // Get uncategorized themes
  const uncategorizedThemes = themes.filter(theme => !theme.category_id);

  // Format for API response
  return {
    success: true,
    data: {
      total_themes: themes.length,
      total_categories: categories.length,
      categorized_themes: categorizedThemes,
      uncategorized_themes: uncategorizedThemes,
      all_themes: themes.map(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description,
        category: categories.find(cat => cat.id === theme.category_id)?.name || null
      }))
    },
    timestamp: new Date().toISOString()
  };
}
