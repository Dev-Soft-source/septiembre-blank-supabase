
// Utility for lazy loading XLSX operations
export const createExcelFile = async (data: any[], filename: string) => {
  const XLSX = await import("xlsx");
  
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
  XLSX.writeFile(workbook, filename);
};

export const readExcelFile = async (file: File): Promise<any[]> => {
  const XLSX = await import("xlsx");
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const createWorkbookFromMultipleSheets = async (sheets: Record<string, any[]>, filename: string) => {
  const XLSX = await import("xlsx");
  
  const workbook = XLSX.utils.book_new();
  
  Object.entries(sheets).forEach(([sheetName, data]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });
  
  XLSX.writeFile(workbook, filename);
};
