import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { HierarchicalThemeSelector } from '@/components/filters/HierarchicalThemeSelector';
import { useUserAffinities } from '@/hooks/useUserAffinities';
import { ThemeTag } from '@/components/ThemeTag';
export const MyAffinities: React.FC = () => {
  const {
    userAffinities,
    loading,
    addAffinity,
    removeAffinity
  } = useUserAffinities();
  const [showSelector, setShowSelector] = React.useState(false);
  const selectedThemeIds = userAffinities.map(ua => ua.theme_id);
  const handleThemeSelect = (themeId: string, isSelected: boolean) => {
    if (isSelected) {
      addAffinity(themeId);
    } else {
      removeAffinity(themeId);
    }
  };
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle>My Affinities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card>
      
      <CardContent className="space-y-4">
        {userAffinities.length > 0 ? <div className="flex flex-wrap gap-2">
            {userAffinities.map(affinity => <div key={affinity.id} className="relative group">
                <ThemeTag theme={affinity.themes} size="md" className="pr-8" />
                <button onClick={() => removeAffinity(affinity.theme_id)} className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-white hover:text-red-300" />
                </button>
              </div>)}
          </div> : <p className="text-muted-foreground text-sm">
            No affinities selected yet. Add some to get personalized hotel recommendations!
          </p>}

        {showSelector && <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-medium">Select Your Affinities</h4>
              <Button onClick={() => setShowSelector(false)} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <HierarchicalThemeSelector selectedThemes={selectedThemeIds} onThemeSelect={handleThemeSelect} allowMultiple={true} className="space-y-2" />
            </div>
          </div>}
      </CardContent>
    </Card>;
};