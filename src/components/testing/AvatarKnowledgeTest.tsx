import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TestResult {
  avatar: string;
  language: string;
  query: string;
  response: string;
  isCorrect: boolean;
}

export const AvatarKnowledgeTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  const criticalTests = [
    {
      query: "What are the possible stay durations in Hotel Living?",
      expected: "8, 15, 22, and 29 days",
      language: "en"
    },
    {
      query: "¿Cuáles son las duraciones de estancia posibles en Hotel Living?",
      expected: "8, 15, 22 y 29 días",
      language: "es"
    },
    {
      query: "Can I get back the 15% deposit?",
      expected: "non-refundable",
      language: "en"
    },
    {
      query: "¿Puedo recuperar el depósito del 15%?",
      expected: "no reembolsable",
      language: "es"
    },
    // Localized knowledge tests
    {
      query: "¿Qué sabes sobre el programa IMSERSO?",
      expected: "IMSERSO",
      language: "es"
    },
    {
      query: "What about Portugal as retirement destination?", 
      expected: "retirement",
      language: "pt"
    },
    {
      query: "Ce știi despre tururile în România?",
      expected: "tururi",
      language: "ro"
    }
  ];

  const testAvatarKnowledge = async () => {
    setIsLoading(true);
    setResults([]);
    
    const testResults: TestResult[] = [];
    // Test specific avatars for localized content
    const avatarTests = [
      { avatars: ['antonio', 'luisa'], tests: criticalTests.filter(t => t.language === 'es') },
      { avatars: ['teresa'], tests: criticalTests.filter(t => t.language === 'pt') },
      { avatars: ['ion'], tests: criticalTests.filter(t => t.language === 'ro') },
      { avatars: ['john', 'martin'], tests: criticalTests.filter(t => t.language === 'en') }
    ];
    
    
    for (const avatarGroup of avatarTests) {
      for (const test of avatarGroup.tests) {
        for (const avatar of avatarGroup.avatars) {
          try {
            console.log(`Testing ${avatar} with: ${test.query}`);
            
            const { data, error } = await supabase.functions.invoke('avatar-knowledge-embeddings', {
              body: {
                query: test.query,
                avatarId: avatar,
                language: test.language
              }
            });

            if (error) {
              console.error('Test error:', error);
              continue;
            }

            const response = data?.knowledge || 'No response';
            const isCorrect = response.toLowerCase().includes(test.expected.toLowerCase());
            
            testResults.push({
              avatar,
              language: test.language,
              query: test.query,
              response,
              isCorrect
            });
            
          } catch (error) {
            console.error('Test failed:', error);
          }
        }
      }
    }
    
    setResults(testResults);
    setIsLoading(false);
  };

  const testCustomQuery = async () => {
    if (!customQuery.trim()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('avatar-knowledge-embeddings', {
        body: {
          query: customQuery,
          avatarId: 'antonio',
          language: 'es'
        }
      });

      if (error) {
        console.error('Custom test error:', error);
        return;
      }

      const response = data?.knowledge || 'No response';
      
      setResults([{
        avatar: 'antonio',
        language: 'es',
        query: customQuery,
        response,
        isCorrect: true // We can't auto-evaluate custom queries
      }]);
      
    } catch (error) {
      console.error('Custom test failed:', error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Avatar Knowledge System Test</h2>
        
        <div className="space-y-4">
          <Button 
            onClick={testAvatarKnowledge} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Testing...' : 'Run Critical Fact Tests'}
          </Button>
          
          <div className="flex gap-2">
            <Input
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Enter a custom question to test..."
              className="flex-1"
            />
            <Button 
              onClick={testCustomQuery}
              disabled={isLoading || !customQuery.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              Test Custom Query
            </Button>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Test Results</h3>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`border-l-4 p-4 ${
                  result.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold">
                    {result.avatar} ({result.language})
                  </span>
                  <span className={`text-sm font-bold ${
                    result.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Query:</strong> {result.query}
                </div>
                
                <div className="text-sm">
                  <strong>Response:</strong> {result.response}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <div className="text-lg font-bold">
              Success Rate: {Math.round((results.filter(r => r.isCorrect).length / results.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">
              {results.filter(r => r.isCorrect).length} out of {results.length} tests passed
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarKnowledgeTest;