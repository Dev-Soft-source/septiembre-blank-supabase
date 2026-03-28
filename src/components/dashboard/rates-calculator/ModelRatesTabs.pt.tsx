
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DefaultCostsTab } from "./DefaultCostsTab";
import { RatesCalculatorTab } from "./RatesCalculatorTab";

export const ModelRatesTabs: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">

      <Tabs defaultValue="costs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-purple-900/30">
          <TabsTrigger 
            value="costs" 
            className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white flex flex-col items-center gap-1"
          >
            <span className="text-xs font-bold">1</span>
            <span className="text-[0.7rem] leading-tight">Modelo Econômico Padrão</span>
          </TabsTrigger>
          <TabsTrigger 
            value="calculator" 
            className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white flex flex-col items-center gap-1"
          >
            <span className="text-xs font-bold">2</span>
            <span className="text-[0.7rem] leading-tight">Crie Seu Próprio Modelo</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="costs" className="mt-8">
          <DefaultCostsTab />
        </TabsContent>

        <TabsContent value="calculator" className="mt-8">
          <RatesCalculatorTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
