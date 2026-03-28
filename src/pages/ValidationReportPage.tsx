import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, Download, CheckCircle } from 'lucide-react';
import { executeValidationReport } from '@/test/validation-report-executor';

interface TabularReportRow {
  role: string;
  testNumber: number;
  email: string;
  registrationStatus: 'Success' | 'Failed';
  emailSent: 'Yes' | 'No' | 'N/A';
  panelAccess: 'Accessible' | 'Not Accessible' | 'N/A';
  referralIdCode: 'Generated' | 'Not Generated' | 'N/A';
  issuesFound: string;
}

const ValidationReportPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [tabularData, setTabularData] = useState<TabularReportRow[]>([]);
  const [executiveSummary, setExecutiveSummary] = useState<any>(null);
  const [reportHTML, setReportHTML] = useState<string>("");

  useEffect(() => {
    // Check if reports already exist in window
    if ((window as any).validationTabularReport) {
      setTabularData((window as any).validationTabularReport);
      setExecutiveSummary((window as any).validationExecutiveSummary);
      setReportHTML((window as any).validationTabularHTML || "");
      setReportGenerated(true);
    }
  }, []);

  const runValidationReport = async () => {
    setIsRunning(true);
    try {
      await executeValidationReport();
      
      // Get results from window
      const tabular = (window as any).validationTabularReport;
      const summary = (window as any).validationExecutiveSummary;
      const htmlReport = (window as any).validationTabularHTML;
      
      setTabularData(tabular || []);
      setExecutiveSummary(summary || null);
      setReportHTML(htmlReport || "");
      setReportGenerated(true);
      
    } catch (error) {
      console.error("Failed to generate validation report:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!reportHTML) return;
    
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel-Living Validation Report</title>
    <style>
        body { margin: 0; padding: 20px; background: #f1f5f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        ${(window as any).validationSummaryHTML || ""}
        ${reportHTML}
    </div>
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotel-living-validation-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string, type: 'registration' | 'boolean' | 'code') => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    
    if (type === 'registration') {
      return status === 'Success' 
        ? <span className={`${baseClasses} bg-green-100 text-green-800`}>✅ Success</span>
        : <span className={`${baseClasses} bg-red-100 text-red-800`}>❌ Failed</span>;
    }
    
    if (type === 'boolean') {
      if (status === 'Yes' || status === 'Accessible') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>✅ {status}</span>;
      } else if (status === 'No' || status === 'Not Accessible') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>❌ {status}</span>;
      } else {
        return <span className={`${baseClasses} bg-gray-100 text-gray-600`}>➖ N/A</span>;
      }
    }
    
    if (type === 'code') {
      if (status === 'Generated') {
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>✅ Generated</span>;
      } else if (status === 'Not Generated') {
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>❌ Not Generated</span>;
      } else {
        return <span className={`${baseClasses} bg-gray-100 text-gray-600`}>➖ N/A</span>;
      }
    }
    
    return status;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Hotel': return '🏨';
      case 'User': return '👤';
      case 'Association': return '🏢';
      case 'Promoter': return '📈';
      case 'Group Leader': return '👨‍💼';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold mb-2">🏆 Validation Results Report</h1>
          <p className="text-blue-100">Complete role-based registration testing and system validation</p>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Report Generation
            </CardTitle>
            <CardDescription>
              Execute comprehensive validation tests across all system components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={runValidationReport} 
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Validation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Complete Validation
                  </>
                )}
              </Button>

              {reportGenerated && (
                <Button 
                  onClick={downloadReport} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download HTML Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        {executiveSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-600">🎯 Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {executiveSummary.overallSuccessRate}
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    executiveSummary.overallGrade === 'A' ? 'bg-green-100 text-green-800' :
                    executiveSummary.overallGrade === 'B' ? 'bg-blue-100 text-blue-800' :
                    executiveSummary.overallGrade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Grade {executiveSummary.overallGrade}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-600">🎭 Registration Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {executiveSummary.registrationSuccessRate}
                </div>
                <div className="text-sm text-gray-600">
                  {executiveSummary.successfulRegistrations}/{executiveSummary.totalRegistrationTests} Tests
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-600">💚 System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div>Email: <span className="font-semibold text-green-600">{executiveSummary.emailDeliveryRate}</span></div>
                  <div>Codes: <span className="font-semibold text-green-600">{executiveSummary.codeGenerationRate}</span></div>
                  <div>Access: <span className="font-semibold text-green-600">{executiveSummary.panelAccessRate}</span></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-600">
                  {executiveSummary.productionReady ? '✅' : '❌'} Production Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold mb-1 ${executiveSummary.productionReady ? 'text-green-600' : 'text-red-600'}`}>
                  {executiveSummary.productionReady ? 'READY' : 'BLOCKED'}
                </div>
                <div className="text-sm text-gray-600">
                  {executiveSummary.confidenceLevel} Confidence
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabular Results */}
        {tabularData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Detailed Test Results by Role
              </CardTitle>
              <CardDescription>
                Complete breakdown of registration testing across all user roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Test #</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Registration Status</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Email Sent</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Panel Access</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Referral/ID Code</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Issues Found</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabularData.map((row, index) => (
                      <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-medium">
                            <span className="text-lg">{getRoleIcon(row.role)}</span>
                            <span>{row.role}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center font-semibold text-gray-600">{row.testNumber}</td>
                        <td className="p-3">{getStatusBadge(row.registrationStatus, 'registration')}</td>
                        <td className="p-3 text-center">{getStatusBadge(row.emailSent, 'boolean')}</td>
                        <td className="p-3 text-center">{getStatusBadge(row.panelAccess, 'boolean')}</td>
                        <td className="p-3 text-center">{getStatusBadge(row.referralIdCode, 'code')}</td>
                        <td className="p-3 text-sm">
                          {row.issuesFound === 'None' ? (
                            <span className="text-green-600 font-medium">✅ No issues detected</span>
                          ) : (
                            <span className="text-red-600">{row.issuesFound}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {!reportGenerated && !isRunning && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                📊 No validation report generated yet
              </div>
              <p className="text-gray-600 mb-4">
                Click "Run Complete Validation" to execute all tests and generate the report
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ValidationReportPage;