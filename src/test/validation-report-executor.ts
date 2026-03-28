/**
 * Validation Report Executor
 * Runs complete validation and generates tabular reports
 */

import { runEnhancedConsolidatedValidation } from './enhanced-consolidated-validation';
import { runRoleBasedRegistrationSimulation } from './role-based-registration-simulation';

export interface TabularReportRow {
  role: string;
  testNumber: number;
  email: string;
  registrationStatus: 'Success' | 'Failed';
  emailSent: 'Yes' | 'No' | 'N/A';
  panelAccess: 'Accessible' | 'Not Accessible' | 'N/A';
  referralIdCode: 'Generated' | 'Not Generated' | 'N/A';
  issuesFound: string;
}

export class ValidationReportExecutor {
  
  async generateFullValidationReport(): Promise<{
    tabularReport: TabularReportRow[];
    executiveSummary: any;
    detailedResults: any;
  }> {
    console.log('📊 GENERATING FULL VALIDATION REPORT');
    console.log('====================================');
    
    // Execute the complete validation suite
    const validationResults = await runEnhancedConsolidatedValidation();
    
    // Execute detailed role-based registration simulation
    const roleRegistrationResults = await runRoleBasedRegistrationSimulation();
    
    // Generate tabular report
    const tabularReport = this.generateTabularReport(roleRegistrationResults);
    
    // Generate executive summary
    const executiveSummary = this.generateExecutiveSummary(validationResults.report, roleRegistrationResults);
    
    return {
      tabularReport,
      executiveSummary,
      detailedResults: validationResults
    };
  }
  
  private generateTabularReport(roleResults: any): TabularReportRow[] {
    const tabularRows: TabularReportRow[] = [];
    
    // Process each role test
    roleResults.roleTests.forEach((roleTest: any) => {
      roleTest.results.forEach((result: any, index: number) => {
        const testNumber = roleTest.role === 'promoter' || roleTest.role === 'leaderliving' 
          ? index + 1 
          : roleTest.role === 'hotel' ? (index === 0 ? 1 : 2)
          : roleTest.role === 'user' ? (index === 0 ? 1 : 2)
          : 1;
        
        // Collect issues
        const issues = result.errors.length > 0 ? result.errors.join('; ') : 'None';
        
        // Determine referral/ID code status
        let referralIdCodeStatus: 'Generated' | 'Not Generated' | 'N/A' = 'N/A';
        if (['hotel', 'association', 'promoter', 'leaderliving'].includes(roleTest.role)) {
          referralIdCodeStatus = result.referralCodeGenerated ? 'Generated' : 'Not Generated';
        }
        
        tabularRows.push({
          role: this.formatRoleName(roleTest.role),
          testNumber,
          email: result.email,
          registrationStatus: result.registrationStatus === 'success' ? 'Success' : 'Failed',
          emailSent: result.emailSent ? 'Yes' : 'No',
          panelAccess: result.panelAccessible ? 'Accessible' : result.registrationStatus === 'success' ? 'Not Accessible' : 'N/A',
          referralIdCode: referralIdCodeStatus,
          issuesFound: issues
        });
      });
    });
    
    return tabularRows.sort((a, b) => {
      const roleOrder = ['Hotel', 'User', 'Association', 'Promoter', 'Group Leader'];
      const aIndex = roleOrder.indexOf(a.role);
      const bIndex = roleOrder.indexOf(b.role);
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      return a.testNumber - b.testNumber;
    });
  }
  
  private formatRoleName(role: string): string {
    switch (role) {
      case 'hotel': return 'Hotel';
      case 'user': return 'User';
      case 'association': return 'Association';
      case 'promoter': return 'Promoter';
      case 'leaderliving': return 'Group Leader';
      default: return role;
    }
  }
  
  private generateExecutiveSummary(validationReport: any, roleResults: any) {
    const consolidatedReport = roleResults.consolidatedReport;
    
    return {
      totalValidationTests: validationReport.executionSummary.totalTests,
      overallSuccessRate: ((validationReport.executionSummary.passedTests / validationReport.executionSummary.totalTests) * 100).toFixed(1) + '%',
      overallGrade: validationReport.executionSummary.overallGrade,
      
      // Registration-specific metrics
      totalRegistrationTests: consolidatedReport.summary.totalRegistrations,
      successfulRegistrations: consolidatedReport.summary.successfulRegistrations,
      registrationSuccessRate: consolidatedReport.summary.successRate.toFixed(1) + '%',
      
      // System health
      emailDeliveryRate: consolidatedReport.systemHealth.emailDelivery.toFixed(1) + '%',
      codeGenerationRate: consolidatedReport.systemHealth.codeGeneration.toFixed(1) + '%',
      panelAccessRate: consolidatedReport.systemHealth.panelAccess.toFixed(1) + '%',
      
      // Production readiness
      productionReady: validationReport.productionReadiness.isReady,
      confidenceLevel: validationReport.productionReadiness.confidenceLevel.toFixed(1) + '%',
      criticalBlockers: validationReport.productionReadiness.blockers.length,
      
      // Role breakdown
      roleBreakdown: consolidatedReport.roleBreakdown
    };
  }
  
  generateTabularHTML(tabularData: TabularReportRow[]): string {
    let html = `
<div class="validation-report-container" style="font-family: 'Inter', sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🏆 VALIDATION RESULTS REPORT</h1>
    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Complete Role-Based Registration Testing Results</p>
  </div>

  <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
          <th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">Role</th>
          <th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">Test #</th>
          <th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">Registration Status</th>
          <th style="padding: 16px 12px; text-align: center; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">Email Sent</th>
          <th style="padding: 16px 12px; text-align: center; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">Panel Access</th>
          <th style="padding: 16px 12px; text-align: center; font-weight: 600; color: #334155; border-right: 1px solid #e2e8f0;">Referral/ID Code</th>
          <th style="padding: 16px 12px; text-align: left; font-weight: 600; color: #334155;">Issues Found</th>
        </tr>
      </thead>
      <tbody>`;

    tabularData.forEach((row, index) => {
      const isEvenRow = index % 2 === 0;
      const bgColor = isEvenRow ? '#ffffff' : '#f8fafc';
      
      // Status badges
      const getStatusBadge = (status: string, type: 'registration' | 'boolean' | 'code') => {
        if (type === 'registration') {
          return status === 'Success' 
            ? '<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">✅ Success</span>'
            : '<span style="background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">❌ Failed</span>';
        }
        
        if (type === 'boolean') {
          if (status === 'Yes' || status === 'Accessible') {
            return '<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">✅ ' + status + '</span>';
          } else if (status === 'No' || status === 'Not Accessible') {
            return '<span style="background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">❌ ' + status + '</span>';
          } else {
            return '<span style="background: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">➖ N/A</span>';
          }
        }
        
        if (type === 'code') {
          if (status === 'Generated') {
            return '<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">✅ Generated</span>';
          } else if (status === 'Not Generated') {
            return '<span style="background: #fee2e2; color: #dc2626; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">❌ Not Generated</span>';
          } else {
            return '<span style="background: #f1f5f9; color: #64748b; padding: 4px 8px; border-radius: 6px; font-weight: 500; font-size: 12px;">➖ N/A</span>';
          }
        }
        
        return status;
      };
      
      html += `
        <tr style="background: ${bgColor}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: 600; color: #1e293b; border-right: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px;">${this.getRoleIcon(row.role)}</span>
              <span>${row.role}</span>
            </div>
          </td>
          <td style="padding: 12px; color: #64748b; border-right: 1px solid #e2e8f0; text-align: center; font-weight: 600;">${row.testNumber}</td>
          <td style="padding: 12px; border-right: 1px solid #e2e8f0;">${getStatusBadge(row.registrationStatus, 'registration')}</td>
          <td style="padding: 12px; text-align: center; border-right: 1px solid #e2e8f0;">${getStatusBadge(row.emailSent, 'boolean')}</td>
          <td style="padding: 12px; text-align: center; border-right: 1px solid #e2e8f0;">${getStatusBadge(row.panelAccess, 'boolean')}</td>
          <td style="padding: 12px; text-align: center; border-right: 1px solid #e2e8f0;">${getStatusBadge(row.referralIdCode, 'code')}</td>
          <td style="padding: 12px; color: ${row.issuesFound === 'None' ? '#16a34a' : '#dc2626'}; font-size: 13px;">
            ${row.issuesFound === 'None' 
              ? '<span style="color: #16a34a; font-weight: 500;">✅ No issues detected</span>' 
              : '<span style="color: #dc2626;">' + row.issuesFound + '</span>'
            }
          </td>
        </tr>`;
    });

    html += `
      </tbody>
    </table>
  </div>
</div>`;

    return html;
  }
  
  private getRoleIcon(role: string): string {
    switch (role) {
      case 'Hotel': return '🏨';
      case 'User': return '👤';
      case 'Association': return '🏢';
      case 'Promoter': return '📈';
      case 'Group Leader': return '👨‍💼';
      default: return '👤';
    }
  }
  
  generateSummaryHTML(summary: any): string {
    return `
<div class="summary-container" style="font-family: 'Inter', sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; font-size: 24px; font-weight: 700;">📊 EXECUTIVE SUMMARY</h2>
    <p style="margin: 10px 0 0 0; opacity: 0.9;">Overall System Health & Performance Metrics</p>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
    <!-- Overall Performance Card -->
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-left: 4px solid #3b82f6;">
      <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        🎯 Overall Performance
      </h3>
      <div style="space-y: 10px;">
        <div style="margin-bottom: 10px;">
          <span style="color: #64748b; font-size: 14px;">Success Rate:</span>
          <span style="color: #059669; font-weight: 700; font-size: 24px; margin-left: 8px;">${summary.overallSuccessRate}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="color: #64748b; font-size: 14px;">Overall Grade:</span>
          <span style="background: ${this.getGradeColor(summary.overallGrade)}; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 700; margin-left: 8px;">${summary.overallGrade}</span>
        </div>
        <div>
          <span style="color: #64748b; font-size: 14px;">Total Tests:</span>
          <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">${summary.totalValidationTests}</span>
        </div>
      </div>
    </div>

    <!-- Registration Metrics Card -->
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-left: 4px solid #8b5cf6;">
      <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        🎭 Registration Testing
      </h3>
      <div>
        <div style="margin-bottom: 10px;">
          <span style="color: #64748b; font-size: 14px;">Success Rate:</span>
          <span style="color: #059669; font-weight: 700; font-size: 20px; margin-left: 8px;">${summary.registrationSuccessRate}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="color: #64748b; font-size: 14px;">Tests Completed:</span>
          <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">${summary.successfulRegistrations}/${summary.totalRegistrationTests}</span>
        </div>
      </div>
    </div>

    <!-- System Health Card -->
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-left: 4px solid #10b981;">
      <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        💚 System Health
      </h3>
      <div>
        <div style="margin-bottom: 8px;">
          <span style="color: #64748b; font-size: 14px;">Email Delivery:</span>
          <span style="color: #059669; font-weight: 600; margin-left: 8px;">${summary.emailDeliveryRate}</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="color: #64748b; font-size: 14px;">Code Generation:</span>
          <span style="color: #059669; font-weight: 600; margin-left: 8px;">${summary.codeGenerationRate}</span>
        </div>
        <div style="margin-bottom: 8px;">
          <span style="color: #64748b; font-size: 14px;">Panel Access:</span>
          <span style="color: #059669; font-weight: 600; margin-left: 8px;">${summary.panelAccessRate}</span>
        </div>
      </div>
    </div>

    <!-- Production Status Card -->
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-left: 4px solid ${summary.productionReady ? '#10b981' : '#ef4444'};">
      <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
        ${summary.productionReady ? '✅' : '❌'} Production Status
      </h3>
      <div>
        <div style="margin-bottom: 10px;">
          <span style="color: #64748b; font-size: 14px;">Status:</span>
          <span style="background: ${summary.productionReady ? '#dcfce7' : '#fee2e2'}; color: ${summary.productionReady ? '#166534' : '#dc2626'}; padding: 4px 8px; border-radius: 6px; font-weight: 600; margin-left: 8px;">
            ${summary.productionReady ? 'READY' : 'BLOCKED'}
          </span>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="color: #64748b; font-size: 14px;">Confidence:</span>
          <span style="color: #1e293b; font-weight: 600; margin-left: 8px;">${summary.confidenceLevel}</span>
        </div>
        <div>
          <span style="color: #64748b; font-size: 14px;">Blockers:</span>
          <span style="color: ${summary.criticalBlockers === 0 ? '#059669' : '#dc2626'}; font-weight: 600; margin-left: 8px;">${summary.criticalBlockers}</span>
        </div>
      </div>
    </div>
  </div>
</div>`;
  }
  
  private getGradeColor(grade: string): string {
    switch (grade) {
      case 'A': return '#10b981';
      case 'B': return '#3b82f6';
      case 'C': return '#f59e0b';
      case 'D': return '#f97316';
      case 'F': return '#ef4444';
      default: return '#64748b';
    }
  }
}

// Execute and display results
export async function executeValidationReport(): Promise<void> {
  const executor = new ValidationReportExecutor();
  
  try {
    console.log("🚀 Executing Full Validation Report...");
    const results = await executor.generateFullValidationReport();
    
    // Generate HTML reports
    const summaryHTML = executor.generateSummaryHTML(results.executiveSummary);
    const tabularHTML = executor.generateTabularHTML(results.tabularReport);
    
    // Display results in console
    console.log("\n" + "=".repeat(80));
    console.log("📋 VALIDATION RESULTS - TABULAR FORMAT");
    console.log("=".repeat(80));
    
    console.table(results.tabularReport);
    
    console.log("\n" + "=".repeat(80));
    console.log("📊 EXECUTIVE SUMMARY");
    console.log("=".repeat(80));
    console.log(results.executiveSummary);
    
    // Save to window for access
    (window as any).validationTabularReport = results.tabularReport;
    (window as any).validationExecutiveSummary = results.executiveSummary;
    (window as any).validationSummaryHTML = summaryHTML;
    (window as any).validationTabularHTML = tabularHTML;
    
    console.log("\n💾 Reports saved to window object:");
    console.log("   • window.validationTabularReport");
    console.log("   • window.validationExecutiveSummary");
    console.log("   • window.validationSummaryHTML");
    console.log("   • window.validationTabularHTML");
    
  } catch (error) {
    console.error("❌ Validation report execution failed:", error);
  }
}