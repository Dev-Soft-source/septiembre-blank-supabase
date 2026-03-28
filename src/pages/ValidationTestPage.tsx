import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { runConsolidatedFinalValidation } from '@/test/consolidated-final-validation-report';

export default function ValidationTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleRunValidation = async () => {
    setIsRunning(true);
    try {
      const { report, readableReport } = await runConsolidatedFinalValidation();
      setResults({ report, readableReport });
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-500';
      case 'B': return 'bg-blue-500';
      case 'C': return 'bg-yellow-500';
      case 'D': return 'bg-orange-500';
      case 'F': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Validation Dashboard</h1>
          <p className="text-gray-600 mt-2">Complete testing suite for adapter performance, forms, and role-based registrations</p>
        </div>
        <Button 
          onClick={handleRunValidation} 
          disabled={isRunning}
          className="bg-[#7E26A6] hover:bg-[#5D0080] text-white"
        >
          {isRunning ? 'Running Tests...' : 'Run Complete Validation'}
        </Button>
      </div>

      {results && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Adapter Performance</TabsTrigger>
            <TabsTrigger value="forms">Form Functionality</TabsTrigger>
            <TabsTrigger value="registration">Role Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Overall Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-2xl font-bold ${
                      results.report.productionReadiness.readyForProduction ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {results.report.productionReadiness.readyForProduction ? '✅ READY' : '❌ NOT READY'}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Confidence: {results.report.productionReadiness.confidenceLevel.toFixed(1)}%
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <Badge variant="outline">{results.report.executionSummary.overallSuccessRate.toFixed(1)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Tests Passed:</span>
                      <Badge variant="outline">{results.report.executionSummary.totalTestsPassed}/{results.report.executionSummary.totalTestsRun}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Issues:</span>
                      <Badge variant={results.report.executionSummary.criticalIssues === 0 ? "default" : "destructive"}>
                        {results.report.executionSummary.criticalIssues}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Component Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Adapter:</span>
                      <Badge className={`${getGradeBadgeColor(results.report.adapterPerformance.performanceGrade)} text-white`}>
                        {results.report.adapterPerformance.performanceGrade}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Forms:</span>
                      <Badge className={`${getGradeBadgeColor(results.report.formFunctionality.functionalityGrade)} text-white`}>
                        {results.report.formFunctionality.functionalityGrade}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Registration:</span>
                      <Badge className={`${getGradeBadgeColor(results.report.roleBasedRegistrations.registrationGrade)} text-white`}>
                        {results.report.roleBasedRegistrations.registrationGrade}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.report.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#7E26A6] font-bold">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Adapter Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Improvement:</span>
                      <Badge variant="outline">{results.report.adapterPerformance.averageImprovement.toFixed(1)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Consistency Rate:</span>
                      <Badge variant="outline">{results.report.adapterPerformance.consistencyRate.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <div>
                    <Badge className={`${getGradeBadgeColor(results.report.adapterPerformance.performanceGrade)} text-white text-lg p-2`}>
                      Grade: {results.report.adapterPerformance.performanceGrade}
                    </Badge>
                  </div>
                </div>
                
                {results.report.adapterPerformance.criticalPerformanceIssues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Critical Performance Issues:</h4>
                    <ul className="space-y-1">
                      {results.report.adapterPerformance.criticalPerformanceIssues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-red-600">❌ {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Form Functionality Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Forms Tested:</span>
                      <Badge variant="outline">{results.report.formFunctionality.formsTestedCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Forms Passed:</span>
                      <Badge variant="outline">{results.report.formFunctionality.formsPassedCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <Badge variant="outline">
                        {((results.report.formFunctionality.formsPassedCount / results.report.formFunctionality.formsTestedCount) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Badge className={`${getGradeBadgeColor(results.report.formFunctionality.functionalityGrade)} text-white text-lg p-2`}>
                      Grade: {results.report.formFunctionality.functionalityGrade}
                    </Badge>
                  </div>
                </div>
                
                {results.report.formFunctionality.criticalFormIssues.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-red-600">Critical Form Issues:</h4>
                    <ul className="space-y-1">
                      {results.report.formFunctionality.criticalFormIssues.map((issue: string, index: number) => (
                        <li key={index} className="text-sm text-red-600">❌ {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Registration Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Roles Tested:</span>
                      <Badge variant="outline">{results.report.roleBasedRegistrations.rolesTestedCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Registrations:</span>
                      <Badge variant="outline">{results.report.roleBasedRegistrations.totalRegistrationsSimulated}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Successful:</span>
                      <Badge variant="outline">{results.report.roleBasedRegistrations.successfulRegistrations}</Badge>
                    </div>
                  </div>
                  <div>
                    <Badge className={`${getGradeBadgeColor(results.report.roleBasedRegistrations.registrationGrade)} text-white text-lg p-2`}>
                      Grade: {results.report.roleBasedRegistrations.registrationGrade}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#7E26A6]">
                      {results.report.roleBasedRegistrations.emailDeliveryRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Email Delivery</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#7E26A6]">
                      {results.report.roleBasedRegistrations.codeGenerationRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Code Generation</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#7E26A6]">
                      {results.report.roleBasedRegistrations.panelAccessRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Panel Access</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Full Report</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              <pre className="text-xs whitespace-pre-wrap">{results.readableReport}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}