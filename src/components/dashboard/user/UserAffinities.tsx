import React from "react";
import { Heart, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserAffinities } from "@/hooks/useUserAffinities";
export function UserAffinities() {
  const {
    t
  } = useTranslation();
  const {
    userAffinities,
    loading,
    removeAffinity
  } = useUserAffinities();
  if (loading) {
    return <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            {t('dashboard.preferences.affinities')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>;
  }
  return <Card>
      
      <CardContent className="space-y-4">
        {userAffinities.length === 0 ? <div className="text-center py-8 text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No affinities selected yet</p>
            <p className="text-sm">Add some interests to get personalized recommendations</p>
          </div> : <div className="flex flex-wrap gap-2">
            {userAffinities.map(affinity => <Badge key={affinity.id} variant="secondary" className="flex items-center gap-2 px-3 py-1">
                {affinity.themes.name}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-destructive/20" onClick={() => removeAffinity(affinity.theme_id)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>)}
          </div>}

        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Affinity
        </Button>
      </CardContent>
    </Card>;
}