
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Download, Languages, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface Translation {
  id: string;
  hotel_id: string;
  language_code: string;
  translation_status: string;
  auto_generated: boolean;
  created_at: string;
  hotel_name?: string;
}

export default function PruebaTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchProgress, setBatchProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('hotel_translations')
        .select(`
          id,
          hotel_id,
          language_code,
          translation_status,
          auto_generated,
          created_at,
          hotels(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const translationsWithHotel = data?.map(translation => ({
        ...translation,
        hotel_name: translation.hotels?.name || 'Unknown Hotel'
      })) || [];

      setTranslations(translationsWithHotel);
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch translations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startBatchTranslation = async () => {
    setIsRunning(true);
    setBatchProgress(0);
    
    // Simulate batch translation process
    const interval = setInterval(() => {
      setBatchProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          toast({
            description: "Batch translation completed successfully"
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      completed: "bg-green-500",
      pending: "bg-yellow-500",
      failed: "bg-red-500",
      processing: "bg-blue-500"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
  };

  const getLanguageStats = () => {
    const stats = translations.reduce((acc, translation) => {
      const lang = translation.language_code;
      if (!acc[lang]) {
        acc[lang] = { total: 0, completed: 0 };
      }
      acc[lang].total++;
      if (translation.translation_status === 'completed') {
        acc[lang].completed++;
      }
      return acc;
    }, {} as Record<string, { total: number; completed: number }>);

    return Object.entries(stats).map(([lang, data]) => ({
      language: lang,
      progress: (data.completed / data.total) * 100,
      completed: data.completed,
      total: data.total
    }));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="bg-[#7a0486] border-purple-600">
          <CardContent className="p-6">
            <div className="text-center text-white">Loading translations...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Batch Translation Management</h2>
        <div className="flex gap-2">
          <Button 
            className="flex items-center gap-2"
            onClick={startBatchTranslation}
            disabled={isRunning}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Running...' : 'Start Batch'}
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Batch Progress */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Batch Translation Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/80">
              <span>Overall Progress</span>
              <span>{batchProgress}%</span>
            </div>
            <Progress value={batchProgress} className="w-full" />
          </div>
          {isRunning && (
            <div className="flex items-center gap-2 text-sm text-white/80">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing translations...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getLanguageStats().map((lang) => (
          <Card key={lang.language} className="bg-[#7a0486] border-purple-600">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium uppercase">{lang.language}</span>
                  <Badge className="bg-purple-600 text-white">
                    {lang.completed}/{lang.total}
                  </Badge>
                </div>
                <Progress value={lang.progress} className="w-full" />
                <div className="text-xs text-white/60">
                  {lang.progress.toFixed(1)}% complete
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Translations Table */}
      <Card className="bg-[#7a0486] border-purple-600">
        <CardHeader>
          <CardTitle className="text-white">Recent Translations ({translations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-600">
                  <th className="text-left p-3 text-white">Hotel</th>
                  <th className="text-left p-3 text-white">Language</th>
                  <th className="text-left p-3 text-white">Status</th>
                  <th className="text-left p-3 text-white">Type</th>
                  <th className="text-left p-3 text-white">Created</th>
                  <th className="text-left p-3 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {translations.slice(0, 10).map((translation) => (
                  <tr key={translation.id} className="border-b border-purple-600/30 hover:bg-purple-800/20">
                    <td className="p-3 text-white font-medium">{translation.hotel_name}</td>
                    <td className="p-3 text-white/80 uppercase">{translation.language_code}</td>
                    <td className="p-3">
                      <Badge className={`${getStatusBadge(translation.translation_status)} text-white`}>
                        {translation.translation_status}
                      </Badge>
                    </td>
                    <td className="p-3 text-white/80">
                      {translation.auto_generated ? 'Auto' : 'Manual'}
                    </td>
                    <td className="p-3 text-white/80">
                      {new Date(translation.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
