
import { CodeStatsCounter } from "@/components/code-stats/CodeStatsCounter";
import { SupabaseIntegrationSection } from "@/components/code-stats/SupabaseIntegrationSection";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function CodeStats() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Hotel Living Codebase Statistics
        </h1>
        <CodeStatsCounter />
        <SupabaseIntegrationSection />
      </main>
      <Footer />
    </div>
  );
}
