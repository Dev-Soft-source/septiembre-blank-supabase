import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocalizedTestResult {
  avatar: string;
  language: string;
  query: string;
  response: string;
  hasLocalizedContent: boolean;
  shouldHaveLocalizedContent: boolean;
  isIsolated: boolean;
}

export const LocalizedKnowledgeTest: React.FC = () => {
  const [results, setResults] = useState<LocalizedTestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const localizedTests = [
    // Spanish IMSERSO tests (Antonio & Luisa ONLY)
    {
      query: "¿Qué sabes sobre el programa IMSERSO?",
      expectedContent: "IMSERSO",
      language: "es",
      authorizedAvatars: ['antonio', 'luisa'],
      unauthorizedAvatars: ['john', 'teresa', 'ion', 'martin']
    },
    {
      query: "¿Hay alternativas al IMSERSO para mayores?", 
      expectedContent: "IMSERSO",
      language: "es",
      authorizedAvatars: ['antonio', 'luisa'],
      unauthorizedAvatars: ['john', 'teresa', 'ion', 'martin']
    },
    
    // Portuguese retirement tests (Teresa ONLY)
    {
      query: "Portugal é bom para aposentados?",
      expectedContent: "aposentadoria",
      language: "pt", 
      authorizedAvatars: ['teresa'],
      unauthorizedAvatars: ['antonio', 'luisa', 'john', 'ion', 'martin']
    },
    {
      query: "Quais são as vantagens de Portugal?",
      expectedContent: "clima",
      language: "pt",
      authorizedAvatars: ['teresa'], 
      unauthorizedAvatars: ['antonio', 'luisa', 'john', 'ion', 'martin']
    },
    
    // Romanian tours tests (Ion ONLY)
    {
      query: "Ce știi despre tururile în România?",
      expectedContent: "tururi",
      language: "ro",
      authorizedAvatars: ['ion'],
      unauthorizedAvatars: ['antonio', 'luisa', 'john', 'teresa', 'martin']
    },
    {
      query: "Sunt sigure tururile în grupuri mici?",
      expectedContent: "siguranță",
      language: "ro",
      authorizedAvatars: ['ion'],
      unauthorizedAvatars: ['antonio', 'luisa', 'john', 'teresa', 'martin']
    }
  ];

  const testLocalizedKnowledge = async () => {
    setIsLoading(true);
    setResults([]);
    
    const testResults: LocalizedTestResult[] = [];
    
    for (const test of localizedTests) {
      // Test authorized avatars (should have localized content)
      for (const avatar of test.authorizedAvatars) {
        try {
          console.log(`Testing AUTHORIZED ${avatar} with: ${test.query}`);
          
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
          const hasLocalizedContent = response.toLowerCase().includes(test.expectedContent.toLowerCase());
          
          testResults.push({
            avatar,
            language: test.language,
            query: test.query,
            response,
            hasLocalizedContent,
            shouldHaveLocalizedContent: true,
            isIsolated: hasLocalizedContent // Should have content for authorized avatar
          });
          
        } catch (error) {
          console.error('Test failed:', error);
        }
      }
      
      // Test unauthorized avatars (should NOT have localized content)
      for (const avatar of test.unauthorizedAvatars) {
        try {
          console.log(`Testing UNAUTHORIZED ${avatar} with: ${test.query}`);
          
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
          const hasLocalizedContent = response.toLowerCase().includes(test.expectedContent.toLowerCase());
          
          testResults.push({
            avatar,
            language: test.language,
            query: test.query,
            response,
            hasLocalizedContent,
            shouldHaveLocalizedContent: false,
            isIsolated: !hasLocalizedContent // Should NOT have content for unauthorized avatar
          });
          
        } catch (error) {
          console.error('Test failed:', error);
        }
      }
    }
    
    setResults(testResults);
    setIsLoading(false);
  };

  const successfulIsolations = results.filter(r => r.isIsolated).length;
  const totalTests = results.length;
  const isolationRate = totalTests > 0 ? Math.round((successfulIsolations / totalTests) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Localized Knowledge Isolation Test</h2>
        <p className="text-gray-600 mb-4">
          This test verifies that localized knowledge is properly isolated to specific avatars and languages.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-bold text-blue-800">Spanish (ES)</h3>
            <p className="text-sm text-blue-600">IMSERSO program info</p>
            <p className="text-xs">Only: Antonio & Luisa</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="font-bold text-green-800">Portuguese (PT)</h3>
            <p className="text-sm text-green-600">Portugal retirement info</p>
            <p className="text-xs">Only: Teresa</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="font-bold text-purple-800">Romanian (RO)</h3>
            <p className="text-sm text-purple-600">Romania tours info</p>
            <p className="text-xs">Only: Ion</p>
          </div>
        </div>
        
        <Button 
          onClick={testLocalizedKnowledge} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Testing Isolation...' : 'Run Localized Knowledge Tests'}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Isolation Test Results</h3>
            <div className={`text-lg font-bold ${isolationRate >= 95 ? 'text-green-600' : isolationRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
              Isolation Rate: {isolationRate}%
            </div>
          </div>
          
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`border-l-4 p-4 ${
                  result.isIsolated 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">
                      {result.avatar} ({result.language})
                    </span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${
                      result.shouldHaveLocalizedContent 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {result.shouldHaveLocalizedContent ? 'AUTHORIZED' : 'UNAUTHORIZED'}
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${
                    result.isIsolated ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.isIsolated ? '✓ ISOLATED' : '✗ LEAK DETECTED'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Query:</strong> {result.query}
                </div>
                
                <div className="text-sm mb-2">
                  <strong>Has Localized Content:</strong> 
                  <span className={result.hasLocalizedContent ? 'text-green-600' : 'text-gray-600'}>
                    {result.hasLocalizedContent ? ' YES' : ' NO'}
                  </span>
                  <span className="text-gray-500">
                    {result.shouldHaveLocalizedContent ? ' (should have)' : ' (should not have)'}
                  </span>
                </div>
                
                <div className="text-sm bg-gray-50 p-2 rounded">
                  <strong>Response:</strong> {result.response.substring(0, 200)}
                  {result.response.length > 200 && '...'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-bold text-green-600">
                  ✓ Successful Isolations: {successfulIsolations}
                </div>
                <div className="text-sm text-gray-600">
                  Content properly isolated to authorized avatars
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  ✗ Isolation Failures: {totalTests - successfulIsolations}
                </div>
                <div className="text-sm text-gray-600">
                  Content leaked to unauthorized avatars
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalizedKnowledgeTest;