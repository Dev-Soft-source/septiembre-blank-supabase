/**
 * Run Validation Now - Immediate Execution
 * Executes validation and displays tabular results
 */

import { runRoleBasedRegistrationSimulation } from './role-based-registration-simulation';

// Simple tabular report generation
async function generateTabularReport() {
  console.log('🎯 EXECUTING VALIDATION TESTS - GENERATING TABULAR REPORT');
  console.log('========================================================\n');

  try {
    // Run role-based registration simulation
    const results = await runRoleBasedRegistrationSimulation();
    
    // Format results into tabular data
    const tabularData: any[] = [];
    
    results.roleTests.forEach((roleTest: any) => {
      roleTest.results.forEach((result: any, index: number) => {
        const testNumber = roleTest.role === 'promoter' || roleTest.role === 'leaderliving' 
          ? index + 1 
          : roleTest.role === 'hotel' ? (index === 0 ? 1 : 2)
          : roleTest.role === 'user' ? (index === 0 ? 1 : 2)
          : 1;
        
        const issues = result.errors.length > 0 ? result.errors.join('; ') : 'None';
        
        let referralIdCodeStatus = 'N/A';
        if (['hotel', 'association', 'promoter', 'leaderliving'].includes(roleTest.role)) {
          referralIdCodeStatus = result.referralCodeGenerated ? 'Generated' : 'Not Generated';
        }
        
        tabularData.push({
          Role: formatRoleName(roleTest.role),
          'Test #': testNumber,
          'Registration Status': result.registrationStatus === 'success' ? 'Success' : 'Failed',
          'Email Sent': result.emailSent ? 'Yes' : 'No',
          'Panel Access': result.panelAccessible ? 'Accessible' : result.registrationStatus === 'success' ? 'Not Accessible' : 'N/A',
          'Referral/ID Code': referralIdCodeStatus,
          'Issues Found': issues
        });
      });
    });
    
    // Sort by role order
    const roleOrder = ['Hotel', 'User', 'Association', 'Promoter', 'Group Leader'];
    tabularData.sort((a, b) => {
      const aIndex = roleOrder.indexOf(a.Role);
      const bIndex = roleOrder.indexOf(b.Role);
      
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      return a['Test #'] - b['Test #'];
    });
    
    console.log('\n📋 VALIDATION RESULTS - TABULAR FORMAT');
    console.log('=====================================\n');
    console.table(tabularData);
    
    // Generate summary statistics
    const summary = {
      'Total Tests': tabularData.length,
      'Successful Registrations': tabularData.filter(row => row['Registration Status'] === 'Success').length,
      'Email Delivery Rate': `${(tabularData.filter(row => row['Email Sent'] === 'Yes').length / tabularData.length * 100).toFixed(1)}%`,
      'Panel Access Rate': `${(tabularData.filter(row => row['Panel Access'] === 'Accessible').length / tabularData.length * 100).toFixed(1)}%`,
      'Code Generation Rate': `${(tabularData.filter(row => row['Referral/ID Code'] === 'Generated').length / tabularData.filter(row => row['Referral/ID Code'] !== 'N/A').length * 100).toFixed(1)}%`,
      'Issues Detected': tabularData.filter(row => row['Issues Found'] !== 'None').length
    };
    
    console.log('\n📊 EXECUTIVE SUMMARY');
    console.log('===================\n');
    console.table([summary]);
    
    // Role breakdown
    const roleBreakdown = roleOrder.map(role => {
      const roleData = tabularData.filter(row => row.Role === role);
      return {
        Role: role,
        'Tests Run': roleData.length,
        'Successful': roleData.filter(row => row['Registration Status'] === 'Success').length,
        'Success Rate': roleData.length > 0 ? `${(roleData.filter(row => row['Registration Status'] === 'Success').length / roleData.length * 100).toFixed(1)}%` : 'N/A'
      };
    }).filter(row => row['Tests Run'] > 0);
    
    console.log('\n🎭 ROLE-BASED BREAKDOWN');
    console.log('======================\n');
    console.table(roleBreakdown);
    
    // Save to global scope
    (window as any).validationTabularResults = tabularData;
    (window as any).validationSummary = summary;
    (window as any).validationRoleBreakdown = roleBreakdown;
    
    console.log('\n💾 Results saved to window object:');
    console.log('   • window.validationTabularResults');
    console.log('   • window.validationSummary');
    console.log('   • window.validationRoleBreakdown');
    
    return { tabularData, summary, roleBreakdown };
    
  } catch (error) {
    console.error('❌ Validation execution failed:', error);
    throw error;
  }
}

function formatRoleName(role: string): string {
  switch (role) {
    case 'hotel': return 'Hotel';
    case 'user': return 'User';
    case 'association': return 'Association';
    case 'promoter': return 'Promoter';
    case 'leaderliving': return 'Group Leader';
    default: return role;
  }
}

// Execute immediately
generateTabularReport().then(() => {
  console.log('\n✅ Tabular validation report generation completed!');
}).catch(error => {
  console.error('❌ Report generation failed:', error);
});

export { generateTabularReport };