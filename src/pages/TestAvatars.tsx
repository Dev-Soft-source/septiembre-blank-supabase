import AvatarKnowledgeTest from "@/components/testing/AvatarKnowledgeTest";
import LocalizedKnowledgeTest from "@/components/testing/LocalizedKnowledgeTest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Avatar Knowledge System Tests</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Knowledge Tests</TabsTrigger>
            <TabsTrigger value="localized">Localized Knowledge Tests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <AvatarKnowledgeTest />
          </TabsContent>
          
          <TabsContent value="localized">
            <LocalizedKnowledgeTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestPage;